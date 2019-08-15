import { createRequestFile } from '../src/trusted-timestamps'
import crypto from 'crypto'
import { stat } from 'fs'

describe('createRequestFile', () => {
  test('Smoke tests', () => {
    expect(typeof createRequestFile).toEqual('function')
  })

  test('Passing hash invalid', async () => {
    const hashFake = 'da39a3ee5e6b4b0d3255bfef95601890afd8070'
    await expect(createRequestFile(hashFake)).rejects.toThrow(Error)
  })

  test('Should be return a path request files', async () => {
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
