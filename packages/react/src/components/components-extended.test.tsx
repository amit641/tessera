import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Alert } from "./alert";
import { Avatar } from "./avatar";
import { Breadcrumb } from "./breadcrumb";
import { Menu } from "./menu";
import { Pagination } from "./pagination";
import { Progress } from "./progress";
import { Tag } from "./tag";
import { Textarea } from "./textarea";

describe("Alert", () => {
  it("uses role=status for info and role=alert for danger", () => {
    const { rerender } = render(<Alert type="info" title="FYI" />);
    expect(screen.getByRole("status")).toHaveAttribute("data-type", "info");
    rerender(<Alert type="danger" title="Boom" />);
    expect(screen.getByRole("alert")).toHaveAttribute("data-type", "danger");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Alert type="success" title="Saved" description="All good." />);
    expect((await axe(container)).violations).toEqual([]);
  });
});

describe("Avatar", () => {
  it("renders initials fallback when no src is given", () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveTextContent("AL");
  });
});

describe("Breadcrumb", () => {
  it("marks the last item as the current page", () => {
    render(
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Settings", href: "/s" }, { label: "Billing" }]}
      />
    );
    const current = screen.getByText("Billing");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });
});

describe("Menu", () => {
  function TestMenu({ onSelect }: { onSelect: (label: string) => void }) {
    return (
      <Menu.Root>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Content>
          <Menu.Item onSelect={() => onSelect("rename")}>Rename</Menu.Item>
          <Menu.Item danger onSelect={() => onSelect("delete")}>
            Delete
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );
  }

  it("opens on click, focuses the first item, and selects with click", async () => {
    const onSelect = vi.fn();
    render(<TestMenu onSelect={onSelect} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");

    await userEvent.click(trigger);
    const items = await screen.findAllByRole("menuitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveFocus();

    await userEvent.click(items[1]);
    expect(onSelect).toHaveBeenCalledWith("delete");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<TestMenu onSelect={() => {}} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    await userEvent.click(trigger);
    await screen.findByRole("menu");

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe("Pagination", () => {
  it("renders ellipses, marks the current page, and pages with prev/next", async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={20} defaultPage={10} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "Page 10" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getAllByText("…")).toHaveLength(2);

    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(11);
  });

  it("disables prev on the first page", () => {
    render(<Pagination count={5} defaultPage={1} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });
});

describe("Progress", () => {
  it("exposes progressbar semantics for determinate values", () => {
    render(<Progress label="Upload" value={40} />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("omits aria-valuenow while indeterminate", () => {
    render(<Progress label="Working" />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });
});

describe("Tag", () => {
  it("calls onDismiss from the labelled remove button", async () => {
    const onDismiss = vi.fn();
    render(<Tag onDismiss={onDismiss}>react</Tag>);
    await userEvent.click(screen.getByRole("button", { name: "Remove react" }));
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe("Textarea", () => {
  it("wires label, description, and error to the control", () => {
    render(<Textarea label="Bio" description="Optional." error="Too long." />);
    const textarea = screen.getByRole("textbox", { name: "Bio" });
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAccessibleDescription("Optional. Too long.");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Textarea label="Notes" />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
