'use client';

import type {
  PortfolioContact,
  PortfolioContactFieldKey,
  PortfolioContactFieldLabels,
  PortfolioExperience,
  PortfolioProject,
  PortfolioPublicUi,
  PortfolioSectionId,
  PortfolioSkill,
} from '@portfolio/shared';
import { normalizeSectionOrder } from '@portfolio/shared';
import { motion, type Variants } from 'motion/react';
import Link from 'next/link';
import {
  easeOutExpo,
  revealSection,
  springSoft,
} from '../lib/motion-presets';
import { PortfolioDevBanner } from './portfolio-dev-banner';
import { RichHtml } from './rich-html';
import { ProjectsCarousel3D } from './projects-carousel-3d';

export type PublicPortfolioData = {
  username: string;
  publicUi: PortfolioPublicUi;
  displayName: string;
  headline: string;
  summary: string;
  contact: PortfolioContact;
  experiences: PortfolioExperience[];
  projects: PortfolioProject[];
  skills: PortfolioSkill[];
  sectionOrder: PortfolioSectionId[];
  cvDownloadUrl: string;
};

export function PublicPortfolioView({ data }: { data: PublicPortfolioData }) {
  const name = data.displayName || data.username;
  const hasBody =
    data.headline ||
    data.summary ||
    data.experiences.length ||
    data.projects.length ||
    data.skills.length ||
    Object.values(data.contact).some(Boolean);

  return (
    <div className="portfolio-page">
      <PortfolioDevBanner
        username={data.username}
        displayName={name}
        headline={data.headline}
        summary={data.summary}
        cvDownloadUrl={data.cvDownloadUrl}
        publicUi={data.publicUi}
      />

      {!hasBody ? (
        <motion.div
          className="portfolio-empty-callout"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springSoft}
        >
          <p className="portfolio-empty-callout-eyebrow">Published</p>
          <h2 className="portfolio-empty-callout-title">Sections are empty</h2>
          <p className="portfolio-empty-callout-lead">
            {data.publicUi.emptyDraftHint}
          </p>
          <div className="problem-reason-card portfolio-empty-callout-reasons">
            <h3 className="problem-reason-heading">Why you are seeing this</h3>
            <ul className="problem-reason-list">
              <li>
                The portfolio is published but no experience, projects, skills,
                or contact blocks are on the public layout yet.
              </li>
              <li>
                Content exists in the library but has not been added to the
                Display tab layout.
              </li>
            </ul>
          </div>
          <Link className="btn btn-secondary portfolio-empty-callout-home" href="/">
            ← Back to home
          </Link>
        </motion.div>
      ) : null}

      {renderOrderedSections(
        data,
        data.publicUi.sectionTitles,
        data.publicUi.contactFieldLabels,
      )}

      <motion.p
        className="back-link"
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, ...springSoft }}
      >
        <Link href="/">{data.publicUi.backLinkLabel}</Link>
      </motion.p>
    </div>
  );
}

function renderOrderedSections(
  data: PublicPortfolioData,
  sectionTitles: PortfolioPublicUi['sectionTitles'],
  contactFieldLabels: PortfolioContactFieldLabels,
) {
  const order = normalizeSectionOrder(data.sectionOrder);
  let index = 0;
  return order.map((sectionId) => {
    switch (sectionId) {
      case 'contact':
        return (
          <ContactSection
            key="contact"
            title={sectionTitles.contact}
            contact={data.contact}
            fieldLabels={contactFieldLabels}
            index={index++}
          />
        );
      case 'experience':
        return (
          <ExperienceSection
            key="experience"
            title={sectionTitles.experience}
            items={data.experiences}
            index={index++}
          />
        );
      case 'projects':
        return (
          <ProjectsSection
            key="projects"
            title={sectionTitles.projects}
            items={data.projects}
            index={index++}
          />
        );
      case 'skills':
        return (
          <SkillsSection
            key="skills"
            title={sectionTitles.skills}
            skills={data.skills}
            index={index++}
          />
        );
      default:
        return null;
    }
  });
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
    >
      <span className="section-title-text">{children}</span>
      <motion.span
        className="section-title-rule"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: easeOutExpo, delay: 0.08 }}
      />
    </motion.h2>
  );
}

const CONTACT_LINK_FIELDS = new Set<PortfolioContactFieldKey>([
  'website',
  'github',
  'linkedin',
]);

