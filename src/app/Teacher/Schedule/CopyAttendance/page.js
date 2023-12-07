"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { LoadingSpin } from "@/utils/LoadingSpin";
import { url, headers } from "@/utils/api";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FaCheck, FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import useConfirmation from "@/utils/ConfirmationHook";
import Modal from "@/utils/Modal";
import { IoMdCloseCircle } from "react-icons/io";
import { FcDataProtection } from "react-icons/fc";
import { SlEnvolopeLetter } from "react-icons/sl";
import useMessageHook from "@/utils/MessageHook";


const Page = () => {
    const { showConfirmation, ConfirmationDialog } = useConfirmation();
    const { showMessage, Message } = useMessageHook();
    const [section, setSection] = useState();
    const [studentProfile, setStudentProfile] = useState();
    const [loading, setLoading] = useState(false);
    const currentPathname = usePathname();
    const [active, setActive] = useState();
    const [viewLetter, setViewLetter] = useState();
    const [idToCopy, setIdToCopy] = useState();

    const searchParams = useSearchParams();
    const attendanceId = searchParams.get("AttendanceId");

    useEffect(() => {
        setActive(currentPathname);
    }, [currentPathname]);

    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    const handleGetStudents = async (sectionName) => {
        try {
            const response = await axios.get(`${url}/api/people/getStudents/${sectionName}`, headers);
            setStudentProfile(response.data)
        } catch (err) {
            showMessage("Something went wrong!")
            console.log(err);
        }
    }

    const handleGetData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/attendance/getAttendanceById/${attendanceId}`, { headers });
            setSection(response.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            showMessage("Something went wrong!");
            console.log(err);
        }
    };

    useEffect(() => {
        if (section) {
            handleGetStudents(section.section);
        }
    }, [section]);


    useEffect(() => {
        handleGetData();
    }, []);


    const handleChangeStatus = (id, studentId, statusIn, statusOut,) => {
        showConfirmation(<div className='grid justify-center gap-4'>
            <div className='bg-green-700 flex items-center text-white gap-4 rounded-t-lg w-full'><FcDataProtection size={32} />Edit Attendance</div>
            <p className='text-xl p-6'>Are you sure you want to change the status?</p>
        </div>, () => {
            handleChangeStatusApi(id, studentId, statusIn, statusOut,)
        });
    };

    const handleChangeStatusApi = async (id, filteredStudent, statusIn, statusOut,) => {
        setLoading(true)
        const letterUrl = filteredStudent.letterUrl
        const letterPublicId = filteredStudent.letterPublicId
        const studentId = filteredStudent.id
        try {
            await axios.put(`${url}/api/attendance/updateStatusOfStudent/${id}`,
                { studentId, statusIn, statusOut, letterUrl, letterPublicId }, headers);
            setLoading(false)
            showMessage(`Successfully updated the status!`)
            handleGetData();
        } catch (error) {
            setLoading(false)
            console.error('An error occurred:', error);
            showMessage("Something went wrong while updating")
        }
    };



    const handleCopyAttendance = (e) => {
        e.preventDefault()
        showConfirmation(
            <div className='grid justify-center gap-4'>
                <div className='bg-green-700 flex items-center text-white gap-4 rounded-t-lg w-full'><FcDataProtection size={32} />Edit Attendance</div>
                <p className='text-xl p-6'>Are you sure you want to copy the attendance from the the code entered?</p>
            </div>, () => {
                handleCopyAttendanceApi()
            });
    };

    const handleCopyAttendanceApi = async () => {
        setLoading(true)
        try {
            await axios.put(`${url}/api/attendance/copyAttendance/${attendanceId}`,
                { code: idToCopy, section: section?.section }, headers);
            setLoading(false)
            showMessage(`Successfully copied the attendance!`)
            handleGetData();
        } catch (error) {
            setLoading(false)
            console.error('An error occurred:', error);
            showMessage(error.response.data.message)
        }
    };

    return (
        <>
            <ConfirmationDialog />
            <Message />
            {loading && <Modal>
                <LoadingSpin loading={loading} />
            </Modal>}
            <div className="border-b-2 px-4 py-4 flex flex-wrap gap-2 w-full border-green-700">
                <p>{section?.date} {section?.time}</p>
                <p>&#40;{section?.section}&#41;</p>
                <p>{section?.event}</p>
                {section && <form className="flex gap-1 items-center" onSubmit={handleCopyAttendance}>
                    <input
                        value={idToCopy}
                        onChange={(e) => setIdToCopy(e.target.value)}
                        placeholder="Enter code"
                        className="border-2 rounded-lg pl-1 border-gray-400" />
                    <button type="submit" className="bg-green-700 rounded-lg px-4 text-white">Copy</button>
                </form>}
            </div>
            <div className="w-full grid gap-1 bg-green-700 py-4 mt-6 mb-20">
                <div className="flex mx-4 font-semibold text-white justify-between">
                    <p className="ml-10">Name</p>
                    <div className="flex gap-2 items-center mr-6">
                        <p>IN</p>
                        <p>OUT</p>
                        <p><SlEnvolopeLetter /></p>
                    </div>
                </div>
                {section?.students.map((student, index) => (
                    <div key={index} className="flex mx-4 rounded-lg text-white hover:bg-green-500 px-6 justify-between">
                        {studentProfile && (studentProfile?.filter((studentes) => studentes.id === student.id)).map((stud, studentIndex) => (
                            <p key={studentIndex}>{stud.firstName} {stud.lastName}</p>
                        ))}
                        <div className="flex gap-2 items-center">
                            {student.statusIn === "present" ?
                                <button onClick={() => handleChangeStatus(attendanceId, student, "absent", student.statusOut)} className="bg-white rounded-full text-green-700 p-1">
                                    <FaCheck size={14} /></button> :
                                <button onClick={() => handleChangeStatus(attendanceId, student, "present", student.statusOut)} className="bg-white rounded-full text-red-700 p-1">
                                    <IoClose size={16} /></button>}
                            {student.statusOut === "present" ?
                                <button onClick={() => handleChangeStatus(attendanceId, student, student.statusIn, "absent")} className="bg-white rounded-full text-green-700 p-1">
                                    <FaCheck size={14} /></button> :
                                <button onClick={() => handleChangeStatus(attendanceId, student, student.statusIn, "present")} className="bg-white rounded-full text-red-700 p-1">
                                    <IoClose size={16} /></button>}
                            {student.letterUrl ? (
                                <button onClick={() => setViewLetter(student.letterUrl)} className="bg-white rounded-full text-blue-700 p-1">
                                    <MdOutlineMailOutline size={14} />
                                </button>
                            ) : (
                                <div className="bg-white rounded-full text-green-700 p-1">
                                    <FaPlus size={14} />
                                </div>
                            )}
                        </div>
                        {viewLetter && (
                            <Modal>
                                <div className="relative w-full h-full">
                                    <button className="absolute rounded-full bg-white text-red-700 -top-2 -right-2" onClick={() => setViewLetter("")}>
                                        <IoMdCloseCircle size={28} style={{ color: 'red' }} />
                                    </button>
                                    <a href={viewLetter} target="_blank">
                                        <img src={viewLetter} height={400} width={400} alt="letter" />
                                    </a>
                                </div>
                            </Modal>
                        )}
                    </div>
                ))
                }
            </div>
            <div className={`fixed bottom-2 flex w-full justify-center`}>
                <div className={`flex justify-between mx-4 ${active === "/Admin" ? "grid gap-2 w-full" : "w-full md:w-1/4"}`}>
                    <button onClick={goBack} className="bg-green-700 text-white px-4 rounded-full">Back</button>
                </div>
            </div>
        </>
    );
};

export default Page;
