const COLORS = {
  BG_BLACK: '\u001b[40m',
  BG_RED: '\u001b[41m',
  BG_GREEN: '\u001b[42m',
  BG_YELLOW: '\u001b[43m',
  BG_BLUE: '\u001b[44m',
  BG_MAGENTA: '\u001b[45m',
  BG_CYAN: '\u001b[46m',
  BG_WHITE: '\u001b[47m',
  FG_BLACK: '\u001b[30m',
  FG_RED: '\u001b[31m',
  FG_GREEN: '\u001b[32m',
  FG_YELLOW: '\u001b[33m',
  FG_BLUE: '\u001b[34m',
  FG_MAGENTA: '\u001b[35m',
  FG_CYAN: '\u001b[36m',
  FG_WHITE: '\u001b[37m',
  RESET: '\u001b[0m',
}

export default class Logger {
  static streams = [process.stdout]

  /**
   * @param { 'INFO' | 'WARNING' | 'ERROR' } level
   * @param { string } message
   */
  static log(level, message) {
    const levelMessage = Logger.getLogLevelMessage(level)

    for (const stream of Logger.streams) {
      stream.write(levelMessage + ' ' + message + '\n')
    }
  }

  static clear() {
    console.clear()
  }

  /**
   * Adds a stream to the logger class to written to
   * @param { import('stream').Writable } stream Stream to add to the logger
   */
  static addStream(stream) {
    Logger.streams.push(stream)
  }

  /**
   * Retuns a log message with a giving level
   * @param { 'INFO' | 'WARNING' | 'ERROR' } level Level of the log message
   * @returns { string } Log message
   */
  static getLogLevelMessage(level) {
    const currentDate = new Date().toISOString()

    switch (level) {
      case 'INFO':
        return `${COLORS.BG_GREEN + COLORS.FG_BLACK} INFORMATION ${
          COLORS.BG_BLACK
        } ${COLORS.FG_GREEN}${currentDate} ${COLORS.RESET}${COLORS.BG_GREEN} ${
          COLORS.RESET
        }`
      case 'WARNING':
        return `${COLORS.BG_YELLOW + COLORS.FG_BLACK} WARNING     ${
          COLORS.BG_BLACK
        } ${COLORS.FG_YELLOW}${currentDate} ${COLORS.RESET}${
          COLORS.BG_YELLOW
        } ${COLORS.RESET}`
      case 'ERROR':
        return `${COLORS.BG_RED + COLORS.FG_BLACK} ERROR       ${
          COLORS.BG_BLACK
        } ${COLORS.FG_RED}${currentDate} ${COLORS.RESET}${COLORS.BG_RED} ${
          COLORS.RESET
        }`
    }
  }

  /**
   * Writes to stdout as an info message
   * @param  {...any} args Args to be logged
   */
  static info(...args) {
    const parsedArgs = args.join(' ')
    Logger.log('INFO', parsedArgs)
  }

  /**
   * Writes to stdout as an error message
   * @param  {...any} args Args to be logged
   */
  static error(...args) {
    const parsedArgs = args.join(' ')
    Logger.log('ERROR', parsedArgs)
  }

  /**
   * Writes to stdout as a warning message
   * @param  {...any} args Args to be logged
   */
  static warning(...args) {
    const parsedArgs = args.join(' ')
    Logger.log('WARNING', parsedArgs)
  }
}