function ContactSection({
  title,
  contact,
  fieldLabels,
  index,
}: {
  title: string;
  contact: PortfolioContact;
  fieldLabels: PortfolioContactFieldLabels;
  index: number;
}) {
  const entries = Object.entries(contact).filter(([, value]) => value);
  if (!entries.length) {
    return null;
  }

  return (
    <motion.section
      className="portfolio-section"
      variants={revealSection(index)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionTitle>{title}</SectionTitle>
      <ul className="contact-list">
        {entries.map(([key, value], i) => {
          const field = key as PortfolioContactFieldKey;
          const label = fieldLabels[field] ?? key;
          return (
          <motion.li
            key={key}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, ...springSoft }}
          >
            <span>{label}</span>
            {CONTACT_LINK_FIELDS.has(field) ? (
              <a href={String(value)} target="_blank" rel="noreferrer">
                {value}
              </a>
            ) : (
              <strong>{value}</strong>
            )}
          </motion.li>
          );
        })}
      </ul>
    </motion.section>
  );
}

function ExperienceSection({
  title,
  items,
  index,
}: {
  title: string;
  items: PortfolioExperience[];
  index: number;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <motion.section
      className="portfolio-section"
      variants={revealSection(index)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <SectionTitle>{title}</SectionTitle>
      <div className="timeline">
        {items.map((item, i) => (
          <motion.article
            key={item.id}
            className="timeline-card"
            initial={{ opacity: 0, x: -28, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.07, ...springSoft }}
            whileHover={{ x: 6 }}
          >
            <div className="timeline-card-head">
              <motion.span
                className="timeline-dot"
                aria-hidden
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 22,
                  delay: i * 0.07,
                }}
              />
              <h3>{item.title}</h3>
            </div>
            <p className="meta">{item.company} · {item.period}</p>
            <RichHtml html={item.description} />
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

function ProjectsSection({
  title,
  items,
  index,
}: {
  title: string;
  items: PortfolioProject[];
  index: number;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <motion.section
      className="portfolio-section"
      variants={revealSection(index)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <SectionTitle>{title}</SectionTitle>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: easeOutExpo }}
      >
        <ProjectsCarousel3D items={items} />
      </motion.div>
    </motion.section>
  );
}

const skillCardVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    rotateX: 0,
  },
  hover: {
    y: -8,
    scale: 1.03,
    rotateX: 4,
    transition: { type: 'spring', stiffness: 440, damping: 24 },
  },
};

const skillCardGlowVariants: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.25 } },
};

const skillIconWrapVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.14,
    rotate: -8,
    transition: { type: 'spring', stiffness: 520, damping: 18 },
  },
};

const skillTitleVariants: Variants = {
  rest: { x: 0 },
  hover: {
    x: 4,
    transition: { type: 'spring', stiffness: 400, damping: 28 },
  },
};

function SkillsSection({
  title,
  skills,
  index,
}: {
  title: string;
  skills: PortfolioSkill[];
  index: number;
}) {
  if (!skills.length) {
    return null;
  }

  return (
    <motion.section
      className="portfolio-section"
      variants={revealSection(index)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionTitle>{title}</SectionTitle>
      <ul className="skills-public-grid">
        {skills.map((skill, i) => (
          <motion.li
            key={skill.id}
            className="skills-public-item"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.04,
              type: 'spring',
              stiffness: 380,
              damping: 24,
            }}
          >
            <motion.div
              className="skills-public-card"
              style={{ transformPerspective: 900 }}
              variants={skillCardVariants}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.98, y: -2 }}
            >
              <motion.span
                className="skills-public-card-glow"
                variants={skillCardGlowVariants}
                aria-hidden
              />
              <div className="skills-public-card-inner">
                <motion.div
                  className="skills-public-icon-wrap"
                  variants={skillIconWrapVariants}
                >
                  {skill.icon ? (
                    <img
                      className="skills-public-icon"
                      src={skill.icon}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                    />
                  ) : (
                    <span className="skills-public-fallback" aria-hidden>
                      {skill.title.charAt(0).toUpperCase()}
                    </span>
                  )}
                </motion.div>
                <div className="skills-public-body">
                  <motion.strong variants={skillTitleVariants}>
                    {skill.title}
                  </motion.strong>
                  {/* {skill.description ? (
                    <p>{skill.description}</p>
                  ) : null} */}
                </div>
              </div>
            </motion.div>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}
