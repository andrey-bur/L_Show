import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import swaggerUi from "swagger-ui-express"
import productsRouter from "./src/router/product/product"
import userRouter from "./src/router/user/user"
import { errorHandler, notFoundHandler } from "./src/constants/middleware"
import { openApiSpec } from "./src/docs/openapi"

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))


app.use("/product", productsRouter)
app.use("/users", userRouter)
app.get("/docs.json", (_req, res) => {
  res.json(openApiSpec)
})
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec))
app.use(notFoundHandler)
app.use(errorHandler)

app.listen(3000, () => {
  console.log("Server started")
})
