import debounce from 'lodash.debounce'

/**
  * A debounce handler function works by ensuring that a particular function is only executed after
 * a certain amount of time has passed since it was last invoked.
 * 
 * @function debounceHandler
 * @param {Function} fn - The function to debounce (meaning that it will only be executed after the specified delay).
 * @param {number} delay - The delay in milliseconds.
 * @return {Function} - The debounced function.
 */
export const debounceHandler = (fn, delay) => {
    const debounceFn = debounce(fn, delay)
    return (request, response, next) => {
        debounceFn(request, response, next)
    }
}