module.exports = {
    outputDir: 'dist',   //build输出目录
    assetsDir: 'assets', //静态资源目录（js, css, img）
    lintOnSave: false, //是否开启eslint
    devServer: {
        open: true, //是否自动弹出浏览器页面
        host: "localhost", 
        port: '8080', 
        https: false,   //是否使用https协议
        hotOnly: false, //是否开启热更新
        // 由于接口跨域的问题，这里需要设置一个代理
        proxy: {
            '/api': {   // 起始地址
                //target: 'http://localhost:8000', //API服务器的地址
                target: 'http://api.dancingline.cn', //API服务器的地址
                //target: 'http://140.143.250.222:9100',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '' // 请求url里面的pathRewrite将会换成target
                }
            }
        },
    }
}

// 搭建一个socket.io服务
const app = require('express')
const server = require('http').Server(app)
const io = require('socket.io')(server)

server.listen(8081)

let oSockets = []
io.sockets.on('connection', socket => {
  console.log('用户链接成功')
  oSockets.push(socket)
  // 群聊
  socket.on('sendMsg', data => {
    socket.broadcast.emit('receiveMsg', data)
  })
  // 上线
  socket.on('online', data => {
    socket.broadcast.emit('online', data)
  })
  // 断开连接
  socket.on('disconnect', () => {
    oSockets.filter(item => item !== socket)
    console.log('用户离线')
  })
})