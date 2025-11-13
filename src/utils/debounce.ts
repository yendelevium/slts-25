import { debounce } from "ts-debounce";

// Forgive the use of any, but I can't be bothered to type this properly now
function debouncedUpdate(func: any) {
  // 300ms debounce
  return debounce(func, 300);
}

export default debouncedUpdate;

// JS version
/*
function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}
*/
