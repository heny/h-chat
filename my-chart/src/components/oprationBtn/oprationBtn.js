import React from 'react'
import './oprationBtn.scss'

export default function (props) {
  let {setKey} = props
  return (
    <div className='send-options'>
      <span className='send-options__span'>发送消息按键</span>
      <input type="radio" hidden name="send-options" onChange={() => setKey('enter')} className='send-options__item' defaultChecked id="enter-radio"/>
      <label htmlFor="enter-radio">
        <span>enter</span>
      </label>
      

      <input type="radio" hidden name="send-options" onChange={() => setKey('ctrl-enter')} className='send-options__item' id="ctrl_enter-radio"/>
      <label htmlFor="ctrl_enter-radio" >
        <span>ctrl+enter</span>
      </label>
      
    </div>
  )
}
