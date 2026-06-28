import type { Metadata } from "next";
import Link from "next/link";
import "@tessera/tokens/tokens.css";
import "@tessera/styles/index.css";
import "./globals.css";
import { ToastProvider } from "@tessera/react";
import { Logo } from "../components/Logo";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { categoryLabels, groupedComponentSlugs } from "../lib/manifests";

export const metadata: Metadata = {
  title: "Tessera - composable design system",
  description:
    "Token-first, zero-runtime-CSS design system with a framework-agnostic core and an eject-with-upgrade-path CLI.",
};

const themeInit = `
try {
  var t = localStorage.getItem("tessera-theme");
  if (t) document.documentElement.dataset.theme = t;
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <ToastProvider>
          <header className="site-header">
            <Link href="/" className="brand">
              <Logo />
              tessera
            </Link>
            <nav>
              <Link href="/tokens">Tokens</Link>
              <Link href="/cli">CLI</Link>
              <Link href="/llms.txt">llms.txt</Link>
            </nav>
            <div className="spacer" />
            <ThemeSwitcher />
          </header>
          <div className="layout">
            <aside className="sidebar">
              <div className="group">Overview</div>
              <Link href="/">Why Tessera</Link>
              <Link href="/getting-started">Getting started</Link>
              <Link href="/theming">Theming</Link>
              <Link href="/tokens">Token explorer</Link>
              <Link href="/cli">Eject &amp; update</Link>
              {groupedComponentSlugs().map(({ category, slugs }) => (
                <div key={category}>
                  <div className="group">{categoryLabels[category] ?? category}</div>
                  <div className="group-links">
                    {slugs.map((slug) => (
                      <Link key={slug} href={`/components/${slug}`}>
                        {slug}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </aside>
            <main className="content">{children}</main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
