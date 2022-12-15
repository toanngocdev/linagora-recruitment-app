export const debounce = (callback: () => any, debounceTime = 300): void => {
  let timer;

  clearTimeout(timer);

  timer = setTimeout(() => {
    callback();
  }, debounceTime);
};
