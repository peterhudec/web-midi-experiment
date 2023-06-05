// @ts-nocheck
import React, {useRef, useState, useEffect} from 'react'
import {Recorder} from '@magenta/music/es6'

import 'html-midi-player'

export const MidiRecorder = () => {
  const playerRef = useRef()
  const pianoRollvisualizerRef = useRef()
  const recorderRef = useRef()
  const [sequence, setSeguence] = useState()
  const [ready, setReady] = useState()
  const [isRecording, setIsRecording] = useState()
  const recorder = recorderRef.current

  useEffect(() => {
    pianoRollvisualizerRef.current.noteSequence = sequence
    playerRef.current.noteSequence = sequence
    playerRef.current.addVisualizer(pianoRollvisualizerRef.current)


    const r = new Recorder(
      {
        // These don't seem to work
        // playClick: true,
        // playCountIn: true,
        startRecordingAtFirstNote: false,
        qpm: 120,
      },
      {
        run: (seq) => {
          playerRef.current.noteSequence = seq
          pianoRollvisualizerRef.current.noteSequence = seq
          setSeguence(seq)
        },
      }
    )

    r.initialize()
      .then(() => setReady(true))

    recorderRef.current = r
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: isRecording && 'tomato',
    }}>
      Recorder
      <div>
        <button
          onClick={() => {
            recorder.start()
            setIsRecording(true)
          }}
          disabled={!ready}
        >
          Start
        </button>
        <button
          onClick={() => {
            recorder.stop()
            setIsRecording(false)
          }}
          disabled={!ready}
        >
          Stop
        </button>
        <button
          onClick={() => recorder.reset()}
          disabled={!ready}
        >
          Clear
        </button>
      </div>
      <midi-visualizer
        type="piano-roll"
        // type="waterfall"
        ref={pianoRollvisualizerRef}
      >
      </midi-visualizer>
      <midi-player ref={playerRef}></midi-player>
      <pre>{JSON.stringify(sequence, null, 2)}</pre>
    </div>
  )
}
