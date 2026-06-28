"use client";
import * as React from "react";
import { tableAnatomy } from "@tessera/core";

export interface TableRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Zebra-stripes the body rows. */
  striped?: boolean;
  /** Highlights body rows on hover. */
  hoverable?: boolean;
}

function TableRoot({ striped, hoverable, children, ...rest }: TableRootProps) {
  return (
    <div
      {...tableAnatomy.attrs("root")}
      data-striped={striped || undefined}
      data-hoverable={hoverable || undefined}
      {...rest}
    >
      <table {...tableAnatomy.attrs("table")}>{children}</table>
    </div>
  );
}

function TableCaption(props: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption {...tableAnatomy.attrs("caption")} {...props} />;
}

function TableHeader(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...tableAnatomy.attrs("header")} {...props} />;
}

function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...tableAnatomy.attrs("body")} {...props} />;
}

function TableRow(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...tableAnatomy.attrs("row")} {...props} />;
}

function TableHead(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...tableAnatomy.attrs("head")} scope="col" {...props} />;
}

function TableCell(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...tableAnatomy.attrs("cell")} {...props} />;
}

export const Table = {
  Root: TableRoot,
  Caption: TableCaption,
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
};
