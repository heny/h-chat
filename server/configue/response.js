module.exports = {
  success: (content, message = "") => {
    return {
      status: "success",
      success: true,
      content: content,
      message: message
    }
  },
  fail: (message = "", type = "") => {
    return {
      status: "fail",
      fail: true,
      type: type,
      message: message
    }
  }
}
