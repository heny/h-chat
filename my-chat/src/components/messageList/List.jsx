import React from 'react'
export default ({ item, ...rest }) => {
  let el
  let { message, fileName, filePath, fileSize } = item
  if (fileName && fileName.match(/png|jpg|gif|jpeg/)) {
    el = (
      <img className='msg-list__img' src={message || filePath} alt="" />
    )
  } else if (fileName) {
    el = (
      <div>
        <span>
          fileName
          <i class='file-size'>{fileSize}</i>
        </span>
        <a download href={filePath} className='msg-list__down'>下载</a>
        {fileName.includes('.html') && <a href={filePath} className='msg-list__down'>查看</a>}
      </div>
    )
  } else if (message) {
    el = (
      <div>
        <span>{message}</span>
        {
          message.startsWith('http') && <a className='msg-list__down' href={message}>前往</a> 
        }
        <span className='msg-list__copy' data-clipboard-text={message}>复制</span>
      </div>
    )
  }
  return el
}
