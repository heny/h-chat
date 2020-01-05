import React, { useEffect, useCallback } from 'react'
import Clipboard from 'clipboard'
export default ({ item, ...rest }) => {
  // 点击打开图片
  const openImg = useCallback(src => {
    const empty = document.createElement('div')
    const imgEl = document.createElement("img")
    const btn = document.createElement('button')
    btn.innerHTML = '去下载'
    btn.className = 'msg-list__godown'
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      window.location.href = src
    })

    imgEl.src = src
    imgEl.style.maxWidth = document.documentElement.clientWidth + 'px'

    empty.appendChild(imgEl)
    empty.appendChild(btn)
    empty.className = 'msg-list__shade'
    // 当图片过高时，不能使用flex布局上下居中了
    if (imgEl.height > document.documentElement.clientHeight) {
      empty.style.display = 'block'
    }
    document.body.appendChild(empty)
    empty.addEventListener('click', () => { empty.remove() })
  }, [])

  useEffect(() => {
    let clipboard = new Clipboard('.msg-list__copy')
    clipboard.on('success', e => {
      console.log('复制成功')

      // let el = e.trigger.children[0]
      e.trigger.innerText = '复制成功'
      e.trigger.style.color = '#000'

      setTimeout(_ => {
        e.trigger.innerText = "复制"
        e.trigger.style.color = '#0080ff'
      }, 1500)
    })

    clipboard.on('error', function (e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    });

    return function () {
      clipboard.destroy()
    }
  }, [])
  let el
  let { message, fileName, filePath } = item
  if (fileName && (
    fileName.includes('jpg')
    || fileName.includes('png')
    || fileName.includes('jpeg')
    || fileName.includes('gif')
  )) {
    el = (
      <div className='msg-list__img'>
        <img src={filePath} alt="" onClick={() => openImg(filePath)} />
      </div>
    )
  } else if (fileName) {
    el = (
      <>
        <span dangerouslySetInnerHTML={{ __html: fileName }}></span>
        <a download href={filePath} className='msg-list__down'>下载</a>
      </>
    )
  } else if (item.message) {
    el = (
      <>
        <span>{message}</span>
        <span className='msg-list__copy' data-clipboard-text={message}>复制</span>
      </>
    )
  }
  return el
}
