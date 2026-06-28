import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMachine } from "./machine";
import { createSelectStore } from "./components/select";
import { createToastGroup } from "./components/toast";
import { createTooltipMachine } from "./components/tooltip";

describe("createMachine", () => {
  it("transitions between states and runs actions", () => {
    const log: string[] = [];
    const machine = createMachine({
      id: "test",
      initial: "closed",
      context: { count: 0 },
      states: {
        closed: { on: { OPEN: { target: "open", actions: [() => log.push("opened")] } } },
        open: { on: { CLOSE: { target: "closed" } } },
      },
    });

    expect(machine.getState().value).toBe("closed");
    machine.send("OPEN");
    expect(machine.getState().value).toBe("open");
    expect(log).toEqual(["opened"]);
    machine.send("OPEN"); // No transition defined; stays put.
    expect(machine.getState().value).toBe("open");
  });

  it("respects guards and updates context via action patches", () => {
    const machine = createMachine({
      id: "guarded",
      initial: "idle",
      context: { allowed: false, runs: 0 },
      states: {
        idle: {
          on: {
            GO: {
              target: "done",
              guard: (ctx) => ctx.allowed,
              actions: [(ctx) => ({ runs: ctx.runs + 1 })],
            },
          },
        },
        done: {},
      },
    });

    machine.send("GO");
    expect(machine.getState().value).toBe("idle");
    machine.setContext({ allowed: true });
    machine.send("GO");
    expect(machine.getState()).toMatchObject({ value: "done", context: { runs: 1 } });
  });

  it("stays usable after stop() (React StrictMode reuses the instance)", () => {
    const machine = createMachine({
      id: "strict",
      initial: "closed",
      context: {},
      states: { closed: { on: { OPEN: { target: "open" } } }, open: { on: { CLOSE: { target: "closed" } } } },
    });
    // StrictMode: mount effect, simulated unmount cleanup (stop), remount.
    machine.stop();
    machine.send("OPEN");
    expect(machine.getState().value).toBe("open");
  });

  it("notifies subscribers", () => {
    const machine = createMachine({
      id: "sub",
      initial: "a",
      context: {},
      states: { a: { on: { NEXT: { target: "b" } } }, b: {} },
    });
    const listener = vi.fn();
    machine.subscribe(listener);
    machine.send("NEXT");
    expect(listener).toHaveBeenCalled();
  });
});

describe("tooltip machine (delayed transitions)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("opens after openDelay and cancels when pointer leaves early", () => {
    const machine = createTooltipMachine({ openDelay: 300, closeDelay: 100 });

    machine.send("POINTER_ENTER");
    expect(machine.getState().value).toBe("opening");
    vi.advanceTimersByTime(299);
    expect(machine.getState().value).toBe("opening");
    vi.advanceTimersByTime(1);
    expect(machine.getState().value).toBe("open");

    machine.send("POINTER_LEAVE");
    expect(machine.getState().value).toBe("closing");
    machine.send("POINTER_ENTER"); // Re-enter during closing: no flicker.
    expect(machine.getState().value).toBe("open");

    machine.send("POINTER_LEAVE");
    vi.advanceTimersByTime(100);
    expect(machine.getState().value).toBe("closed");

    // Early leave during opening cancels the pending open.
    machine.send("POINTER_ENTER");
    machine.send("POINTER_LEAVE");
    vi.advanceTimersByTime(1000);
    expect(machine.getState().value).toBe("closed");
  });
});

describe("select store", () => {
  const items = [
    { value: "a", label: "Apple" },
    { value: "b", label: "Banana", disabled: true },
    { value: "c", label: "Cherry" },
  ];

  it("skips disabled items when highlighting", () => {
    const store = createSelectStore({ items });
    store.open();
    expect(store.getState().highlightedIndex).toBe(0);
    store.highlightNext();
    expect(store.getState().highlightedIndex).toBe(2); // skips disabled "b"
    store.highlightNext();
    expect(store.getState().highlightedIndex).toBe(0); // wraps
  });

  it("selects, fires callback, and supports typeahead", () => {
    const onValueChange = vi.fn();
    const store = createSelectStore({ items, onValueChange });
    store.open();
    store.typeahead("c");
    expect(store.getState().highlightedIndex).toBe(2);
    store.selectHighlighted();
    expect(onValueChange).toHaveBeenCalledWith("c");
    expect(store.getState()).toMatchObject({ value: "c", open: false });
  });
});

describe("toast group", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("auto-dismisses, caps visible toasts, and pauses on demand", () => {
    const group = createToastGroup({ duration: 1000, max: 2 });
    group.create({ title: "one" });
    group.create({ title: "two" });
    group.create({ title: "three" });
    expect(group.getState().toasts.map((toast) => toast.title)).toEqual(["two", "three"]);

    group.pauseAll();
    vi.advanceTimersByTime(5000);
    expect(group.getState().toasts).toHaveLength(2);

    group.resumeAll();
    vi.advanceTimersByTime(1000);
    expect(group.getState().toasts).toHaveLength(0);
  });
});
