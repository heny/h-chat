import React from 'react'
import './header.scss'

export default ({online}) => {
  return (
    <div className="header">
      聊天系统
      <span className='online'>当前在线人数：{online}</span>
    </div>
  )
}