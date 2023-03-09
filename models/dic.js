const Dic = require('../lib/mongo').Dic

const a = [
    {
        type: 'categoryType',
        value: 1,
        name: '收入',
    },
]

const c = [
    {
        type: 'category',
        value: 1,
        name: '餐饮',
        consumeType: '支出'
    },
    {
        type: 'category',
        value: 2,
        name: '红包',
        consumeType: '收入'
    }
]


// 日常账本对应类别库
// 装修账本对应类别库


// 增删改查
module.exports = {
    create: function create(obj) {
        return Book.create(obj)
    },
    del: function del() {
        return Book.remove(obj)
    },
    update: function update(obj) {
        return Book.findOneAndUpdate(obj)
    },
    getList: function getList(query) {
        return Book.find(query).exec()
    },
    getPublicBook: function getPublicBook(query) {
        return Book.find(query).exec()
    }
}