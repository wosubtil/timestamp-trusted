import { exec } from 'child_process'
export const execAsync = async (command: string): Promise => {
  return new Promise((resolve, reject): Promise => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }
      // if (stderr.length) {
      //   reject(stderr.trim())
      //   return
      // }
      resolve(stdout.trim())
    })
  })
}
