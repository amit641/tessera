import * as React from "react";

/** Controlled/uncontrolled state with a single setter. */
export function useControllableState<T>(options: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (next: T) => void] {
  const { value, defaultValue, onChange } = options;
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const onChangeRef = useLatestRef(onChange);

  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled, onChangeRef]
  );
  return [current, set];
}

/** Always-current ref for callbacks captured by long-lived machines/stores. */
export function useLatestRef<T>(value: T): React.MutableRefObject<T> {
  const ref = React.useRef(value);
  React.useInsertionEffect(() => {
    ref.current = value;
  });
  return ref;
}

interface Subscribable<S> {
  subscribe(listener: () => void): () => void;
  getState(): S;
}

/** Subscribes a React component to a Tessera core store or machine. */
export function useExternalState<S>(source: Subscribable<S>): S {
  return React.useSyncExternalStore(source.subscribe, source.getState, source.getState);
}

export function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

/** Context factory that throws a descriptive error when used outside its provider. */
export function createStrictContext<T>(name: string) {
  const Context = React.createContext<T | null>(null);

  function useStrictContext(): T {
    const value = React.useContext(Context);
    if (value === null) {
      throw new Error(`Tessera: ${name} parts must be rendered inside <${name}.Root>.`);
    }
    return value;
  }
  return [Context.Provider, useStrictContext] as const;
}
