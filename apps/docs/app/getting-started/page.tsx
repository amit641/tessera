export const metadata = { title: "Getting started - Tessera" };

export default function GettingStartedPage() {
  return (
    <>
      <h1>Getting started</h1>
      <p>
        Tessera ships as three small packages: tokens (CSS variables), styles (zero-runtime CSS
        recipes), and the React components. Three steps and you are rendering accessible UI.
      </p>

      <h2>1. Install</h2>
      <pre>
        <code>{`pnpm add @tessera/react @tessera/styles @tessera/tokens`}</code>
      </pre>

      <h2>2. Import the CSS once</h2>
      <p>
        Add the two stylesheets to your app entry (e.g. <code>app/layout.tsx</code> in Next.js).
        All library styles live inside <code>@layer tessera</code>, so they can never override
        your own CSS.
      </p>
      <pre>
        <code>{`import "@tessera/tokens/tokens.css";
import "@tessera/styles/index.css";`}</code>
      </pre>

      <h2>3. Use components</h2>
      <pre>
        <code>{`import { Button, TextField, Dialog } from "@tessera/react";

export function Example() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open settings</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Settings</Dialog.Title>
        <TextField label="Display name" />
        <Button>Save</Button>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  );
}`}</code>
      </pre>

      <h2>Toasts need a provider</h2>
      <p>
        Wrap your app once with <code>ToastProvider</code>; then call <code>useToast()</code>{" "}
        anywhere.
      </p>
      <pre>
        <code>{`import { ToastProvider } from "@tessera/react";

<ToastProvider>{children}</ToastProvider>`}</code>
      </pre>

      <h2>Dark and light themes</h2>
      <p>
        The default theme is dark. Switch by setting <code>data-theme</code> on the root element -
        no JavaScript re-render involved, it is pure CSS variables.
      </p>
      <pre>
        <code>{`document.documentElement.dataset.theme = "light"; // or "dark"`}</code>
      </pre>

      <h2>Server components</h2>
      <p>
        Every component is client-ready (<code>&quot;use client&quot;</code> is baked into the
        bundle) and the CSS has no runtime, so Tessera works out of the box with React Server
        Components and streaming SSR.
      </p>

      <h2>Prefer owning the code?</h2>
      <p>
        Instead of importing from the package you can eject any component&apos;s source into your
        repo with the CLI - and still receive upstream improvements via 3-way merge. See{" "}
        <a href="/cli">Eject &amp; update</a>.
      </p>
    </>
  );
}
