import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  ContactItem,
  ExperienceItem,
  PortfolioContact,
  PortfolioExperience,
  PortfolioProject,
  ProjectItem,
} from '@portfolio/shared';
import { In, Repository } from 'typeorm';
import {
  CreateContactDto,
  UpdateContactDto,
} from './dto/contact.dto';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from './dto/experience.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ContactProfile } from './entities/contact-profile.entity';
import { Experience } from './entities/experience.entity';
import { Project } from './entities/project.entity';

@Injectable()
export class ContentLibraryService {
  constructor(
    @InjectRepository(Experience)
    private readonly experiencesRepo: Repository<Experience>,
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
    @InjectRepository(ContactProfile)
    private readonly contactsRepo: Repository<ContactProfile>,
  ) {}

  async listExperiences(userId: string): Promise<Experience[]> {
    return this.experiencesRepo.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }

  async createExperience(
    userId: string,
    dto: CreateExperienceDto,
  ): Promise<Experience> {
    const row = this.experiencesRepo.create({
      userId,
      company: dto.company.trim(),
      title: dto.title.trim(),
      period: dto.period?.trim() ?? '',
      description: dto.description?.trim() ?? '',
    });
    return this.experiencesRepo.save(row);
  }

  async updateExperience(
    userId: string,
    id: string,
    dto: UpdateExperienceDto,
  ): Promise<Experience> {
    const row = await this.findOwnedExperience(userId, id);
    if (dto.company !== undefined) {
      row.company = dto.company.trim();
    }
    if (dto.title !== undefined) {
      row.title = dto.title.trim();
    }
    if (dto.period !== undefined) {
      row.period = dto.period.trim();
    }
    if (dto.description !== undefined) {
      row.description = dto.description.trim();
    }
    return this.experiencesRepo.save(row);
  }

  async deleteExperience(userId: string, id: string): Promise<void> {
    const row = await this.findOwnedExperience(userId, id);
    await this.experiencesRepo.remove(row);
  }

  async listProjects(userId: string): Promise<Project[]> {
    return this.projectsRepo.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }

  async createProject(userId: string, dto: CreateProjectDto): Promise<Project> {
    const row = this.projectsRepo.create({
      userId,
      title: dto.title.trim(),
      description: dto.description?.trim() ?? '',
      url: dto.url?.trim() || null,
      tech: dto.tech ?? [],
    });
    return this.projectsRepo.save(row);
  }

  async updateProject(
    userId: string,
    id: string,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    const row = await this.findOwnedProject(userId, id);
    if (dto.title !== undefined) {
      row.title = dto.title.trim();
    }
    if (dto.description !== undefined) {
      row.description = dto.description.trim();
    }
    if (dto.url !== undefined) {
      row.url = dto.url.trim() || null;
    }
    if (dto.tech !== undefined) {
      row.tech = dto.tech;
    }
    return this.projectsRepo.save(row);
  }

  async deleteProject(userId: string, id: string): Promise<void> {
    const row = await this.findOwnedProject(userId, id);
    await this.projectsRepo.remove(row);
  }

  async listContacts(userId: string): Promise<ContactProfile[]> {
    return this.contactsRepo.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }

  async createContact(
    userId: string,
    dto: CreateContactDto,
  ): Promise<ContactProfile> {
    const row = this.contactsRepo.create({
      userId,
      label: dto.label?.trim() || 'Primary',
      email: dto.email?.trim() || null,
      phone: dto.phone?.trim() || null,
      github: dto.github?.trim() || null,
      linkedin: dto.linkedin?.trim() || null,
      website: dto.website?.trim() || null,
      location: dto.location?.trim() || null,
    });
    return this.contactsRepo.save(row);
  }

  async updateContact(
    userId: string,
    id: string,
    dto: UpdateContactDto,
  ): Promise<ContactProfile> {
    const row = await this.findOwnedContact(userId, id);
    if (dto.label !== undefined) {
      row.label = dto.label.trim() || 'Primary';
    }
    if (dto.email !== undefined) {
      row.email = dto.email.trim() || null;
    }
    if (dto.phone !== undefined) {
      row.phone = dto.phone.trim() || null;
    }
    if (dto.github !== undefined) {
      row.github = dto.github.trim() || null;
    }
    if (dto.linkedin !== undefined) {
      row.linkedin = dto.linkedin.trim() || null;
    }
    if (dto.website !== undefined) {
      row.website = dto.website.trim() || null;
    }
    if (dto.location !== undefined) {
      row.location = dto.location.trim() || null;
    }
    return this.contactsRepo.save(row);
  }

