import React, { useState, useRef, useCallback, useEffect } from 'react'
import './sendImage.scss'
import Viewer from 'viewerjs'
import compressionImg from './compress'

export default React.forwardRef(({ setShowLoading, setIsSelectFile, isSelectFile, startToast, upload }, ref) => {
  const [imgUrl, setImgUrl] = useState('')
  const [file, setFile] = useState(null)
  const [isSendAble, setIsSendAble] = useState(false) // 是否可以发送
  const viewer = useRef(null)
  const inputFileEl = useRef(null)

  React.useImperativeHandle(ref, state => ({
    setIsSelectFile
  }), [setIsSelectFile])

  useEffect(() => {
    viewer.current = new Viewer(document.querySelector('.send-img__preview'), {
      navbar: false // 一张图片不需要显示导航栏
    })
    return () => {
      // 组件卸载关闭
      viewer.current.destroy()
    }
  }, [])

  // 设置当前的文件
  const setCurFile = useCallback(file => {
    let fr = new FileReader()
    setFile(file)
    fr.readAsDataURL(file)
    fr.onload = () => {
      setShowLoading(false)
      setImgUrl(fr.result)
      setIsSendAble(true)
      setIsSelectFile(true)
    }
  }, [setFile, setIsSendAble, setShowLoading, setIsSelectFile])

  // 发送图片
  const imgSendHandler = useCallback(_ => {
    // 如果文件超过1m, 则提示
    if (file.size > 1024 * 1024) {
      // setShowLoading(true) // 设置showLoading
      startToast('正在上传中, 请等待...')
    }
    inputFileEl.current.value = '' // 清空文件选择框
    setFile(null) // 清空文件
    setIsSelectFile(false) // 设置是否可以选择图片
    setIsSendAble(false) // 设置是否可以发送图片的
    setImgUrl('') // 清空图片信息

    // 处理图片发送
    if (!file) return
    // 处理文件上传
    upload(file)

  }, [inputFileEl, upload, startToast, setFile, setIsSelectFile, setIsSendAble, setImgUrl, file])

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
        setIsSelectFile(false)
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

      <button className='send'
        disabled={!isSendAble}
        onClick={imgSendHandler}
      >发送文件</button>
    </div>
  )
})
