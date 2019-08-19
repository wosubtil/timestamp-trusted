import { exec } from 'child_process'
import { stat } from 'fs'
import { promisify } from 'util'
import { CustomError } from './custom-error'

export const execAsync = async (command: string): Promise<string> => {
  return new Promise((resolve, reject): void => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        if (stderr.length) {
          reject(new CustomError(stderr.trim()))
          return
        }
        reject(error)
        return
      }
      if (stderr.length) {
        if (stderr.trim() === 'Using configuration from /etc/pki/tls/openssl.cnf') {
          resolve(stdout.trim())
          return
        }
        reject(new CustomError(stderr.trim()))
      }
      resolve(stdout.trim())
    })
  })
}

export const getFileStats = async (pathFile: string): Promise<Stats> => {
  try {
    const statAsync = promisify(stat)
    const fileStats = await statAsync(pathFile)
    return fileStats
  } catch (error) {
    throw new CustomError('There was an error fetching file stats')
  }
}

interface Stats {
  dev: number;
  mode: number;
  nlink: number;
  uid: number;
  gid: number;
  rdev: number;
  blksize: number;
  ino: number;
  size: number;
  blocks: number;
  atimeMs: number;
  mtimeMs: number;
  ctimeMs: number;
  birthtimeMs: number;
  atime: Date;
  mtime: Date;
  ctime: Date;
  birthtime: Date;
}
