// @ts-nocheck
/* eslint-disable no-unused-vars */
import React, {useRef, useEffect, useReducer, useState} from 'react'
import ReactDOM from 'react-dom/client'

import { MidiRecorder } from './MidiRecorder'

ReactDOM.createRoot(document.getElementById('root')).render(
  <div>
    <h1>MIDI???</h1>
    <MidiRecorder/>
  </div>
)
