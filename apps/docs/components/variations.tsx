"use client";
import * as React from "react";
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Dialog,
  Kbd,
  Menu,
  Pagination,
  Popover,
  Progress,
  RadioGroup,
  Select,
  Separator,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Table,
  Tabs,
  Tag,
  TextField,
  Textarea,
  Tooltip,
  useToast,
} from "@tessera/react";

interface Variation {
  title: string;
  description?: string;
  code: string;
  render: React.ComponentType;
}

/* ---------------------------------- Button --------------------------------- */

const buttonVariations: Variation[] = [
  {
    title: "Variants",
    description: "Four visual variants cover most intents; danger is reserved for destructive actions.",
    code: `<Button>Solid</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`,
    render: () => (
      <>
        <Button>Solid</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </>
    ),
  },
  {
    title: "Sizes",
    code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
    render: () => (
      <>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </>
    ),
  },
  {
    title: "Loading state",
    description: "loading disables the button and swaps in a spinner while preserving width.",
    code: `const [loading, setLoading] = useState(false);

<Button
  loading={loading}
  onClick={() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }}
>
  {loading ? "Saving..." : "Save changes"}
</Button>`,
    render: function LoadingButton() {
      const [loading, setLoading] = React.useState(false);
      return (
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
        >
          {loading ? "Saving..." : "Save changes"}
        </Button>
      );
    },
  },
];

/* -------------------------------- TextField -------------------------------- */

const textFieldVariations: Variation[] = [
  {
    title: "With description",
    code: `<TextField
  label="Email"
  type="email"
  placeholder="you@example.com"
  description="We never share your email."
/>`,
    render: () => (
      <div style={{ width: 280 }}>
        <TextField
          label="Email"
          type="email"
          placeholder="you@example.com"
          description="We never share your email."
        />
      </div>
    ),
  },
  {
    title: "Validation error",
    description: "Pass error to mark the field invalid; it is announced via role=alert and aria-describedby.",
    code: `const [value, setValue] = useState("");

<TextField
  label="Username"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error={value && value.length < 3 ? "Must be at least 3 characters" : undefined}
/>`,
    render: function ValidationField() {
      const [value, setValue] = React.useState("");
      return (
        <div style={{ width: 280 }}>
          <TextField
            label="Username"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={
              value.length > 0 && value.length < 3 ? "Must be at least 3 characters" : undefined
            }
            placeholder="Type 1-2 chars to see the error"
          />
        </div>
      );
    },
  },
];

/* --------------------------------- Textarea -------------------------------- */

const textareaVariations: Variation[] = [
  {
    title: "Basic",
    code: `<Textarea
  label="Feedback"
  rows={4}
  placeholder="Tell us what you think..."
  description="Markdown is supported."
/>`,
    render: () => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <Textarea
          label="Feedback"
          rows={4}
          placeholder="Tell us what you think..."
          description="Markdown is supported."
        />
      </div>
    ),
  },
  {
    title: "With error",
    code: `<Textarea label="Bio" error="Bio is required." rows={3} />`,
    render: () => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <Textarea label="Bio" error="Bio is required." rows={3} />
      </div>
    ),
  },
];

/* --------------------------------- Checkbox -------------------------------- */

const checkboxVariations: Variation[] = [
  {
    title: "States",
    code: `<Checkbox label="Accept terms and conditions" defaultChecked />
<Checkbox label="Subscribe to newsletter" />
<Checkbox label="Disabled option" disabled />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Checkbox label="Accept terms and conditions" defaultChecked />
        <Checkbox label="Subscribe to newsletter" />
        <Checkbox label="Disabled option" disabled />
      </div>
    ),
  },
  {
    title: "Controlled",
    code: `const [checked, setChecked] = useState(false);

<Checkbox
  label={checked ? "Subscribed" : "Subscribe to updates"}
  checked={checked}
  onCheckedChange={setChecked}
/>`,
    render: function ControlledCheckbox() {
      const [checked, setChecked] = React.useState(false);
      return (
        <Checkbox
          label={checked ? "Subscribed" : "Subscribe to updates"}
          checked={checked}
          onCheckedChange={setChecked}
        />
      );
    },
  },
];

/* ---------------------------------- Switch --------------------------------- */

const switchVariations: Variation[] = [
  {
    title: "States",
    code: `<Switch label="Email notifications" defaultChecked />
<Switch label="Public profile" />
<Switch label="Disabled" disabled />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Switch label="Email notifications" defaultChecked />
        <Switch label="Public profile" />
        <Switch label="Disabled" disabled />
      </div>
    ),
  },
];

