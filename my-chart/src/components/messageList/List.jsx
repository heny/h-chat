import React, { useEffect } from 'react'
import Clipboard from 'clipboard'
export default ({ item, startToast, ...rest }) => {
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