  async deleteContact(userId: string, id: string): Promise<void> {
    const row = await this.findOwnedContact(userId, id);
    await this.contactsRepo.remove(row);
  }

  experienceToItem(row: Experience): ExperienceItem {
    return {
      id: row.id,
      company: row.company,
      title: row.title,
      period: row.period,
      description: row.description,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  projectToItem(row: Project): ProjectItem {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      url: row.url ?? undefined,
      tech: row.tech ?? [],
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  contactToItem(row: ContactProfile): ContactItem {
    return {
      id: row.id,
      label: row.label,
      email: row.email ?? undefined,
      phone: row.phone ?? undefined,
      github: row.github ?? undefined,
      linkedin: row.linkedin ?? undefined,
      website: row.website ?? undefined,
      location: row.location ?? undefined,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  contactToPortfolioContact(row: ContactProfile): PortfolioContact {
    return {
      email: row.email ?? undefined,
      phone: row.phone ?? undefined,
      github: row.github ?? undefined,
      linkedin: row.linkedin ?? undefined,
      website: row.website ?? undefined,
      location: row.location ?? undefined,
    };
  }

  mergeContacts(rows: ContactProfile[]): PortfolioContact {
    const merged: PortfolioContact = {};
    for (const row of rows) {
      const part = this.contactToPortfolioContact(row);
      for (const [key, value] of Object.entries(part)) {
        if (value && !merged[key as keyof PortfolioContact]) {
          merged[key as keyof PortfolioContact] = value;
        }
      }
    }
    return merged;
  }

  async resolveExperiences(
    userId: string,
    ids: string[],
  ): Promise<PortfolioExperience[]> {
    if (!ids.length) {
      return [];
    }
    const rows = await this.experiencesRepo.find({
      where: { userId, id: In(ids) },
    });
    const byId = new Map(rows.map((r) => [r.id, r]));
    return ids
      .map((id) => byId.get(id))
      .filter((r): r is Experience => Boolean(r))
      .map((r) => ({
        id: r.id,
        company: r.company,
        title: r.title,
        period: r.period,
        description: r.description,
      }));
  }

  async resolveProjects(
    userId: string,
    ids: string[],
  ): Promise<PortfolioProject[]> {
    if (!ids.length) {
      return [];
    }
    const rows = await this.projectsRepo.find({
      where: { userId, id: In(ids) },
    });
    const byId = new Map(rows.map((r) => [r.id, r]));
    return ids
      .map((id) => byId.get(id))
      .filter((r): r is Project => Boolean(r))
      .map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        url: r.url ?? undefined,
        tech: r.tech ?? [],
      }));
  }

  async resolveContacts(
    userId: string,
    ids: string[],
  ): Promise<ContactProfile[]> {
    if (!ids.length) {
      return [];
    }
    const rows = await this.contactsRepo.find({
      where: { userId, id: In(ids) },
    });
    const byId = new Map(rows.map((r) => [r.id, r]));
    return ids
      .map((id) => byId.get(id))
      .filter((r): r is ContactProfile => Boolean(r));
  }

  private async findOwnedExperience(
    userId: string,
    id: string,
  ): Promise<Experience> {
    const row = await this.experiencesRepo.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException('Experience not found');
    }
    if (row.userId !== userId) {
      throw new ForbiddenException();
    }
    return row;
  }

  private async findOwnedProject(userId: string, id: string): Promise<Project> {
    const row = await this.projectsRepo.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException('Project not found');
    }
    if (row.userId !== userId) {
      throw new ForbiddenException();
    }
    return row;
  }

  private async findOwnedContact(
    userId: string,
    id: string,
  ): Promise<ContactProfile> {
    const row = await this.contactsRepo.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException('Contact not found');
    }
    if (row.userId !== userId) {
      throw new ForbiddenException();
    }
    return row;
  }
}