/* -------------------------------- RadioGroup ------------------------------- */

const radioGroupVariations: Variation[] = [
  {
    title: "Plan picker",
    description: "Arrow keys move selection; disabled items are skipped.",
    code: `<RadioGroup.Root label="Plan" defaultValue="pro">
  <RadioGroup.Item value="free" label="Free - $0/month" />
  <RadioGroup.Item value="pro" label="Pro - $12/month" />
  <RadioGroup.Item value="team" label="Team - $48/month" />
  <RadioGroup.Item value="enterprise" label="Enterprise (contact us)" disabled />
</RadioGroup.Root>`,
    render: () => (
      <RadioGroup.Root label="Plan" defaultValue="pro">
        <RadioGroup.Item value="free" label="Free - $0/month" />
        <RadioGroup.Item value="pro" label="Pro - $12/month" />
        <RadioGroup.Item value="team" label="Team - $48/month" />
        <RadioGroup.Item value="enterprise" label="Enterprise (contact us)" disabled />
      </RadioGroup.Root>
    ),
  },
];

/* ---------------------------------- Select --------------------------------- */

const selectVariations: Variation[] = [
  {
    title: "Basic",
    description: "Full listbox keyboard support: arrows, Home/End, and typeahead.",
    code: `<Select
  label="Framework"
  placeholder="Pick a framework"
  items={[
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
    { value: "angular", label: "Angular", disabled: true },
  ]}
  onValueChange={setValue}
/>`,
    render: function BasicSelect() {
      const [value, setValue] = React.useState<string | null>(null);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Select
            label="Framework"
            placeholder="Pick a framework"
            items={[
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
              { value: "svelte", label: "Svelte" },
              { value: "solid", label: "Solid" },
              { value: "angular", label: "Angular", disabled: true },
            ]}
            onValueChange={setValue}
          />
          <span className="pill">value: {value ?? "null"}</span>
        </div>
      );
    },
  },
];

/* ---------------------------------- Slider --------------------------------- */

const sliderVariations: Variation[] = [
  {
    title: "Basic",
    code: `<Slider label="Volume" defaultValue={40} formatValue={(v) => \`\${v}%\`} />`,
    render: () => <Slider label="Volume" defaultValue={40} formatValue={(v) => `${v}%`} />,
  },
  {
    title: "Custom range and step",
    code: `<Slider
  label="Price limit"
  min={50}
  max={500}
  step={25}
  defaultValue={200}
  formatValue={(v) => \`$\${v}\`}
/>`,
    render: () => (
      <Slider
        label="Price limit"
        min={50}
        max={500}
        step={25}
        defaultValue={200}
        formatValue={(v) => `$${v}`}
      />
    ),
  },
];

/* ----------------------------------- Tabs ---------------------------------- */

const tabsVariations: Variation[] = [
  {
    title: "Basic",
    description: "Roving focus with arrow keys; selection follows focus automatically.",
    code: `<Tabs.Root defaultValue="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="security">Security</Tabs.Trigger>
    <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">Manage your account.</Tabs.Content>
  <Tabs.Content value="security">2FA and sessions.</Tabs.Content>
  <Tabs.Content value="billing">Invoices and usage.</Tabs.Content>
</Tabs.Root>`,
    render: () => (
      <Tabs.Root defaultValue="account">
        <Tabs.List>
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="security">Security</Tabs.Trigger>
          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="account">Manage your account details and preferences.</Tabs.Content>
        <Tabs.Content value="security">
          Two-factor authentication and active sessions.
        </Tabs.Content>
        <Tabs.Content value="billing">Invoices, payment methods, and usage.</Tabs.Content>
      </Tabs.Root>
    ),
  },
];

