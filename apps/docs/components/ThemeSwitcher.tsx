"use client";
import * as React from "react";
import { Switch } from "@tessera/react";

export function ThemeSwitcher() {
  const [light, setLight] = React.useState(false);

  React.useEffect(() => {
    setLight(document.documentElement.dataset.theme === "light");
  }, []);

  function onChange(checked: boolean) {
    setLight(checked);
    const theme = checked ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("tessera-theme", theme);
  }

  return <Switch label="Light" checked={light} onCheckedChange={onChange} />;
}
