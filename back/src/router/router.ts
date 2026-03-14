import express from "express"
import {
  getAllProducts,
  searchProducts,
  filterProductsByType,
  filterProductsByPopular,
  sortProductsByPriceAsc,
  sortProductsByPriceDesc,
  sortProductsByName,
  sortProductsByRating
} from "../controllers/products/products.controller"

const router = express.Router()

router.get("/", async (req, res) => {
  const products = await getAllProducts()
  res.json(products)
})

router.get("/search", async (req, res) => {
  const query = req.query.q as string
  const products = await searchProducts(query)
  res.json(products)
})

router.get("/type/:type", async (req, res) => {
  const products = await filterProductsByType(req.params.type)
  res.json(products)
})

router.get("/popular/:value", async (req, res) => {
  const popular = req.params.value === "true"
  const products = await filterProductsByPopular(popular)
  res.json(products)
})

router.get("/sort/price-asc", async (req, res) => {
  const products = await sortProductsByPriceAsc()
  res.json(products)
})

router.get("/sort/price-desc", async (req, res) => {
  const products = await sortProductsByPriceDesc()
  res.json(products)
})

router.get("/sort/name", async (req, res) => {
  const products = await sortProductsByName()
  res.json(products)
})

router.get("/sort/rating", async (req, res) => {
  const products = await sortProductsByRating()
  res.json(products)
})

export default router