import { Injectable } from "@nestjs/common";
import { encoding_for_model, TiktokenModel } from "@dqbd/tiktoken";

import { HandleErrors } from "../utils/utils";

@Injectable()
export class TikTokenAdapter {

  constructor(
    private readonly errors: HandleErrors,
  ) { }

  /**
   * Calculates the number of tokens in a string based on the specified model's encoding.
   * @param message El mensaje de entrada del cual calcular los tokens.
   * @param model El modelo de codificación a utilizar para calcular los tokens.
   * @returns La cantidad de tokens generada por el mensaje.
   */
  public tokensCountFromString = (message: string, model: TiktokenModel): number => {
    try {
      const encoder = encoding_for_model(model);

      const tokens = encoder.encode(message);
      encoder.free();

      return tokens.length;
    } catch (error) {
      this.errors.handleError(`Error calculating tokens: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

  // MODELS AVAILABLE
  // "davinci-002"
  // "babbage-002"
  // "text-davinci-003"
  // "text-davinci-002"
  // "text-davinci-001"
  // "text-curie-001"
  // "text-babbage-001"
  // "text-ada-001"
  // "davinci"
  // "curie"
  // "babbage"
  // "ada"
  // "code-davinci-002"
  // "code-davinci-001"
  // "code-cushman-002"
  // "code-cushman-001"
  // "davinci-codex"
  // "cushman-codex"
  // "text-davinci-edit-001"
  // "code-davinci-edit-001"
  // "text-embedding-ada-002"
  // "text-similarity-davinci-001"
  // "text-similarity-curie-001"
  // "text-similarity-babbage-001"
  // "text-similarity-ada-001"
  // "text-search-davinci-doc-001"
  // "text-search-curie-doc-001"
  // "text-search-babbage-doc-001"
  // "text-search-ada-doc-001"
  // "code-search-babbage-code-001"
  // "code-search-ada-code-001"
  // "gpt2"
  // "gpt-3.5-turbo"
  // "gpt-35-turbo"
  // "gpt-3.5-turbo-0301"
  // "gpt-3.5-turbo-0613"
  // "gpt-3.5-turbo-1106"
  // "gpt-3.5-turbo-0125"
  // "gpt-3.5-turbo-16k"
  // "gpt-3.5-turbo-16k-0613"
  // "gpt-3.5-turbo-instruct"
  // "gpt-3.5-turbo-instruct-0914"
  // "gpt-4"
  // "gpt-4-0314"
  // "gpt-4-0613"
  // "gpt-4-32k"
  // "gpt-4-32k-0314"
  // "gpt-4-32k-0613"
  // "gpt-4-turbo-preview"
  // "gpt-4-1106-preview"
  // "gpt-4-0125-preview"
  // "gpt-4-vision-preview"