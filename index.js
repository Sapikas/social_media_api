const express = require('express');
const app = express();
require('dotenv/config')
const PORT = process.env.PORT || 4000
const api = process.env.API_URL
const userRouter = require('./routers/users')
const postRouter = require('./routers/posts')
const commentRouter = require('./routers/comments')
const invitationSendRouter = require('./routers/friendsrequest')
const invitationRecievedRouter = require('./routers/myfriendsrequest')
const friendsRouter = require('./routers/friends')
const db = require('./config/database')
const cookieParser = require('cookie-parser');

//middlewares
app.use(express.json())
app.use(cookieParser())

//routers
app.use(`${api}/users`, userRouter)
app.use(`${api}/posts`, postRouter)
app.use(`${api}/comments`, commentRouter)
app.use(`${api}/invitations/send`, invitationSendRouter) 
app.use(`${api}/invitations/recieved`, invitationRecievedRouter) 
app.use(`${api}/friends`, friendsRouter)

app.get('/', (req,res)=>{
    res.status(200).send('Hello World')
})

db.sync()
.then((res)=> console.log(res))
.then(()=>console.log('Db connected'))
.catch((err)=> console.log(err))

app.listen(PORT, ()=>{
    console.log(`The server is running in port ${PORT}`);
})