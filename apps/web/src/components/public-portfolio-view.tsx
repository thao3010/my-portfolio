'use client';

import type {
  PortfolioContact,
  PortfolioExperience,
  PortfolioProject,
  PortfolioSectionId,
  PortfolioSkill,
} from '@portfolio/shared';
import { normalizeSectionOrder } from '@portfolio/shared';
import { motion } from 'motion/react';
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
  locale: string;
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
        locale={data.locale}
        username={data.username}
        displayName={name}
        headline={data.headline}
        summary={data.summary}
        cvDownloadUrl={data.cvDownloadUrl}
      />

      {!hasBody ? (
        <motion.p
          className="portfolio-draft-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Portfolio is published but sections are empty — add content in the CMS editor.
        </motion.p>
      ) : null}

      {renderOrderedSections(data)}

      <motion.p
        className="back-link"
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, ...springSoft }}
      >
        <Link href="/">← Back to home</Link>
      </motion.p>
    </div>
  );
}

function renderOrderedSections(data: PublicPortfolioData) {
  const order = normalizeSectionOrder(data.sectionOrder);
  let index = 0;
  return order.map((sectionId) => {
    switch (sectionId) {
      case 'contact':
        return (
          <ContactSection
            key="contact"
            contact={data.contact}
            index={index++}
          />
        );
      case 'experience':
        return (
          <ExperienceSection
            key="experience"
            items={data.experiences}
            index={index++}
          />
        );
      case 'projects':
        return (
          <ProjectsSection
            key="projects"
            items={data.projects}
            index={index++}
          />
        );
      case 'skills':
        return (
          <SkillsSection
            key="skills"
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

function ContactSection({
  contact,
  index,
}: {
  contact: PortfolioContact;
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
      <SectionTitle>Contact</SectionTitle>
      <ul className="contact-list">
        {entries.map(([key, value], i) => (
          <motion.li
            key={key}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, ...springSoft }}
          >
            <span>{key}</span>
            {key === 'website' || key === 'github' || key === 'linkedin' ? (
              <a href={String(value)} target="_blank" rel="noreferrer">
                {value}
              </a>
            ) : (
              <strong>{value}</strong>
            )}
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}

function ExperienceSection({
  items,
  index,
}: {
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
      <SectionTitle>Experience</SectionTitle>
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
            <motion.span
              className="timeline-dot"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 500, damping: 22, delay: i * 0.07 }}
            />
            <h3>{item.title}</h3>
            <p className="meta">{item.company} · {item.period}</p>
            <RichHtml html={item.description} />
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

function ProjectsSection({
  items,
  index,
}: {
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
      <SectionTitle>Selected work</SectionTitle>
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

function SkillsSection({
  skills,
  index,
}: {
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
      <SectionTitle>Skills</SectionTitle>
      <ul className="skills-public-grid">
        {skills.map((skill, i) => (
          <motion.li
            key={skill.id}
            className="skills-public-card"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 380, damping: 24 }}
            whileHover={{ y: -3 }}
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
            <div className="skills-public-body">
              <strong>{skill.title}</strong>
              {skill.description ? (
                <p>{skill.description}</p>
              ) : null}
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}
