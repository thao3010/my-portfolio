import { SKILL_ICON_PRESETS } from '@portfolio/shared';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { mkdirSync } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { BEARER_SCHEME } from '../setup-swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillsService } from './skills.service';

const ALLOWED_ICON_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);
const MAX_ICON_BYTES = 2 * 1024 * 1024;

@ApiTags('Skills')
@ApiBearerAuth(BEARER_SCHEME)
@Controller('me/skills')
@UseGuards(JwtAuthGuard)
export class SkillsController {
  constructor(
    private readonly skillsService: SkillsService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List skills for the current user' })
  async listMine(@CurrentUser() user: JwtPayload) {
    const skills = await this.skillsService.listForUser(user.sub);
    return skills.map((s) => this.skillsService.toResponse(s));
  }

  @Get('icon-presets')
  @ApiOperation({ summary: 'Built-in skill icon library' })
  listIconPresets() {
    return SKILL_ICON_PRESETS;
  }

  @Post()
  @ApiOperation({ summary: 'Create a skill' })
  async createMine(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateSkillDto,
  ) {
    const skill = await this.skillsService.createForUser(user.sub, dto);
    return this.skillsService.toResponse(skill);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a skill' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async updateMine(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSkillDto,
  ) {
    const skill = await this.skillsService.updateForUser(user.sub, id, dto);
    return this.skillsService.toResponse(skill);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a skill' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async deleteMine(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.skillsService.deleteForUser(user.sub, id);
    return { ok: true };
  }

  @Post('icon-upload')
  @ApiOperation({ summary: 'Upload a custom skill icon image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_ICON_BYTES },
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = join(process.cwd(), 'uploads', 'skill-icons');
          mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          const safeExt = ALLOWED_ICON_EXT.has(ext) ? ext : '.png';
          cb(null, `${randomUUID()}${safeExt}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        if (!ALLOWED_ICON_EXT.has(ext)) {
          cb(new Error('Invalid file type'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  uploadIcon(
    @UploadedFile() file: Express.Multer.File | undefined,
  ): { url: string } {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const publicBase =
      this.config.get<string>('publicBaseUrl') ?? 'http://localhost:3847';
    const url = `${publicBase}/api/v1/uploads/skill-icons/${file.filename}`;
    return { url };
  }
}
