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
    getCount: function getCount(query) {
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

        return Flow.find(params).count()
    },
    getTotal: function getTotal(query) {
        const currentTime = new Date().getTime()
        const { bookId, startTime = currentTime - 86400000 * 7, endTime = currentTime, categoryType, categoryId } = query

        return Flow.aggregate(
            [
                {
                    $match: {
                        bookId,
                        bizTime: { $gte: parseInt(startTime), $lte: parseInt(endTime) }
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
    },
    getCategorysTotal: function getTotal(query) {
        const currentTime = new Date().getTime()
        const { bookId, startTime = currentTime - 86400000 * 7, endTime = currentTime, categoryType, categoryId } = query

        return Flow.aggregate(
            [
                {
                    $match: {
                        bookId,
                        bizTime: { $gte: parseInt(startTime), $lte: parseInt(endTime) }
                    },
                },
                {
                    $group: {
                        "_id": "$categoryId",
                        totalAmount: { $sum: '$amount' },
                    },
                }
            ]
        )
    }
}