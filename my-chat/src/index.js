import React from 'react'
import { render } from 'react-dom'
import App from './App'
import config from './config'
import IO from 'socket.io-client'
import { StoreContext } from 'redux-react-hook'
import store from './store'
import 'viewerjs/dist/viewer.css'

const path = config.getCurrentServer()
const socket = IO(path)
render(
  <StoreContext.Provider value={store}>
    <App socket={socket} />
  </StoreContext.Provider>
  , window.root
)
