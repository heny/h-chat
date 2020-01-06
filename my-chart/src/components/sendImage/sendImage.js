import React, { useState, useRef } from 'react'
import './sendImage.scss'

export default React.forwardRef(({ setIsSendAble, isSelectFile }, ref) => {
  const [imgUrl, setImgUrl] = useState('')
  const [file, setFile] = useState(null)
  const inputFileEl = useRef(null)

  React.useImperativeHandle(ref, state => ({
    file, inputFileEl: inputFileEl.current, setFile, setImgUrl
  }), [file])

  // 选择文件上传
  const changeHandler = e => {
    const { files: [file] } = e.target
    setIsSendAble(false)
    setImgUrl('') // 在选择文件时, 如果点击取消, 则清空
    setFile(null)

    if (!file) return // 如果没有file则不往下执行
    setFile(file)
    // 如果是图片, 则将图片转换为base64进行预览
    if (file.type.includes('image')) {
      let fr = new FileReader()
      fr.readAsDataURL(file)
      // 上传进度
      // fr.onprogress = e => {
      //   if (!e.lengthComputable) return
      //   let percent = Math.round((e.loaded / e.total) * 100)
      //   console.log(`${file.name},progress is ${percent}%`)
      // }
      fr.onload = () => {
        setImgUrl(fr.result)
        setIsSendAble(true)
      }
    }
  }

  return (
    <div className='send-img'>
      <input onChange={changeHandler} disabled={!isSelectFile} ref={inputFileEl} type="file" />
      <img className='send-img__preview' src={imgUrl} style={{
        border: imgUrl ? '1px solid #e0dada' : 'none'
      }} alt='' />
    </div>
  )
})
