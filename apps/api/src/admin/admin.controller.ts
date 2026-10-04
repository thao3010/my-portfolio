import { UserRole } from '@portfolio/shared';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BEARER_SCHEME } from '../setup-swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';

@ApiTags('Admin')
@ApiBearerAuth(BEARER_SCHEME)
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all users (admin only)' })
  async listUsers() {
    const users = await this.usersService.listAll();
    return users.map((user) => this.authService.sanitizeUser(user));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user role or active status (admin only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserAdminDto,
  ) {
    const user = await this.usersService.updateAdminFields(id, dto);
    return this.authService.sanitizeUser(user);
  }
}
