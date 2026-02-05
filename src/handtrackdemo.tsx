import * as handTrack from 'handtrackjs';
import { useEffect, useRef, useState } from 'react';
import { STBRootLayout } from './components/stbkit/stb';
import { RootLayout } from './components/stbkit';
import { Pointer } from 'lucide-react';

const defaultParams = {
    flipHorizontal: true,
    outputStride: 16,
    imageScaleFactor: 1,
    maxNumBoxes: 20,
    iouThreshold: 0.2,
    scoreThreshold: 0.6,
    modelType: "ssd320fpnlite",
    modelSize: "large",
    bboxLineWidth: "2",
    fontSize: 17,
};

export default function HandTrackDemo({ hideInfo }: { hideinfo?: boolean }) {
    const vidref = useRef<HTMLVideoElement>(null)
    const canvasref = useRef<HTMLCanvasElement>(null)
    const [status, setStatus] = useState("loading")
    const [pointer, setPointer] = useState({
        x: 0,
        y: 0,
    })
    // const [model, setModel] = useState("loading")
    useEffect(() => {
        if (!vidref || !canvasref) return
        handTrack.load(defaultParams).then((model) => {
            setStatus("loaded")
            handTrack.startVideo(vidref.current).then(() => {
                var tvstate = true
                var stateToGoTo = true
                var timeSinceStateToGoTo = 0
                var numdet = 0
                setInterval(() => {
                    model.detect(vidref.current).then(predictions => {
                        model.renderPredictions(predictions, canvasref.current, canvasref.current.getContext("2d"), vidref.current)
                        numdet = predictions.length
                        if (numdet != 0 && tvstate == false && stateToGoTo == false) {
                            window.tvPower(true)
                            stateToGoTo = true
                            tvstate = true
                        } else if (numdet == 0 && tvstate == true && stateToGoTo == true) {
                            stateToGoTo = false
                        }
                        if (stateToGoTo != tvstate) {
                            timeSinceStateToGoTo += 100
                        }
                        if (stateToGoTo != tvstate && timeSinceStateToGoTo > 5000) {
                            if (numdet > 0) {
                                stateToGoTo = true
                                timeSinceStateToGoTo = 0
                            } else {
                                stateToGoTo = false
                                timeSinceStateToGoTo = 0
                                tvstate = false
                                window.tvPower(false)
                            }
                        }
                        var hand1 = predictions.find(item => item.label == "open")
                        setPointer({
                            x: hand1.bbox[0],
                            y: hand1.bbox[1]
                        })
                    })
                }, 100)
            })
        })
    }, [])
    return <STBRootLayout className={"hidden"}>
        <div className='bg-white rounded-full h-5 w-5 border-1 border-black z-999 fixed' style={{
            top: pointer.y,
            left: pointer.x,
        }} />
        <video ref={vidref} className='object-contain hidden' />
        <canvas ref={canvasref} className='w-full h-full object-contain' />
    </STBRootLayout>
}