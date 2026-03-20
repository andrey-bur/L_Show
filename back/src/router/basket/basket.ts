import express from "express"

import {
  createBasket,
  getAllBaskets,
  getBasketByUserId,
  updateBasketByUserId
} from "../../controllers/basket/basket.controller"

const router = express.Router()

router.get("/", async (req, res) => {
  const baskets = await getAllBaskets()
  res.json(baskets)
})

router.get("/:userId", async (req, res) => {
  const basket = await getBasketByUserId(Number(req.params.userId))

  if (!basket) {
    return res.status(404).json({ message: "Basket not found" })
  }

  res.json(basket)
})

router.post("/:userId", async (req, res) => {
  const currentBasket = await getBasketByUserId(Number(req.params.userId))

  if (currentBasket) {
    return res.status(409).json({ message: "Basket already exists" })
  }

  const basket = await createBasket(Number(req.params.userId))
  res.status(201).json(basket)
})

router.patch("/:userId", async (req, res) => {
  const items = req.body.items
  const basket = await updateBasketByUserId(Number(req.params.userId), Array.isArray(items) ? items : [])

  if (!basket) {
    return res.status(404).json({ message: "Basket not found" })
  }

  res.json(basket)
})

export default router
