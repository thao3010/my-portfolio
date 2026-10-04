import type { PortfolioContent, PortfolioSectionId } from '@portfolio/shared';
import { normalizeSectionOrder } from '@portfolio/shared';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function contactSection(content: PortfolioContent): string {
  const contactRows = Object.entries(content.contact)
    .filter(([, value]) => value)
    .map(
      ([key, value]) =>
        `<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(String(value))}</td></tr>`,
    )
    .join('');
  if (!contactRows) {
    return '';
  }
  return `<section><h2>Contact</h2><table>${contactRows}</table></section>`;
}

function experienceSection(content: PortfolioContent): string {
  if (!content.experiences.length) {
    return '';
  }
  const blocks = content.experiences
    .map(
      (exp) => `
      <article class="block">
        <h3>${escapeHtml(exp.title)}</h3>
        <p class="meta">${escapeHtml(exp.company)} · ${escapeHtml(exp.period)}</p>
        <div class="rich">${exp.description}</div>
      </article>`,
    )
    .join('');
  return `<section><h2>Experience</h2>${blocks}</section>`;
}

function projectsSection(content: PortfolioContent): string {
  if (!content.projects.length) {
    return '';
  }
  const blocks = content.projects
    .map(
      (proj) => `
      <article class="block">
        <h3>${escapeHtml(proj.title)}</h3>
        ${proj.url ? `<p class="meta"><a href="${escapeHtml(proj.url)}">${escapeHtml(proj.url)}</a></p>` : ''}
        <div class="rich">${proj.description}</div>
        ${proj.tech.length ? `<p class="meta">${proj.tech.map(escapeHtml).join(' · ')}</p>` : ''}
      </article>`,
    )
    .join('');
  return `<section><h2>Projects</h2>${blocks}</section>`;
}

function skillsSection(content: PortfolioContent): string {
  if (!content.skills.length) {
    return '';
  }
  const items = content.skills
    .map(
      (skill) => `
      <li class="skill">
        ${skill.icon ? `<img src="${escapeHtml(skill.icon)}" alt="" width="28" height="28" />` : ''}
        <div>
          <strong>${escapeHtml(skill.title)}</strong>
          ${skill.description ? `<p>${escapeHtml(skill.description)}</p>` : ''}
        </div>
      </li>`,
    )
    .join('');
  return `<section><h2>Skills</h2><ul class="skills">${items}</ul></section>`;
}

function sectionHtml(
  sectionId: PortfolioSectionId,
  content: PortfolioContent,
): string {
  switch (sectionId) {
    case 'contact':
      return contactSection(content);
    case 'experience':
      return experienceSection(content);
    case 'projects':
      return projectsSection(content);
    case 'skills':
      return skillsSection(content);
    default:
      return '';
  }
}

export function buildCvDownloadHtml(
  content: PortfolioContent,
  username: string,
): string {
  const name = escapeHtml(content.displayName || username);
  const headline = escapeHtml(content.headline);
  const summary = content.summary ? stripHtml(content.summary) : '';
  const order = normalizeSectionOrder(content.sectionOrder);
  const bodySections = order.map((id) => sectionHtml(id, content)).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${name} — CV</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.5; color: #0f172a; max-width: 720px; margin: 2rem auto; padding: 0 1.25rem; }
    h1 { margin: 0 0 0.25rem; font-size: 1.75rem; }
    h2 { margin: 1.75rem 0 0.75rem; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.35rem; }
    h3 { margin: 0 0 0.35rem; font-size: 1.05rem; }
    .headline { color: #475569; margin: 0 0 0.75rem; }
    .summary { margin: 0 0 1rem; }
    .meta { color: #64748b; font-size: 0.92rem; margin: 0 0 0.5rem; }
    .block { margin-bottom: 1.1rem; }
    table { border-collapse: collapse; width: 100%; font-size: 0.95rem; }
    th { text-align: left; padding: 0.2rem 0.75rem 0.2rem 0; color: #64748b; font-weight: 600; text-transform: capitalize; vertical-align: top; }
    td { padding: 0.2rem 0; }
    ul.skills { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.65rem; }
    li.skill { display: flex; gap: 0.65rem; align-items: flex-start; }
    li.skill img { border-radius: 6px; object-fit: contain; background: #f1f5f9; padding: 4px; }
    li.skill p { margin: 0.15rem 0 0; color: #475569; font-size: 0.9rem; }
    .rich p { margin: 0.35rem 0; }
    @media print { body { margin: 0.5in; } }
  </style>
</head>
<body>
  <header>
    <h1>${name}</h1>
    ${headline ? `<p class="headline">${headline}</p>` : ''}
    ${summary ? `<p class="summary">${escapeHtml(summary)}</p>` : ''}
  </header>
  ${bodySections}
</body>
</html>`;
}
