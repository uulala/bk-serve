module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send('hello')
    })
    app.use('/signup', require('./signup'))
    app.use('/signin', require('./signin'))
    app.use('/signout', require('./signout'))
    app.use('/flow', require('./flow'))
    app.use('/book', require('./book'))
    app.use('/category', require('./category'))
    app.use('/upload', require('./csUpload'))
    app.use('/over', require('./over'))
}