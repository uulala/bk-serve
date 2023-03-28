const fs = require('fs')
const path = require('path')
const sha1 = require('sha1') // sha1 并不是一种十分安全的加密方式，实际开发中可以使用更安全的 bcrypt 或 scrypt 加密
const express = require('express')
const router = express.Router()

const FlowModel = require('../models/flow')
const UserModel = require('../models/users')
const checkLogin = require('../middlewares/check').checkLogin

// 新增
router.post('/create', checkLogin, function (req, res, next) {
    const userId = req.session.user.uuid
    const { bookId, categoryType, categoryId, bizTime, amount, comment } = req.body

    // 待写入数据库的用户信息
    let obj = {
        userId,
        bookId,
        categoryType,
        categoryId,
        bizTime,
        amount,
        comment
    }

    // 用户信息写入数据库
    FlowModel.create(obj)
        .then(function (result) {
            res.send({ code: 1, msg: '写入成功' })
        })
        .catch(function (e) {
            return res.send({ code: 0, msg: e.message })
            // next(e)
        })
})

// 获取列表
router.get('/list', checkLogin, function (req, res, next) {

    FlowModel.getListByPage(req.query).then(function (r1) {
        const userIds = r1.map(item => item.userId)
        UserModel.getUsersByIds(userIds).then(function (rr) {
            r1.map(item => {
                item.userName = rr.find(it => it.uuid === item.userId)?.name
            })
            FlowModel.getCount(req.query).then(r2 => {
                res.send({ code: 1, data: r1, count: r2 })
            })
        })
    }).catch(function (e) {
        return res.send({ code: 0, msg: e.message })
        // next(e)
    })
})

// 更新
router.post('/update', checkLogin, function (req, res, next) {
    // 用户信息写入数据库
    FlowModel.update(req.body)
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
    FlowModel.del({ ...req.body, userId })
        .then(function (result) {
            res.send({ code: 1, msg: '删除成功' })
        })
        .catch(function (e) {
            return res.send({ code: 0, msg: e.message })
            // next(e)
        })
})

// 获取汇总数据
router.get('/total', checkLogin, function (req, res, next) {

    FlowModel.getTotal(req.query).then(function (r1) {
        FlowModel.getCategorysTotal(req.query).then(r2 => {
            res.send({ code: 1, data: { all: r1, categorys: r2 } })
        })
    }).catch(function (e) {
        return res.send({ code: 0, msg: e.message })
        // next(e)
    })

})

// 查看趋势
router.get('/trand', checkLogin, function (req, res, next) {
    FlowModel.getTrand({
        ...req.query,
        categoryType: 2
    }).then(function (r1) {
        FlowModel.getTrand({
            ...req.query,
            categoryType: 3
        }).then(function (r2) {
            // 补齐空白数据
            const cc = []
            r1.map(item => {
                cc.push(item._id)
            })
            r2.map(item => {
                cc.push(item._id)
            })
            const realCc = [...new Set(cc)]
            const tempR1 = [], tempR2 = []

            realCc.map(item => {
                const one = r1.find(it => it._id === item)
                const one2 = r2.find(it => it._id === item)
                tempR1.push(one ? one.totalAmount : 0)
                tempR2.push(one2 ? one2.totalAmount : 0)

            })

            res.send({ code: 1, data: { outcome: tempR2, income: tempR1, cc: realCc } })
        })
    }).catch(function (e) {
        return res.send({ code: 0, msg: e.message })
        // next(e)
    })
})

module.exports = router