import { reference, semantic } from "@tessera/tokens";

const isColor = (path: string) => path.startsWith("color.");
const toVar = (path: string) => `--ts-${path.replace(/\./g, "-")}`;

export default function TokensPage() {
  const referenceColors = Object.entries(reference).filter(([path]) => isColor(path));
  const referenceOther = Object.entries(reference).filter(([path]) => !isColor(path));
  const semanticEntries = Object.entries(semantic);

  return (
    <>
      <h1>Token explorer</h1>
      <p>
        Tokens are W3C design-token JSON compiled into two CSS tiers:{" "}
        <strong>reference</strong> (raw values on <code>:root</code>) and{" "}
        <strong>semantic</strong> (per-theme aliases that flip with{" "}
        <code>data-theme</code>). Toggle the theme switcher in the header - the semantic
        swatches below re-resolve live because they render from CSS variables.
      </p>

      <h2>Semantic tier ({semanticEntries.length})</h2>
      <p>
        Components consume only this tier. Each swatch shows its dark/light alias targets.
      </p>
      <div className="swatch-grid">
        {semanticEntries.map(([path, value]) => (
          <div className="swatch" key={path}>
            <div className="chip" style={{ background: `var(${toVar(path)})` }} />
            <div className="meta">
              <span className="path">{path}</span>
              <span className="value">dark: {value.dark}</span>
              <span className="value">light: {value.light}</span>
            </div>
          </div>
        ))}
      </div>

      <h2>Reference tier - colors ({referenceColors.length})</h2>
      <div className="swatch-grid">
        {referenceColors.map(([path, value]) => (
          <div className="swatch" key={path}>
            <div className="chip" style={{ background: value }} />
            <div className="meta">
              <span className="path">{path}</span>
              <span className="value">{value}</span>
            </div>
          </div>
        ))}
      </div>

      <h2>Reference tier - dimensions, motion, type ({referenceOther.length})</h2>
      <table className="props-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>CSS variable</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {referenceOther.map(([path, value]) => (
            <tr key={path}>
              <td>
                <code>{path}</code>
              </td>
              <td>
                <code>{toVar(path)}</code>
              </td>
              <td>
                <code>{value}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
