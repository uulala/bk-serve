const config = require('config-lite')(__dirname)
const { addUuid } = require('./plugins')

var mongoose = require('mongoose');
mongoose.connect(config.mongodb)


// const moment = require('moment')
// const objectIdToTimestamp = require('objectid-to-timestamp')

mongoose.plugin(addUuid);

// // 根据 id 生成创建时间 created_at
// mongolass.plugin('addCreatedAt', {
//     afterFind: function (results) {
//         results.forEach(function (item) {
//             item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
//         })
//         return results
//     },
//     afterFindOne: function (result) {
//         if (result) {
//             result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
//         }
//         return result
//     }
// })

// 定义用户表 schema
const User = mongoose.model('User', new mongoose.Schema({
    uuid: { type: String },
    name: { type: 'string', required: true },
    password: { type: 'string', required: true },
    avatar: { type: 'string' },
    gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' }, // required: true 表示该字段是必需的，default: xxx 用于创建文档时设置默认值。
    openid: { type: 'string' }
}));

const Book = mongoose.model('book', new mongoose.Schema({
    uuid: { type: String }, // value 值
    isPublic: { type: Number, default: 0 },
    userId: { type: String, required: true }, // 用户 id
    name: { type: String, required: true }, // 账本名称
    img: { type: String }, // 账本封面地址
    // type: { type: String }, // 账本类别
    categorys: { type: Array }, // 账本对应类别库
    // 默认类别库 [1,2,3]
    bookMembers: { type: Array, default: [] }
}))

const Category = mongoose.model('category', new mongoose.Schema({
    uuid: { type: String }, // 子级需要引用父级id
    parentId: { type: Number },
    name: { type: String },
    categoryType: { type: Number },
    icon: { type: String },
    sub: { type: Array, default: null }
}))

const Dic = mongoose.model('dic', new mongoose.Schema({
    type: { type: String, required: true }, // 字典类别
    name: { type: Number, required: true }, // 账本名称
    img: { type: String } // 账本封面
}))

// 定义 schema
const Flow = mongoose.model('flow', new mongoose.Schema({
    uid: { type: Number },
    userId: { type: String, required: true }, // 账户: userId
    userName: { type: String },
    bookId: { type: String, required: true }, // 账本
    categoryType: { type: Number, required: true }, // 大类，如收入/支出
    categoryId: { type: String, required: true }, // 小类，如交通/网费
    // categoryName: { type: Number, required: true }, // 类别名称
    // uid: { type: Number, required: true },
    // currency: { type: Number, required: true }, // 币种
    // currencyShortName: { type: String, required: true }, // CNY
    // members: { type: Number, required: true },
    bizTime: { type: Number, required: true }, // 消费时间
    amount: { type: Number, required: true }, // 金额
    comment: { type: String } // 备注
}))

const CsUpload = mongoose.model('upload', new mongoose.Schema({
    openid: { type: 'string' },
    category: { type: String, required: true }, // 作为什么用的，类似 bg, avatar
    url: { type: String, required: true }
}))


module.exports = {
    User,
    Book,
    Category,
    Dic,
    Flow,
    CsUpload
}

