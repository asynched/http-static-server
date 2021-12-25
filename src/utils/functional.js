export const lift = (fn, ...args) => {
  return () => fn(...args)
}
