import { createAnatomy } from "../anatomy";

/** Anatomy contracts for components whose state lives in the framework adapter. */

export const buttonAnatomy = createAnatomy("button", ["root", "spinner", "label"]);

export const textFieldAnatomy = createAnatomy("text-field", [
  "root",
  "label",
  "input",
  "description",
  "error",
]);

export const checkboxAnatomy = createAnatomy("checkbox", [
  "root",
  "control",
  "indicator",
  "label",
]);

export const switchAnatomy = createAnatomy("switch", ["root", "control", "thumb", "label"]);

export const radioGroupAnatomy = createAnatomy("radio-group", [
  "root",
  "label",
  "item",
  "control",
  "indicator",
  "itemLabel",
]);

export const tabsAnatomy = createAnatomy("tabs", ["root", "list", "trigger", "content"]);

export const accordionAnatomy = createAnatomy("accordion", [
  "root",
  "item",
  "header",
  "trigger",
  "indicator",
  "content",
]);
