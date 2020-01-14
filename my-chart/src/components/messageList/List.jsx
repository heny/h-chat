import React, { useEffect } from 'react'
import Clipboard from 'clipboard'
export default ({ item, startToast, ...rest }) => {

  // 点击打开图片
  /*   const openImg = useCallback(async (message, src) => {
      const empty = document.createElement('div')
      const imgEl = document.createElement('img')
      const btn = document.createElement('button')
      btn.innerHTML = '去下载'
      btn.className = 'msg-list__godown'
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        window.location.href = src
      })
  
      imgEl.src = message
      imgEl.style.maxWidth = document.documentElement.clientWidth + 'px'
  
      empty.appendChild(imgEl)
      empty.appendChild(btn)
      empty.className = 'msg-list__shade'
      // 当图片过高时，不能使用flex布局上下居中了
      // 使用div块元素来判断, 图片的高度会判断失误,
      setTimeout(() => {
        if (imgEl.clientHeight >= document.documentElement.clientHeight) {
          empty.style.height = "auto"
          empty.style.position = 'absolute'
        }
      }, 0)
      document.body.appendChild(empty)
      empty.addEventListener('click', () => { empty.remove() })
    }, []) */

  useEffect(() => {
    let clipboard = new Clipboard('.msg-list__copy')
    clipboard.on('success', e => {
      startToast('复制成功', 'success', false)
    })

    clipboard.on('error', function (e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    });

    return function () {
      clipboard.destroy()
    }
  }, [startToast])
  let el
  let { message, fileName, filePath } = item
  if (fileName && fileName.match(/png|jpg|gif|jpeg/)) {
    el = (
      <img className='msg-list__img' src={message} alt="" />
    )
  } else if (fileName) {
    el = (
      <>
        <span dangerouslySetInnerHTML={{ __html: fileName }}></span>
        <a download href={filePath} className='msg-list__down'>下载</a>
        {fileName.includes('.html') && <a href={filePath} className='msg-list__down'>查看</a>}
      </>
    )
  } else if (message) {
    el = (
      <>
        <span>{message}</span>
        {
          message.startsWith('http')
            ? <a className='msg-list__down' href={message}>前往</a>
            : <span className='msg-list__copy' data-clipboard-text={message}>复制</span>
        }
      </>
    )
  }
  return el
}
