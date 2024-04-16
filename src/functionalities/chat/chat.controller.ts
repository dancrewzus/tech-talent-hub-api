import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common'

import { OpenAiAdapter } from 'src/common/adapters/openai.adapter';
import { ChatbotCallDto } from './dto/chatbot-call.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {

  constructor(
    private readonly AIAdapter: OpenAiAdapter,
    private readonly chatService: ChatService
  ) { }

  @Post('message')
  newMessageReceived(
    @Body() chatbotCallDto: ChatbotCallDto
  ) {
    return this.chatService.newMessageReceived(chatbotCallDto);
  }

  // @Get('runs/:id')
  // createMainAssistant(
  //   @Param('id') id: string
  // ) {
  //   return this.chatService.listRuns(id);
  // }

  // @Get('clear')
  // clearConversations() {
  //   return this.chatService.clearConversations();
  // }
  
  @Get('assistants')
  getAllAssistants() {
    const entity = this.AIAdapter.getEntity()
    return this.AIAdapter.getAllAssistants(entity);
  }
  
  @Get('create-assistants-architecture')
  createAssistantsArchitecture() {
    return this.chatService.createAssistantsArchitecture();
  }
  
  @Get('assistant/:name')
  getAssistantByName(
    @Param('name') name: string
  ) {
    const entity = this.AIAdapter.getEntity()
    return this.AIAdapter.getAssistantByName(entity, name);
  }
  
  @Get('thread/:id')
  getMessagesInThread(
    @Param('id') id: string
  ) {
    const entity = this.AIAdapter.getEntity()
    return this.AIAdapter.getMessagesInThread(entity, id);
  }
  
  // @Get('threads')
  // getThreads() {
  //   return this.chatService.getAllThreads();
  // }
  
  // @Delete('reb-assistant')
  // deleteRebAssistant() {
  //   return this.chatService.deleteRebAssistant();
  // }
  
  // @Delete('threads')
  // deleteAllThreads() {
  //   return this.chatService.deleteAllThreads();
  // }
  
  @Delete('assistant/:id')
  deleteAssistant(
    @Param('id') id: string
  ) {
    const entity = this.AIAdapter.getEntity()
    return this.AIAdapter.deleteAssistantById(entity, id);
  }
  
  // @Delete('run/:threadId/:runId')
  // deleteRun(
  //   @Param('threadId') threadId: string,
  //   @Param('runId') runId: string
  // ) {
  //   return this.chatService.deleteRunById(threadId, runId);
  // }
  
  // @Delete('thread/:id')
  // deleteThread(
  //   @Param('id') id: string
  // ) {
  //   return this.chatService.deleteThreadById(id);
  // }
}