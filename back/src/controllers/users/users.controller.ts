import { readData, addItem, updateItem } from "../../servires/database.servires"

const file = "users"

type User = {
  id: number
  name: string
  email: string
  number: string
  password: string
}

export async function findUser(name:string , password: string): Promise<User | null> {
  const users: User[] = await readData(file)
  const user = users.find(
    u => u.name == name && u.password == password
  )
  if (!user) {
    return null
  }
  return user
}

export async function createUser(user: User): Promise<void> {
  await addItem(file, user)
}

export async function updateUser(id: number, data: Partial<User>): Promise<void> {
  const user = await updateItem(file, id, data)

  if (!user) {

  }
}
