import { Module } from '@nestjs/common';

import { AxiosAdapter } from './adapters/axios.adapter';
import { CloudAdapter } from './adapters/cloud.adapter';
import { DayJSAdapter } from './adapters/dayjs.adapter';

import { Utils, HandleErrors } from './utils/utils';

@Module({
  providers: [
    AxiosAdapter,
    CloudAdapter,
    DayJSAdapter,
    HandleErrors,
    Utils
  ],
  exports: [
    AxiosAdapter,
    CloudAdapter,
    DayJSAdapter,
    HandleErrors,
    Utils
  ],
})
export class CommonModule {}
