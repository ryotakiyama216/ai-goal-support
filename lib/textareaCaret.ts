const MIRROR_PROPERTIES = [
  "direction",
  "boxSizing",
  "width",
  "height",
  "overflowX",
  "overflowY",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderStyle",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "fontSizeAdjust",
  "lineHeight",
  "fontFamily",
  "textAlign",
  "textTransform",
  "textIndent",
  "textDecoration",
  "letterSpacing",
  "wordSpacing",
  "tabSize",
] as const;

export type CaretCoordinates = {
  top: number;
  left: number;
  height: number;
};

export function getTextareaCaretCoordinates(
  textarea: HTMLTextAreaElement,
  position: number
): CaretCoordinates {
  const mirror = document.createElement("div");
  const style = window.getComputedStyle(textarea);

  mirror.setAttribute("aria-hidden", "true");
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordWrap = "break-word";
  mirror.style.overflow = "hidden";

  for (const prop of MIRROR_PROPERTIES) {
    mirror.style[prop] = style[prop];
  }

  const before = textarea.value.slice(0, position);
  const after = textarea.value.slice(position) || ".";

  mirror.textContent = before;
  const marker = document.createElement("span");
  marker.textContent = after;
  mirror.appendChild(marker);

  document.body.appendChild(mirror);

  const top =
    marker.offsetTop -
    textarea.scrollTop +
    Number.parseFloat(style.borderTopWidth || "0") +
    Number.parseFloat(style.paddingTop || "0");
  const left =
    marker.offsetLeft -
    textarea.scrollLeft +
    Number.parseFloat(style.borderLeftWidth || "0") +
    Number.parseFloat(style.paddingLeft || "0");
  const height = marker.offsetHeight;

  document.body.removeChild(mirror);

  return { top, left, height };
}
