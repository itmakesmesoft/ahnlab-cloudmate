// setup: 컴포넌트가 마운트되기 전 호출.
// mounted: 컴포넌트가 마운트된 후 호출.
// beforeUpdate: 컴포넌트가 업데이트되기 전 호출.
// afterUpdate: 컴포넌트가 업데이트된 후 호출.
// componentWillUnmount: 컴포넌트가 언마운트 되기 전에 호출.

export default class Component {
  parent: Element | null | undefined;
  props: any;
  state: any = {};
  isMounted: boolean = false;

  constructor(parent?: Element | null, props?: any) {
    this.parent = parent;
    this.props = props;
    this.setup();
    this.update();
  }
  private update() {
    if (!this.isMounted) {
      this.render();
      this.setEvents();
      this.mounted();
      this.isMounted = true;
    } else {
      this.beforeUpdate();
      this.render();
      this.setEvents();
      this.afterUpdate();
    }
  }
  private render() {
    if (this.parent) {
      this.parent.innerHTML = this.template();
    }
  }
  setup() {}

  mounted() {}

  beforeUpdate() {}

  afterUpdate() {}

  Unmount() {}

  template() {
    return ``;
  }

  setEvents() {}

  setState(newState: any) {
    if (JSON.stringify(this.state) !== JSON.stringify(newState)) {
      // 상태가 변경되었을 때만 render 호출
      this.state = { ...this.state, ...newState };
      this.update();
    }
  }
}

export const escapeFromXSS = (propValue?: string) => {
  const escaper = document.createElement("div");
  if (propValue) escaper.textContent = propValue; // propValue에 태그가 포함되는 경우, 이를 문자열로 치환시키기 위함
  return escaper.innerHTML;
};

export const debounce = (callback: any, delay = 300) => {
  let timer: NodeJS.Timeout | null;
  return (...args: any[]) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const throttle = (callback: any, delay = 1000) => {
  let timer: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (!timer) {
      callback(...args);
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    }
  };
};
