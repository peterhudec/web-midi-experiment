// @ts-nocheck
/* eslint-disable no-unused-vars */
import React, {useRef, useEffect, useReducer, useState} from 'react'
import ReactDOM from 'react-dom/client'
import { WebMidi } from 'webmidi';

window.wm = WebMidi
window.WebMidi = WebMidi

import 'html-midi-player'

const TWINKLE_TWINKLE = {
  tempos: [{
    qpm: 123,
  }],
  notes: [
    {pitch: 60, startTime: 0.0, endTime: 0.5},
    {pitch: 60, startTime: 0.5, endTime: 1.0},
    {pitch: 67, startTime: 1.0, endTime: 1.5},
    {pitch: 67, startTime: 1.5, endTime: 2.0},
    {pitch: 69, startTime: 2.0, endTime: 2.5},
    {pitch: 69, startTime: 2.5, endTime: 3.0},
    {pitch: 67, startTime: 3.0, endTime: 4.0},
    {pitch: 65, startTime: 4.0, endTime: 4.5},
    {pitch: 65, startTime: 4.5, endTime: 5.0},
    {pitch: 64, startTime: 5.0, endTime: 5.5},
    {pitch: 64, startTime: 5.5, endTime: 6.0},
    {pitch: 62, startTime: 6.0, endTime: 6.5},
    {pitch: 62, startTime: 6.5, endTime: 7.0},
    {pitch: 60, startTime: 7.0, endTime: 8.0},
  ],
  totalTime: 8
};

const CHROMATIC = {
  notes: [
    {pitch: 60, quantizedStartStep: 0, quantizedEndStep: 1},
    {pitch: 61, quantizedStartStep: 1, quantizedEndStep: 2},
    {pitch: 62, quantizedStartStep: 2, quantizedEndStep: 3},
  ],
  quantizationInfo: {stepsPerQuarter: 1},
  tempos: [{time: 0, qpm: 60}],
  totalQuantizedSteps: 4,
};


const useOnMount = (callback) => {
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) {
      callback()
      ref.current = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

const getMidiInputs = async () => {
  const {inputs} = await navigator.requestMIDIAccess()
  return Object.fromEntries(
    [...inputs.entries()]
    .map(([, input]) => [input.name, input])
  )
}

const reducer = (state, action) => {
  return state
}

export const MidiPlayer1 = ({sequence}) => {
  const [midiInputs, setMidiInputs] = useState([])
  const [midiInput, setMidiInput] = useState()
  const playerRef = useRef()
  const pianoRollvisualizerRef = useRef()
  const staffVisualizerRef = useRef()

  useOnMount(async () => {
    const midiInputs = await getMidiInputs()
    console.log({midiInputs})
    setMidiInputs(midiInputs)
  })

  useEffect(() => {
    if (playerRef.current) {
      pianoRollvisualizerRef.current.noteSequence = sequence
      staffVisualizerRef.current.noteSequence = sequence
      playerRef.current.noteSequence = sequence
      playerRef.current.addVisualizer(pianoRollvisualizerRef.current)
      playerRef.current.addVisualizer(staffVisualizerRef.current)
    }
  }, [playerRef, pianoRollvisualizerRef, sequence])

  useEffect(() => {
    if (midiInput) {
      console.log('subscribe', midiInput.name)
      // midiInput.onmidimessage = ({data}) =>

      return () => {
        console.log('unsubscribe', midiInput.name)
        delete midiInput.onmidimessage
      }
    }
  }, [midiInput])

  return (
    <>
      <select onChange={e => setMidiInput(midiInputs[e.target.value])}>
        {Object.entries(midiInputs).map(([name, {id}]) =>
          <option key={id} value={name}>{name}</option>
        )}
      </select>
      <midi-visualizer
        type="piano-roll"
        ref={pianoRollvisualizerRef}
      >
      </midi-visualizer>
      <midi-visualizer
        type="staff"
        ref={staffVisualizerRef}
      >
      </midi-visualizer>
      <midi-player ref={playerRef}></midi-player>
    </>
  )
}
