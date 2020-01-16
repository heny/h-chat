import React, { useCallback, useEffect, useRef } from 'react'
import { useMappedState } from 'redux-react-hook'
import List from './List'
import './messageList.scss'
import Viewer from 'viewerjs'
import { CSSTransition } from 'react-transition-group'
import { clearMessage, clearFile } from '../../api/message'

export default function (props) {
  const viewer = useRef(null)
  const mapState = useCallback(state => ({ status: state.toast.status }), [])
  const { status } = useMappedState(mapState)
  let { list, setList, showLoading, info, startToast } = props

  useEffect(() => {
    // 挂载图片进行预览
    let mountEl = document.querySelector('.images')
    viewer.current = new Viewer(mountEl)
    return () => {
      viewer.current.destroy()
    }
  }, [list])

  const clearAll = useCallback(_ => {
    clearMessage() // 清空数据库
    clearFile() // 清空远端文件
    setList([]) // 清空list
    startToast('清空成功', 'success', false)
    // localStorage.removeItem('list') // 删除localStorage
  }, [setList, startToast])

  let toastEl = {
    loading: <i className='icon-Loading iconfont my-loading'></i>,
    success: <i style={{ fontSize: '25px' }} className='iconfont icon-success'></i>,
    warning: <i style={{ fontSize: '18px' }} className='iconfont icon-warning'></i>
  }

  return (
    <div className='msg-list'>
      <div className='msg-list__scroll'>
        <ul className='images'>
          {list.length ?
            list.map((item, index) => (
              <li key={index} className='msg-list__item'>
                <List item={item} startToast={startToast} />
              </li>
            ))
            : <div className='msg-list__empty'>
              <span>支持拖拽发送</span>
            </div>
          }
        </ul>
        <span className="clears" onClick={clearAll}>X</span>
        <CSSTransition
          appear={true}
          unmountOnExit
          className='fade'
          timeout={2000}
          in={showLoading}
        >
          <div>
            <div className='toast'>
              {toastEl[status]}
              {info}
            </div>
          </div>
        </CSSTransition>
      </div>
    </div>
  )
}
