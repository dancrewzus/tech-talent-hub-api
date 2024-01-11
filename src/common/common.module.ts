import { Module } from '@nestjs/common';

import { AxiosAdapter } from './adapters/axios.adapter';
import { CloudAdapter } from './adapters/cloud.adapter';
import { HandleErrors } from './utils/handleErrors.util';
import { TimeHandler } from './utils/timeHandler.util';
import { Utils } from './utils/utils';

@Module({
  providers: [
    AxiosAdapter,
    CloudAdapter,
    HandleErrors,
    TimeHandler,
    Utils
  ],
  exports: [
    AxiosAdapter,
    CloudAdapter,
    HandleErrors,
    TimeHandler,
    Utils
  ],
})
export class CommonModule {}
