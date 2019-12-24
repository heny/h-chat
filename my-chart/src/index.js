import React from 'react'
import {render} from 'react-dom'
import App from './App'
import config from './config'
import IO from 'socket.io-client'

const path = config.server[config.mode]
const socket = IO(path)
render(<App socket={socket} />,window.root)
