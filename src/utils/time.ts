//封装函数获取时间
export const getTime = () => {
  let message = ''
  let hour = new Date().getHours()
  if (hour < 6) {
    message = '早上'
  } else if (hour < 12) {
    message = '上午'
  } else if (hour < 18) {
    message = '下午'
  } else {
    message = '晚上'
  }
  return message
}