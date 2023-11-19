"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import { url, headers } from "@/utils/api";
import {
  isFaceDetectionModelLoaded,
  isFacialLandmarkDetectionModelLoaded,
  isFeatureExtractionModelLoaded,
  loadModels,
} from "@/app/faceUtil";
import { DEFAULT_UPLOAD_OPTION, UPLOAD_OPTION } from "@/globalData";
import { useSearchParams } from "next/navigation";
import ModelLoadStatus from "@/utils/ModelLoadStatus";
import ModelLoading from "@/utils/ModelLoading";
import { UploadFromDisk } from "@/components/Student/UploadFromDisk";
import { UploadFromWebcam } from "@/components/Student/UploadFromWebCam";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";


const AddFacePhoto = ({ }) => {
  const [selectedUploadOption, setSelectedUploadOption] = useState(DEFAULT_UPLOAD_OPTION);
  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(false);
  const [loadingMessageError, setLoadingMessageError] = useState("");
  const [facePhoto, setFacePhoto] = useState()
  const [faceDesc, setFaceDesc] = useState()
  const [savedImages, setSavedImages] = useState()
  const [profile, setProfile] = useState()
  const searchParams = useSearchParams()
  const currentPathname = usePathname()
  const [active, setActive] = useState()

  useEffect(() => {
    setActive(currentPathname)
  }, [currentPathname])

  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  const studentId = searchParams.get('id')

  const handleSelectUploadOption = (value) => {
    setSelectedUploadOption(value);
  };

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

  const handleGetData = async () => {
    try {
      const response = await axios.get(`${url}/api/people/${studentId}`, { headers });
      setProfile(response.data)
    } catch (err) {
      alert("Something went wrong!")
      console.log(err);
    }
  }

  const handleGetStudentFacePhotos = async () => {
    try {
      const response = await axios.get(`${url}/api/facePhotos/${studentId}`, { headers });
      setSavedImages(response.data)
    } catch (err) {
      alert("Something went wrong!")
      console.log(err);
    }
  }

  const handleDeleteStudentFacePhotos = async (photo, index) => {
    setDeleting(!deleting)
    setDeletingIndex(index)
    try {
      const response = await axios.put(`${url}/api/facePhotos/deleteFacePhoto/${photo.id}`,
        { photoPublicId: photo.photoPublicId }, { headers });
      alert("Deleted successfully!")
      handleGetStudentFacePhotos()
      setDeleting(false)
    } catch (err) {
      alert("Something went wrong!")
      setDeleting(!deleting)
      console.log(err);
    }
  }

  const handleUploadFacePhoto = async () => {
    setLoading(!loading)
    try {
      const response = await axios.post(`${url}/api/facePhotos`,
        { owner: studentId, facePhoto: facePhoto, faceDescriptor: faceDesc.toString() }, headers);
      handleGetStudentFacePhotos()
      alert(`Successfully uploaded!`)
      setSuccess(!success)
      setLoading(false)
    } catch (error) {
      setLoading(!loading)
      console.error('An error occurred:', error);
      alert("Something went wrong while uploading")
    }
    // console.log(studentId, facePhoto, faceDesc.toString())
  }


  useEffect(() => {
    handleGetData()
    handleGetStudentFacePhotos()
  }, [])


  return (
    <div className="p-4 text-green-700">
      <div className="border-b-2 w-full border-green-700">
        <p className="my-2 text-green-700 text-lg ml-4">{profile?.firstName} {profile?.lastName} &#40;{profile?.section}&#41;</p>
      </div>
      <div className="grid grid-cols-4">
        {/* <button className="bg-green-700 text-white px-4" onClick={handleGetStudentFacePhotos}>Get Images</button> */}
        <div className="col-span-1 hidden md:grid gap-4 justify-center m-2">
          {facePhoto &&
            <div className="grid justify-center">
              <p>Upcoming Image:</p>
              < Image
                alt="Face"
                width={120}
                height={120}
                src={facePhoto && facePhoto}
              /> </div>
          }
          {savedImages && (
            <div>
              <p>Saved Images:</p>
              {savedImages.map((photo, index) => (
                <div key={index} className="grid gap-1 my-2 h-max justify-center">
                  <Image src={photo.photoUrl} height={150} width={150} alt={index} />
                  <button
                    className="bg-red-700 text-white text-center w-full"
                    onClick={() => handleDeleteStudentFacePhotos(photo, index)}
                  >
                    {deleting && deletingIndex === index ? "Deleting" : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}


        </div>
        <div className={`${!savedImages && !facePhoto ? "col-span-4 grid" : "col-span-4 grid md:col-span-3"}  h-max justify-center items-center gap-4`}>
          <div className="m-2 flex gap-4">
            <label className="">Upload Image Option:</label>
            <select
              defaultValue={DEFAULT_UPLOAD_OPTION}
              value={selectedUploadOption}
              className="border-green-700 rounded-lg border-2"
              onChange={(e) => handleSelectUploadOption(e.target.value)}
            >
              {UPLOAD_OPTION.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>
          <div>
            {!isAllModelLoaded && <div className="bg-white p-4 rounded-md">
              <> <h2 className="text-xl font-semibold mb-4">Please wait...</h2>
                <ModelLoadStatus errorMessage={loadingMessageError} />
              </>
            </div>}
            <br />
            {!isAllModelLoaded ? (
              <ModelLoading loadingMessage={loadingMessage} />
            ) : loadingMessageError ? (
              <div className="error">{loadingMessageError}</div>
            ) : (
              isAllModelLoaded &&
              loadingMessageError.length === 0 && (
                <div>
                  {selectedUploadOption === "From Webcam" ? (
                    <UploadFromWebcam
                      setFacePhoto={setFacePhoto}
                      handleUploadFacePhoto={handleUploadFacePhoto}
                      setFaceDesc={setFaceDesc}
                      loading={loading}
                      success={success}
                      handleSelectUploadOption={handleSelectUploadOption}
                    />
                  ) : (
                    <UploadFromDisk
                      setFacePhoto={setFacePhoto}
                      handleUploadFacePhoto={handleUploadFacePhoto}
                      setFaceDesc={setFaceDesc}
                      loading={loading}
                      success={success}
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <div className={`fixed bottom-2 flex w-full justify-center`}>
          <div className={`flex justify-between mx-4 ${active === "/Admin" ? "grid gap-2 w-full" : "w-full md:w-1/4"}`}>
            <button onClick={goBack} className="bg-green-700 text-white px-4 rounded-full" >Back</button>
          </div>
        </div>
        <div className="col-span-4 md:hidden grid gap-4 justify-center m-4">
          {facePhoto &&
            <div className="grid justify-center">
              <p>Upcoming Image:</p>
              < Image
                alt="Face"
                width={120}
                height={120}
                src={facePhoto && facePhoto[0].preview}
              /> </div>
          }
          <p>Saved Images:</p>
          {savedImages?.map((photo, index) =>
            <div key={index} className="grid gap-1 h-max justify-center">
              <Image src={photo.photoUrl} height={150} width={150} alt={index} />
              <button className="bg-red-700 text-white text-center w-full"
                onClick={() => handleDeleteStudentFacePhotos(photo, index)}>
                {deleting && deletingIndex === index ? "Deleting" : "Delete"}</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AddFacePhoto;
