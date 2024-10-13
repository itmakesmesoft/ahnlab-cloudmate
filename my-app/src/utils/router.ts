import Component from "./common";

interface RouteInterface {
  path: string;
  component: () => Component;
}

export default class Router extends Component {
  setup() {
    this.state = {
      routes: [],
    };
  }

  addRoute(route: RouteInterface) {
    this.state.routes.push(route);
  }

  findRoute() {
    if (!window.location.hash) window.location.href = "#/";
    const foundRoute = this.state.routes.find(
      (route: RouteInterface) => route.path === window.location.hash
    );
    if (foundRoute) foundRoute.component();
    else window.location.href = "#/";
  }

  start() {
    window.addEventListener("hashchange", () => this.findRoute());
    this.findRoute();
  }
}
