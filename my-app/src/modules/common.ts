export const createElement = <T extends HTMLElement>(
  tag: string,
  props: { [key: string]: any } | null = {},
  ...children: string[] | Node[] | [string | undefined]
): T => {
  const element = document.createElement(tag);
  const properties = Object.entries({ ...props });

  if (props) {
    properties.forEach(([key, value]) => {
      if (key.slice(0, 2) === "on" && typeof value === "function") {
        // onclick, onmouseover와 같은 DOM 이벤트를 addEventListener에 담기 위함
        const event = key.slice(2).toLowerCase();
        element.addEventListener(event, value);
      } else {
        element.setAttribute(key, escapeFromXSS(value));
      }
    });
  }

  children.forEach((child) => {
    if (!child) return;
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element as T;
};

const escapeFromXSS = (propValue?: string) => {
  const escaper = document.createElement("div");
  if (propValue) escaper.textContent = propValue; // propValue에 태그가 포함되는 경우, 이를 문자열로 치환시키기 위함
  return escaper.innerHTML;
};
