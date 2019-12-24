import React, {useCallback, } from 'react'
import Clipboard from 'clipboard'
import './messageList.scss'

export default function (props) {
  let {list, setList} = props

  const clearAll = useCallback(_ => {
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

  return (
    <ul className='msg-list'>
      {list.map((item,index) => (
        <li key={index} className='msg-list__item'>
          { item.includes('data:image')
            ? (
              <div className='msg-list__img'>
                <img src={item} alt=""/>
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
      ))}
      <span className="clears" onClick={clearAll}>X</span>
    </ul>
  )
}
