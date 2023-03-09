const Flow = require('../lib/mongo').Flow


// 增删改查
module.exports = {
    create: function create(obj) {
        return Flow.create(obj)
    },
    del: function del(obj) {
        return Flow.remove(obj)
    },
    update: function update(obj) {
        // return Flow.update({uid:92096174},{userId: 'a8fa0730af6b43d88524cc99aabd205d'})
        return Flow.findOneAndUpdate({ uuid: obj.uuid }, obj)
    },
    getListByPage: function getListByPage(query) {
        const { bookId, startTime, endTime, categoryType, categoryId, currentPage = 1, pageSize = 10 } = query

        const params = {
            bookId
        }

        if (startTime && endTime) {
            params.bizTime = { $gte: parseInt(startTime), $lte: parseInt(endTime) }
        }
        if (categoryType) {
            params.categoryType = categoryType
        }
        if (categoryId) {
            params.categoryId = categoryId
        }
        const total = Flow.find(params).count()
        // .select({_id:0}) 不返回 _id
        return Flow.find(params).sort({ bizTime: -1 }).skip((currentPage - 1) * pageSize).limit(pageSize).select({ _id: 0 }).exec()
    },
    getTotal: function getTotal(query) {
        const currentTime = new Date().getTime()
        const { bookId, startTime = currentTime - 86400000 * 7, endTime = currentTime, categoryType, categoryId } = query

        const params = {
            bookId,
            bizTime: { $gte: parseInt(startTime), $lte: parseInt(endTime) }
        }
        return Flow.aggregate(
            [
                {
                    $match: {
                        bookId,
                        bizTime: { $gte: startTime, $lte: endTime }
                    },
                },
                {
                    $group: {
                        "_id": "$categoryType",
                        totalAmount: { $sum: '$amount' },
                    },
                }
            ]
        )
    }
}