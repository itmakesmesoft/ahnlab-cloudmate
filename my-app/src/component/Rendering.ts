import Component from "../utils/common";

export default class Rendering extends Component {
  template() {
    const mockList = Array.from({ length: 9 })
      .fill(1)
      .map((_, i) => i);
    return `
    <div>
      <ul class="list_wrapper grid grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        ${mockList.map(() => `<li class="skeleton-item rounded-md md:rounded-lg lg:rounded-xl w-full h-auto aspect-[1/1] bg-gray-900"></li>`).join("")}
      </ul>
    </div>
    `;
  }
}