/* --------------------------------- Accordion ------------------------------- */

const accordionVariations: Variation[] = [
  {
    title: "Basic",
    code: `<Accordion.Root defaultValue={["one"]}>
  <Accordion.Item value="one">
    <Accordion.Trigger>What is the anatomy contract?</Accordion.Trigger>
    <Accordion.Content>Stable data-part attributes, versioned like an API.</Accordion.Content>
  </Accordion.Item>
  ...
</Accordion.Root>`,
    render: () => (
      <div style={{ width: 420, maxWidth: "100%" }}>
        <Accordion.Root defaultValue={["anatomy"]}>
          <Accordion.Item value="anatomy">
            <Accordion.Trigger>What is the anatomy contract?</Accordion.Trigger>
            <Accordion.Content>
              Every part carries stable data-scope/data-part attributes - a versioned public API
              for your styles and tests.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="runtime">
            <Accordion.Trigger>Is there a CSS runtime?</Accordion.Trigger>
            <Accordion.Content>
              No. All styling is plain CSS in cascade layers; your unlayered CSS always wins.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="eject">
            <Accordion.Trigger>Can I own the code?</Accordion.Trigger>
            <Accordion.Content>
              Yes - tessera add button copies the source into your repo, and tessera update 3-way
              merges upstream improvements into your modified copy.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    ),
  },
];

/* ---------------------------------- Dialog --------------------------------- */

const dialogVariations: Variation[] = [
  {
    title: "Confirmation dialog",
    description: "Focus is trapped, scroll is locked, Escape and the backdrop dismiss.",
    code: `<Dialog.Root>
  <Dialog.Trigger>Delete workspace</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Delete workspace?</Dialog.Title>
    <Dialog.Description>
      This permanently deletes the workspace and all of its data.
    </Dialog.Description>
    <Button variant="danger">Delete</Button>
    <Dialog.Close />
  </Dialog.Content>
</Dialog.Root>`,
    render: () => (
      <Dialog.Root>
        <Dialog.Trigger>Delete workspace</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Delete workspace?</Dialog.Title>
          <Dialog.Description>
            This permanently deletes the workspace and all of its data. This action cannot be
            undone.
          </Dialog.Description>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <Button variant="danger">Delete</Button>
          </div>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>
    ),
  },
];

/* --------------------------------- Popover --------------------------------- */

const popoverVariations: Variation[] = [
  {
    title: "Filter popover",
    code: `<Popover.Root placement="bottom-start">
  <Popover.Trigger>Open filters</Popover.Trigger>
  <Popover.Content>
    <Popover.Title>Filters</Popover.Title>
    <Checkbox label="Only active" defaultChecked />
    <Checkbox label="Include archived" />
    <Popover.Close />
  </Popover.Content>
</Popover.Root>`,
    render: () => (
      <Popover.Root placement="bottom-start">
        <Popover.Trigger>Open filters</Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Filters</Popover.Title>
          <Checkbox label="Only active" defaultChecked />
          <Checkbox label="Include archived" />
          <Popover.Close />
        </Popover.Content>
      </Popover.Root>
    ),
  },
];

/* --------------------------------- Tooltip --------------------------------- */

const tooltipVariations: Variation[] = [
  {
    title: "Hover intent and placement",
    code: `<Tooltip.Root>
  <Tooltip.Trigger>Hover me (600ms intent)</Tooltip.Trigger>
  <Tooltip.Content>Driven by a four-state core machine</Tooltip.Content>
</Tooltip.Root>

<Tooltip.Root openDelay={0} placement="bottom">
  <Tooltip.Trigger>Instant tooltip</Tooltip.Trigger>
  <Tooltip.Content>openDelay={0}</Tooltip.Content>
</Tooltip.Root>`,
    render: () => (
      <>
        <Tooltip.Root>
          <Tooltip.Trigger>Hover me (600ms intent)</Tooltip.Trigger>
          <Tooltip.Content>Driven by a four-state core machine</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root openDelay={0} placement="bottom">
          <Tooltip.Trigger>Instant tooltip</Tooltip.Trigger>
          <Tooltip.Content>openDelay={"{0}"}</Tooltip.Content>
        </Tooltip.Root>
      </>
    ),
  },
];

