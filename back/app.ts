import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import productsRouter from "./src/router/product/product"
import userRouter from "./src/router/user/user"
import basketRouter from "./src/router/basket/basket"
import { errorHandler, notFoundHandler } from "./src/constants/middleware"

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))


app.use("/product", productsRouter)
app.use("/basket", basketRouter)
app.use("/users", userRouter)
app.use(notFoundHandler)
app.use(errorHandler)

app.listen(3000, () => {
  console.log("Server started")
})
