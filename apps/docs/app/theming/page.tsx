export const metadata = { title: "Theming - Tessera" };

export default function ThemingPage() {
  return (
    <>
      <h1>Theming</h1>
      <p>
        Tessera is themed entirely through CSS custom properties compiled from W3C design tokens.
        There is no theme object, no provider, and no runtime cost - overriding a theme is just
        CSS.
      </p>

      <h2>The token layers</h2>
      <ul>
        <li>
          <strong>Reference tokens</strong> (<code>--ts-color-*</code>, <code>--ts-space-*</code>,
          ...) - raw palette and scales. Rarely overridden.
        </li>
        <li>
          <strong>Semantic tokens</strong> (<code>--ts-bg-canvas</code>,{" "}
          <code>--ts-accent-default</code>, <code>--ts-fg-muted</code>, ...) - what components
          actually consume. Override these to re-theme everything at once.
        </li>
        <li>
          <strong>Component tokens</strong> (<code>--btn-bg</code>, <code>--alert-accent</code>,
          ...) - per-component knobs documented in each component&apos;s Styling section.
        </li>
      </ul>

      <h2>Change the brand color</h2>
      <p>One rule re-themes every button, badge, focus ring, and accent in the system:</p>
      <pre>
        <code>{`:root {
  --ts-accent-default: oklch(0.65 0.2 300); /* purple instead of teal */
  --ts-accent-emphasis: oklch(0.58 0.21 300);
  --ts-accent-fg: oklch(0.78 0.16 300);
  --ts-accent-subtle: oklch(0.3 0.08 300 / 0.35);
}`}</code>
      </pre>

      <h2>Dark / light mode</h2>
      <p>
        Themes are keyed off <code>data-theme</code> on <code>&lt;html&gt;</code>. Both themes ship
        in <code>tokens.css</code>; switching is instant and SSR-safe.
      </p>
      <pre>
        <code>{`<html data-theme="light">  <!-- or "dark" (default) -->`}</code>
      </pre>

      <h2>Restyle a single component</h2>
      <p>
        Components expose stable <code>data-scope</code>/<code>data-part</code> attributes - a
        versioned styling API. Because all library CSS sits in <code>@layer tessera</code>, your
        unlayered CSS always wins. No specificity wars, no <code>!important</code>:
      </p>
      <pre>
        <code>{`/* square buttons, app-wide */
[data-scope="button"][data-part="root"] {
  border-radius: 0;
}

/* or tweak one component token */
[data-scope="button"][data-part="root"][data-variant="solid"] {
  --btn-bg: var(--ts-success-default);
}`}</code>
      </pre>

      <h2>Scoped themes</h2>
      <p>
        Because everything is CSS variables, you can theme a subtree - useful for marketing
        sections or embedded widgets:
      </p>
      <pre>
        <code>{`.promo-section {
  --ts-accent-default: #f59e0b;
  --ts-radius-md: 2px;
}`}</code>
      </pre>

      <h2>Build your own token set</h2>
      <p>
        The source of truth is W3C design-token JSON in <code>@tessera/tokens</code>. Fork the
        JSON, run the build script, and you get a complete <code>tokens.css</code> plus typed
        TypeScript maps for your own brand.
      </p>
    </>
  );
}
