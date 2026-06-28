import { createAnatomy } from "../anatomy";

/** Anatomy contracts for the extended component set. */

export const alertAnatomy = createAnatomy("alert", ["root", "icon", "title", "description"]);

export const avatarAnatomy = createAnatomy("avatar", ["root", "image", "fallback"]);

export const badgeAnatomy = createAnatomy("badge", ["root"]);

export const cardAnatomy = createAnatomy("card", [
  "root",
  "header",
  "title",
  "description",
  "content",
  "footer",
]);

export const separatorAnatomy = createAnatomy("separator", ["root"]);

export const skeletonAnatomy = createAnatomy("skeleton", ["root"]);

export const spinnerAnatomy = createAnatomy("spinner", ["root"]);

export const progressAnatomy = createAnatomy("progress", [
  "root",
  "label",
  "valueText",
  "track",
  "fill",
]);

export const textareaAnatomy = createAnatomy("textarea", [
  "root",
  "label",
  "input",
  "description",
  "error",
]);

export const kbdAnatomy = createAnatomy("kbd", ["root"]);

export const breadcrumbAnatomy = createAnatomy("breadcrumb", [
  "root",
  "list",
  "item",
  "link",
  "separator",
]);

export const tagAnatomy = createAnatomy("tag", ["root", "label", "close"]);

export const menuAnatomy = createAnatomy("menu", [
  "trigger",
  "positioner",
  "content",
  "item",
  "separator",
  "groupLabel",
]);

export const sliderAnatomy = createAnatomy("slider", [
  "root",
  "label",
  "valueText",
  "control",
]);

export const paginationAnatomy = createAnatomy("pagination", [
  "root",
  "list",
  "item",
  "ellipsis",
  "prev",
  "next",
]);

export const tableAnatomy = createAnatomy("table", [
  "root",
  "table",
  "caption",
  "header",
  "body",
  "row",
  "head",
  "cell",
]);