/* ----------------------------------- Menu ---------------------------------- */

const menuVariations: Variation[] = [
  {
    title: "Action menu",
    description: "Arrow keys move focus, Enter selects, Escape closes and refocuses the trigger.",
    code: `<Menu.Root>
  <Menu.Trigger>Actions</Menu.Trigger>
  <Menu.Content>
    <Menu.Item onSelect={() => rename()}>Rename</Menu.Item>
    <Menu.Item onSelect={() => duplicate()}>Duplicate</Menu.Item>
    <Menu.Separator />
    <Menu.Item danger onSelect={() => remove()}>Delete</Menu.Item>
  </Menu.Content>
</Menu.Root>`,
    render: function ActionMenu() {
      const toast = useToast();
      return (
        <Menu.Root>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Content>
            <Menu.Item onSelect={() => toast({ title: "Renamed" })}>Rename</Menu.Item>
            <Menu.Item onSelect={() => toast({ title: "Duplicated" })}>Duplicate</Menu.Item>
            <Menu.Separator />
            <Menu.Item danger onSelect={() => toast({ title: "Deleted", type: "danger" })}>
              Delete
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
      );
    },
  },
  {
    title: "With group labels",
    code: `<Menu.Root placement="bottom-end">
  <Menu.Trigger>Workspace</Menu.Trigger>
  <Menu.Content>
    <Menu.GroupLabel>Switch to</Menu.GroupLabel>
    <Menu.Item>Acme Corp</Menu.Item>
    <Menu.Item>Personal</Menu.Item>
    <Menu.Separator />
    <Menu.Item>Create workspace...</Menu.Item>
  </Menu.Content>
</Menu.Root>`,
    render: () => (
      <Menu.Root placement="bottom-end">
        <Menu.Trigger>Workspace</Menu.Trigger>
        <Menu.Content>
          <Menu.GroupLabel>Switch to</Menu.GroupLabel>
          <Menu.Item>Acme Corp</Menu.Item>
          <Menu.Item>Personal</Menu.Item>
          <Menu.Separator />
          <Menu.Item>Create workspace...</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    ),
  },
];

/* ----------------------------------- Toast --------------------------------- */

const toastVariations: Variation[] = [
  {
    title: "Types",
    description: "Hovering the viewport pauses every auto-dismiss timer.",
    code: `const toast = useToast();

<Button onClick={() => toast({ title: "Changes saved", type: "success" })}>Success</Button>
<Button onClick={() => toast({ title: "Build started", description: "You'll be notified." })}>Info</Button>
<Button onClick={() => toast({ title: "Deploy failed", type: "danger" })}>Danger</Button>`,
    render: function ToastTypes() {
      const toast = useToast();
      return (
        <>
          <Button onClick={() => toast({ title: "Changes saved", type: "success" })}>
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({ title: "Build started", description: "You'll be notified when it finishes." })
            }
          >
            Info
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              toast({ title: "Deploy failed", description: "Check the logs.", type: "danger" })
            }
          >
            Danger
          </Button>
        </>
      );
    },
  },
];

/* ----------------------------------- Alert --------------------------------- */

