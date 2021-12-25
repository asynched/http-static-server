import http from 'http'

import { lift } from './utils/functional.js'
import StaticFileHandler from './lib/static-file-handler.js'

import { PORT } from './config/index.js'

http
  .createServer(StaticFileHandler.main)
  .listen(PORT, lift(StaticFileHandler.startupCallback, PORT))
