import config from '@/config'
import store from 'store'
import { setInfo, setHash } from 'store/actions'
let baseURL = config.getCurrentServer()
// 不使用axios，使用原声ajax，因为原生支持进度条
function request({
  url,
  method = "post",
  data,
  headers = {},
  onProgress = e => e
}) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = onProgress;
    xhr.open(method, url);
    Object.keys(headers).forEach(key =>
      xhr.setRequestHeader(key, headers[key])
    );
    xhr.send(data);
    xhr.onload = e => {
      resolve({
        data: e.target.response
      });
    };
  });
}

// 创建chunk文件，进行文件拆分
function createFileChunk(file, chunkSize = 10 * 1024 * 1024) {
  const fileChunkList = []
  let cur = 0
  let i = 0
  while (cur < file.size) {
    fileChunkList.push({
      chunk: file.slice(cur, cur + chunkSize),
      hash: file.name + '-' + i,
      index: i,
      percentage: 0
    })
    cur += chunkSize
    i++
  }
  return fileChunkList
}

// 处理进度条
function createProgressHandler(item, file, fileChunkList) {
  return e => {
    item.percentage = parseInt(String((e.loaded / e.total) * 100));
    uploadPercentage(file, fileChunkList)
  }
}

// 计算百分比
function uploadPercentage(file, data) {
  if (!file || !data.length) return 0
  const loaded = data
    .map(item => item.chunk.size * item.percentage)
    .reduce((acc, cur) => acc + cur);
  console.log(`当前的百分比：${parseInt((loaded / file.size).toFixed(2))}%`)
  store.dispatch(setInfo(`正在上传中, 当前进度：${parseInt((loaded / file.size).toFixed(2))}%`))
}

// 合并请求
async function mergeRequest(name, setIsSelectFile, socket) {
  // store.dispatch(setInfo('上传成功, 开始合并文件...'))
  let mergeRef = await request({
    url: `${baseURL}msg/merge`,
    headers: {
      "content-type": "application/json"
    },
    data: JSON.stringify({ filename: name, hash: store.getState().upload.hash })
  })
  if (mergeRef) {
    setIsSelectFile(false)
    store.dispatch(setInfo('合并成功, 正在推送消息中...'))
    // 接收到消息会关
    // store.dispatch(setShowToast(false))
    socket.emit('message', JSON.parse(mergeRef.data))
  }
}

// 生成文件 hash（web-worker）
function calculateHash(fileChunkList) {
  return new Promise(resolve => {
    // 添加 worker 属性
    let worker = new Worker("/hash.js");
    worker.postMessage({ fileChunkList });
    worker.onmessage = e => {
      const { hash } = e.data;
      // let hashPercentage = percentage;
      if (hash) {
        resolve(hash);
      }
    };
  });
}

// 文件秒传
async function verifyUpload(filename) {
  const { data } = await request({
    url: `${baseURL}msg/verify`,
    headers: {
      "Content-Type": "application/json"
    },
    data: JSON.stringify({ filename })
  });
  console.log(data, 'datadata')
  return JSON.parse(data);
}

// 上传切片
async function uploadChunks(file, startToast, setIsSelectFile, socket, fileChunkList) {
  const requestList = fileChunkList
    .map(({ chunk, hash, fileHash }) => {
      const formData = new FormData()
      formData.append('chunk', chunk)
      formData.append('hash', hash)
      formData.append('filename', file.name)
      formData.append('fileHash', fileHash)
      return { formData }
    })
    .map(async ({ formData }, index) => request({
      url: `${baseURL}msg/upload`,
      data: formData,
      onProgress: createProgressHandler(fileChunkList[index], file, fileChunkList)
    })
    )
  startToast('开始上传中')
  await Promise.all(requestList)
  await mergeRequest(file.name, setIsSelectFile, socket)
}

export default async (file, startToast, setIsSelectFile, socket) => {
  let fileChunkList = createFileChunk(file)
  let fileHash = await calculateHash(fileChunkList)
  store.dispatch(setHash(fileHash))
  // 判断是否秒传
  const { shouldIgnore } = await verifyUpload(file.name)
  console.log(shouldIgnore, 'shouldUpload')
  if (!shouldIgnore) {
    setIsSelectFile(true)
    startToast('文件已存在', 'warning', false)
    return
  }
  // 给每个文件添加hash值, 并修改原hash值
  fileChunkList = fileChunkList.map(item => ({
    ...item,
    fileHash,
    hash: `${fileHash}-${item.index}`
  }))
  uploadChunks(file, startToast, setIsSelectFile, socket, fileChunkList)
}
