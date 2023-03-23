
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()
const https = require('https')
const config = require('config-lite')(__dirname)


const checkNotLogin = require('../middlewares/check').checkNotLogin
const checkLogin = require('../middlewares/check').checkLogin

const BookModel = require('../models/book')
const CategoryModel = require('../models/category')
const CsUploadModel = require('../models/csUpload')
const FlowModel = require('../models/flow')
const UserModel = require('../models/users')

// 删除自己的所有信息
router.post('/delAll', checkLogin, function (req, res, next) {
    const userId = req.session.user.uuid
    const openid = req.session.user.openid

    UserModel.del({ uuid: userId }).then(r1 => {
        CsUploadModel.del({ openid }).then(r2=>{
             BookModel.del({ userId }).then(r3 =>{
                FlowModel.del({ userId }).then(r4=>{
                    res.send({code: 1, msg: 'success'})
                })
             })
        })
    })
})

module.exports = router