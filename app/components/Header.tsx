import Link from "next/link";

type HeaderProps = {
  current?: "work" | "resume";
};

export function Header({ current }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Link className="wordmark" href="/" aria-label="Sergey Kudelin, home">
          <span className="wordmark-code" aria-hidden="true">SK / 26</span>
          <span>Sergey Kudelin</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/#work" aria-current={current === "work" ? "page" : undefined}>
            Work
          </Link>
          <Link href="/resume" aria-current={current === "resume" ? "page" : undefined}>
            Resume
          </Link>
          <a href="https://www.linkedin.com/in/sergeykudelin">LinkedIn</a>
          <a href="mailto:sergey@sergeykudelin.com">Email</a>
        </nav>
      </div>
    </header>
  );
}
