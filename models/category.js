const Category = require('../lib/mongo').Category

// 增删改查
module.exports = {
    // create: function create(obj) {
    //     return Category.create(obj)
    // },
    del: function del(obj) {
        return Category.remove(obj)
    },
    update: function update(obj) {
        return Category.update({ uuid: obj.uuid }, obj)
    },
    getListByIds: function getListByIds(ids) {
        return Category.find({ uuid: { $in: ids } })
    }
}