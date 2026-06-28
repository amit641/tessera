"use client";
import * as React from "react";
import { avatarAnatomy } from "@tessera/core";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Falls back to initials when missing or failed to load. */
  src?: string;
  /** Person/entity name; used for alt text and fallback initials. */
  name: string;
  size?: "sm" | "md" | "lg";
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, size = "md", ...rest },
  ref
) {
  const [failed, setFailed] = React.useState(false);
  const showImage = src && !failed;

  return (
    <span {...avatarAnatomy.attrs("root")} data-size={size} ref={ref} {...rest}>
      {showImage ? (
        <img
          {...avatarAnatomy.attrs("image")}
          src={src}
          alt={name}
          onError={() => setFailed(true)}
        />
      ) : (
        <span {...avatarAnatomy.attrs("fallback")} role="img" aria-label={name}>
          {initials(name)}
        </span>
      )}
    </span>
  );
});
