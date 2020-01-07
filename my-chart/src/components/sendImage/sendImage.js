import React, { useState, useRef, useCallback } from 'react'
import './sendImage.scss'
import compressionImg from './compress'

export default React.forwardRef(({ setShowLoading, setIsSendAble, isSelectFile, startToast }, ref) => {
  const [imgUrl, setImgUrl] = useState('')
  const [file, setFile] = useState(null)
  const inputFileEl = useRef(null)

  React.useImperativeHandle(ref, state => ({
    file, inputFileEl: inputFileEl.current, setFile, setImgUrl
  }), [file])

  // 设置当前的文件
  const setCurFile = useCallback(file => {
    let fr = new FileReader()
    setFile(file)
    fr.readAsDataURL(file)
    fr.onload = () => {
      setShowLoading(false)
      setImgUrl(fr.result)
      setIsSendAble(true)
    }
  }, [setFile, setIsSendAble, setShowLoading])

  // 选择文件上传
  const changeHandler = e => {
    const { files: [file] } = e.target
    setIsSendAble(false)
    setImgUrl('') // 在选择文件时, 如果点击取消, 则清空
    setFile(null)

    if (!file) return // 如果没有file则不往下执行
    // 如果是图片, 则将图片转换为base64进行预览
    if (file.type.includes('image')) {
      // 判断图片是否过大, 太大进行压缩
      if (file.size > 1024 * 1024) {
        setShowLoading(true)
        startToast('图片过大, 正在转换中...')
        compressionImg(file, newFile => setCurFile(newFile))
      } else {
        setCurFile(file)
      }
    } else {
      setFile(file)
      setIsSendAble(true)
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
