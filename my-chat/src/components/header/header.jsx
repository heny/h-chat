import React from 'react'
import './header.scss'

export default ({online}) => {
  return (
    <div className="header">
      消息转发工具
      <span className='online'>当前在线人数：{online}</span>
    </div>
  )
}