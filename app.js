const express = require("express")
const app = express()

const dotenv = require("dotenv")
dotenv.config()

const connectToDB = require("./config/db")
connectToDB()

const userRouter = require("./routes/user.routes")


app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.use("/user",userRouter)




app.listen(3000,()=>{
    console.log("server is running on port 3000")
})