import Link from "next/link";
import { Logo } from "../components/Logo";

const problems = [
  {
    title: "The customization cliff",
    body: "MUI/AntD make the first 80% easy and the last 20% brutal: specificity wars, undocumented class names, !important.",
  },
  {
    title: "Runtime CSS-in-JS tax",
    body: "Emotion-style runtimes bloat bundles, slow hydration, and break under React Server Components.",
  },
  {
    title: "No ownership middle ground",
    body: "npm packages lock you out of internals; copy-paste kits cut you off from upstream fixes forever.",
  },
  {
    title: "AI hallucinates your UI",
    body: "LLMs generate outdated component APIs because libraries ship no machine-readable contracts.",
  },
];

const answers = [
  {
    title: "Anatomy contract",
    body: "Stable data-scope/data-part attributes on every part - a versioned public API for styles and tests.",
    href: "/components/dialog",
  },
  {
    title: "Zero-runtime cascade layers",
    body: "All CSS lives in @layer tessera. Your unlayered app CSS always wins. RSC-safe by construction.",
    href: "/components/button",
  },
  {
    title: "Framework-agnostic core",
    body: "Behavior lives in plain-TS state machines and stores; React is a thin adapter.",
    href: "/components/tooltip",
  },
  {
    title: "Eject with an upgrade path",
    body: "tessera add copies source into your repo; tessera update 3-way merges upstream improvements into your edits.",
    href: "/cli",
  },
  {
    title: "Token-first theming",
    body: "W3C token JSON compiles to reference + semantic CSS variable tiers. Swap themes with one attribute.",
    href: "/tokens",
  },
  {
    title: "AI-native manifests",
    body: "Every component ships a machine-readable manifest, aggregated into llms.txt for coding agents.",
    href: "/llms.txt",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <Logo size={64} />
        <h1>
          Small, stable parts.
          <br />
          <span className="accent">Composed into systems you own.</span>
        </h1>
        <p className="lead">
          Tessera is a design system built against the failure modes of MUI, AntD, and Chakra:
          28 accessible components, zero-runtime styling, a framework-agnostic core, versioned
          anatomy contracts, and an eject command that keeps an upgrade path.
        </p>
        <p>
          <Link href="/getting-started">Get started in 3 steps →</Link>
        </p>
        <pre>
          <code>{`import "@tessera/tokens/tokens.css";
import "@tessera/styles/index.css";
import { Button } from "@tessera/react";`}</code>
        </pre>
      </section>

      <h2>What existing libraries get wrong</h2>
      <div className="card-grid">
        {problems.map((problem) => (
          <div className="card" key={problem.title}>
            <h3>{problem.title}</h3>
            <p>{problem.body}</p>
          </div>
        ))}
      </div>

      <h2>The Tessera answer</h2>
      <div className="card-grid">
        {answers.map((answer) => (
          <Link
            key={answer.title}
            href={answer.href}
            className="card"
            style={{ display: "block" }}
          >
            <h3>{answer.title}</h3>
            <p>{answer.body}</p>
          </Link>
        ))}
      </div>

      <h2>Override anything without a fight</h2>
      <p>
        Every Tessera rule lives inside <code>@layer tessera</code> and targets stable anatomy
        attributes. This is the entire override story - no <code>!important</code>, no class-name
        spelunking, guaranteed stable across upgrades:
      </p>
      <pre>
        <code>{`/* your plain app css - always wins, because Tessera's CSS is layered */
[data-scope="button"][data-part="root"] {
  --button-bg: rebeccapurple;
  border-radius: 0;
}`}</code>
      </pre>
    </>
  );
}
