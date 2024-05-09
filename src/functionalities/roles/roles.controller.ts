import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { Auth } from 'src/auth/decorators/auth.decorator'

@ApiTags('Roles')
@Controller('roles')
@Auth(ValidRoles.Root)
export class RolesController {

  constructor(
  ) {}
}
