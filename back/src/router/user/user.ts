import express from "express"

import {
  getAuthorizedUser,
  loginUser,
  logoutUser,
  registerUser,
  sessionCookieName,
  sessionTtlMs,
  UpdateUserData,
  updateAuthorizedUser
} from "../../controllers/users/users.controller"
import { User } from "../../../types/User"

const router = express.Router()

router.post("/login", async (req, res) => {
  const result = await loginUser(req.body as { identifier?: string; password?: string })

  if (result.status !== "success") {
    const statusCode = result.status === "validation_error" ? 400 : 401
    return res.status(statusCode).json({ message: result.message })
  }

  res.cookie(sessionCookieName, result.data.session.sessionId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: sessionTtlMs
  })

  return res.json(result.data.user)
})

router.post("/registration", async (req, res) => {
  const result = await registerUser(req.body as Partial<User>)

  if (result.status !== "success") {
    const statusCode = result.status === "validation_error" ? 400 : 409
    return res.status(statusCode).json({ message: result.message })
  }

  res.cookie(sessionCookieName, result.data.session.sessionId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: sessionTtlMs
  })

  return res.status(201).json(result.data.user)
})

router.get("/me", async (req, res) => {
  const result = await getAuthorizedUser(req.cookies?.[sessionCookieName] as string | undefined)

  if (result.status !== "success") {
    res.clearCookie(sessionCookieName)
    return res.status(401).json({ message: result.message })
  }

  return res.json(result.data)
})

router.post("/logout", async (req, res) => {
  await logoutUser(req.cookies?.[sessionCookieName] as string | undefined)

  res.clearCookie(sessionCookieName)

  return res.json({ message: "Logged out" })
})

router.patch("/:id", async (req, res) => {
  const result = await updateAuthorizedUser(
    Number(req.params.id),
    req.cookies?.[sessionCookieName] as string | undefined,
    req.body as UpdateUserData
  )

  if (result.status !== "success") {
    const statusCode =
      result.status === "validation_error" ? 400
        : result.status === "unauthorized" ? 401
          : result.status === "not_found" ? 404
            : result.status === "conflict" ? 409
              : 403
    return res.status(statusCode).json({ message: result.message })
  }

  return res.json(result.data)
})

export default router
