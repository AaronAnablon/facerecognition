import React, { useEffect, useState } from "react";
import { getFullFaceDescription } from "../../app/faceUtil";
import { inputSize } from "@/globalData";
import Image from "next/image";
import useMessageHook from "@/utils/MessageHook";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export const UploadFromDisk = ({ setFacePhoto, setFaceDesc, handleUploadFacePhoto, loading, success }) => {
  const { showMessage, Message } = useMessageHook();
  const [fullDesc, setFullDesc] = useState([]);
  const [faceDescriptor, setFaceDescriptor] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [isRunningFaceDetector, setIsRunningFaceDetector] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);
  const [fileList, setFileList] = useState([]);

  const handleChange = async (fileList) => {
    if (fileList.length === 0) {
      setFaceDescriptor([]);
      setDetectionCount(0);
      setFileList([]);
      return;
    }

    if (!fileList[0].url && !fileList[0].preview) {
      if (/\.(jpe?g|png)$/i.test(fileList[0].name) === false) {
        showMessage("Not an image file (only JPG/PNG accepted)!");
        return;
      }
      fileList[0].preview = await getBase64(fileList[0]);
    }
    setPreviewImage(fileList[0].url || fileList[0].preview);
    setFileList(fileList);
    setFacePhoto(fileList[0].preview)


    if (fileList[0].preview.length > 0) {
      setIsRunningFaceDetector(true);
      await getFullFaceDescription(fileList[0].preview, inputSize).then(
        (data) => {
          setFullDesc(data);
          setDetectionCount(data.length);
          setFaceDescriptor(data[0]?.descriptor);
          setFaceDesc(data[0]?.descriptor)
          setIsRunningFaceDetector(false);
        }
      );
    }
  };

  const handleSubmit = () => {
    handleUploadFacePhoto()
  }


  const handleCancel = () => {
    setPreviewImage(!previewImage)
    setFacePhoto("")
    setFileList([])
  }

  return (
    <>
      <Message />
      <div className="flex items-center justify-center">
        <div className="">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleChange(e.target.files)}
              accept="image/png,image/jpeg"
            />
            <div className="group">
              <div className="border-4 border-dashed border-gray-200 rounded-lg cursor-pointer">
                {fileList.length >= 1 ? null : (
                  <div className="p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-8 h-8 text-gray-600 mx-auto"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Upload</p>
                  </div>
                )}
              </div>
            </div>
          </label>
        </div>
        {previewImage &&
          <div className="flex flex-col items-center justify-center">
            <Image
              alt="example"
              width={300}
              height={300}
              src={previewImage}
            />
            <div className="flex gap-4">
              <button
                className="bg-green-700 w-32 hover:bg-green-900 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handleCancel}
              >
                Cancel
              </button>
              {fullDesc && <button
                type="button"
                className="bg-green-700 w-32 hover:bg-green-900 text-white font-bold py-2 px-4 rounded mt-4"
                disabled={
                  previewImage.length === 0 ||
                  (detectionCount !== 1 ||
                    faceDescriptor.length !== 128)
                }
                onClick={handleSubmit}
              >
                {loading ? "Saving..." : "Save"}
              </button>}
            </div>
            <div>
              {detectionCount > 1 && (
                <span className="showMessage">Only single face allowed</span>
              )}
              {detectionCount === 0 && (
                <span className="showMessage">No face detected</span>
              )}
              <p>
                Number of detection:{" "}
                {isRunningFaceDetector ? (
                  <>
                    Detecting face... <span className="animate-spin">⚙️</span>
                  </>
                ) : (
                  detectionCount
                )}
              </p>
              {/* Face Descriptor{" "}
        {detectionCount === 0 && !isRunningFaceDetector && <span>Empty</span>}
        {isRunningFaceDetector && (
          <>
            Generating 128 measurements...{" "}
            <span className="animate-spin">⚙️</span>
          </>
        )}
         <br />
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
          </div>}
      </div >

    </>
  );
};
