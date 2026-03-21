import fs from "fs/promises"
import path from "path"

type EntityWithId = {
  id: number
}

const databasePath = path.resolve("database")

/**
 * Builds an absolute path for a JSON storage file.
 * @param fileName Base database file name without extension.
 * @returns Absolute file path.
 */
const getFilePath = (fileName: string): string => {
  return path.join(databasePath, `${fileName}.json`)
}

/**
 * Writes a full collection to a JSON file.
 * @template T
 * @param fileName Base database file name without extension.
 * @param data Collection of entities to persist.
 * @returns Promise resolved when file write is completed.
 */
export const writeData = async <T>(fileName: string, data: T[]): Promise<void> => {
  await fs.writeFile(
    getFilePath(fileName),
    JSON.stringify(data, null, 2)
  )
}

/**
 * Reads and parses a JSON collection from storage.
 * @template T
 * @param fileName Base database file name without extension.
 * @returns Parsed collection. Returns an empty array for empty files.
 */
export const readData = async <T>(fileName: string): Promise<T[]> => {
  const data = await fs.readFile(getFilePath(fileName), "utf-8")
  const trimmed = data.trim()

  if (!trimmed) {
    return []
  }

  return JSON.parse(trimmed) as T[]
}

/**
 * Adds a new entity to the target JSON collection.
 * @template T
 * @param fileName Base database file name without extension.
 * @param item Entity to append.
 * @returns The appended entity.
 */
export const addItem = async <T>(fileName: string, item: T): Promise<T> => {
  const data = await readData<T>(fileName)

  data.push(item)

  await writeData(fileName, data)

  return item
}

/**
 * Updates an entity by numeric identifier.
 * @template T
 * @param fileName Base database file name without extension.
 * @param id Entity identifier.
 * @param newData Partial payload with updated fields.
 * @returns Updated entity or null when not found.
 */
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

/**
 * Replaces the whole collection in the target JSON file.
 * @template T
 * @param fileName Base database file name without extension.
 * @param items New collection state.
 * @returns Promise resolved when data is written.
 */
export const replaceItems = async <T>(fileName: string, items: T[]): Promise<void> => {
  await writeData(fileName, items)
}
