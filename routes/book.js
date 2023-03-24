const express = require('express')
const router = express.Router()

const BookModel = require('../models/book')
const CategoryModel = require('../models/category')
const checkLogin = require('../middlewares/check').checkLogin

// 查询 book 
router.get('/', checkLogin, function (req, res, next) {
    const { isFirst, uuid } = req.query
    let obj = {}
    if (isFirst) {
        obj.userId = req.session.user.uuid
    } else {
        obj.uuid = uuid
    }
    BookModel.getObj(obj).then(r1 => {
        let one = isFirst ? r1[0] : r1
        CategoryModel.getListByIds(one.categorys).then(r2 => {
            const tempArr = [], tempObj = {}
            r2.map(item => {
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
            res.send({ code: 1, data: { book: one, categoryTree: tempArr } })
        })

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