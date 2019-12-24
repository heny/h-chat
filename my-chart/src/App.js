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
  const fileIptRef = React.createRef(null)
  const inputEl = useRef(null)

  const send = useCallback(_ => {
    if(!msg) return
    socket.emit('message', msg)
    inputEl.current.value = ''
    setMsg('')
  }, [msg, socket])

  const imgSend = useCallback(_ => {
    const { imgUrl } = fileIptRef.current
    if(!imgUrl.includes('data:image')) return
    socket.emit('message', imgUrl)
  }, [fileIptRef, socket])

  // const fetchList = React.useCallback(_ => {
  //   getMessageList().then(res => {
  //     let arr = res.data.map(item =>item.message)
  //     setList(arr)
  //   })
  // }, [])

  useEffect(() => {
    socket.on('jieshou', message => {
      setList(state => {
        let state2 = JSON.parse(JSON.stringify(state))
        state2.unshift(message)
        return state2
      })
    })
  }, [socket])


  const handleEnter = React.useCallback(e => {
      if(e.keyCode === 13) {
        send()
        inputEl.current.value = ''
      }
  }, [send])

  const handlerSend = React.useCallback((e) => {
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
        <textarea type="text" id='msg-ipt' ref={inputEl} onChange={e => {setMsg(e.target.value)}} onKeyDown={e => handlerSend(e)} />
      </div>
      <button onClick={send} className='send'>发送</button>
      <button className='send' onClick={imgSend}>发送Img</button>
    </div>
  )
}
