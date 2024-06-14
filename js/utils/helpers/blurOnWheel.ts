// 主要用途為避免當input的type為number時，意外在input上滾動滑鼠滾輪導致input的值改變
const blurOnWheel = (e: React.WheelEvent<HTMLInputElement>) => {
  e.currentTarget.blur();
};

export { blurOnWheel };
