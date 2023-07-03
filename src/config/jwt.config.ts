import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import envConfig from './env.config';

export const JWT_CONFIG: JwtModuleAsyncOptions = {
  useFactory: () => ({
    secret: envConfig().jwtSecret,
    signOptions: {
      expiresIn: envConfig().jwtExpiration,
    },
  }),
};
