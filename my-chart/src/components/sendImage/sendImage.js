import React from 'react'
import './sendImage.scss'

export default React.forwardRef((props, ref) => {
  const [imgUrl, setImgUrl] = React.useState('')

  React.useImperativeHandle(ref,state =>({
    imgUrl
  }), [imgUrl])

  const changeHandler = e =>{
    const {files} = e.target
    if(files[0] && files[0].type.includes('image')){
      let fr = new FileReader()
      fr.readAsDataURL(files[0])
      fr.onprogress = e => {
        if(!e.lengthComputable) return
        let percent = Math.round((e.loaded / e.total) * 100)
        console.log(`${files[0].name},progress is ${percent}%`)
      }
      fr.onload = ()=>{
        setImgUrl(fr.result)
      }
    }
  }

  return (
    <div className='send-img'>
      <input onChange={changeHandler} type="file" />
      <img className='send-img__preview' src={imgUrl} style={{
        border: imgUrl && '1px solid #e0dada'
      }} alt='' />
    </div>
  )
})
