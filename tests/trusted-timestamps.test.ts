import { createFileRequest } from '../src/trusted-timestamps'
import crypto from 'crypto'
import { stat } from 'fs'

describe('createFileRequest', () => {
  test('Smoke tests', () => {
    expect(typeof createFileRequest).toEqual('function')
  })

  test('Passing hash invalid', async () => {
    const hashFake = 'da39a3ee5e6b4b0d3255bfef95601890afd8070'
    await expect(createFileRequest(hashFake)).rejects.toThrow(Error)
  })

  test('Should be return a path request files', async () => {
    const rawContent = 'Hello'
    const hashContent = crypto.createHash('sha256').update(rawContent).digest('hex')
    const pathFileRequest = await createFileRequest(hashContent)
    expect(typeof pathFileRequest).toEqual('string')
    stat(pathFileRequest, (error, stats) => {
      if (error) throw error
      expect(stats.size).toBeGreaterThan(0)
    })
  })
})
