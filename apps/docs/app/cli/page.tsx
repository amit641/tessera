export default function CliPage() {
  return (
    <>
      <h1>Eject with an upgrade path</h1>
      <p>
        The unsolved problem in component libraries: npm packages lock you out of internals,
        while copy-paste kits (shadcn-style) hand you the code but cut you off from upstream
        fixes forever. Tessera&apos;s CLI gives you both.
      </p>

      <h2>1. Eject a component</h2>
      <pre>
        <code>{`$ tessera add button

  + tessera-ui/button/button.tsx
  + tessera-ui/button/button.css

Added button v0.1.0. Runtime deps: @tessera/core, @tessera/tokens.`}</code>
      </pre>
      <p>
        The source is now yours - edit it like any other file in your repo. Behind the scenes,
        Tessera records the pristine upstream snapshot in <code>.tessera/base/</code> and pins
        versions + content hashes in <code>tessera-lock.json</code>.
      </p>

      <h2>2. Modify it freely</h2>
      <pre>
        <code>{`/* tessera-ui/button/button.css - your edit */
[data-scope="button"][data-part="root"] {
  height: 2.5rem; /* taller buttons for our brand */
}`}</code>
      </pre>

      <h2>3. Pull upstream improvements later</h2>
      <pre>
        <code>{`$ tessera update button

  ~ button.css (merged your changes with upstream)

Updated button to v0.2.0 cleanly.`}</code>
      </pre>
      <p>
        <code>tessera update</code> runs a 3-way merge per file: base snapshot vs. your copy
        vs. the new upstream version. Non-overlapping changes merge cleanly; genuine overlaps
        produce git-style conflict markers you resolve in your editor - exactly like a rebase,
        but for vendored UI components.
      </p>

      <h2>Merge semantics</h2>
      <table className="props-table">
        <thead>
          <tr>
            <th>Your copy</th>
            <th>Upstream</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>unchanged</td>
            <td>unchanged</td>
            <td>no-op</td>
          </tr>
          <tr>
            <td>modified</td>
            <td>unchanged</td>
            <td>your copy kept untouched</td>
          </tr>
          <tr>
            <td>unchanged</td>
            <td>modified</td>
            <td>fast-forwarded to upstream</td>
          </tr>
          <tr>
            <td>modified</td>
            <td>modified</td>
            <td>3-way merge (conflict markers only on true overlaps)</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
