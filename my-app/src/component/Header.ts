import Component from "../utils/common";

class Header extends Component {
  template(): string {
    return `
    <header class="py-4 bg-[#fafafa] border-b border-[#e0dfdf]">
      <h1 class="text-xl font-bold text-center">고양이 리스트</h1>
    </header>`;
  }
  mounted(): void {}
}
export default Header;
