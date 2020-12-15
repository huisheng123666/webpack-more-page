function removeEle(selector, animationName, duration = 300) {
  const ele = document.querySelector(selector)
  if (animationName) {
    ele.style.animation = `${animationName} ${duration}ms ease`
  }
  setTimeout(() => {
    ele.parentNode.removeChild(ele)
  }, duration)
}

export default {
  removeEle
}