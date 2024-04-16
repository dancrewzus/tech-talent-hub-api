import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt,Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { HandleErrors } from 'src/common/utils/handleErrors.util';
import { User } from 'src/functionalities/users/entities/user.entity';
import { error } from 'src/common/constants/error-messages';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectModel(User.name, 'default') private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly handleErrors: HandleErrors,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtSecret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  public validate = async (payload: JwtPayload): Promise<User> => {
    try {
      const { id } = payload
      const user = await this.userModel.findOne({ _id: id })
        .populate({ path: 'role', select: 'name' })

      if(!user) {
        throw new UnauthorizedException(error.INVALID_TOKEN)
      }
      if(!user.isActive) {
        throw new UnauthorizedException(error.USER_INACTIVE)
      }
      
      return user
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}