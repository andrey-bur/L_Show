import express from "express"
import productsRouter from "./src/router/product/product"
import userRouter from "./src/router/user/user"

const app = express()

app.use(express.json())

app.use("/product", productsRouter)
app.use("/user",userRouter)


app.listen(3000,()=>{
    console.log("Server started")
})