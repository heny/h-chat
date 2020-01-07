import React, { useCallback } from 'react'
import { useMappedState } from 'redux-react-hook'
import List from './List'
import './messageList.scss'
import { clearMessage, clearFile } from '../../api/message'

export default function (props) {
  const mapState = useCallback(state => ({ status: state.toast.status }), [])
  const { status } = useMappedState(mapState)
  let { list, setList, showLoading, info, setShowLoading, startToast } = props

  const clearAll = useCallback(_ => {
    clearMessage() // 清空数据库
    clearFile() // 清空远端文件
    setList([]) // 清空list
    startToast('清空成功...', 'success', false)
    // localStorage.removeItem('list') // 删除localStorage
  }, [setList, startToast])

  return (
    <div className='msg-list'>
      <div className='msg-list__scroll'>
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
        {/* {( */}
        {showLoading && (
          <div className='loading' onClick={() => setShowLoading(false)}>
            {/* {status === 'loading' && <span className='dot'></span>} */}
            {status === 'loading' && <i className='icon-Loading iconfont my-loading'></i>}
            {status === 'success' && <i style={{ fontSize: '25px' }} className='iconfont icon-success'></i>}

            {info}
          </div>
        )}
      </div>
    </div>
  )
}
