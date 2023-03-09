const express = require('express')
const check = require('../middlewares/check')
const router = express.Router()

const CategoryModel = require('../models/category')
const checkLogin = require('../middlewares/check').checkLogin

// 根据 ids 获取列表树
router.get('/list', checkLogin, function (req, res, next) {
    // 获取用户的类别列表
    CategoryModel.getListByIds(req.query.ids.split(',')).then(result => {
        const tempArr = [], tempObj = {}
        result.map(item => {
            const { parentId } = item
            if (!parentId) {
                tempArr.push(item)
            } else {
                if (tempObj[parentId]) {
                    tempObj[parentId].push(item)
                } else {
                    tempObj[parentId] = [item]
                }
            }
        })
        const keys = Object.keys(tempObj)
        tempArr.map(item => {
            if (keys.includes(item.uuid)) {
                item.sub = tempObj[item.uuid]
            }
        })
        res.send({ code: 1, data: tempArr })
    }).catch(err => {
        res.send({ code: 0, msg: err.message })
    })
})

// 更新
router.post('/update', checkLogin, function (req, res, next) {
    // 用户信息写入数据库
    CategoryModel.update(req.body)
        .then(function (result) {
            res.send({ code: 1, msg: '更新成功' })
        })
        .catch(function (e) {
            return res.send({ code: 0, msg: e.message })
            // next(e)
        })
})

// 删除
router.post('/del', checkLogin, function (req, res, next) {
    const userId = req.session.user.uuid
    CategoryModel.del({ ...req.body, userId })
        .then(function (result) {
            res.send({ code: 1, msg: '删除成功' })
        })
        .catch(function (e) {
            return res.send({ code: 0, msg: e.message })
            // next(e)
        })
})

module.exports = router