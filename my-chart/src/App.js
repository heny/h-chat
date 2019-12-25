import React,{useCallback,useEffect,useRef,useState} from 'react'
import SendOprtions from './components/oprationBtn/oprationBtn'
import MessageList from './components/messageList/messageList'
import SendImage from './components/sendImage/sendImage'
import './App.scss'
// import {getMessageList, addMessage, clearMessage} from './api/message'
export default ({socket}) => {
  const [msg, setMsg] = useState('')
  const [list, setList] = useState([])
  const [key, setKey] = useState('enter')
  const fileIptRef = React.createRef(null) // 获取子组件方法
  const inputEl = useRef(null) // 绑定输入框el
  const sendImgEl = useRef(null) // 获取发送img的元素

  // 发送消息
  const send = useCallback(_ => {
    if(!msg) return
    socket.emit('message', msg)
    inputEl.current.value = ''
    setMsg('')
  }, [msg, socket])

  // 发送图片
  const imgSend = useCallback(_ => {
    const { imgUrl } = fileIptRef.current
    if(!imgUrl.includes('data:image')) return
    let el = sendImgEl.current
    el.innerHTML = '发送成功,请等待'
    el.style.color = 'red'
    setTimeout(()=>{
      el.innerHTML = '发送IMG'
      el.style.color = '#000'
    },1500)
    socket.emit('message', imgUrl)
  }, [fileIptRef, socket])

  // const fetchList = React.useCallback(_ => {
  //   getMessageList().then(res => {
  //     let arr = res.data.map(item =>item.message)
  //     setList(arr)
  //   })
  // }, [])

  // 传入file对象，进行发送消息
  const byFileSendMessage = useCallback(file => {
    let fr = new FileReader();
    fr.readAsDataURL(file)
    fr.onload = e => {
      if(!fr.result.includes('data:image')) return
      socket.emit('message', fr.result)
    }
  }, [socket])

  // 拖拽发送图片
  const dragUpload = useCallback(()=>{
    // 触发ondrog事件
    document.ondragover = e => e.preventDefault()
    document.ondrop = e => e.preventDefault()
    document.querySelector('.msg-list').ondrop = e => {
      let {files} = e.dataTransfer
      files[0] && byFileSendMessage(files[0])
    }
  }, [byFileSendMessage])


  useEffect(() => {
    dragUpload()
    // 创建接收事件
    socket.on('jieshou', message => {
      setList(state => {
        let state2 = JSON.parse(JSON.stringify(state))
        state2.unshift(message)
        return state2
      })
    })
  }, [socket, dragUpload])


  const handleEnter = useCallback(e => {
      if(e.keyCode === 13) {
        send()
        inputEl.current.value = ''
      }
  }, [send])


  // 粘贴发送消息
  const pasteHandler = useCallback(e =>{
    e.persist()
    let {files} = e.clipboardData
    files[0] && byFileSendMessage(files[0])
  }, [byFileSendMessage])


  // 判断发送事件
  const handlerSend = useCallback(e => {
    if(key === 'enter'){
      if(e.keyCode === 13) {
        // 阻止默认的回车按钮
        e.preventDefault()
        send()
        inputEl.current.value = ''
      }
    } else {
      if(e.keyCode === 17) {
        inputEl.current.addEventListener('keydown', handleEnter)
        // 抬起清除事件
        inputEl.current.addEventListener('keyup', e => {
          if(e.keyCode === 17) {
            inputEl.current.removeEventListener('keydown', handleEnter)
          }
        })
      }
    }
  }, [handleEnter, key, send])


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
          onChange={e => {setMsg(e.target.value)}}
          onKeyDown={e => handlerSend(e)}
        />
      </div>
      <button onClick={send} className='send'>发送</button>
      <button className='send' onClick={imgSend} ref={sendImgEl} >发送Img</button>
    </div>
  )
}
