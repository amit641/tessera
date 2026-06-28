"use client";
import * as React from "react";
import { cardAnatomy } from "@tessera/core";

export interface CardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds hover affordance for clickable/linkable cards. */
  interactive?: boolean;
}

function CardRoot({ interactive, children, ...rest }: CardRootProps) {
  return (
    <div {...cardAnatomy.attrs("root")} data-interactive={interactive || undefined} {...rest}>
      {children}
    </div>
  );
}

function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...cardAnatomy.attrs("header")} {...props} />;
}

function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...cardAnatomy.attrs("title")} style={{ margin: 0 }} {...props} />;
}

function CardDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...cardAnatomy.attrs("description")} style={{ margin: 0 }} {...props} />;
}

function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...cardAnatomy.attrs("content")} {...props} />;
}

function CardFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...cardAnatomy.attrs("footer")} {...props} />;
}

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
};
