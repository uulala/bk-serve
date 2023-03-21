const CsUpload = require('../lib/mongo').CsUpload

// 增删改查
module.exports = {
    create: function create(obj) {
        console.log(obj)
        return CsUpload.create(obj)
    },
    del: function del(obj) {
        return CsUpload.remove(obj)
    },
    getUrlByType: function getUrlByType(obj) {
        return CsUpload.find(obj)
    }
}