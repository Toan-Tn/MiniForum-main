const express = require('express');
const app = express();
const PORT = 8797;
const cors = require('cors')
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const middleware = require('./helper/authenMiddleware')
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('uploads'))

const UserRouter = require('./controller/userController')
const PostRouter = require('./controller/postController')
const authRouter = require('./controller/authController')
const CommentRounter = require('./controller/commentController')
var mongoDB = 'mongodb://localhost:27017/projectForum';
mongoose.connect(mongoDB, function (err) {
    if (err) throw err;
    console.log('Successfully connected');
});
//Ép Mongoose sử dụng thư viện promise toàn cục
mongoose.Promise = global.Promise;
//Lấy kết nối mặc định
var db = mongoose.connection;
app.use('/', authRouter)
app.use('/user',middleware.authenticateJWT ,UserRouter)
app.use('/post',middleware.authenticateJWT , PostRouter)
app.use('/comment',middleware.authenticateJWT , CommentRounter)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(PORT, () => { console.log("Server started on http://localhost:" + PORT) })
module.exports = app;