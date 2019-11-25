import React from 'react'
import {render} from 'react-dom'
import App from './App'
import IO from 'socket.io-client'
const socket = IO('ws://39.107.82.176:3006')
render(<App socket={socket} />,window.root)