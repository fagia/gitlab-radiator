import {basicAuth} from './auth'
import compression from 'compression'
import {config} from './config'
import express from 'express'
import http from 'http'
import socketIo from 'socket.io'
import {update} from './gitlab'

const app = express()
const httpServer = http.Server(app)
const socketIoServer = socketIo(httpServer)

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  const {bindDevAssets} = require('./dev-assets')
  bindDevAssets(app)
}

app.disable('x-powered-by')
app.use(compression())
app.use(basicAuth(config.auth))
app.use(express.static(`${__dirname}/../public`))

httpServer.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port *:${config.port}`)
})

const globalState = {
  projects: null,
  error: null,
  zoom: config.zoom,
  projectsOrder: config.projectsOrder,
  columns: config.columns,
  baseUrl: config.gitlab.url
}

socketIoServer.on('connection', (socket) => {
  socket.emit('state', withOptionalHeader(withDate(globalState)))
})

setInterval(async () => {
  try {
    globalState.projects = await update(config)
    globalState.error = null
    socketIoServer.emit('state', withDate(globalState))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message)
    globalState.error = `Failed to communicate with GitLab API: ${error.message}`
    socketIoServer.emit('state', withDate(globalState))
  }
}, config.interval)

function withDate(state) {
  return {
    ...state,
    now: Date.now()
  }
}

function withOptionalHeader(state) {
  if (!!config.header) {
    return {
      header: config.header,
      ...state
    }
  } else {
    return state
  }
}