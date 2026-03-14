import express from "express"
import productsRouter from "./src/router/router"

const app = express()

app.use(express.json())

app.use("/product", productsRouter)

app.listen(3000,()=>{
    console.log("Server started")
})