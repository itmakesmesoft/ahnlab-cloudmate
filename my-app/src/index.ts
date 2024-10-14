import './index.css';
import Main from './pages/main';
import Page from './pages/dev';
import Router from './utils/router';
import Component from './utils/common';
import Header from './component/Header';

interface StateInterface {
  pages: {
    [key: string]: () => Component;
  };
}

// 프로젝트의 루트 컴포넌트
class App extends Component<object, StateInterface> {
  setup() {
    this.state = {
      pages: {
        TempPage: () => new Page(document.querySelector("[data-key='app']")),
        MainPage: () => new Main(document.querySelector("[data-key='app']")),
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
    const { MainPage, TempPage } = this.state.pages;

    router.addRoute({ path: '#/', component: MainPage });
    router.addRoute({ path: '#/dev', component: TempPage });
    router.start();
  }
}
new App(document.querySelector('#app'));
