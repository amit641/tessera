import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { TextField } from "./text-field";
import { Tabs } from "./tabs";
import { Dialog } from "./dialog";
import { Accordion } from "./accordion";

describe("Button", () => {
  it("renders the anatomy contract attributes", () => {
    render(<Button variant="outline">Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("data-scope", "button");
    expect(button).toHaveAttribute("data-part", "root");
    expect(button).toHaveAttribute("data-variant", "outline");
  });

  it("blocks interaction and sets aria-busy while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button).catch(() => {});
    expect(onClick).not.toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Button>Save</Button>);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});

describe("Checkbox", () => {
  it("toggles through the hidden native input", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept terms" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Checkbox label="Accept" />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});

describe("TextField", () => {
  it("wires label, description, and error with aria", () => {
    const { rerender } = render(<TextField label="Email" description="Work email preferred" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAccessibleDescription("Work email preferred");
    expect(input).not.toHaveAttribute("aria-invalid");

    rerender(<TextField label="Email" description="Work email preferred" error="Required" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });
});

describe("Tabs", () => {
  function renderTabs() {
    return render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
          <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">Panel A</Tabs.Content>
        <Tabs.Content value="b">Panel B</Tabs.Content>
      </Tabs.Root>
    );
  }

  it("activates tabs with arrow keys (roving focus)", async () => {
    renderTabs();
    const tabA = screen.getByRole("tab", { name: "Tab A" });
    expect(tabA).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Panel A")).toBeVisible();

    tabA.focus();
    await userEvent.keyboard("{ArrowRight}");
    const tabB = screen.getByRole("tab", { name: "Tab B" });
    expect(tabB).toHaveFocus();
    expect(tabB).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Panel B")).toBeVisible();
  });

  it("has no axe violations", async () => {
    const { container } = renderTabs();
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});

describe("Dialog", () => {
  function renderDialog() {
    return render(
      <Dialog.Root>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Confirm</Dialog.Title>
          <Dialog.Description>Are you sure?</Dialog.Description>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>
    );
  }

  it("opens, wires aria, closes on Escape, and restores focus", async () => {
    renderDialog();
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await userEvent.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Confirm");
    expect(dialog).toHaveAccessibleDescription("Are you sure?");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes via the close button", async () => {
    renderDialog();
    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }));
    await userEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Accordion", () => {
  it("toggles items and enforces single-open by default", async () => {
    render(
      <Accordion.Root>
        <Accordion.Item value="a">
          <Accordion.Trigger>Section A</Accordion.Trigger>
          <Accordion.Content>Content A</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Trigger>Section B</Accordion.Trigger>
          <Accordion.Content>Content B</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );

    const triggerA = screen.getByRole("button", { name: "Section A" });
    await userEvent.click(triggerA);
    expect(triggerA).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Content A")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Section B" }));
    expect(screen.queryByText("Content A")).not.toBeInTheDocument();
    expect(screen.getByText("Content B")).toBeInTheDocument();
  });
});
