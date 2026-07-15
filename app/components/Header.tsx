import Link from "next/link";

type HeaderProps = {
  current?: "work" | "resume" | "brief";
};

export function Header({ current }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Link className="wordmark" href="/" aria-label="Sergey Kudelin, home">
          <span className="wordmark-mark" aria-hidden="true" />
          Sergey Kudelin
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/#work" aria-current={current === "work" ? "page" : undefined}>
            Work
          </Link>
          <Link href="/#about">About</Link>
          <Link href="/resume" aria-current={current === "resume" ? "page" : undefined}>
            Resume
          </Link>
          <a href="mailto:kudelin.dev@gmail.com">Email</a>
        </nav>
      </div>
    </header>
  );
}
