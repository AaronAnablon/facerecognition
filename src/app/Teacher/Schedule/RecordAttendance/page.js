"use client"

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { url, headers } from "@/utils/api";
import { createMatcher } from "@/app/faceUtil";
import ProcessFaceRecognition from "@/components/Teacher/ProcessFaceRecognition";
import { useSearchParams } from "next/navigation";
import TrxDashBoard from "@/components/Teacher/TrxDashboard";
import Modal from "@/utils/Modal";

const Page = (props) => {
    const [isOn, setIsOn] = useState(true);
    const [detected, setDetected] = useState([]);
    const [active, setActive] = useState()
    const currentPathname = usePathname()
    const searchParams = useSearchParams()
    const attendanceId = searchParams.get('AttendanceId')
    const [profile, setProfile] = useState()
    const router = useRouter()
    const [status, setStatus] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setActive(currentPathname)
    }, [currentPathname])

    const goBack = () => {
        router.back();
    };

    const handleChangeStatusApi = async (studentIds, status) => {
        setLoading(!loading)
        try {
            const response = await
                axios.put(`${url}/api/attendance/updateStatusOfStudents/${attendanceId}`,
                    { studentIds, status }, headers);
            alert("Attendance Saved!")
            setLoading(false)
        } catch (error) {
            console.error('An error occurred:', error);
            setLoading(!loading)
            alert("Something went wrong while updating")
        }
    };

    useEffect(() => {
        if (!isOn) {
            const studentIds = new Set(detected)
            const ArrayOfStudentIds = Array.from(studentIds)
            handleChangeStatusApi(ArrayOfStudentIds, status ? true : false)
        }
    }, [isOn])

    const handleIsOnChange = (value) => {
        setIsOn(value);
    };

    const [faceMatcher, setFaceMatcher] = useState([]);
    const [attendance, setAttendance] = useState();
    const [faceData, setFaceData] = useState([]);

    const handleGetAttendance = async () => {
        try {
            const response = await axios.get(`${url}/api/attendance/getAttendanceById/${attendanceId}`, { headers });
            setAttendance(response.data);
        } catch (err) {
            alert("Something went wrong!");
            console.log(err);
        }
    };

    const handeGetProfile = async () => {
        try {
            const response = await axios.get(`${url}/api/people/getStudents/${attendance.section}`, { headers });
            // console.log("profile", response)
            setProfile(response.data)
        } catch (err) {
            alert("Something went wrong!");
            console.log(err);
        }
    };

    useEffect(() => {
        attendance?.section && handeGetProfile()
    }, [attendance])

    const handleGetFaceData = async () => {
        try {
            const response = await axios.get(`${url}/api/facePhotos`, { headers });
            setFaceData(response.data)
        } catch (err) {
            alert("Something went wrong!");
            console.log(err);
        }
    };
    const filteredFacePhotos = faceData && faceData.filter((facePhotos) => (
        attendance?.students?.map((student) => student.id).includes(facePhotos.owner)
    ))

    const resultArray = profile && filteredFacePhotos && filteredFacePhotos.reduce((acc, current) => {
        const existingOwner = acc.find(item => item.owner === current.owner);

        if (existingOwner) {
            // If owner exists, add to the existing owner's array
            existingOwner.photos.push({
                photoUrl: current.photoUrl,
                photoPublicId: current.photoPublicId,
                faceDescriptor: current.faceDescriptor,
            });
        } else {
            // If owner doesn't exist, create a new entry
            acc.push({
                owner: current.owner,
                photos: [{
                    photoUrl: current.photoUrl,
                    photoPublicId: current.photoPublicId,
                    faceDescriptor: current.faceDescriptor,
                }],
            });
        }

        return acc;
    }, []);
    

    useEffect(() => {
        if (resultArray?.length > 0) {
            const matcher = async () => {
                const profileList = resultArray && await createMatcher(resultArray, .45);
                setFaceMatcher(profileList);
            }
            matcher()
        }
    }, [profile]);


    useEffect(() => {
        handleGetAttendance()
        handleGetFaceData()
    }, [])

   

    return (
        <div className="">
            <div className="flex bg-green-700 px-6 text-white gap-2">
                <h2 className="font-bold text-lg">Attdendance Details:</h2>
                <div className="flex font-semibold text-lg gap-4 ml-4">
                    <p>{attendance?.date} {attendance?.time}</p>
                    <p>&#40;{attendance?.section}&#41;</p>
                    <p>{attendance?.event}</p>
                </div>
            </div>
            {loading && <Modal>
                <p>Saving the recorded attendance! Please wait...</p>
            </Modal>}
            <div className="mx-auto py-1 mb-20">
                <div className="mb-4">
                    <div className="flex items-center bg-green-700 px-4 py-2 text-white gap-2">
                        <h4 className="">Attendance Setting</h4>
                        <form>
                            <div className="">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleIsOnChange(e.target.checked)}
                                        checked={isOn}
                                        className="mr-2"
                                    />
                                    {isOn
                                        ? " (Open)"
                                        : " (Closed)"}
                                </div>
                            </div>
                        </form>
                        <div className={`flex relative rounded-full h-max py-1 text-white bg-gray-200 border-2 border-gray-400 w-24 ${status ? "justify-start" : "justify-end"}`}>
                            <div className="absolute text-green-700 left-4">IN</div>
                            <button className={`bg-green-700 w-11 mx-1 px-1 rounded-full z-10`}
                                onClick={() => setStatus(!status)}>{status ? "IN" : "OUT"}</button>
                            <div className="absolute text-green-700 right-2">OUT</div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-8">
                    <div className="col-span-2 md:block hidden">
                        <TrxDashBoard {...props} present={detected} participants={profile} />
                    </div>
                    <div className="col-span-8 md:col-span-6">
                        {resultArray && faceMatcher && profile &&
                            isOn && (
                                <ProcessFaceRecognition
                                    {...props}
                                    faceMatcher={faceMatcher}
                                    participants={profile}
                                    setDetected={setDetected}
                                />
                            )}
                    </div>
                    <div className="col-span-8 block md:hidden">
                        <TrxDashBoard {...props} present={detected} participants={profile} />
                    </div>
                </div>
            </div>
            <div className={`fixed bottom-2 flex w-full justify-center`}>
                <div className={`flex justify-between mx-4 ${active === "/Teacher" ? "grid gap-2 w-full" : "w-full md:w-1/4"}`}>
                    <button onClick={goBack} className="bg-green-700 text-white px-4 rounded-full" >Back</button>
                </div>
            </div>
        </div>
    );
};

Page.displayName = 'AttendnaceRoom';


export default Page;