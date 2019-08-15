import { createRequestFile, signRequestFile } from '../src/trusted-timestamps'
import crypto from 'crypto'
import { stat } from 'fs'
jest.setTimeout(15000)
const urlTimeStampAuthority = 'https://freetsa.org/tsr'

describe('createRequestFile', () => {
  test('Smoke tests', () => {
    expect(typeof createRequestFile).toEqual('function')
  })

  test('Passing hash invalid', async () => {
    const hashFake = 'da39a3ee5e6b4b0d3255bfef95601890afd8070'
    await expect(createRequestFile(hashFake)).rejects.toThrow(Error)
  })

  test('Should be return a path request file', async () => {
    const rawContent = 'Hello'
    const hashContent = crypto.createHash('sha256').update(rawContent).digest('hex')
    const pathFileRequest = await createRequestFile(hashContent)
    expect(typeof pathFileRequest).toEqual('string')
    stat(pathFileRequest, (error, stats) => {
      if (error) throw error
      expect(stats.size).toBeGreaterThan(0)
    })
  })
})

describe('signRequestFile', () => {
  test('Basic tests', async () => {
    expect(typeof signRequestFile).toBe('function')
  })

  test('Should be return error - File Request Invalid', async () => {
    const pathFileRequestInvalid = '/tmp/123123123'
    expect(signRequestFile(pathFileRequestInvalid, urlTimeStampAuthority)).rejects.toThrow(Error)
  })

  test('Should be return a new file signing', async () => {
    const rawContent = 'Hello'
    const hashContent = crypto.createHash('sha256').update(rawContent).digest('hex')
    const pathFileRequest = await createRequestFile(hashContent)
    const pathResonseFile = await signRequestFile(pathFileRequest, urlTimeStampAuthority)
    expect(typeof pathResonseFile).toEqual('string')
    stat(pathResonseFile, (error, stats) => {
      if (error) throw error
      expect(stats.size).toBeGreaterThan(0)
    })
  })
})
