import express from "express"
import {
    findUser,
    createUser,
    updateUser
  }from "../../controllers/users/users.controller"
  
const router=express.Router();

router.post("/login", async (req, res) => {
  const { name, password } = req.body
  const user = await findUser(name, password)
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }
  res.cookie("session", user.id.toString(), {
    httpOnly: true,      
    maxAge: 10 * 60 * 1000})
  res.json(user)
})

router.post("/registration", async (req, res) => {
  const user = req.body
  await createUser(user)
  res.cookie("session", user.id.toString(), {
    httpOnly: true,    
    maxAge: 10 * 60 * 1000
  })
  res.json({
    message: "User created"
  })
})

router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id)
  const data = req.body
  await updateUser(id, data)
  res.json({
    message: "User updated"
  })
})

export default router 