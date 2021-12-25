/**
 * @typedef MonadicHandlerOptionsType
 * @property { (...args: any) => any } target Target function to be handled
 * @property { boolean } async Boolean value indicating wether the function is async or not
 */

/**
 * Returns a function that is lifted to not throw errors
 * @param { MonadicHandlerOptionsType } options Options
 * @returns { (...args: any) => [Error, any] | Promise<[Error, any]> } Lifted function
 */
export const monadicHandler = ({ target, async = false }) => {
  if (async) {
    return async (...args) => {
      try {
        return [null, await target(...args)]
      } catch (error) {
        return [error, null]
      }
    }
  }

  return (...args) => {
    try {
      return [null, target(...args)]
    } catch (error) {
      return [error, null]
    }
  }
}
