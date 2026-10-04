import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { href: '/content/experiences', label: 'Experience' },
  { href: '/content/projects', label: 'Projects' },
  { href: '/content/contacts', label: 'Contact' },
  { href: '/content/skills', label: 'Skills' },
] as const;

export function ContentSectionNav() {
  const { pathname } = useLocation();

  return (
    <nav className="content-section-nav" aria-label="Content sections">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={`content-section-nav-link${pathname === link.href ? ' is-active' : ''}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
