import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { getFullFaceDescription } from "../../app/faceUtil";
import {
    DEFAULT_WEBCAM_RESOLUTION,
    inputSize,
    webcamResolutionType,
} from "@/globalData";
import { drawFaceRect } from "@/utils/drawFaceRect";


export const UploadFromWebcam = ({ setFacePhoto, setFaceDesc, handleUploadFacePhoto, loading, handleSelectUploadOption }) => {
    const [camWidth, setCamWidth] = useState(DEFAULT_WEBCAM_RESOLUTION.width);
    const [camHeight, setCamHeight] = useState(DEFAULT_WEBCAM_RESOLUTION.height);
    const [inputDevices, setInputDevices] = useState([]);
    const [selectedWebcam, setSelectedWebcam] = useState();

    const [fullDesc, setFullDesc] = useState(null);
    const [faceDescriptor, setFaceDescriptor] = useState([]);

    const [previewImage, setPreviewImage] = useState("");
    const [waitText, setWaitText] = useState("");

    const webcamRef = useRef();
    const canvasRef = useRef();

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

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(async (devices) => {
            let inputDevice = devices.filter(
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
                setPreviewImage(webcamRef.current.getScreenshot());
                setFacePhoto(webcamRef.current.getScreenshot())
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
                        setFaceDescriptor(data[0]?.descriptor);
                        setFaceDesc(data[0]?.descriptor)
                        setWaitText("");
                    })
                    .catch((err) => {
                        setWaitText(
                            "Preparing the device, please wait..."
                        );
                    });
                const ctx = canvasRef.current.getContext("2d");

                drawFaceRect(fullDesc, ctx);
            }
        }

        let interval = setInterval(() => {
            capture();
        }, 700);

        return () => clearInterval(interval);
    });

    const handleCancel = () => {
        handleSelectUploadOption("From Disk")
        setFacePhoto("")
    }

    const handleSubmit = () => {
        handleUploadFacePhoto()
    }

    return (
        <div className="bg-gray-100 px-6">
            <div className="">
                <p className="text-lg">{waitText}</p>
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
                    />
                    <canvas
                        ref={canvasRef}
                        className="absolute text-center z-8"
                        style={{
                            width: camWidth,
                            height: camHeight,
                        }}
                    />
                </div>
                {previewImage && (
                    <div className="flex justify-center gap-2 items-center mt-4">
                        <div className="mt-2">
                            <button
                                className={`bg-green-700 w-32 text-white px-4 py-2 rounded-md`}
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="mt-2">
                            {fullDesc && <button
                                className={`bg-green-700 w-32 text-white px-4 py-2 rounded-md`}
                                onClick={handleSubmit}
                                disabled={(fullDesc && fullDesc.length !== 1) ||
                                    (faceDescriptor && faceDescriptor.length !== 128)
                                }
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>}
                        </div>
                    </div>
                )}
                <div className="mt-4">
                    <p>
                        Number of detection: {fullDesc ? fullDesc.length : 0}{" "}
                        {fullDesc && fullDesc.length > 1 && (
                            <span className="text-red-500">Cannot be more than 2</span>
                        )}
                    </p>
                    {/* <p>Face Descriptors:</p>
                    {fullDesc &&
                        fullDesc.map((desc, index) => (
                            <div
                                key={index}
                                className="break-all mb-2 bg-lightblue p-2 rounded-md"
                            >
                                <strong className="text-red-500">Face #{index}:</strong>{" "}
                                {desc.descriptor.toString()}
                            </div>
                        ))} */}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Webcam Size:</label>
                    <select
                        defaultValue={DEFAULT_WEBCAM_RESOLUTION.label}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={handleWebcamResolution}
                    >
                        {webcamResolutionType.map((type) => (
                            <option key={type.label} value={type.label}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
                {inputDevices && <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Webcam:</label>
                    <select
                        defaultValue="Select Webcam"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={handleSelectWebcam}
                    >
                        {inputDevices?.inputDevice?.map((device) => (
                            <option key={device.deviceId} value={device.deviceId}>
                                {device.label}
                            </option>
                        ))}
                    </select>
                </div>}
            </div>
        </div>
    );
};
