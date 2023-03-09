const { Book } = require('../lib/mongo')

// categoryType
// 增删改查
module.exports = {
    getObj: function (obj) {
        return Book.find(obj)
    },
    create: function create(obj) {
        return Book.findOne({ uuid: obj.publicBkUuid }).then(res => {
            return Book.create({ ...obj, categorys: res.categorys })
        })
    },
    del: function del(obj) {
        return Book.remove(obj)
    },
    update: function update(obj) {
        return Book.update({ uuid: obj.uuid }, obj)
    },
    join: function join({ uuid, userId }) {
        return Book.findOne({ uuid }).then(res => {
            if (res.bookMembers.includes(userId)) {
                throw new Error('已添加')
            } else {
                return Book.update({ uuid }, { $push: { bookMembers: userId } })
            }
        })

    },
    getList: function getList({ userId, isPublic, ...query }) {
        if (isPublic) return Book.find({ isPublic })

        return Book.find({ ...query, bookMembers: { $elemMatch: { $eq: userId } } }).exec()
    },
}