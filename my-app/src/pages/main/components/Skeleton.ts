const styles = {
  ul: "list_wrapper grid grid-cols-3 gap-2 md:gap-3 lg:gap-4",
  li: "skeleton-item rounded-md md:rounded-lg lg:rounded-xl w-full h-auto aspect-[1/1] bg-gray-900",
};

const Skeleton = () => {
  const mockList = Array.from({ length: 9 })
    .fill(1)
    .map((_, i) => i);
  return `<ul class="${styles.ul}">${mockList.map(() => `<li class="${styles.li}"></li>`).join("")}</ul>`;
};
export default Skeleton;
