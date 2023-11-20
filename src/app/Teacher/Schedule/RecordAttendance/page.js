"use client"

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { url, headers } from "@/utils/api";
import { createMatcher } from "@/app/faceUtil";
import ProcessFaceRecognition from "@/components/Teacher/ProcessFaceRecognition";
import { useSearchParams } from "next/navigation";
import TrxDashBoard from "@/components/Teacher/TrxDashboard";

const Page = (props) => {
    const [isOn, setIsOn] = useState(true);
    const [detected, setDetected] = useState([]);
    const [active, setActive] = useState()
    const currentPathname = usePathname()
    const searchParams = useSearchParams()
    const attendanceId = searchParams.get('AttendanceId')
    const [profile, setProfile] = useState()
    const router = useRouter()

    useEffect(() => {
        setActive(currentPathname)
    }, [currentPathname])

    const goBack = () => {
        router.back();
    };

    const handleChangeStatusApi = async (studentIds) => {

        try {
            const response = await
                axios.put(`${url}/api/attendance/updateStatusOfStudent/${attendanceId}`,
                    { studentIds, status: "present", }, headers);
            alert("Attendance Saved!")
            console.log(response)
        } catch (error) {
            console.error('An error occurred:', error);
            alert("Something went wrong while updating")
        }
    };

    useEffect(() => {
        if (!isOn) {
            console.log(new Set(detected))
            handleChangeStatusApi(new Set(detected))
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
            // console.log("attendance", response.data);
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
            // console.log("facePhotos", response.data);
            setFaceData(response.data)
        } catch (err) {
            alert("Something went wrong!");
            console.log(err);
        }
    };
    const filteredFacePhotos = faceData?.filter((facePhotos) => (
        attendance?.students?.map((student) => student.id).includes(facePhotos.owner)
    ))

    const resultArray = filteredFacePhotos.reduce((acc, current) => {
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

    // console.log("resultarray", resultArray)

    useEffect(() => {
        handleGetAttendance()
        handleGetFaceData()
    }, [])

    useEffect(() => {
        if (resultArray?.length > 0) {
            const matcher = async () => {
                const profileList = resultArray && await createMatcher(resultArray, .45);
                setFaceMatcher(profileList);
            }
            matcher()
        }
    }, [profile]);





    const removeDuplicate = filteredFacePhotos?.filter((students, index, self) => (
        index === self.findIndex((s) => s.owner === students.owner)
    ));
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
            <div className="mx-auto p-6">
                <div className="mb-8">
                    <div className="flex gap-2">
                        <h4 className="mb-4">Attendance Setting</h4>
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
                    </div>

                </div>
                <div className="grid grid-cols-8">
                    <div className="col-span-2 md:block hidden">
                        <TrxDashBoard {...props} present={detected} participants={profile} />
                    </div>
                    <div className="col-span-8 md:col-span-6">
                        {faceMatcher && profile &&
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