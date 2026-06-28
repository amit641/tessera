import * as React from "react";

const iconProps: React.SVGProps<SVGSVGElement> = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "1em",
  height: "1em",
  "aria-hidden": true,
};

export const CheckIcon = () => (
  <svg {...iconProps}>
    <polyline points="3 8.5 6.5 12 13 4.5" />
  </svg>
);

export const ChevronDownIcon = () => (
  <svg {...iconProps}>
    <polyline points="4 6 8 10 12 6" />
  </svg>
);

export const CloseIcon = () => (
  <svg {...iconProps}>
    <line x1="4" y1="4" x2="12" y2="12" />
    <line x1="12" y1="4" x2="4" y2="12" />
  </svg>
);
