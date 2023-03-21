const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false })) // 支持 application/x-www-form-urlencoded
app.use(bodyParser.json()) // 支持 application/json

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))
// session 中间件
app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: MongoStore.create({// 将 session 存储到 mongodb
    mongoUrl: config.mongodb// mongodb 地址
  })
}))

// 路由
routes(app)

// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})