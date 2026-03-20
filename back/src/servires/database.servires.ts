import fs from "fs/promises"
import path from "path"

type EntityWithId = {
  id: number
}

const databasePath = path.resolve("database")

const getFilePath = (fileName: string): string => {
  return path.join(databasePath, `${fileName}.json`)
}

export const writeData = async <T>(fileName: string, data: T[]): Promise<void> => {
  await fs.writeFile(
    getFilePath(fileName),
    JSON.stringify(data, null, 2)
  )
}

export const readData = async <T>(fileName: string): Promise<T[]> => {
  const data = await fs.readFile(getFilePath(fileName), "utf-8")
  const trimmed = data.trim()

  if (!trimmed) {
    return []
  }

  return JSON.parse(trimmed) as T[]
}

export const addItem = async <T>(fileName: string, item: T): Promise<T> => {
  const data = await readData<T>(fileName)

  data.push(item)

  await writeData(fileName, data)

  return item
}

export const updateItem = async <T extends EntityWithId>(
  fileName: string,
  id: number,
  newData: Partial<T>
): Promise<T | null> => {
  const data = await readData<T>(fileName)

  const index = data.findIndex(item => item.id === id)

  if (index === -1) {
    return null
  }

  const updatedItem: T = {
    ...data[index],
    ...newData
  } as T

  data[index] = updatedItem

  await writeData(fileName, data)

  return data[index] ?? null
}

export const replaceItems = async <T>(fileName: string, items: T[]): Promise<void> => {
  await writeData(fileName, items)
}
