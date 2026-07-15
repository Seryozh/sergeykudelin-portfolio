import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner shell">
        <span>Sergey Kudelin / Growth Engineer / Miami</span>
        <div className="footer-links">
          <Link href="/brief">Why this site exists</Link>
          <Link href="/resume">Resume</Link>
          <a href="https://github.com/Seryozh">GitHub</a>
          <a href="https://www.linkedin.com/in/sergeykudelin">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
