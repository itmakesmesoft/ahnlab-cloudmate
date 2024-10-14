import Component from './common';

interface RouteInterface {
  path: string;
  component: () => Component;
}
interface StateInterface {
  routes: RouteInterface[];
}
// 페이지 라우팅용
export default class Router extends Component<object, StateInterface> {
  setup() {
    this.state = {
      routes: [],
    };
  }

  // 라우트를 추가하는 메서드
  addRoute(route: RouteInterface) {
    this.state.routes.push(route);
  }

  // url을 통해 라우트를 찾는 메서드
  findRoute() {
    if (!window.location.hash) window.location.href = '#/';
    const foundRoute = this.state.routes.find(
      (route: RouteInterface) => route.path === window.location.hash
    );
    if (foundRoute) {
      foundRoute.component();
    } else window.location.href = '#/';
  }

  start() {
    window.addEventListener('hashchange', () => this.findRoute());
    this.findRoute();
  }
}
