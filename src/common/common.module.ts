import { Module } from '@nestjs/common';

import { AxiosAdapter } from './adapters/axios.adapter';
// import { TensorflowUtil } from './utils/tensorflow.util';
import { HandleErrors } from './utils/handleErrors.util';
import { Utils } from './utils/utils';

@Module({
  providers: [
    AxiosAdapter,
    // TensorflowUtil,
    HandleErrors,
    Utils
  ],
  exports: [
    AxiosAdapter,
    // TensorflowUtil,
    HandleErrors,
    Utils
  ],
})
export class CommonModule {}
