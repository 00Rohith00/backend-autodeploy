import debounce from 'lodash.debounce'

/**
 *
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