// setup: 컴포넌트가 마운트되기 전 호출.
// mounted: 컴포넌트가 마운트된 후 호출.
// beforeUpdate: 컴포넌트가 업데이트되기 전 호출.
// afterUpdate: 컴포넌트가 업데이트된 후 호출.
// componentWillUnmount: 컴포넌트가 언마운트 되기 전에 호출.

// 컴포넌트 클래스
export default class Component<P = object, S = object> {
  parent: Element | null | undefined;
  props: P;
  state: S;
  isMounted: boolean = false;

  constructor(parent?: Element | null, props?: unknown) {
    this.parent = parent;
    this.props = props as P;
    this.state = {} as S;
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

  unMounted() {}

  template() {
    return ``;
  }

  setEvents() {}

  setState(newState: unknown) {
    if (JSON.stringify(this.state) !== JSON.stringify(newState)) {
      // 상태가 변경되었을 때만 render 호출
      this.state = { ...this.state, ...(newState || {}) };
      this.update();
    }
  }
}

// 크로스 사이트 스크립팅 공격 방지용(모든 사용자 인풋을 감쌀 것)
export const escapeFromXSS = (propValue?: string) => {
  const escaper = document.createElement('div');
  if (propValue) escaper.textContent = propValue; // propValue에 태그가 포함되는 경우, 이를 문자열로 치환시키기 위함
  return escaper.innerHTML;
};

export const debounce = <T extends unknown[]>(
  // 디바운스(delay 시간 이후에 한 번만 callback 실행)
  callback: (...args: T) => void,
  delay = 1000
) => {
  let timer: NodeJS.Timeout | null;
  return (...args: T) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
// 쓰로틀링(callback 실행 후 delay 시간동안 같은 요청 무시)
let timer: NodeJS.Timeout | null;
export const throttle = (
  callback: (...args: unknown[]) => void,
  delay = 1000
) => {
  if (timer) return;
  callback();
  timer = setTimeout(() => {
    timer = null;
  }, delay);
};
