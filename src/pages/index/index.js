import './index.styl'

console.log(456)

if (process.env.NODE_ENV === 'development') {
  import('./index.html')
}

