import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import SendOprtions from './components/oprationBtn/oprationBtn'
import MessageList from './components/messageList/messageList'
import SendImage from './components/sendImage/sendImage'
import './App.scss'
import { getMessageList, addMessage, uploadFile } from './api/message'
export default ({ socket }) => {
  const [msg, setMsg] = useState('')
  const [list, setList] = useState([])
  const [isUploadServer] = useState(true) // 是否保存到数据库
  const [key, setKey] = useState('enter')
  const fileIptRef = createRef(null) // 获取子组件方法
  const inputEl = useRef(null) // 绑定输入框el
  const sendImgEl = useRef(null) // 获取发送img的元素

  // 发送消息函数
  const sendMessage = useCallback((message, size) => {
    socket.emit('message', message)
    // 判断是否需要保存数据库, 转换的base64超过100k将无法存入数据库
    if (isUploadServer && (!size || size < 1024 * 100)) {
      console.log(message, 'message')
      addMessage({ message })
    }
  }, [isUploadServer, socket])

  // 请求数据
  const fetchList = React.useCallback(async _ => {
    let res = await getMessageList()
    // 将请求到的数据放进list里面
    res && setList(res)
  }, [])

  // enter发送消息
  const send = useCallback(async _ => {
    if (!msg) return
    sendMessage(msg)
    setMsg('')
    inputEl.current.value = ''
  }, [msg, sendMessage])

  // 处理文件上传
  const upload = useCallback(async file => {
    let formData = new FormData()
    formData.append('file', file)
    let res = await uploadFile(formData)
    if (res) {
      fetchList()
      console.log(res, '3333')
    }
  }, [fetchList])

  // 发送图片
  const imgSendHandler = useCallback(_ => {
    const { file } = fileIptRef.current
    // 处理图片发送
    if (!file) return

    // if (file.type.includes('image')) {
    //   sendMessage(imgUrl)
    // }
    // 处理文件上传
    upload(file)

    // 修改按键
    let el = sendImgEl.current
    el.innerHTML = '发送成功,请等待'
    el.style.color = 'red'
    setTimeout(() => {
      el.innerHTML = '发送IMG'
      el.style.color = '#000'
    }, 1500)
  }, [fileIptRef, upload])

  // 公共方法传入file对象，进行发送消息
  const byFileSendMessage = useCallback(file => {
    console.log('file对象', file)
    upload(file)
    // if (file.type.includes('image')) {
    //   let fr = new FileReader();
    //   fr.readAsDataURL(file)
    //   fr.onload = e => {
    //     sendMessage(fr.result, file.size)
    //   }
    // }
  }, [upload])

  // 拖拽发送图片
  const dragUpload = useCallback(() => {
    // 触发ondrog事件
    document.ondragover = e => e.preventDefault()
    document.ondrop = e => e.preventDefault()
    document.querySelector('.msg-list').ondrop = e => {
      let { files: [file] } = e.dataTransfer
      file && byFileSendMessage(file)
    }
  }, [byFileSendMessage])


  useEffect(() => {
    dragUpload()
    fetchList()
    // 创建接收事件
    socket.on('jieshou', message => {
      console.log(message, '3333')
      setList(state => {
        let state2 = JSON.parse(JSON.stringify(state))
        state2.unshift({ message })
        return state2
      })
    })
  }, [socket, dragUpload, fetchList])


  const handleEnter = useCallback(e => {
    if (e.keyCode === 13) {
      send()
      inputEl.current.value = ''
    }
  }, [send])

  // 判断发送事件
  const handlerSend = useCallback(e => {
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
  }, [handleEnter, key, send])



  // 粘贴发送消息
  const pasteHandler = useCallback(e => {
    e.persist()
    let { files } = e.clipboardData
    files[0] && byFileSendMessage(files[0])
  }, [byFileSendMessage])


  return (
    <div className='App'>
      <MessageList list={list} setList={setList} />
      <div className='ipt-demo'>
        <SendOprtions setKey={setKey} />
        <SendImage ref={fileIptRef} />
        <textarea
          onPaste={pasteHandler}
          type='text'
          id='msg-ipt'
          placeholder='可在此粘贴图片发送'
          ref={inputEl}
          onChange={e => { setMsg(e.target.value) }}
          onKeyDown={e => handlerSend(e)}
        />
      </div>
      <button onClick={send} className='send'>发送</button>
      <button className='send' onClick={imgSendHandler} ref={sendImgEl} >发送文件</button>
    </div>
  )
}
