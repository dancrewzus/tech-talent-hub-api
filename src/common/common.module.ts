import { Module } from '@nestjs/common';

import { AxiosAdapter } from './adapters/axios.adapter';
import { CloudAdapter } from './adapters/cloud.adapter';
import { DayJSAdapter } from './adapters/dayjs.adapter';
import { OpenAiAdapter } from './adapters/openai.adapter';
import { TikTokenAdapter } from './adapters/tiktoken.adapter';

import { Utils, HandleErrors } from './utils/utils';
import { Assistants } from './utils/assistants.util';

@Module({
  providers: [
    AxiosAdapter,
    CloudAdapter,
    DayJSAdapter,
    OpenAiAdapter,
    TikTokenAdapter,
    HandleErrors,
    Assistants,
    Utils
  ],
  exports: [
    AxiosAdapter,
    CloudAdapter,
    DayJSAdapter,
    OpenAiAdapter,
    TikTokenAdapter,
    HandleErrors,
    Assistants,
    Utils
  ],
})
export class CommonModule {}
