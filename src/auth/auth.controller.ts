import { Controller, Post, Body, Get, Ip } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { User } from 'src/functionalities/users/entities/user.entity'
import { ErrorResponseDto } from 'src/common/dto/error-response.dto'
import { CreateUserDto } from 'src/functionalities/users/dto'

import { LoginResponseDto } from './dto/login-response.dto'
import { GetUser } from './decorators/get-user.decorator'
import { Auth } from './decorators/auth.decorator'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { PasswordDto } from './dto/password.dto'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiResponse({ status: 200, description: 'User logged.', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request. Email or password not satisfied some conditions.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials. Email or password are invalid.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Internal error.', type: ErrorResponseDto })
  login(
    @Ip() clientIp: string,
    @Body() loginDto: LoginDto
  ) {
    return this.authService.login(loginDto, clientIp)
  }
  
  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered.', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request. Email or password not satisfied some conditions.', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not found exception. Primary role not found.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Internal error.', type: ErrorResponseDto })
  register(
    @Ip() clientIp: string,
    @Body() createUserDto: CreateUserDto
  ) {
    return this.authService.register(createUserDto, clientIp)
  }

  @Post('change-password')
  @ApiResponse({ status: 200, description: 'Password changed.', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request. Email or password not satisfied some conditions.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials. Email or password are invalid.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Internal error.', type: ErrorResponseDto })
  changePassword(
    @Ip() clientIp: string,
    @Body() passwordDto: PasswordDto
  ) {
    return this.authService.changePassword(passwordDto, clientIp)
  }
  
  @Post('reset-password')
  @ApiResponse({ status: 200, description: 'Request for reset password sended.', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request. Email or password not satisfied some conditions.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials. Email or password are invalid.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Internal error.', type: ErrorResponseDto })
  resetPassword(
    @Ip() clientIp: string,
    @Body() passwordDto: PasswordDto
  ) {
    return this.authService.resetPassword(passwordDto, clientIp)
  }

  @Get('check-status')
  @Auth()
  @ApiResponse({ status: 200, description: 'Check user status', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request. Email or password not satisfied some conditions.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials. Email or password are invalid.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Internal error.', type: ErrorResponseDto })
  checkAthStatus(
    @Ip() clientIp: string,
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user, clientIp)
  }

  @Get('private-test')
  @Auth()
  testPrivateRoute(
    @Ip() clientIp: string,
    @GetUser() user: User
  ) {
    return {
      message: "It's leviousa!",
      ip: clientIp,
      user,
    }
  }
}
