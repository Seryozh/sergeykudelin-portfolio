import Link from "next/link";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="not-found shell">
        <p className="eyebrow"><span className="signal-dot" aria-hidden="true" />404</p>
        <h1>This page is not here.</h1>
        <p>The work still is. Start with the FutureClinic case.</p>
        <Link className="button button-dark" href="/work/futureclinic">See FutureClinic</Link>
      </main>
      <Footer />
    </>
  );
}
