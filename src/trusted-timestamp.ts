
import { CustomError } from './helpers/custom-error'
import { execAsync, getFileStats } from './helpers/helpers'
import { promisify } from 'util'
import { stat } from 'fs'
import tmp from 'tmp'

const statAsync = promisify(stat)

export const createRequestFile = async (hash: string): Promise<string> => {
  const createTmpFileAsync = promisify(tmp.file)
  if (hash.length < 40) {
    throw new CustomError('Invalid hash')
  }
  const pathTmpFile = await createTmpFileAsync()
  const commandOpenSSL = `openssl ts -query -digest ${hash} -cert -out ${pathTmpFile}`
  await execAsync(commandOpenSSL)
  const statsRequestFile = await getFileStats(pathTmpFile)
  if (!statsRequestFile.size) {
    throw new CustomError('There was an error creating File Request. The file appear is empty')
  }
  return pathTmpFile
}

export const signRequestFile = async (pathRequestFile: string, urlTSA: string): Promise<string> => {
  await getFileStats(pathRequestFile)
  const pathResponseFile = `${pathRequestFile}.tsr`
  const command = `curl -H "Content-Type: application/timestamp-query" --data-binary "@${pathRequestFile}" ${urlTSA} > ${pathResponseFile} --fail --silent --show-error`
  await execAsync(command)
  return pathResponseFile
}

export const getTimestampFromResponse = async (pathResponseFile: string): Promise<string> => {
  await statAsync(pathResponseFile)
  const command = `openssl ts -reply -in ${pathResponseFile} -text`
  const resultCommand = await execAsync(command)
  const timestamp = resultCommand.match('(Time stamp: )(.*)')[2]
  return timestamp
}
