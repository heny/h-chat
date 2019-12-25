import React from 'react'
import {render} from 'react-dom'
import App from './App'
import config from './config'
import IO from 'socket.io-client'

const path = config.getCurrentServer()
const socket = IO(path)
render(<App socket={socket} />,window.root)
