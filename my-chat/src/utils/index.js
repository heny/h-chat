/**
 * 优雅处理Promise
 * @param {Promise} promise 
 */
export const to = promise => promise.then(
  data => [null, data],
  err => [err, null]
)
