import React, {useCallback, } from 'react'
import Clipboard from 'clipboard'
import './messageList.scss'
import {clearMessage} from '../../api/message'


export default function (props) {
  let {list, setList} = props

  const clearAll = useCallback(_ => {
    clearMessage()
    setList([])
  }, [setList])
  
  React.useEffect(()=>{
    let clipboard = new Clipboard('.msg-list__copy')
    clipboard.on('success', e => {
      console.log('复制成功')

      // let el = e.trigger.children[0]
      e.trigger.innerText = '复制成功'
      e.trigger.style.color = '#000'
      
      setTimeout(_ => {
        e.trigger.innerText = "复制"
        e.trigger.style.color = '#0080ff'
      }, 1500)
    })

    clipboard.on('error', function(e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
     });

    return function(){
      clipboard.destroy()
    }
  }, [])

  // 点击打开图片
  const openImg = useCallback(src=>{
    const empty = document.createElement('div')
    const imgEl = document.createElement("img")
    imgEl.src = src
    imgEl.style.maxWidth = document.documentElement.clientWidth + 'px'
    empty.appendChild(imgEl)
    empty.className = 'msg-list__shade'
    // 当图片过高时，不能使用flex布局上下居中了
    if(imgEl.height > document.documentElement.clientHeight) {
      empty.style.display = 'block'
    }
    document.body.appendChild(empty)
    empty.addEventListener('click',()=>{empty.remove()})
  }, [])

  return (
    <div className='msg-list'>
      <ul>
        { list.length ?
          list.map((item,index) => (
            <li key={index} className='msg-list__item'>
              { item.includes('data:image')
                ? (
                  <div className='msg-list__img'>
                    <img src={item} alt="" onClick={()=>openImg(item)}/>
                  </div>
                )
                : (
                <>
                  <span>{item}</span>
                  <span className='msg-list__copy' data-clipboard-text={item}>复制</span>
                </>
                )
              }
            </li>
          ))
        : <div className='msg-list__empty'>
            <span>支持拖拽发送</span>
          </div>
      }
      </ul>
      <span className="clears" onClick={clearAll}>X</span>
    </div>
  )
}
