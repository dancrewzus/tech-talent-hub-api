import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { MessageData, NewMessage } from 'src/common/interfaces/chat.interface'
import { TikTokenAdapter } from 'src/common/adapters/tiktoken.adapter'
import { OpenAiAdapter } from 'src/common/adapters/openai.adapter'
import { DayJSAdapter } from 'src/common/adapters/dayjs.adapter'
import { Assistants } from 'src/common/utils/assistants.util'
import { Utils, HandleErrors } from 'src/common/utils/utils'
import { Message } from './entities/message.entity'
import { Thread } from './entities/thread.entity'
import { app } from 'src/common/constants'

@Injectable()
export class ChatService {

  constructor(
    @InjectModel(Message.name, 'default') private readonly messageModel: Model<Message>,
    @InjectModel(Thread.name, 'default') private readonly threadModel: Model<Thread>,
    private readonly tiktoken: TikTokenAdapter,
    private readonly AIAdapter: OpenAiAdapter,
    private readonly assistants: Assistants,
    private readonly errors: HandleErrors,
    private readonly dayjs: DayJSAdapter,
    private readonly utils: Utils,
  ) {
    this.AIEntity = this.AIAdapter.getEntity()
  }

  private AIEntity

  /*********************** **
   * ASSISTANTS MANAGEMENT **
   *********************** **/

  public createAssistantsArchitecture = async () => {

    // Crear asistente orquestador                (gpt-4)
    // Crear asistente de conversación            (gpt-3.5)
    // Crear asistente de base de datos           (gpt-3.5)
    // Crear asistente de agendar una cita        (gpt-4)
    // Crear asistente de referencia de ubicación (gpt-4)

    await this.assistants.createConversationAssistant()
  }
  
  /******************* **
   * THREAD MANAGEMENT **
   ******************* **/

  /**
   * Retrieves a thread by the client number. Returns null if no thread is found.
   * @param clientNumber The client's phone number.
   * @returns The thread ID as a string or null.
   */
  private getThreadByClientNumber = async (clientNumber: string): Promise<string | null> => {
    try {
      const thread = await this.threadModel.findOne({ clientNumber });
      return thread?.threadId || null;
    } catch (error) {
      this.errors.handleError(`Error retrieving thread by client number: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // TODO los hilos se pueden cruzar si se tienen dos o más números de whatsapp
  
  /**
   * Stores or updates a thread with the given client number and thread ID.
   * 
   * If a thread with the given client number doesn't exist, a new thread is created.
   * If it does exist, its threadId is updated.
   * 
   * @param clientNumber The client's unique identifier.
   * @param threadId The thread ID to associate with the client number.
   * @returns A promise that resolves with the updated or new thread document.
   */
  private storeThreadByClientNumber = async (clientNumber: string, threadId: string): Promise<Thread> => {
    try {
      let thread = await this.threadModel.findOne({ clientNumber });
  
      if (!thread) {
        thread = await this.threadModel.create({ clientNumber, threadId });
      } else {
        thread.threadId = threadId;
        await thread.save();
      }
  
      return thread;
    } catch (error) {
      this.errors.handleError(`Error storing thread by client number: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Initializes a thread for a client by creating a new thread in the AI platform and storing it in the database.
   * 
   * @param clientNumber The client's unique identifier.
   * @returns A promise that resolves with the ID of the initialized thread.
   */
  private initializeThreadForClient = async (clientNumber: string): Promise<string> => {
    const thread = await this.AIAdapter.createThread(this.AIEntity)
    await this.storeThreadByClientNumber(clientNumber, thread.id);
    return thread.id;
  }

  /**
   * Retrieves the thread ID for a given client number. If no thread exists, a new one is initialized.
   * 
   * This method also validates the existence of the thread in the AI platform and re-initializes it if necessary.
   * 
   * @param clientNumber The client's unique identifier.
   * @returns A promise that resolves with the thread ID.
   */
  private getThreadId = async (clientNumber: string): Promise<string> => {
    let threadId = await this.getThreadByClientNumber(clientNumber);
  
    if (!threadId) {
      threadId = await this.initializeThreadForClient(clientNumber);
    } else if (!(await this.AIAdapter.validateThreadExistence(this.AIEntity, threadId))) {
      threadId = await this.initializeThreadForClient(clientNumber);
    }
  
    return threadId;
  }

  /******************** **
   * MESSAGE MANAGEMENT **
   ******************** **/

  /**
 * Stores a new message in the database.
 * 
 * @param messageData Contains the message text, sender information, client number, thread ID, token count, and timestamp.
 * @returns A promise that resolves once the message is stored.
 */
  private storeNewMessage = async (messageData: MessageData) => {
    try {
      await this.messageModel.create(messageData);
      return
    } catch (error) {
      this.errors.handleError(`Error storing new message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Processes the receipt of a new message from a client, interacts with the AI assistant,
   * and stores the conversation in the database.
   * 
   * @param data An object containing the new message and the client number.
   * @returns A promise that resolves with the AI assistant's response or an empty string if no response is received.
   */
  public newMessageReceived = async (data: NewMessage) => {
    const { message, clientNumber /*, companyId */} = data
    try {
      console.info(`[${ this.dayjs.getCurrentDateTime() }] - New message received from ${clientNumber}`)
      const assistant = await this.AIAdapter.getAssistantByName(this.AIEntity, app.assistants.CONVERSATIONAL_ASSISTANT_NAME)
      const threadId = await this.getThreadId(clientNumber)

      await this.AIAdapter.insertMessageInThread(this.AIEntity, threadId, { content: message })

      console.info(`[${ this.dayjs.getCurrentDateTime() }] - Inserted message in thread ${threadId}`)

      const assistantResponse = await this.AIAdapter.runAssistantById(this.AIEntity, assistant.id, threadId)

      console.info(`[${ this.dayjs.getCurrentDateTime() }] - Assistant ${assistant.name} has respond`)
      
      if(assistantResponse?.length) {

        const filteredResponse = this.utils.extractContentResponse(assistantResponse[0].content[0])

        const clientMessageTokens = this.tiktoken.tokensCountFromString(message, 'gpt-3.5-turbo-0125')
        const assistantMessageTokens = this.tiktoken.tokensCountFromString(filteredResponse, 'gpt-3.5-turbo-0125')

        console.info(`[${ this.dayjs.getCurrentDateTime() }] - Tokens used: ${clientMessageTokens} + ${assistantMessageTokens} = ${clientMessageTokens + assistantMessageTokens}`)

        if(!app.assistants.TESTING_ASSISTANT) {
          await Promise.all([
            this.storeNewMessage({
              message,
              clientNumber,
              threadId,
              from: 'client',
              tokens: clientMessageTokens,
              createdAt: this.dayjs.getCurrentDateTime(),
            }),
            this.storeNewMessage({
              message: filteredResponse,
              clientNumber,
              threadId,
              from: 'assistant',
              tokens: assistantMessageTokens,
              createdAt: this.dayjs.getCurrentDateTime(),
            })
          ])
        }
        return filteredResponse
      }
      return ''
    } catch (error) {
      return this.errors.handleError(`Error handling new message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
}