import config from '../config'
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
function createFileChunk(file, chunkSize = 10 * 1024 * 1024){
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
function createProgressHandler(item, file, fileChunkList, setInfo){
  return e => {
    item.percentage = parseInt(String((e.loaded / e.total) * 100));
    uploadPercentage(file, fileChunkList, setInfo)
  }
}

// 计算百分比
function uploadPercentage(file, data, setInfo) {
  if(!file || !data.length) return 0
  const loaded = data
        .map(item => item.chunk.size * item.percentage)
        .reduce((acc, cur) => acc + cur);
  setInfo(`正在上传中, 当前进度：${parseInt((loaded / file.size).toFixed(2))}%`)
}

// 合并请求
async function mergeRequest(name, setIsSelectFile, socket) {
  let mergeRef = await request({
    url: `${baseURL}msg/merge`,
    headers: {
      "content-type": "application/json"
    },
    data: JSON.stringify({filename: name})
  })
  if(mergeRef) {
    setIsSelectFile(false)
    socket.emit('message', JSON.parse(mergeRef.data))
  }
}

export default async (file, startToast,setIsSelectFile,socket, setInfo) => {
  let fileChunkList = createFileChunk(file)
  const requestList = fileChunkList
    .map(({chunk, hash}) => {
      const formData = new FormData()
      formData.append('chunk', chunk)
      formData.append('hash', hash)
      formData.append('filename', file.name)
      return {formData}
    })
    .map(async ({formData}, index) =>request({
        url: `${baseURL}msg/upload`,
        data: formData,
        onProgress: createProgressHandler(fileChunkList[index], file, fileChunkList, setInfo)
      })
    )
  startToast('开始上传中')
  await Promise.all(requestList)
  await mergeRequest(file.name, setIsSelectFile, socket)
}
