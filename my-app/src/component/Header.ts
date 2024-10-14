import Component from '../utils/common';

export default class Header extends Component {
  template(): string {
    return `
    <header class="py-4 bg-[#fafafa] border-b border-[#e0dfdf]">
      <h1 class="text-xl font-bold text-center">Catstagram</h1>
    </header>`;
  }
  mounted(): void {}
}
