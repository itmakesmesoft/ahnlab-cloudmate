import "./index.css";
import Main from "./main";
import Router from "./utils/router";
import Component from "./utils/common";
import Header from "./component/Header";

class Page extends Component {
  template() {
    return `
      <h1>페이지2</h1>
      `;
  }
}

class App extends Component {
  setup() {
    this.state = {
      components: {
        SecretComponent: () =>
          new Page(document.querySelector("[data-key='app']")),
        MainComponent: () =>
          new Main(document.querySelector("[data-key='app']")),
      },
    };
  }
  template(): string {
    return `
        <header data-key="header"></header>
        <div data-key="app"></div>
      `;
  }
  mounted(): void {
    new Header(document.querySelector("[data-key='header']"));

    const router = new Router();
    const { MainComponent, SecretComponent } = this.state.components;

    router.addRoute({ path: "#/", component: MainComponent });
    router.addRoute({ path: "#/secret", component: SecretComponent });
    router.start();
  }
}
new App(document.querySelector("#app"));
