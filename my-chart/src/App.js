import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import SendOprtions from './components/oprationBtn/oprationBtn'
import MessageList from './components/messageList/messageList'
import SendImage from './components/sendImage/sendImage'
import './App.scss'
import { getMessageList, addMessage, uploadFile } from './api/message'
export default ({ socket }) => {
  const [msg, setMsg] = useState('')
  const [list, setList] = useState([])
  const [isSelectFile, setIsSelectFile] = useState(true) // 是否可以选择文件
  const [isSendAble, setIsSendAble] = useState(false) // 是否可以发送
  const [isUploadServer] = useState(true) // 是否保存到数据库
  const [key, setKey] = useState('enter')
  const fileIptRef = createRef(null) // 获取子组件方法
  const inputEl = useRef(null) // 绑定输入框el
  const sendImgEl = useRef(null) // 获取发送img的元素
  const [showLoading, setShowLoading] = useState(false) // 是否显示loading
  const [info, setInfo] = useState('loading...') // 设置显示消息

  // 发送消息函数
  const sendMessage = useCallback((message, size) => {
    socket.emit('message', { message })
    // 判断是否需要保存数据库, 转换的base64超过100k将无法存入数据库
    if (isUploadServer && (!size || size < 1024 * 100)) {
      console.log(message, 'message')
      addMessage({ message })
    }
  }, [isUploadServer, socket])

  // 请求数据
  const fetchList = React.useCallback(async _ => {
    // 判断缓存是否有, 即使有也需要存文件
    setShowLoading(true)
    // if (localStorage['list']) {
    //   setShowLoading(false)
    //   setList(JSON.parse(localStorage['list']))
    // }
    // 请求接口, 重新存缓存
    let res = await getMessageList()
    // 将请求到的数据放进list里面
    if (res) {
      if (res.length) {
        setShowLoading(false)
      } else {
        setTimeout(() => {
          setShowLoading(false)
        }, 1500)
      }
      setList(res)
      // localStorage['list'] = JSON.stringify(res)
    }
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
    if (file.size > 1024 * 1024) {
      setShowLoading(true)
      setInfo('上传成功,正在推送消息...')
      setTimeout(() => {
        setInfo('文件过大, 请耐心等待...')
      }, 2000)
    }
    if (res) {
      setIsSelectFile(false)
      socket.emit('message', res)
    }
  }, [socket])

  // 发送图片
  const imgSendHandler = useCallback(_ => {
    const { file, inputFileEl, setFile, setImgUrl } = fileIptRef.current
    // 如果文件超过1m, 则提示
    if (file.size > 1024 * 1024) {
      setShowLoading(true) // 设置showLoading
      setInfo('正在上传中, 请等待...')
    }
    inputFileEl.value = '' // 清空文件选择框
    setFile(null) // 清空文件
    setIsSelectFile(false) // 设置是否可以选择图片
    setIsSendAble(false) // 设置是否可以发送图片的
    setImgUrl('') // 清空图片信息

    // 处理图片发送
    if (!file) return
    // 处理文件上传
    upload(file)

    // 修改按键
    // let el = sendImgEl.current
    // el.innerHTML = '发送成功,请等待'
    // el.style.color = 'red'
    // setTimeout(() => {
    //   el.innerHTML = '发送文件'
    //   el.style = ''
    // }, 1500)
  }, [fileIptRef, upload])

  // 拖拽发送图片
  const dragUpload = useCallback(() => {
    // 触发ondrog事件
    document.ondragover = e => e.preventDefault()
    document.ondrop = e => e.preventDefault()
    document.querySelector('.msg-list').ondrop = e => {
      let { files: [file] } = e.dataTransfer
      file && upload(file)
    }
  }, [upload])


  useEffect(() => {
    dragUpload()
    fetchList()
    // 创建接收事件
    socket.on('jieshou', message => {
      setInfo('接收成功')
      setShowLoading(false)
      setList(state => {
        let state2 = JSON.parse(JSON.stringify(state))
        state2.unshift(message)
        setIsSelectFile(true)
        // localStorage['list'] = JSON.stringify(state2)
        return state2
      })
      // 发送消息缓存一份list
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
    let { files: [file] } = e.clipboardData
    file && upload(file)
  }, [upload])


  return (
    <div className='App'>
      <MessageList
        list={list}
        setList={setList}
        showLoading={showLoading}
        setShowLoading={setShowLoading}
        info={info} />
      <div className='ipt-demo'>
        <SendOprtions setKey={setKey} />
        <SendImage
          ref={fileIptRef}
          setIsSendAble={setIsSendAble}
          isSelectFile={isSelectFile} />
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
      <button className='send' onClick={imgSendHandler} disabled={!isSendAble} ref={sendImgEl} >发送文件</button>
    </div>
  )
}
