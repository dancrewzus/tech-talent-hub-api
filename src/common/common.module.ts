import { Module } from '@nestjs/common';

import { AxiosAdapter } from './adapters/axios.adapter';
import { CloudAdapter } from './adapters/cloud.adapter';
import { DayJSAdapter } from './adapters/dayjs.adapter';
import { TikTokenAdapter } from './adapters/tiktoken.adapter';

import { Utils, HandleErrors } from './utils/utils';

@Module({
  providers: [
    AxiosAdapter,
    CloudAdapter,
    DayJSAdapter,
    TikTokenAdapter,
    HandleErrors,
    Utils
  ],
  exports: [
    AxiosAdapter,
    CloudAdapter,
    DayJSAdapter,
    TikTokenAdapter,
    HandleErrors,
    Utils
  ],
})
export class CommonModule {}
