const User = require('../lib/mongo').User

// User.index({ name: 1 }, { unique: true }).exec()// 设置了 name 的唯一索引，根据用户名找到用户，用户名全局唯一

// 增删改查
module.exports = {
  // 注册一个用户
  create: function create(user) {
    return User.create(user)
  },

  // 通过用户名获取用户信息
  getUserByName: function getUserByName(name) {
    return User.findOne({ name })
  },
  getUserByOpenid: function getUserByOpenid(openid) {
    return User.findOne({ openid })
  },
  getUsersByIds: function getUsersByIds(ids) {
    return User.find({ userId: { $in: ids } }).exec()
  },
  updateUser: function updateUser({ uuid, name, avatar }) {
    return User.findOneAndUpdate(uuid, { name, avatar })
  },
  del: function delUser(obj){
    return User.remove(obj)
  }
}