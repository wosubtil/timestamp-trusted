import { createRequestFile, signRequestFile, getTimestampFromResponse } from '../src/trusted-timestamp'
import crypto from 'crypto'
import { stat } from 'fs'
jest.setTimeout(30000)

const urlTimeStampAuthority = 'https://freetsa.org/tsr'
const urlTimeStampAuthorityInvalid = 'https://frerrretsa.org'
const rawContent = 'Hello'
const hashContent = crypto.createHash('sha256').update(rawContent).digest('hex')

describe('createRequestFile', () => {
  test('Basics tests', () => {
    expect(typeof createRequestFile).toEqual('function')
  })

  test('Should return an error - Hash invalid', async () => {
    try {
      const hashFake = 'da39a3ee5e6b4b0d3255bfef95601890afd8070'
      await createRequestFile(hashFake)
    } catch (error) {
      expect(error.message).toBe('Invalid hash')
    }
  })

  test('Should return the path request file', async () => {
    const pathRequestFile = await createRequestFile(hashContent)
    expect(typeof pathRequestFile).toEqual('string')
    stat(pathRequestFile, (error, stats) => {
      if (error) throw error
      expect(stats.size).toBeGreaterThan(0)
    })
  })
})

describe('signRequestFile', () => {
  test('Basic tests', async () => {
    expect(typeof signRequestFile).toBe('function')
  })

  test('Should return an error - File Request Invalid', async () => {
    try {
      const pathRequestFileInvalid = '/tmp/123123123'
      await signRequestFile(pathRequestFileInvalid, urlTimeStampAuthority)
    } catch (error) {
      expect(error.message).toBe('There was an error fetching file stats')
    }
  })

  test('Should return an error - urlTimestapAuthority is Invalid', async () => {
    try {
      const pathRequestFile = await createRequestFile(hashContent)
      await signRequestFile(pathRequestFile, urlTimeStampAuthorityInvalid)
    } catch (error) {
      expect(error.message).toBe(`curl: (6) Could not resolve host: ${urlTimeStampAuthorityInvalid.replace('https://', '')}`)
    }
  })

  test('Should be return a new file signing', async () => {
    const pathRequestFile = await createRequestFile(hashContent)
    const pathResonseFile = await signRequestFile(pathRequestFile, urlTimeStampAuthority)
    expect(typeof pathResonseFile).toEqual('string')
    stat(pathResonseFile, (error, stats) => {
      if (error) throw error
      expect(stats.size).toBeGreaterThan(0)
    })
  })
})

describe('getTimestampFromResponse', () => {
  test('Basics tests', () => {
    expect(typeof getTimestampFromResponse).toBe('function')
  })
  test('Should return the Timestamp File Response ', async () => {
    const pathRequestFile = await createRequestFile(hashContent)
    const pathResponseFile = await signRequestFile(pathRequestFile, urlTimeStampAuthority)
    const timestamp = await getTimestampFromResponse(pathResponseFile)
    expect(typeof timestamp).toBe('string')
  })
})
