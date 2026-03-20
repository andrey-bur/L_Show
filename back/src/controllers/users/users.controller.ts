import crypto from "crypto"

import { createBasket } from "../basket/basket.controller"
import { addItem, readData, replaceItems, updateItem } from "../../servires/database.servires"
import { Session } from "../../../types/Session"
import { Delivery, User } from "../../../types/User"

const usersFile = "users"
const sessionFile = "session"

export const sessionCookieName = "sessionId"
export const sessionTtlMs = 10 * 60 * 1000

type RegisterUserData = Omit<User, "id">

export type LoginData = {
  identifier?: string
  password?: string
}

export type RegisterData = {
  name?: string
  email?: string
  login?: string
  phone?: string
  password?: string
  cart?: User["cart"]
  deliveries?: User["deliveries"]
}

export type UpdateUserData = Partial<User> & {
  oldPassword?: string
}

type SuccessResult<T> = {
  status: "success"
  data: T
}

type ErrorResult = {
  status: "validation_error" | "not_found" | "unauthorized" | "conflict"
  message: string
}

export type LoginResult = SuccessResult<{ user: User; session: Session }> | ErrorResult
export type RegisterResult = SuccessResult<{ user: User; session: Session }> | ErrorResult
export type AuthorizedUserResult = SuccessResult<User> | ErrorResult
export type UpdateUserResult = SuccessResult<User> | ErrorResult

function normalizeUser(user: RegisterUserData & { id: number }): User {
  return {
    id: user.id,
    name: user.name.trim(),
    email: user.email.trim(),
    login: user.login.trim(),
    phone: user.phone.trim(),
    password: user.password,
    cart: Array.isArray(user.cart) ? user.cart : [],
    deliveries: Array.isArray(user.deliveries) ? user.deliveries as Delivery[] : []
  }
}

function getErrorResult(message: string, status: ErrorResult["status"]): ErrorResult {
  return { status, message }
}

export async function getAllUsers(): Promise<User[]> {
  return readData<User>(usersFile)
}

export async function getUserById(id: number): Promise<User | null> {
  const users = await getAllUsers()
  return users.find(user => user.id === id) ?? null
}

export async function getNextUserId(): Promise<number> {
  const users = await getAllUsers()
  const maxId = users.reduce((currentMax, user) => Math.max(currentMax, user.id), 0)
  return maxId + 1
}

export async function findUser(identifier: string, password: string): Promise<User | null> {
  const users = await getAllUsers()
  const normalizedIdentifier = identifier.trim().toLowerCase()

  return users.find(user =>
    user.password === password &&
    [user.name, user.email, user.login, user.phone]
      .some(value => value.trim().toLowerCase() === normalizedIdentifier)
  ) ?? null
}

export async function findUserByUniqueFields(email: string, login: string, phone: string): Promise<User | null> {
  const users = await getAllUsers()

  return users.find(user =>
    user.email.trim().toLowerCase() === email.trim().toLowerCase() ||
    user.login.trim().toLowerCase() === login.trim().toLowerCase() ||
    user.phone.trim() === phone.trim()
  ) ?? null
}

export async function createUser(userData: RegisterUserData): Promise<User> {
  const user = normalizeUser({
    ...userData,
    id: await getNextUserId()
  })

  await addItem(usersFile, user)

  return user
}

export async function updateUser(id: number, data: Partial<User>): Promise<User | null> {
  return updateItem<User>(usersFile, id, data)
}

export async function getAllSessions(): Promise<Session[]> {
  return readData<Session>(sessionFile)
}

export async function getActiveSessions(): Promise<Session[]> {
  const sessions = await getAllSessions()
  const activeSessions = sessions.filter(session => session.expires > Date.now())

  if (activeSessions.length !== sessions.length) {
    await replaceItems(sessionFile, activeSessions)
  }

  return activeSessions
}

