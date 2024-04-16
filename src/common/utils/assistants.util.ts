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
    return [ ]
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
        description: oneLine``,
        instructions: oneLine``,
        model: 'gpt-3.5-turbo-0125',
        tools: this.getMainAssistantTools()
      }
      const assistant = await this.AIAdapter.createAssistant(this.AIEntity, assistantData);
      return assistant
    } catch (error) {
      this.errors.handleError(`Error creating conversational assistant: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}