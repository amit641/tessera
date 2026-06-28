import { notFound } from "next/navigation";
import { Variations } from "../../../components/variations";
import { categoryLabels, componentSlugs, readManifest } from "../../../lib/manifests";

export function generateStaticParams() {
  return componentSlugs.map((slug) => ({ slug }));
}

export default function ComponentPage({ params }: { params: { slug: string } }) {
  if (!componentSlugs.includes(params.slug)) notFound();
  const manifest = readManifest(params.slug);

  return (
    <>
      <h1>
        {manifest.displayName} <span className="pill">v{manifest.version}</span>{" "}
        <span className="pill">{categoryLabels[manifest.category] ?? manifest.category}</span>
      </h1>
      <p>{manifest.description}</p>
      <pre>
        <code>{manifest.import}</code>
      </pre>

      <h2>Examples</h2>
      <Variations slug={params.slug} />

      <h2>Anatomy</h2>
      <p>
        These <code>data-part</code> attributes are a versioned public API - style and test
        against them; they will not change in a minor release.
      </p>
      <table className="props-table">
        <thead>
          <tr>
            <th>Part</th>
            <th>Element</th>
            <th>Stable selector</th>
          </tr>
        </thead>
        <tbody>
          {manifest.anatomy.map((part) => (
            <tr key={part.part}>
              <td>
                <code>{part.part}</code>
                {part.note ? <span className="pill" style={{ marginLeft: 8 }}>{part.note}</span> : null}
              </td>
              <td>
                <code>{part.element}</code>
              </td>
              <td>
                <code>{`[data-scope="${manifest.name}"][data-part="${part.part}"]`}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Props</h2>
      <table className="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {manifest.props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code>{prop.name}</code>
                {prop.required ? " *" : ""}
              </td>
              <td>
                <code>{prop.type}</code>
              </td>
              <td>{prop.default ? <code>{prop.default}</code> : "—"}</td>
              <td>{prop.description ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Accessibility</h2>
      <p>
        Roles: {manifest.a11y.roles.map((role) => (
          <code key={role} style={{ marginRight: 8 }}>
            {role}
          </code>
        ))}
      </p>
      {manifest.a11y.keyboard.length > 0 && (
        <table className="props-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {manifest.a11y.keyboard.map((entry) => (
              <tr key={entry.key}>
                <td>
                  <code>{entry.key}</code>
                </td>
                <td>{entry.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {manifest.a11y.notes.length > 0 && (
        <ul>
          {manifest.a11y.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}

      <h2>Styling</h2>
      <p>
        Override styles by targeting the stable selectors below from any unlayered CSS - it always
        beats the library&apos;s <code>@layer tessera</code> styles, no <code>!important</code>{" "}
        needed.
      </p>
      <pre>
        <code>
          {manifest.styling.selectors
            .map((selector) => `${selector} {\n  /* your overrides */\n}`)
            .join("\n\n")}
        </code>
      </pre>
      {manifest.styling.componentTokens && manifest.styling.componentTokens.length > 0 && (
        <p>
          Component tokens:{" "}
          {manifest.styling.componentTokens.map((token) => (
            <code key={token} style={{ marginRight: 8 }}>
              {token}
            </code>
          ))}
        </p>
      )}
      {manifest.styling.stateAttributes && manifest.styling.stateAttributes.length > 0 && (
        <p>
          State attributes:{" "}
          {manifest.styling.stateAttributes.map((attr) => (
            <code key={attr} style={{ marginRight: 8 }}>
              {attr}
            </code>
          ))}
        </p>
      )}
    </>
  );
}
