import fs from 'fs/promises'
import path from 'path'

import Logger from '../utils/logger.js'
import { monadicHandler } from '../utils/monadic-handler.js'

export default class StaticFileHandler {
  static ROOT_PATH = process.cwd()
  static MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mp3',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/pdf',
    '.ico': 'image/x-icon',
  }

  /**
   * Parses a url
   *
   * Why? Incoming urls might start with _/_ and _/_ only, so it defaults these specific
   * cases to return an _index.html_ file from that path.
   *
   * @param { string } url Url to be parsed
   * @returns { string } parsed url
   */
  static parseUrl(url) {
    if (url.endsWith('/')) {
      return url + 'index.html'
    }

    return url
  }

  /**
   * Gets the mime type for the file path given
   * @param { string } filePath File path to get the mime type from
   * @returns { string } Returns the specific mime type for that file
   */
  static getMimeType(filePath) {
    const { ext: fileExtension } = path.parse(filePath)
    return StaticFileHandler.MIME_TYPES[fileExtension]
  }

  /**
   * Gets a file from a given path in the file system
   * @param { string } url Url of the given file to be accessed
   * @returns { Promise<{ file: string, mimeType: string }> } File info and mime type
   */
  static async getFile(url) {
    const parsedUrl = StaticFileHandler.parseUrl(url)
    const filePath = path.join(StaticFileHandler.ROOT_PATH, parsedUrl)

    await fs.access(filePath)

    const file = await fs.readFile(filePath)
    const mimeType = StaticFileHandler.getMimeType(filePath)

    return {
      file,
      mimeType,
    }
  }

  /**
   * Main handler for HTTP requests
   * @param { import('http').IncomingMessage } request Incoming HTTP request
   * @param { import('http').ServerResponse } response Outgoing HTTP response
   * @returns { void } Does not return anything
   */
  static async main(request, response) {
    Logger.info(request.method, request.url)

    const getFileHandler = monadicHandler({
      target: StaticFileHandler.getFile,
      async: true,
    })

    const [error, data] = await getFileHandler(request.url)

    if (error) {
      Logger.error(request.method, request.url, '404')
      response.statusCode = 404
      response.end()
      return
    }

    const { file, mimeType } = data

    Logger.info(request.method, request.url, '200')

    response.setHeader('Content-Type', mimeType)
    response.write(file)
    response.end()
  }

  /**
   * Startup callback for the HTTP server
   * @param { string | number } port Startup port
   */
  static startupCallback(port) {
    Logger.clear()
    Logger.info(`Server started on port: :${port}`)
  }
}
