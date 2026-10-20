import { normalizeSkillIconUrl } from '@portfolio/shared';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillsRepo: Repository<Skill>,
    private readonly config: ConfigService,
  ) {}

  normalizeIcon(icon: string): string {
    const publicBase =
      this.config.get<string>('publicBaseUrl') ?? 'http://localhost:3847';
    return normalizeSkillIconUrl(icon, publicBase);
  }

  async listForUser(userId: string): Promise<Skill[]> {
    return this.skillsRepo.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }

  async createForUser(userId: string, dto: CreateSkillDto): Promise<Skill> {
    const skill = this.skillsRepo.create({
      userId,
      icon: dto.icon.trim(),
      title: dto.title.trim(),
      description: dto.description.trim(),
    });
    return this.skillsRepo.save(skill);
  }

  async updateForUser(
    userId: string,
    skillId: string,
    dto: UpdateSkillDto,
  ): Promise<Skill> {
    const skill = await this.findOwned(userId, skillId);
    if (dto.icon !== undefined) {
      skill.icon = dto.icon.trim();
    }
    if (dto.title !== undefined) {
      skill.title = dto.title.trim();
    }
    if (dto.description !== undefined) {
      skill.description = dto.description.trim();
    }
    return this.skillsRepo.save(skill);
  }

  async deleteForUser(userId: string, skillId: string): Promise<void> {
    const skill = await this.findOwned(userId, skillId);
    await this.skillsRepo.remove(skill);
  }

  toResponse(skill: Skill) {
    return {
      id: skill.id,
      icon: this.normalizeIcon(skill.icon),
      title: skill.title,
      description: skill.description,
      createdAt: skill.createdAt.toISOString(),
      updatedAt: skill.updatedAt.toISOString(),
    };
  }

  private async findOwned(userId: string, skillId: string): Promise<Skill> {
    const skill = await this.skillsRepo.findOne({ where: { id: skillId } });
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    if (skill.userId !== userId) {
      throw new ForbiddenException();
    }
    return skill;
  }
}
