const express = require('express')
const router = express.Router()

const BookModel = require('../models/book')
const checkLogin = require('../middlewares/check').checkLogin

// 查询 book 
router.get('/', checkLogin, function (req, res, next) {
    BookModel.getObj({ uuid: req.query.uuid }).then(result => {
        res.send({ code: 1, data: result })
    })
})

// 获取 booklist (用户booklist / 公共booklist)
router.get('/list', checkLogin, function (req, res, next) {
    req.query.userId = req.session.user.uuid
    BookModel.getList(req.query).then(result => {
        res.send({ code: 1, data: result })
    })
        .catch(function (e) {
            return res.send({ code: 0, msg: e.message })
        })
})

// 新增 book
router.post('/create', checkLogin, function (req, res, next) {
    const params = req.body
    params.userId = req.session.user.uuid
    params.bookMembers = [params.userId]

    BookModel.create(params).then(result => {
        res.send({ code: 1, data: result })
    }).catch(function (e) {
        return res.send({ code: 0, msg: e.message })
    })
})

// 更新
router.post('/update', checkLogin, function (req, res, next) {
    // 用户信息写入数据库
    BookModel.update(req.body)
        .then(function (result) {
            res.send({ code: 1, msg: '更新成功' })
        })
        .catch(function (e) {
            return res.send({ code: 0, msg: e.message })
            // next(e)
        })
})

router.post('/join', checkLogin, function (req, res, next) {
    // 用户信息写入数据库
    const params = { uuid: req.body.bookId, userId: req.session.user.uuid }
    BookModel.join(params)
        .then(function (result) {
            // if (!result) throw new Error('已添加')

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
    BookModel.del({ ...req.body, userId })
        .then(function (result) {
            res.send({ code: 1, msg: '删除成功' })
        })
        .catch(function (e) {
            return res.send({ code: 0, msg: e.message })
            // next(e)
        })
})
module.exports = router