export async function createSession(userId: number): Promise<Session> {
  const sessions = await getActiveSessions()

  const session: Session = {
    sessionId: crypto.randomUUID(),
    userId,
    expires: Date.now() + sessionTtlMs
  }

  const nextSessions = sessions.filter(currentSession => currentSession.userId !== userId)
  nextSessions.push(session)

  await replaceItems(sessionFile, nextSessions)

  return session
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sessions = await getActiveSessions()
  const nextSessions = sessions.filter(session => session.sessionId !== sessionId)
  await replaceItems(sessionFile, nextSessions)
}

export async function getCurrentUserBySession(sessionId?: string): Promise<User | null> {
  if (!sessionId) {
    return null
  }

  const sessions = await getActiveSessions()
  const session = sessions.find(item => item.sessionId === sessionId)

  if (!session) {
    return null
  }

  return getUserById(session.userId)
}

export async function loginUser(data: LoginData): Promise<LoginResult> {
  const identifier = String(data.identifier ?? "").trim()
  const password = String(data.password ?? "").trim()

  if (!identifier || !password) {
    return getErrorResult("Identifier and password are required", "validation_error")
  }

  const user = await findUser(identifier, password)

  if (!user) {
    return getErrorResult("Invalid credentials", "unauthorized")
  }

  const session = await createSession(user.id)

  return {
    status: "success",
    data: { user, session }
  }
}

export async function registerUser(data: RegisterData): Promise<RegisterResult> {
  const name = String(data.name ?? "").trim()
  const email = String(data.email ?? "").trim()
  const login = String(data.login ?? "").trim()
  const phone = String(data.phone ?? "").trim()
  const password = String(data.password ?? "")

  if (!name || !email || !login || !phone || !password) {
    return getErrorResult("All registration fields are required", "validation_error")
  }

  const existingUser = await findUserByUniqueFields(email, login, phone)

  if (existingUser) {
    return getErrorResult("User already exists", "conflict")
  }

  const user = await createUser({
    name,
    email,
    login,
    phone,
    password,
    cart: Array.isArray(data.cart) ? data.cart : [],
    deliveries: Array.isArray(data.deliveries) ? data.deliveries : []
  })

  await createBasket(user.id)

  const session = await createSession(user.id)

  return {
    status: "success",
    data: { user, session }
  }
}

export async function logoutUser(sessionId?: string): Promise<void> {
  if (!sessionId) {
    return
  }

  await deleteSession(sessionId)
}

export async function getAuthorizedUser(sessionId?: string): Promise<AuthorizedUserResult> {
  const user = await getCurrentUserBySession(sessionId)

  if (!user) {
    return getErrorResult("Unauthorized", "unauthorized")
  }

  return {
    status: "success",
    data: user
  }
}

export async function updateAuthorizedUser(
  userId: number,
  sessionId: string | undefined,
  data: UpdateUserData
): Promise<UpdateUserResult> {
  const currentUser = await getCurrentUserBySession(sessionId)

  if (!currentUser || currentUser.id !== userId) {
    return getErrorResult("Forbidden", "unauthorized")
  }

  const needsProfileVerification = typeof data.name === "string" ||
    typeof data.email === "string" ||
    typeof data.login === "string" ||
    typeof data.phone === "string" ||
    typeof data.password === "string"

  if (needsProfileVerification) {
    const oldPassword = String(data.oldPassword ?? "")

    if (!oldPassword) {
      return getErrorResult("Current password is required", "validation_error")
    }

    if (oldPassword !== currentUser.password) {
      return getErrorResult("Current password is incorrect", "unauthorized")
    }
  }

  const { oldPassword, ...safeData } = data

  if (safeData.email || safeData.login || safeData.phone) {
    const duplicate = await findUserByUniqueFields(
      safeData.email ?? currentUser.email,
      safeData.login ?? currentUser.login,
      safeData.phone ?? currentUser.phone
    )

    if (duplicate && duplicate.id !== currentUser.id) {
      return getErrorResult("User was not updated", "conflict")
    }
  }

  const user = await updateUser(userId, safeData)

  if (!user) {
    return getErrorResult("User not found", "not_found")
  }

  return {
    status: "success",
    data: user
  }
}
