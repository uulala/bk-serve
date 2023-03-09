const { v4 } = require('uuid')
function addUuid(schema, option) {
    schema.add({ uuid: String })
    // crete 触发
    schema.pre('save', function (next) {
        this.uuid = v4().replace(/-/ig, '')
        this.createTime = new Date().getTime()
        next()
    })
    // // insertMany 触发
    // schema.pre('insertMany',function(next){
    //     this.uuid = v4()
    //     next()
    // })
    // schema.post('save',function(){
    //     this.uuid = v4()
    // })
}

module.exports = {
    addUuid
}