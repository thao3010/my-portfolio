export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p>
        Created by <span className="site-footer-name">Daisy</span> @{year}
      </p>
    </footer>
  );
}
