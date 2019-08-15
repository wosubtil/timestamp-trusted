import { execAsync } from './helpers'
import { promisify } from 'util'
import { stat } from 'fs'
import tmp from 'tmp'

const statAsync = promisify(stat)

export const createRequestFile = async (hash: string): string => {
  try {
    const createTmpFileAsync = promisify(tmp.file)
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

export const signRequestFile = async (pathRequestFile: string, urlTSA: string): Promise<string> => {
  try {
    await statAsync(pathRequestFile)
    const pathResponseFile = `${pathRequestFile}.tsr`
    const command = `curl -H "Content-Type: application/timestamp-query" --data-binary "@${pathRequestFile}" ${urlTSA} > ${pathResponseFile}`
    await execAsync(command)
    return pathRequestFile
  } catch (error) {
    if (error.message) {
      throw new Error(error.message)
    }
    throw new Error('There was a problem signing the file')
  }
}
