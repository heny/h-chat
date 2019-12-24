import React from 'react'

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
      fr.onload = ()=>{
        setImgUrl(fr.result)
      }
    }
  }

  return (
    <div className='send-img'>
      <input onChange={changeHandler} type="file" />
    </div>
  )
})
