import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { BEARER_SCHEME } from '../setup-swagger';
import { ContentLibraryService } from './content-library.service';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from './dto/experience.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@ApiTags('Content library')
@ApiBearerAuth(BEARER_SCHEME)
@Controller('me/content')
@UseGuards(JwtAuthGuard)
export class ContentLibraryController {
  constructor(private readonly library: ContentLibraryService) {}

  @Get('experiences')
  @ApiOperation({ summary: 'List experiences in the content library' })
  listExperiences(@CurrentUser() user: JwtPayload) {
    return this.library
      .listExperiences(user.sub)
      .then((rows) => rows.map((r) => this.library.experienceToItem(r)));
  }

  @Post('experiences')
  @ApiOperation({ summary: 'Create an experience entry' })
  createExperience(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateExperienceDto,
  ) {
    return this.library
      .createExperience(user.sub, dto)
      .then((r) => this.library.experienceToItem(r));
  }

  @Put('experiences/:id')
  @ApiParam({ name: 'id', format: 'uuid' })
  updateExperience(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExperienceDto,
  ) {
    return this.library
      .updateExperience(user.sub, id, dto)
      .then((r) => this.library.experienceToItem(r));
  }

  @Delete('experiences/:id')
  @ApiParam({ name: 'id', format: 'uuid' })
  async deleteExperience(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.library.deleteExperience(user.sub, id);
    return { ok: true };
  }

  @Get('projects')
  @ApiOperation({ summary: 'List projects in the content library' })
  listProjects(@CurrentUser() user: JwtPayload) {
    return this.library
      .listProjects(user.sub)
      .then((rows) => rows.map((r) => this.library.projectToItem(r)));
  }

  @Post('projects')
  createProject(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateProjectDto,
  ) {
    return this.library
      .createProject(user.sub, dto)
      .then((r) => this.library.projectToItem(r));
  }

  @Put('projects/:id')
  @ApiParam({ name: 'id', format: 'uuid' })
  updateProject(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.library
      .updateProject(user.sub, id, dto)
      .then((r) => this.library.projectToItem(r));
  }

  @Delete('projects/:id')
  @ApiParam({ name: 'id', format: 'uuid' })
  async deleteProject(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.library.deleteProject(user.sub, id);
    return { ok: true };
  }

  @Get('contacts')
  listContacts(@CurrentUser() user: JwtPayload) {
    return this.library
      .listContacts(user.sub)
      .then((rows) => rows.map((r) => this.library.contactToItem(r)));
  }

  @Post('contacts')
  createContact(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateContactDto,
  ) {
    return this.library
      .createContact(user.sub, dto)
      .then((r) => this.library.contactToItem(r));
  }

  @Put('contacts/:id')
  @ApiParam({ name: 'id', format: 'uuid' })
  updateContact(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateContactDto,
  ) {
    return this.library
      .updateContact(user.sub, id, dto)
      .then((r) => this.library.contactToItem(r));
  }

  @Delete('contacts/:id')
  @ApiParam({ name: 'id', format: 'uuid' })
  async deleteContact(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.library.deleteContact(user.sub, id);
    return { ok: true };
  }
}
