import { execAsync } from './helpers'
import { promisify } from 'util'
import { stat } from 'fs'
import tmp from 'tmp'

export const createFileRequest = async (hash: string): string => {
  try {
    const createTmpFileAsync = promisify(tmp.file)
    const statAsync = promisify(stat)
    if (hash.length < 40) {
      throw new Error('Invalid hash')
    }
    const pathTmpFile = await createTmpFileAsync()
    const commandOpenSSL = `openssl ts -query -digest ${hash} -cert -out ${pathTmpFile}`
    await execAsync(commandOpenSSL)
    const statsRequestFile = await statAsync(pathTmpFile)
    if (!statsRequestFile.size) {
      throw new Error('There was an error creating File Request. The file appear is empty')
    }
    return pathTmpFile
  } catch (error) {
    if (error.message) {
      throw new Error(error.message)
    }
    throw new Error('There was an error creating File Request')
  }
}
