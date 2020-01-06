import React, { useCallback } from 'react'
import List from './List'
import './messageList.scss'
import { clearMessage, clearFile } from '../../api/message'

export default function (props) {
  let { list, setList, showLoading, info, setShowLoading } = props

  const clearAll = useCallback(_ => {
    clearMessage() // 清空数据库
    clearFile() // 清空远端文件
    setList([]) // 清空list
    // localStorage.removeItem('list') // 删除localStorage
  }, [setList])

  return (
    <div className='msg-list'>
      <ul>
        {list.length ?
          list.map((item, index) => (
            <li key={index} className='msg-list__item'>
              <List item={item} />
            </li>
          ))
          : <div className='msg-list__empty'>
            <span>支持拖拽发送</span>
          </div>
        }
      </ul>
      <span className="clears" onClick={clearAll}>X</span>
      {showLoading && (
        <div className='loading' onClick={() => setShowLoading(false)}>{info}</div>
      )}
    </div>
  )
}
