import { Injectable } from "@nestjs/common"
import { oneLine } from 'common-tags'

import { OpenAiAdapter } from "../adapters/openai.adapter"
import { app } from 'src/common/constants'
import { HandleErrors } from "./utils"

@Injectable()
export class Assistants {

  constructor(
    private readonly AIAdapter: OpenAiAdapter,
    private readonly errors: HandleErrors,
  ) {
    this.AIEntity = this.AIAdapter.getEntity()
  };

  private AIEntity

  private getMainAssistantTools = () => {
    return [
      {
        type: 'function',
        function: {
          name: 'getAllDepartments',
          description: "This function returns a list with all the available departments which you can then filter to find the one that best suits the client's requirements.",
          parameters: {
            type: 'object',
            properties: { },
            required: [ ]
          },
        }
      },
    ]
  }

  public createConversationAssistant = async () => {

    const assistantName = app.assistants.CONVERSATIONAL_ASSISTANT_NAME
    try {

      const assistantChecked = await this.AIAdapter.checkAssistantByName(this.AIEntity, assistantName);

      if (assistantChecked) {
        return this.AIAdapter.getAssistantByName(this.AIEntity, assistantName);
      }

      const assistantData = {
        name: assistantName,
        description: oneLine`
          Eres Rentmies, un asesor inmobiliario ubicado en Colombia, especializado en alquiler de apartamentos. 
        `,
        instructions: oneLine`
          Tu objetivo principal es facilitar que los clientes agenden visitas a propiedades directamente en el chat. 
          Debes ser breve en tus respuestas, nunca responder con más de 600 caracteres. Mantén un tono cortés al 
          saludar a los clientes, pidiendo su nombre si es desconocido para brindar atención personalizada.
          Enfoca las respuestas en el alquiler de apartamentos en Colombia, identificando a los clientes 
          por nombre, evaluando su interés y ofreciendo información detallada.
        `,
        model: 'gpt-3.5-turbo-0125',
        tools: this.getMainAssistantTools()
      }
      const assistant = await this.AIAdapter.createAssistant(this.AIEntity, assistantData);
      return assistant
    } catch (error) {
      this.errors.handleError(`Error creating conversational assistant: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  public createRentmiesAssistant = async () => {

    const assistantName = app.assistants.MAIN_ASSISTANT_NAME
    try {

      const assistantChecked = await this.AIAdapter.checkAssistantByName(this.AIEntity, assistantName);

      if (assistantChecked) {
        return this.AIAdapter.getAssistantByName(this.AIEntity, assistantName);
      }

      const assistantData = {
        name: assistantName,
        description: oneLine`
          Eres un asistente orquestador, encargado de gestionar otros asistentes. 
        `,
        instructions: oneLine`
          Los asistentes los encuentras en las tools, revisa bien su descripción. Debes retornar el mensaje tal cual lo recibes de los asistentes.
          Analiza muy bien el contexto de la conversación para que los asistentes puedan ser utilizados correctamente.
        `,
        model: 'gpt-4-0125-preview',
        tools: this.getMainAssistantTools()
      }
      const assistant = await this.AIAdapter.createAssistant(this.AIEntity, assistantData);
      return assistant
    } catch (error) {
      this.errors.handleError(`Error creating conversational assistant: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}