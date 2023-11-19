import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
    getFullFaceDescription,
    isFaceDetectionModelLoaded,
    isFacialLandmarkDetectionModelLoaded,
    isFeatureExtractionModelLoaded,
    loadModels,
} from "../../app/faceUtil";
import { drawRectAndLabelFace } from "@/utils/drawRectAndLabelFace";
import ModelLoading from "@/utils/ModelLoading";
import ModelLoadStatus from "@/utils/ModelLoadStatus";
import { DEFAULT_WEBCAM_RESOLUTION, inputSize, webcamResolutionType } from "@/globalData";
import TrxDashboard from "./TrxDashboard";


const ProcessFaceRecognition = (props) => {
    const { participants, faceMatcher } = props;
    const webcamRef = useRef();
    const canvasRef = useRef();

    const [selectedWebcam, setSelectedWebcam] = useState();
    const [inputDevices, setInputDevices] = useState([]);
    const [camWidth, setCamWidth] = useState(DEFAULT_WEBCAM_RESOLUTION.width);
    const [camHeight, setCamHeight] = useState(DEFAULT_WEBCAM_RESOLUTION.height);
    const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [loadingMessageError, setLoadingMessageError] = useState("");
    const [fullDesc, setFullDesc] = useState(null);
    const [waitText, setWaitText] = useState("");

    useEffect(() => {
        async function loadingtheModel() {
            await loadModels(setLoadingMessage, setLoadingMessageError);
            setIsAllModelLoaded(true);
        }
        if (
            !!isFaceDetectionModelLoaded() &&
            !!isFacialLandmarkDetectionModelLoaded() &&
            !!isFeatureExtractionModelLoaded()
        ) {
            setIsAllModelLoaded(true);
            return;
        }
        loadingtheModel();
    }, [isAllModelLoaded]);

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(async (devices) => {
            let inputDevice = await devices.filter(
                (device) => device.kind === "videoinput"
            );
            setInputDevices({ ...inputDevices, inputDevice });
        });
    }, []);

    useEffect(() => {
        function capture() {
            if (
                typeof webcamRef.current !== "undefined" &&
                webcamRef.current !== null &&
                webcamRef.current.video.readyState === 4
            ) {
                const videoWidth = webcamRef.current.video.videoWidth;
                const videoHeight = webcamRef.current.video.videoHeight;

                // Set canvas height and width
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;

                // 4. TODO - Make Detections
                // e.g. const obj = await net.detect(video);

                // Draw mesh
                getFullFaceDescription(webcamRef.current.getScreenshot(), inputSize)
                    .then((data) => {
                        setFullDesc(data);
                        setWaitText("");
                    })
                    .catch((err) => {
                        setWaitText(
                            "Preparing face matcher and device setup, please wait..."
                        );
                    });
                const ctx = canvasRef.current.getContext("2d");

                drawRectAndLabelFace(fullDesc, faceMatcher, participants, ctx);

            }
        }

        let interval = setInterval(() => {
            capture();
        }, 700);

        return () => clearInterval(interval);
    });

    const handleSelectWebcam = (value) => {
        setSelectedWebcam(value);
    };

    const handleWebcamResolution = (value) => {
        webcamResolutionType.map((type) => {
            if (value === type.label) {
                setCamWidth(type.width);
                setCamHeight(type.height);
            }
        });
    };

    return (
        <div className="content">
            <div className="card">
                <form>
                    <div className="form-item">
                        <label>Webcam</label>
                        <select
                            className="w-64"
                            defaultValue="Select Webcam"
                            onChange={(e) => handleSelectWebcam(e.target.value)}
                        >
                            {inputDevices?.inputDevice?.map((device) => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-item">
                        <label>Webcam Size</label>
                        <select
                            className="w-32"
                            defaultValue={DEFAULT_WEBCAM_RESOLUTION.label}
                            onChange={(e) => handleWebcamResolution(e.target.value)}
                        >
                            {webcamResolutionType.map((type) => (
                                <option key={type.label} value={type.label}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>



                {!isAllModelLoaded && <ModelLoadStatus errorMessage={loadingMessageError} />}

                {!isAllModelLoaded ? (
                    <ModelLoading loadingMessage={loadingMessage} />
                ) : loadingMessageError ? (
                    <div className="error">{loadingMessageError}</div>
                ) : (
                    <div></div>
                )}

                {isAllModelLoaded && loadingMessageError.length == 0 && (
                    <div className="card takeAttendance__card__webcam">
                        <>
                            <p>{waitText}</p>
                            <div className="flex justify-center items-center">
                                <Webcam
                                    muted={true}
                                    ref={webcamRef}
                                    audio={false}
                                    width={camWidth}
                                    height={camHeight}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{
                                        deviceId: selectedWebcam,
                                    }}
                                    mirrored
                                />
                                <canvas
                                    ref={canvasRef}
                                    style={{
                                        position: "absolute",
                                        textAlign: "center",
                                        zIndex: 8,
                                        width: camWidth,
                                        height: camHeight,
                                    }}
                                />
                            </div>
                        </>
                    </div>
                )}
            </div>
            <TrxDashboard {...props} participants={fullDesc} />
        </div>
    );
};

export default ProcessFaceRecognition