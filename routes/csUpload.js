const fs = require('fs')
const path = require('path')

const sha1 = require('sha1') // sha1 并不是一种十分安全的加密方式，实际开发中可以使用更安全的 bcrypt 或 scrypt 加密
const express = require('express')
const router = express.Router()

const CsUploadModel = require('../models/csUpload')
const checkLogin = require('../middlewares/check').checkLogin
const uploadFile = require('../middlewares/upload').uploadFile

// 上传图片
router.post('/', checkLogin, uploadFile, function (req, res, next) {
    const openid = req.session.user.openid
    const { category, url } = req.body
    CsUploadModel.create({ openid, category, url }).then(result => {
        res.send({ code: 1, msg: '添加成功' })
    }).catch((e) => {
        // 添加失败，异步删除上传的头像
        fs.unlink(path)
        return res.send({ code: 0, msg: '添加失败' })
    })
})

// 获取壁纸
router.get('/byType', checkLogin, function (req, res, next) {
    const openid = req.session.user.openid
    CsUploadModel.getUrlByType({ openid, category: req.query.category }).then(result => {
        res.send({ code: 1, data: result })
    })
})

// 查看图片
router.get('/img/:p', function (req, res, next) {
    if(req.params.p.includes('..')){
        return res.send(404)
    }
    res.sendFile(path.join(__dirname, `../../public/bk/${req.params.p}`))
})

module.exports = router