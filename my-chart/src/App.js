import React,{useCallback,useEffect,useRef,useState} from 'react'
import './App.scss'
// import {getMessageList, addMessage, clearMessage} from './api/message'
export default ({socket}) => {
  const [msg, setMsg] = useState('')
  const [list, setList] = useState([])
  const [key, setKey] = useState('enter')
  const inputEl = useRef(null)

  const send = useCallback(_ => {
    socket.emit('message', msg)
    inputEl.current.value = ''
  }, [msg, socket])

  // const fetchList = React.useCallback(_ => {
  //   getMessageList().then(res => {
  //     let arr = res.data.map(item =>item.message)
  //     setList(arr)
  //   })
  // }, [])

  useEffect(() => {
    // fetchList()
    socket.on('jieshou', message => {
      setList(state => {
        let state2 = JSON.parse(JSON.stringify(state))
        state2.unshift(message)
        return state2
      })
      // addMessage({message}).then(res => {
      //   fetchList()
      // })
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
    <div>
      <MessageList list={list} setList={setList} />
      <div className='ipt-demo'>
        <SendOprtions setKey={setKey} />
        <textarea type="text" id='msg-ipt' ref={inputEl} onChange={e => {setMsg(e.target.value)}} onKeyDown={e => handlerSend(e)} />
      </div>
      <button onClick={send} className='send'>发送</button>
    </div>
  )
}


// 消息发送组件
function SendOprtions (props) {
  let {setKey} = props
  return (
    <div className='send-options'>
      <span className='ipt-demo__span'>发送消息按键</span>
      <input type="radio" name="send-options" onChange={() => setKey('enter')} className='send-options__item' defaultChecked id="enter-radio"/>
      <label htmlFor="enter-radio">enter</label>
      <input type="radio" name="send-options" onChange={() => setKey('ctrl-enter')} className='send-options__item' id="ctrl_enter-radio"/>
      <label htmlFor="ctrl_enter-radio" >ctrl+enter</label>
    </div>
  )
}


// 消息列表处理
function MessageList (props) {
  let {list, setList} = props

  const clearAll = useCallback(_ => {
    setList([])
    // clearMessage().then(res => {
    //   fetchList()
    // })
  }, [setList])

  // 复制功能
  const copys = useCallback((cont,el) => {
    const textArea = document.createElement('textarea')
    textArea.value = cont
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')    //开启复制;
    document.body.removeChild(textArea)
    // 复制成功处理
    el.innerText = '复制成功'
    el.style.color = '#000'
    setTimeout(_ => {
      el.innerText = "复制"
      el.style.color = '#0080ff'
    }, 1500)
  }, [])

  return (
    <ul className='msg-list'>
      {list.map((item,index) => (
        <li key={index}>{item} <span className='copy' onClick={e => copys(item,e.target)}>复制</span></li>
      ))}
      <span className="clears" onClick={clearAll}>X</span>
    </ul>
  )
}