const alertVariations: Variation[] = [
  {
    title: "Types",
    code: `<Alert type="info" title="Heads up" description="A new version is available." />
<Alert type="success" title="Deploy complete" description="All checks passed." />
<Alert type="warning" title="Approaching quota" description="You've used 90% of your plan." />
<Alert type="danger" title="Payment failed" description="Update your billing details." />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
        <Alert type="info" title="Heads up" description="A new version is available." />
        <Alert type="success" title="Deploy complete" description="All checks passed." />
        <Alert type="warning" title="Approaching quota" description="You've used 90% of your plan." />
        <Alert type="danger" title="Payment failed" description="Update your billing details." />
      </div>
    ),
  },
];

/* ---------------------------------- Avatar --------------------------------- */

const avatarVariations: Variation[] = [
  {
    title: "Sizes and fallback",
    description: "When src is missing or fails to load, initials derived from name are shown.",
    code: `<Avatar name="Ada Lovelace" size="sm" />
<Avatar name="Grace Hopper" />
<Avatar name="Alan Turing" size="lg" />
<Avatar name="Broken Image" src="/does-not-exist.png" />`,
    render: () => (
      <>
        <Avatar name="Ada Lovelace" size="sm" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Alan Turing" size="lg" />
        <Avatar name="Broken Image" src="/does-not-exist.png" />
      </>
    ),
  },
];

/* ----------------------------------- Badge --------------------------------- */

const badgeVariations: Variation[] = [
  {
    title: "Tones",
    code: `<Badge>Accent</Badge>
<Badge tone="neutral">Neutral</Badge>
<Badge tone="success">Active</Badge>
<Badge tone="warning">Pending</Badge>
<Badge tone="danger">Failed</Badge>`,
    render: () => (
      <>
        <Badge>Accent</Badge>
        <Badge tone="neutral">Neutral</Badge>
        <Badge tone="success">Active</Badge>
        <Badge tone="warning">Pending</Badge>
        <Badge tone="danger">Failed</Badge>
      </>
    ),
  },
  {
    title: "Variants",
    code: `<Badge variant="subtle">Subtle</Badge>
<Badge variant="solid">Solid</Badge>
<Badge variant="outline">Outline</Badge>`,
    render: () => (
      <>
        <Badge variant="subtle">Subtle</Badge>
        <Badge variant="solid">Solid</Badge>
        <Badge variant="outline">Outline</Badge>
      </>
    ),
  },
];

/* ----------------------------------- Card ---------------------------------- */

const cardVariations: Variation[] = [
  {
    title: "Composed card",
    code: `<Card.Root>
  <Card.Header>
    <Card.Title>API usage</Card.Title>
    <Card.Description>Last 30 days</Card.Description>
  </Card.Header>
  <Card.Content>
    <Progress label="Requests" value={64} />
  </Card.Content>
  <Card.Footer>
    <Button size="sm" variant="outline">View report</Button>
  </Card.Footer>
</Card.Root>`,
    render: () => (
      <Card.Root style={{ width: 340, maxWidth: "100%" }}>
        <Card.Header>
          <Card.Title>API usage</Card.Title>
          <Card.Description>Last 30 days</Card.Description>
        </Card.Header>
        <Card.Content>
          <Progress label="Requests" value={64} />
        </Card.Content>
        <Card.Footer>
          <Button size="sm" variant="outline">
            View report
          </Button>
        </Card.Footer>
      </Card.Root>
    ),
  },
  {
    title: "Interactive",
    description: "interactive adds a hover affordance for clickable cards.",
    code: `<Card.Root interactive>
  <Card.Content>Hover me - I lift slightly.</Card.Content>
</Card.Root>`,
    render: () => (
      <Card.Root interactive style={{ width: 280 }}>
        <Card.Content>Hover me - I lift slightly.</Card.Content>
      </Card.Root>
    ),
  },
];

/* --------------------------------- Separator ------------------------------- */

const separatorVariations: Variation[] = [
  {
    title: "Horizontal and vertical",
    code: `<p>Above</p>
<Separator />
<p>Below</p>

<div style={{ display: "flex" }}>
  <span>Docs</span>
  <Separator orientation="vertical" />
  <span>API</span>
</div>`,
    render: () => (
      <div style={{ width: "100%" }}>
        <p style={{ margin: 0 }}>Above</p>
        <Separator />
        <p style={{ margin: 0 }}>Below</p>
        <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>API</span>
          <Separator orientation="vertical" />
          <span>Blog</span>
        </div>
      </div>
    ),
  },
];

/* --------------------------------- Skeleton -------------------------------- */

const skeletonVariations: Variation[] = [
  {
    title: "Loading card",
    description: "Compose variants to mirror the final layout and avoid content shift.",
    code: `<div style={{ display: "flex", gap: 12 }}>
  <Skeleton variant="circle" width={40} height={40} />
  <div style={{ flex: 1 }}>
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" width="90%" />
    <Skeleton height={80} />
  </div>
</div>`,
    render: () => (
      <div style={{ display: "flex", gap: 12, width: 320 }}>
        <Skeleton variant="circle" width={40} height={40} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton height={80} />
        </div>
      </div>
    ),
  },
];

/* ---------------------------------- Spinner -------------------------------- */

const spinnerVariations: Variation[] = [
  {
    title: "Sizes",
    code: `<Spinner size="sm" />
<Spinner />
<Spinner size="lg" label="Loading results" />`,
    render: () => (
      <>
        <Spinner size="sm" />
        <Spinner />
        <Spinner size="lg" label="Loading results" />
      </>
    ),
  },
];

/* --------------------------------- Progress -------------------------------- */

const progressVariations: Variation[] = [
  {
    title: "Determinate",
    code: `<Progress label="Uploading photos" value={64} />`,
    render: function Determinate() {
      const [value, setValue] = React.useState(64);
      return (
        <div style={{ width: 320, display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Progress label="Uploading photos" value={value} />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.max(0, v - 10))}>
              -10
            </Button>
            <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.min(100, v + 10))}>
              +10
            </Button>
          </div>
        </div>
      );
    },
  },
  {
    title: "Indeterminate",
    description: "Omit value when total work is unknown.",
    code: `<Progress label="Processing" />`,
    render: () => (
      <div style={{ width: 320 }}>
        <Progress label="Processing" />
      </div>
    ),
  },
];

/* ------------------------------------ Kbd ---------------------------------- */

const kbdVariations: Variation[] = [
  {
    title: "Shortcuts",
    code: `Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette.`,
    render: () => (
      <p style={{ margin: 0 }}>
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette, or <Kbd>?</Kbd> for help.
      </p>
    ),
  },
];

/* --------------------------------- Breadcrumb ------------------------------ */

const breadcrumbVariations: Variation[] = [
  {
    title: "Basic",
    code: `<Breadcrumb
  items={[
    { label: "Home", href: "#" },
    { label: "Settings", href: "#" },
    { label: "Billing" },
  ]}
/>`,
    render: () => (
      <Breadcrumb
        items={[{ label: "Home", href: "#" }, { label: "Settings", href: "#" }, { label: "Billing" }]}
      />
    ),
  },
  {
    title: "Custom separator",
    code: `<Breadcrumb separator="›" items={...} />`,
    render: () => (
      <Breadcrumb
        separator="›"
        items={[{ label: "Library", href: "#" }, { label: "React", href: "#" }, { label: "Hooks" }]}
      />
    ),
  },
];

/* ------------------------------------ Tag ---------------------------------- */

const tagVariations: Variation[] = [
  {
    title: "Tones",
    code: `<Tag>design</Tag>
<Tag tone="accent">react</Tag>
<Tag tone="danger">deprecated</Tag>`,
    render: () => (
      <>
        <Tag>design</Tag>
        <Tag tone="accent">react</Tag>
        <Tag tone="danger">deprecated</Tag>
      </>
    ),
  },
  {
    title: "Dismissible",
    code: `const [tags, setTags] = useState(["react", "vue", "svelte"]);

{tags.map((tag) => (
  <Tag key={tag} tone="accent" onDismiss={() => setTags(tags.filter((t) => t !== tag))}>
    {tag}
  </Tag>
))}`,
    render: function DismissibleTags() {
      const [tags, setTags] = React.useState(["react", "vue", "svelte", "solid"]);
      return (
        <>
          {tags.map((tag) => (
            <Tag
              key={tag}
              tone="accent"
              onDismiss={() => setTags((prev) => prev.filter((t) => t !== tag))}
            >
              {tag}
            </Tag>
          ))}
          {tags.length === 0 && (
            <Button size="sm" variant="ghost" onClick={() => setTags(["react", "vue", "svelte", "solid"])}>
              Reset
            </Button>
          )}
        </>
      );
    },
  },
];

/* --------------------------------- Pagination ------------------------------ */

const paginationVariations: Variation[] = [
  {
    title: "Basic",
    code: `<Pagination count={10} defaultPage={3} onPageChange={setPage} />`,
    render: function BasicPagination() {
      const [page, setPage] = React.useState(3);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
          <Pagination count={10} page={page} onPageChange={setPage} />
          <span className="pill">page: {page}</span>
        </div>
      );
    },
  },
  {
    title: "Many pages",
    description: "Distant ranges collapse into ellipses; siblings controls the window width.",
    code: `<Pagination count={50} defaultPage={25} siblings={2} />`,
    render: () => <Pagination count={50} defaultPage={25} siblings={2} />,
  },
];

/* ----------------------------------- Table --------------------------------- */

const tableVariations: Variation[] = [
  {
    title: "Striped and hoverable",
    code: `<Table.Root striped hoverable>
  <Table.Header>
    <Table.Row>
      <Table.Head>Service</Table.Head>
      <Table.Head>Region</Table.Head>
      <Table.Head>Status</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>api-server</Table.Cell>
      <Table.Cell>us-east-1</Table.Cell>
      <Table.Cell><Badge tone="success">Healthy</Badge></Table.Cell>
    </Table.Row>
    ...
  </Table.Body>
</Table.Root>`,
    render: () => (
      <Table.Root striped hoverable>
        <Table.Header>
          <Table.Row>
            <Table.Head>Service</Table.Head>
            <Table.Head>Region</Table.Head>
            <Table.Head>Latency</Table.Head>
            <Table.Head>Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>api-server</Table.Cell>
            <Table.Cell>us-east-1</Table.Cell>
            <Table.Cell>23 ms</Table.Cell>
            <Table.Cell>
              <Badge tone="success">Healthy</Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>worker-pool</Table.Cell>
            <Table.Cell>eu-west-2</Table.Cell>
            <Table.Cell>41 ms</Table.Cell>
            <Table.Cell>
              <Badge tone="warning">Degraded</Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>cdn-edge</Table.Cell>
            <Table.Cell>ap-south-1</Table.Cell>
            <Table.Cell>—</Table.Cell>
            <Table.Cell>
              <Badge tone="danger">Down</Badge>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    ),
  },
];

/* --------------------------------------------------------------------------- */

const allVariations: Record<string, Variation[]> = {
  button: buttonVariations,
  "text-field": textFieldVariations,
  textarea: textareaVariations,
  checkbox: checkboxVariations,
  switch: switchVariations,
  "radio-group": radioGroupVariations,
  select: selectVariations,
  slider: sliderVariations,
  tabs: tabsVariations,
  accordion: accordionVariations,
  dialog: dialogVariations,
  popover: popoverVariations,
  tooltip: tooltipVariations,
  menu: menuVariations,
  toast: toastVariations,
  alert: alertVariations,
  avatar: avatarVariations,
  badge: badgeVariations,
  card: cardVariations,
  separator: separatorVariations,
  skeleton: skeletonVariations,
  spinner: spinnerVariations,
  progress: progressVariations,
  kbd: kbdVariations,
  breadcrumb: breadcrumbVariations,
  tag: tagVariations,
  pagination: paginationVariations,
  table: tableVariations,
};

export function Variations({ slug }: { slug: string }) {
  const list = allVariations[slug];
  if (!list) return null;
  return (
    <>
      {list.map((variation) => {
        const Render = variation.render;
        return (
          <section key={variation.title} className="variation">
            <h3>{variation.title}</h3>
            {variation.description && <p>{variation.description}</p>}
            <div className="demo-surface">
              <Render />
            </div>
            <details className="code-details">
              <summary>Show code</summary>
              <pre>
                <code>{variation.code}</code>
              </pre>
            </details>
          </section>
        );
      })}
    </>
  );
}
