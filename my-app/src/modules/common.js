export const debounce = (callback, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const throttle = (callback, delay = 1000) => {
  let timer;
  return (...args) => {
    if (!timer) {
      callback(...args);
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    }
  };
};

const escapeFromHtml = (propValue) => {
  const escaper = document.createElement("div");
  escaper.textContent = propValue; // propValue에 태그가 포함되는 경우, 이를 문자열로 치환시키기 위함
  return escaper.innerHTML;
};

export const createElement = (tag, props = {}, ...children) => {
  const element = document.createElement(tag);
  const properties = Object.entries({ ...props });

  if (props) {
    properties.forEach(([key, value]) => {
      if (key.slice(0, 2) === "on") {
        // onclick, onmouseover와 같은 DOM 이벤트를 addEventListener에 담기 위함
        const event = key.slice(2).toLowerCase();
        element.addEventListener(event, value);
      } else {
        element.setAttribute(key, escapeFromHtml(value));
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

  return element;
};
