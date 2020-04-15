import React, { useCallback, useEffect, useRef } from 'react'
import { useMappedState } from 'redux-react-hook'
import List from './List'
import Clipboard from 'clipboard'
import './messageList.scss'
import Viewer from 'viewerjs'
import { CSSTransition } from 'react-transition-group'
import { clearMessage, clearFile, delItem } from '../../api/message'
import { Modal, Toast, Icon } from 'antd-mobile'

const prompt = Modal.prompt;

export default function (props) {
  const viewer = useRef(null)
  const mapState = useCallback(state => ({ status: state.toast.status }), [])
  const { status } = useMappedState(mapState)
  let { list, setList, showLoading, info, startToast } = props

  // 挂载图片进行预览
  useEffect(() => {
    let mountEl = document.querySelector('.images')
    viewer.current = new Viewer(mountEl)
    return () => {
      viewer.current.destroy()
    }
  }, [])

  // 触发复制功能，不能在子元素上面写，否则会给每个消息都注册
  useEffect(() => {
    let clipboard = new Clipboard('.msg-list__copy')
    clipboard.on('success', function (e) {
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

  // 通过item删除单个
  const deleteItem = useCallback(({id, fileName}, index) => {
    console.log(id, 'itemitemite')
    setList(list => {
      const curList = JSON.parse(JSON.stringify(list))
      curList.splice(index, 1)
      return curList
    })
    delItem({id, fileName})
    startToast('删除成功', 'success', false)
  }, [startToast, setList])

  // 清空所有消息函数
  const clearnMessage = useCallback(() => {
    clearMessage() // 清空数据库
    clearFile() // 清空远端文件
    setList([]) // 清空list
    startToast('清空成功', 'success', false)
    // localStorage.removeItem('list') // 删除localStorage
  }, [setList, startToast])

  // 清空所有消息弹窗
  const clearnPrompt = useCallback(()=>{
    prompt(
      '确定要清空全部消息吗？',
      '您需要输入密码才能清空',
      [
        { text: '取消' },
        { text: '提交', onPress: password => new Promise(
          (resolve, reject) => {
            if(password === '1122'){
              clearnMessage()
              resolve()
            } else {
              Toast.info('密码输入错误, 请重新输入', 1)
              reject()
            }
          }
        ) },
      ],
      'default',
      null,
      ['请输入密码']
    )
  }, [clearnMessage])

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
                <List item={item} />
                <Icon
                  type='cross-circle'
                  color='#ddd'
                  className='msg-list__item__delete'
                  style={{width:16}}
                  onClick={()=>deleteItem(item, index)}
                />
                {/* <Button inline size="small" className='msg-list__item__delete'>删除</Button> */}
              </li>
            ))
            : <div className='msg-list__empty'>
              <span>支持拖拽发送</span>
            </div>
          }
        </ul>
        <span className="clears" onClick={clearnPrompt}>X</span>
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
