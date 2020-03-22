import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import { useMappedState, useDispatch } from 'redux-react-hook'
import SendOprtions from './components/oprationBtn/oprationBtn'
import MessageList from './components/messageList/messageList'
import SendImage from './components/sendImage/sendImage'
import Header from './components/header/header'
import './App.scss'
import { getMessageList, addMessage } from './api/message'
import {
  setShowToast as setshowToast,
  setInfo as setinfo,
  setStatus as setstatus
} from './store/actions'
import uploadFiles from './utils/upload'
import { to } from './utils'

export default ({ socket }) => {
  const [msg, setMsg] = useState('')
  const [list, setList] = useState([])
  const [isUploadServer] = useState(true) // 是否保存到数据库
  const [key, setKey] = useState('enter')
  const [showOther, setShowOther] = useState(false) // 显示 更多按钮
  const [isSelectFile, setIsSelectFile] = useState(true) // 是否可以选择文件
  const [online, setOnline] = useState(0)
  const fileIptRef = createRef(null) // 获取子组件方法
  const inputEl = useRef(null) // 绑定输入框el
  const timerId = useRef(null)

  const mapState = useCallback(state => ({
    info: state.toast.info,
    showLoading: state.toast.showLoading,
    isNoticeOnline: state.oprationBtn.isNoticeOnline
  }), [])
  const { showLoading, info, isNoticeOnline } = useMappedState(mapState)
  const dispatch = useDispatch()
  const setShowToast = useCallback((flag) => {
    setshowToast(flag)(dispatch)
  }, [dispatch])
  const setInfo = useCallback(message => {
    setinfo(message)(dispatch)
  }, [dispatch])
  const setStatus = useCallback(status => {
    setstatus(status)(dispatch)
  }, [dispatch])

  const startToast = useCallback((info, status = 'loading', isPermanent = true, time = 1500) => {
    setShowToast(true)
    setInfo(info)
    setStatus(status)
    if (!isPermanent) {
      setTimeout(() => {
        setShowToast(false)
      }, time)
    }
  }, [setInfo, setStatus, setShowToast])

  // 发送消息函数
  const sendMessage = useCallback((message, size) => {
    socket.emit('message', { message })
    // 判断是否需要保存数据库, 转换的base64超过100k将无法存入数据库
    if (isUploadServer && (!size || size < 1024 * 100)) {
      console.log(message, 'message')
      addMessage({ message, id:Math.random().toString().substr(3,6) })
    }
  }, [isUploadServer, socket])

  // enter发送消息
  const send = useCallback(async _ => {
    if (!msg) return
    sendMessage(msg)
    setMsg('')
    inputEl.current.value = ''
  }, [msg, sendMessage])

  // 处理文件上传
  const upload = useCallback(async file => {
    uploadFiles(file, startToast, setIsSelectFile, socket, setInfo)
  }, [socket, startToast, setIsSelectFile, setInfo])


  // 给url加缓存
  // const catchURL = useCallback(() => {
  //   window.location.href = location.href
  // }, [])
  
  // 设置当前人数
  const getCurOnline = useCallback(() => {
    socket.emit('/user/list', len => {
      setOnline(len)
    })
  }, [socket])

  // 拖拽发送图片
  useEffect(() => {
    // 触发ondrog事件
    document.ondragover = e => e.preventDefault()

    document.ondrop = e => e.preventDefault()
    document.querySelector('.msg-list').ondrop = e => {
      let { files: [file] } = e.dataTransfer
      file && upload(file)
    }
  }, [upload])

  useEffect(() => {
    // 请求数据
    (async function(){
      startToast('Loading...', 'loading')
      let [err, res] = await to(getMessageList())
      if(err) return startToast('请求出错', 'warning', false)
      setTimeout(() => {
        setShowToast(false)
        // 将请求到的数据放进list里面
        setList(res)
        // 如果有数据就直接消失显示框, 如果没有数据则显示1.5s再消失
      }, res.length ? 0 : 1500)
    })()
  }, [setShowToast, startToast])

  useEffect(() => {
    getCurOnline()
    // 创建接收事件
    socket.on('jieshou', message => {
      // 判断是否是定时器在执行
      timerId.current && clearTimeout(timerId.current)
      setShowToast(false)
      setList(state => {
        let state2 = JSON.parse(JSON.stringify(state))
        state2.unshift(message)
        setIsSelectFile(true)
        return state2
      })
    })

    socket.on('/access', () => {
      // console.log(isNoticeOnline, 'isNoticeOnline')
      getCurOnline()
      startToast('有人上线了', 'success', false)
      // isNoticeOnline && startToast('有人上线了', 'success', false)
    })

    socket.on('/leave', () => {
      // console.log(isNoticeOnline, 'isNoticeOnline')
      getCurOnline()
      startToast('有人离开了', 'success', false)
      // isNoticeOnline && startToast('有人离开了', 'success', false)
    })
  }, [setIsSelectFile, setShowToast, socket, startToast, getCurOnline, isNoticeOnline]) 

  // ctrl+enter事件
  const handleEnter = useCallback(e => {
    if (e.keyCode === 13) {
      send()
      inputEl.current.value = ''
    }
  }, [send])

  // alt+s 发送消息
  const handleEnterAlt = useCallback(e => {
    if(e.keyCode === 83) {
      send()
      inputEl.current.value = ''
    }
  }, [send])

  // 判断发送事件
  const handlerSend = useCallback(e => {
    // alt+s 事件
    if(e.altKey){
      inputEl.current.addEventListener('keydown', handleEnterAlt)
      inputEl.current.addEventListener('keyup', e => {
        inputEl.current.removeEventListener('keydown', handleEnterAlt)
      })
    }
    if (key === 'enter') {
      if (e.keyCode === 13) {
        // 阻止默认的回车按钮
        e.preventDefault()
        send()
        inputEl.current.value = ''
      }
    } else {
      if (e.keyCode === 17) {
        inputEl.current.addEventListener('keydown', handleEnter)
        // 抬起清除事件
        inputEl.current.addEventListener('keyup', e => {
          if (e.keyCode === 17) {
            inputEl.current.removeEventListener('keydown', handleEnter)
          }
        })
      }
    }
  }, [handleEnter, handleEnterAlt, key, send])

  // 粘贴发送消息
  const pasteHandler = useCallback(e => {
    e.persist()
    let { files: [file] } = e.clipboardData
    file && upload(file)
  }, [upload])

  return (
    <div className='App'>
      <Header online={online} />
      <MessageList {...{ list, setList, showLoading, setShowToast, setStatus, info, startToast }} />
      <div className='footer'>
        <div className="input-group">
          <textarea
            className='msg-ipt'
            onChange={e => { setMsg(e.target.value) }}
            value={msg}
            onKeyDown={e => handlerSend(e)}
            onPaste={pasteHandler}
            placeholder='可在此粘贴图片发送'
            ref={inputEl}
            type='text'
          />
          <div className="btn-group">
            <button className='btn-group__item send'
              onClick={send}
              disabled={!msg}
            >发送</button>
            <button onClick={() => setShowOther(true)} className='btn-group__item other'>
              其他
            </button>
          </div>
        </div>
        <SendImage ref={fileIptRef}
          {...{ setShowToast, startToast, upload, isSelectFile, setIsSelectFile }}
        />
        {showOther && (
          <div className="shadow-box" onClick={() => setShowOther(false)}>
            <div className='other-options' onClick={e => e.stopPropagation()}>
              <div className="other-options__title">其他操作</div>
              <ul>
                <li>
                  <SendOprtions setKey={setKey} myKey={key} />
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
