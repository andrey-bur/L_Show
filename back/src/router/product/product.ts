import express from "express"
import {
  getAllProducts,
  getProductsByQuery,
  searchProducts,
  filterProductsByType,
  filterProductsByAvailability,
  filterProductsByPopular,
  sortProductsByPriceAsc,
  sortProductsByPriceDesc,
  sortProductsByName,
  sortProductsByRating
} from "../../controllers/products/products.controller"

const router = express.Router()

router.get("/", async (req, res) => {
  const querySearch = typeof req.query.search === "string" ? req.query.search : undefined
  const queryType = typeof req.query.type === "string" ? req.query.type : undefined
  const querySort = typeof req.query.sort === "string" ? req.query.sort : undefined
  const queryInStockRaw = typeof req.query.inStock === "string" ? req.query.inStock : undefined

  const queryInStock = queryInStockRaw === undefined
    ? undefined
    : queryInStockRaw.toLowerCase() === "true"

  const hasQuery = Boolean(querySearch || queryType || querySort || queryInStockRaw !== undefined)
  let products = await getAllProducts()

  if (hasQuery) {
    const productQuery: {
      search?: string
      type?: string
      sort?: "price-asc" | "price-desc" | "name" | "rating"
      inStock?: boolean
    } = {}

    if (querySearch) productQuery.search = querySearch
    if (queryType) productQuery.type = queryType
    if (querySort === "price-asc" || querySort === "price-desc" || querySort === "name" || querySort === "rating") {
      productQuery.sort = querySort
    }
    if (queryInStockRaw !== undefined) {
      productQuery.inStock = queryInStockRaw.toLowerCase() === "true"
    }

    products = await getProductsByQuery(productQuery)
  }

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

router.get("/availability/:value", async (req, res) => {
  const inStock = req.params.value === "true"
  const products = await filterProductsByAvailability(inStock)
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
