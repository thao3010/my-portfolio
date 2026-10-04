import {
  createEmptyPortfolioContent,
  createEmptySurfaceLayout,
  DEFAULT_PORTFOLIO_SECTION_ORDER,
  normalizeSectionOrder,
  type PortfolioContent,
  type PortfolioEditorPayload,
  type PortfolioSkill,
  type SurfaceLayout,
} from '@portfolio/shared';
import { buildCvDownloadHtml } from './build-cv-html';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentLibraryService } from '../content-library/content-library.service';
import { SkillsService } from '../skills/skills.service';
import { User } from '../users/entities/user.entity';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';

function layoutIsEmpty(layout: SurfaceLayout | undefined): boolean {
  if (!layout) {
    return true;
  }
  return (
    layout.experienceIds.length === 0 &&
    layout.projectIds.length === 0 &&
    layout.contactIds.length === 0 &&
    layout.skillIds.length === 0
  );
}

function normalizeLayout(raw: unknown): SurfaceLayout {
  if (!raw || typeof raw !== 'object') {
    return createEmptySurfaceLayout();
  }
  const o = raw as Record<string, unknown>;
  const ids = (key: string) =>
    Array.isArray(o[key])
      ? (o[key] as unknown[]).filter((id) => typeof id === 'string')
      : [];
  return {
    sectionOrder: normalizeSectionOrder(o.sectionOrder),
    experienceIds: ids('experienceIds'),
    projectIds: ids('projectIds'),
    contactIds: ids('contactIds'),
    skillIds: ids('skillIds'),
  };
}

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfoliosRepository: Repository<Portfolio>,
    private readonly contentLibrary: ContentLibraryService,
    private readonly skillsService: SkillsService,
  ) {}

  async getOrCreateForUser(userId: string): Promise<Portfolio> {
    let portfolio = await this.portfoliosRepository.findOne({
      where: { userId },
    });
    if (!portfolio) {
      const empty = createEmptyPortfolioContent();
      portfolio = this.portfoliosRepository.create({
        userId,
        displayName: empty.displayName,
        headline: empty.headline,
        summary: empty.summary,
        contact: empty.contact,
        experiences: empty.experiences,
        projects: empty.projects,
        skills: [],
        isPublished: empty.isPublished,
        portfolioLayout: createEmptySurfaceLayout(),
        cvLayout: createEmptySurfaceLayout(),
      });
      portfolio = await this.portfoliosRepository.save(portfolio);
    }
    portfolio.portfolioLayout = normalizeLayout(portfolio.portfolioLayout);
    portfolio.cvLayout = normalizeLayout(portfolio.cvLayout);
    return this.migrateLegacyEmbeddedContentIfNeeded(portfolio);
  }

  async updateForUser(
    userId: string,
    dto: UpdatePortfolioDto,
  ): Promise<Portfolio> {
    const portfolio = await this.getOrCreateForUser(userId);
    Object.assign(portfolio, {
      ...(dto.displayName !== undefined && { displayName: dto.displayName }),
      ...(dto.headline !== undefined && { headline: dto.headline }),
      ...(dto.summary !== undefined && { summary: dto.summary }),
      ...(dto.contact !== undefined && { contact: dto.contact }),
      ...(dto.experiences !== undefined && { experiences: dto.experiences }),
      ...(dto.projects !== undefined && { projects: dto.projects }),
      ...(dto.skills !== undefined && { skills: dto.skills }),
      ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
      ...(dto.portfolioLayout !== undefined && {
        portfolioLayout: normalizeLayout(dto.portfolioLayout),
      }),
      ...(dto.cvLayout !== undefined && {
        cvLayout: normalizeLayout(dto.cvLayout),
      }),
    });
    return this.portfoliosRepository.save(portfolio);
  }

  async getPublishedByUsername(username: string): Promise<{
    user: Pick<User, 'username' | 'preferredLocale'>;
    portfolio: PortfolioContent;
  }> {
    const portfolio = await this.portfoliosRepository
      .createQueryBuilder('portfolio')
      .innerJoinAndSelect('portfolio.user', 'user')
      .where('user.username = :username', { username: username.toLowerCase() })
      .andWhere('user.is_active = true')
      .andWhere('portfolio.is_published = true')
      .getOne();
    if (!portfolio?.user) {
      throw new NotFoundException('Portfolio not found');
    }
    portfolio.portfolioLayout = normalizeLayout(portfolio.portfolioLayout);
    portfolio.cvLayout = normalizeLayout(portfolio.cvLayout);
    const migrated = await this.migrateLegacyEmbeddedContentIfNeeded(portfolio);
    const resolved = await this.resolveSurfaceContent(
      migrated.userId,
      migrated,
      migrated.portfolioLayout,
    );
    return {
      user: {
        username: portfolio.user.username,
        preferredLocale: portfolio.user.preferredLocale,
      },
      portfolio: resolved,
    };
  }

  async getPublishedCvByUsername(username: string): Promise<{
    user: Pick<User, 'username' | 'preferredLocale'>;
    portfolio: PortfolioContent;
  }> {
    const portfolio = await this.portfoliosRepository
      .createQueryBuilder('portfolio')
      .innerJoinAndSelect('portfolio.user', 'user')
      .where('user.username = :username', { username: username.toLowerCase() })
      .andWhere('user.is_active = true')
      .andWhere('portfolio.is_published = true')
      .getOne();
    if (!portfolio?.user) {
      throw new NotFoundException('Portfolio not found');
    }
    portfolio.portfolioLayout = normalizeLayout(portfolio.portfolioLayout);
    portfolio.cvLayout = normalizeLayout(portfolio.cvLayout);
    const migrated = await this.migrateLegacyEmbeddedContentIfNeeded(portfolio);
    const layout = layoutIsEmpty(migrated.cvLayout)
      ? migrated.portfolioLayout
      : migrated.cvLayout;
    const resolved = await this.resolveSurfaceContent(
      migrated.userId,
      migrated,
      layout,
    );
    return {
      user: {
        username: portfolio.user.username,
        preferredLocale: portfolio.user.preferredLocale,
      },
      portfolio: resolved,
    };
  }

  buildCvHtml(content: PortfolioContent, username: string): string {
    return buildCvDownloadHtml(content, username);
  }

  toEditorResponse(portfolio: Portfolio): PortfolioEditorPayload & {
    updatedAt: string;
  } {
    return {
      displayName: portfolio.displayName,
      headline: portfolio.headline,
      summary: portfolio.summary,
      isPublished: portfolio.isPublished,
      portfolioLayout: normalizeLayout(portfolio.portfolioLayout),
      cvLayout: normalizeLayout(portfolio.cvLayout),
      updatedAt: portfolio.updatedAt.toISOString(),
    };
  }

  private async resolveSurfaceContent(
    userId: string,
    portfolio: Portfolio,
    layout: SurfaceLayout,
  ): Promise<PortfolioContent> {
    let experiences = await this.contentLibrary.resolveExperiences(
      userId,
      layout.experienceIds,
    );
    let projects = await this.contentLibrary.resolveProjects(
      userId,
      layout.projectIds,
    );
    let contact = this.contentLibrary.mergeContacts(
      await this.contentLibrary.resolveContacts(userId, layout.contactIds),
    );
    let skills = await this.resolveSkills(userId, layout.skillIds);

    if (!experiences.length && portfolio.experiences?.length) {
      experiences = portfolio.experiences;
    }
    if (!projects.length && portfolio.projects?.length) {
      projects = portfolio.projects;
    }
    if (!Object.keys(contact).length && portfolio.contact) {
      contact = portfolio.contact;
    }
    if (!skills.length && portfolio.skills?.length) {
      skills = (portfolio.skills as string[]).map((title, index) => ({
        id: `legacy-skill-${index}`,
        icon: '',
        title,
        description: '',
      }));
    }

    return {
      displayName: portfolio.displayName,
      headline: portfolio.headline,
      summary: portfolio.summary,
      isPublished: portfolio.isPublished,
      sectionOrder: layout.sectionOrder,
      contact,
      experiences,
      projects,
      skills,
    };
  }

  private async resolveSkills(
    userId: string,
    skillIds: string[],
  ): Promise<PortfolioSkill[]> {
    if (!skillIds.length) {
      return [];
    }
    const all = await this.skillsService.listForUser(userId);
    const byId = new Map(all.map((s) => [s.id, s]));
    return skillIds
      .map((id) => byId.get(id))
      .filter((skill): skill is NonNullable<typeof skill> => Boolean(skill))
      .map((skill) => ({
        id: skill.id,
        icon: skill.icon,
        title: skill.title,
        description: skill.description,
      }));
  }

  private async migrateLegacyEmbeddedContentIfNeeded(
    portfolio: Portfolio,
  ): Promise<Portfolio> {
    if (!layoutIsEmpty(portfolio.portfolioLayout)) {
      return portfolio;
    }

    const hasLegacy =
      (portfolio.experiences?.length ?? 0) > 0 ||
      (portfolio.projects?.length ?? 0) > 0 ||
      Object.keys(portfolio.contact ?? {}).length > 0 ||
      (portfolio.skills?.length ?? 0) > 0;

    if (!hasLegacy) {
      return portfolio;
    }

    const experienceIds: string[] = [];
    for (const exp of portfolio.experiences ?? []) {
      const row = await this.contentLibrary.createExperience(portfolio.userId, {
        company: exp.company,
        title: exp.title,
        period: exp.period,
        description: exp.description,
      });
      experienceIds.push(row.id);
    }

    const projectIds: string[] = [];
    for (const proj of portfolio.projects ?? []) {
      const row = await this.contentLibrary.createProject(portfolio.userId, {
        title: proj.title,
        description: proj.description,
        url: proj.url,
        tech: proj.tech,
      });
      projectIds.push(row.id);
    }

    const contactIds: string[] = [];
    if (portfolio.contact && Object.keys(portfolio.contact).length > 0) {
      const c = portfolio.contact;
      const row = await this.contentLibrary.createContact(portfolio.userId, {
        label: 'Primary',
        email: c.email,
        phone: c.phone,
        github: c.github,
        linkedin: c.linkedin,
        website: c.website,
        location: c.location,
      });
      contactIds.push(row.id);
    }

    portfolio.portfolioLayout = {
      sectionOrder: [...DEFAULT_PORTFOLIO_SECTION_ORDER],
      experienceIds,
      projectIds,
      contactIds,
      skillIds: [],
    };
    portfolio.cvLayout = { ...portfolio.portfolioLayout };

    return this.portfoliosRepository.save(portfolio);
  }
}
