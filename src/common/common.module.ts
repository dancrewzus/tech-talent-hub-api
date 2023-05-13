import { Module } from '@nestjs/common';

import { AxiosAdapter } from './adapters/axios.adapter';
import { TensorflowUtil } from './utils/tensorflow.util';

@Module({
  providers: [
    AxiosAdapter,
    TensorflowUtil
  ],
  exports: [
    AxiosAdapter,
    TensorflowUtil
  ],
})
export class CommonModule {}
