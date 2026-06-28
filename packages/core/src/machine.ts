import { createStore, type Store } from "./store";

export interface MachineEvent {
  type: string;
  [key: string]: unknown;
}

export interface MachineState<C extends object> {
  value: string;
  context: C;
}

type Action<C extends object> = (context: C, event: MachineEvent) => Partial<C> | void;

interface Transition<C extends object> {
  target?: string;
  guard?: (context: C, event: MachineEvent) => boolean;
  actions?: Action<C>[];
}

interface StateNode<C extends object> {
  entry?: Action<C>[];
  exit?: Action<C>[];
  /** Delayed transitions: ms -> transition. Timers are cancelled when the state exits. */
  after?: Record<number, Transition<C>>;
  on?: Record<string, Transition<C>>;
}

export interface MachineConfig<C extends object> {
  id: string;
  initial: string;
  context: C;
  states: Record<string, StateNode<C>>;
}

export interface Machine<C extends object> {
  readonly id: string;
  getState(): MachineState<C>;
  send(event: MachineEvent | string): void;
  setContext(partial: Partial<C>): void;
  subscribe(listener: () => void): () => void;
  /**
   * Clears any pending delayed (`after`) transitions. Reversible and
   * idempotent: the machine stays usable, so a later `send` works again.
   * (React StrictMode reuses the instance across simulated unmount/remount.)
   */
  stop(): void;
}

/**
 * Tiny declarative finite-state machine (~100 LOC, zero deps).
 * Supports guards, entry/exit/transition actions, and delayed `after`
 * transitions (used for tooltip open/close delays, toast timers, etc.).
 */
export function createMachine<C extends object>(config: MachineConfig<C>): Machine<C> {
  const store: Store<MachineState<C>> = createStore({
    value: config.initial,
    context: config.context,
  });
  let timers: ReturnType<typeof setTimeout>[] = [];

  function runActions(actions: Action<C>[] | undefined, event: MachineEvent) {
    if (!actions) return;
    for (const action of actions) {
      const patch = action(store.get().context, event);
      if (patch) store.set({ context: { ...store.get().context, ...patch } });
    }
  }

  function clearTimers() {
    for (const t of timers) clearTimeout(t);
    timers = [];
  }

  function scheduleAfter(node: StateNode<C>) {
    if (!node.after) return;
    for (const [delay, transition] of Object.entries(node.after)) {
      const timer = setTimeout(() => {
        takeTransition(transition, { type: `after.${delay}` });
      }, Number(delay));
      timers.push(timer);
    }
  }

  function takeTransition(transition: Transition<C>, event: MachineEvent) {
    const { value, context } = store.get();
    if (transition.guard && !transition.guard(context, event)) return;

    const targetChanged = transition.target !== undefined && transition.target !== value;
    if (targetChanged) {
      clearTimers();
      runActions(config.states[value].exit, event);
    }
    runActions(transition.actions, event);
    if (targetChanged) {
      const next = config.states[transition.target!];
      if (!next) throw new Error(`[${config.id}] unknown state: ${transition.target}`);
      store.set({ value: transition.target! });
      runActions(next.entry, event);
      scheduleAfter(next);
    }
  }

  scheduleAfter(config.states[config.initial]);

  return {
    id: config.id,
    getState: store.get,
    send(eventOrType) {
      const event = typeof eventOrType === "string" ? { type: eventOrType } : eventOrType;
      const transition = config.states[store.get().value].on?.[event.type];
      if (transition) takeTransition(transition, event);
    },
    setContext(partial) {
      store.set({ context: { ...store.get().context, ...partial } });
    },
    subscribe: store.subscribe,
    stop() {
      clearTimers();
    },
  };
}
