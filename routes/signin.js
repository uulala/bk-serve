const sha1 = require('sha1')
const express = require('express')
const router = express.Router()
const https = require('https')
const config = require('config-lite')(__dirname)

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin
const checkLogin = require('../middlewares/check').checkLogin
const CsUploadModel = require('../models/csUpload')

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  const { name, password } = req.body

  // 校验参数
  try {
    if (!name.length) {
      throw new Error('请填写用户名')
    }
    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch (e) {
    return res.send({ code: 0, msg: e.message })
  }

  UserModel.getUserByName(name)
    .then(function (user) {

      if (!user) {
        return res.send({ code: 0, msg: '用户不存在' })
      }
      // 检查密码是否匹配
      if (sha1(password) !== user.password) {
        return res.send({ code: 0, msg: '用户名或密码错误' })
      }
      // 用户信息写入 session
      delete user.password
      req.session.user = user
      // 跳转到主页
      // res.redirect('/posts')
      res.send({ code: 1, msg: '登录成功', data: user })
    })
    .catch(next)
})

// 微信登录
router.post('/wx', checkNotLogin, function (req, res, next) {
  const { appid, secret } = config
  https.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${req.body.code}&grant_type=authorization_code`, (rr) => {
    rr.on('data', (d) => {
      const openid = JSON.parse(d).openid
      UserModel.getUserByOpenid(openid).then(user => {
        if (user) {
          req.session.user = user
          res.send({ code: 1, msg: '登录成功', data: user })
        } else {
          UserModel.create({ openid, name: 'momo', password: openid }).then(user => {
            req.session.user = user
            // 初始化默认壁纸
            CsUploadModel.insertMany([{ openid, category: 'bg', url: 'upload/img/public-1.jpg' }, { openid, category: 'bg', url: 'upload/img/public-2.jpg' }, { openid, category: 'bg', url: 'upload/img/public-3.jpg' }]).then(rr => {
              res.send({ code: 1, msg: '注册成功', data: user })
            })
          })
        }
      })
    })
  }).on('error', (err) => {
    console.log(err)
  })


  // UserModel.getUserByName(name)
  //   .then(function (user) {

  //     if (!user) {
  //       return res.send({ code: 0, msg: '用户不存在' })
  //     }
  //     // 检查密码是否匹配
  //     if (sha1(password) !== user.password) {
  //       return res.send({ code: 0, msg: '用户名或密码错误' })
  //     }
  //     // 用户信息写入 session
  //     delete user.password
  //     req.session.user = user
  //     // 跳转到主页
  //     // res.redirect('/posts')
  //     res.send({ code: 1, msg: '登录成功' })
  //   })
  //   .catch(next)
})

// 修改用户信息
router.post('/update', checkLogin, function (req, res, next) {
  const { uuid } = req.session.user
  const { name, avatar } = req.body
  UserModel.updateUser({ uuid, name, avatar }).then(user => {
    console.log('res user:', user)
    res.send({ code: 1, msg: '修改成功', data: Object.assign(user, { name, avatar }) })
  })

})

// 绑定已有账户
// router.post('/bind', checkLogin, function (req, res, next) {
//   const { _id, name, avatar } = req.body
//   UserModel.updateUser({ id: _id, name, avatar }).then(user => {
//     console.log('res user:', user)
//     res.send({ code: 1, msg: '修改成功', data: Object.assign(user, { name, avatar }) })
//   })

// })
module.exports = router