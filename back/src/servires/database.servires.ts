import fs from "fs/promises"
import path from "path"

const databasePath = path.resolve("database")

const getFilePath = (fileName: string) => {
  return path.join(databasePath, `${fileName}.json`)
}

const writeData = async (fileName: string, data: any) => {
  await fs.writeFile(
    getFilePath(fileName),
    JSON.stringify(data, null, 2)
  )
}
export const readData = async (fileName: string) => {
  const data = await fs.readFile(getFilePath(fileName), "utf-8")
  return JSON.parse(data)
}

export const addItem = async (fileName: string, item: object) => {
  const data = await readData(fileName)

  data.push(item)

  await writeData(fileName, data)

  return item
}

export const updateItem = async (fileName: string, id: number, newData: object) => {
  const data = await readData(fileName)

  const index = data.findIndex((item:any) => item.id === id)

  if (index === -1) return null

  data[index] = { ...data[index], ...newData }

  await writeData(fileName, data)

  return data[index]
}