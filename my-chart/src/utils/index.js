
/**
 * 节流函数
 * @param {Function} fn 
 * @param {Number} delay
 * @param {Boolean} flush 是否立即调用
 */
export const throttle = (fn, delay=500, flush = false) => {
  let flag = true;   // 设定一个开关
  return () => {
      if(!flag) return;  // 判断是否有等待延时函数,如果开关为false则return不执行;
      flush && fn()
      flag = false;  // 将开头为false;
      setTimeout(()=>{
          !flush && fn()
          console.log('节流中...')
          flag = true;  // 执行完定时器 开关为true;
      },delay)
  }
}

/**
 * 优雅处理Promise
 * @param {Promise} promise 
 */
export const to = promise => promise.then(
  data => [null, data],
  err => [err, null]
)
