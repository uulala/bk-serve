const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../../public/bk'))
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname)
      cb(null, file.fieldname + '-' + Date.now() + extname)
    }
  })
  
module.exports = {
    uploadFile(req, res, next) {
        let upload = multer({ storage: storage }).any()
        upload(req,res, err => {
            if(err){
                res.send({code: 0, msg: '上传失败'})
            } else {
                req.body.url = `upload/img/${req.files[0].filename}`
                next()
            }
        })
    }
}