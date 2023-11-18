"use client"

import Layout from "@/app/Admin/Layout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { LoadingSpin } from "@/utils/LoadingSpin";
import { url, headers } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import useConfirmation from "@/utils/ConfirmationHook";
import { FcDataProtection } from "react-icons/fc";
import { FaCheck, FaPlus } from "react-icons/fa";
import Modal from "@/utils/Modal";
import Image from "next/image";
import { MdOutlineMailOutline } from "react-icons/md";
import SelectImage from "@/components/SelectImage";
import { IoMdCloseCircle } from "react-icons/io";

const Page = () => {
    const { showConfirmation, ConfirmationDialog } = useConfirmation();
    const [viewLetter, setViewLetter] = useState(false)
    const [uploadLetter, setUploadLetter] = useState(false)
    const [schedule, setSchedule] = useState()
    const [student, setStudent] = useState()
    const [loading, setLoading] = useState(false)
    const currentPathname = usePathname()
    const [active, setActive] = useState()

    useEffect(() => {
        setActive(currentPathname)
    }, [currentPathname])

    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    const searchParams = useSearchParams()
    const studentId = searchParams.get('id')

    const handleGetStudent = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${url}/api/people/${studentId}`, { headers });
            setStudent(response.data)
            setLoading(false)
        } catch (err) {
            alert("Something went wrong!")
            console.log(err);
            setLoading(false)
        }
    }


    const handleGetData = async (sectionName) => {
        setLoading(true)
        try {
            const response = await axios.get(`${url}/api/attendance/getStudents/${sectionName}`, headers);
            setSchedule(response.data)
            setLoading(false)
        } catch (err) {
            alert("Something went wrong!")
            console.log(err);
            setLoading(false)
        }
    }

    useEffect(() => {
        if (student) {
            handleGetData(student.section)
        }
    }, [student])

    useEffect(() => {
        handleGetStudent()
    }, [])

    const groupByDay = () => {
        const groupedByDay = {};
        schedule?.forEach((item) => {
            const day = new Date(item.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            if (!groupedByDay[day]) {
                groupedByDay[day] = [];
            }
            groupedByDay[day].push(item);
        });

        return groupedByDay;
    };
    const groupedSchedule = groupByDay(schedule);

    const handleChangeStatus = (id, studentId, value) => {
        showConfirmation(<div className='grid justify-center gap-4'>
            <div className='bg-green-700 flex items-center text-white gap-4 rounded-t-lg w-full'><FcDataProtection size={32} />Delete Schedule</div>
            <p className='text-xl p-6'>Are you sure you want to change the status to {value}?</p>
        </div>, () => {
            handleChangeStatusApi(id, studentId, value)
        });
    };


    const handleChangeStatusApi = async (id, filteredStudent, value) => {
        const letterUrl = filteredStudent.letterUrl
        const letterPublicId = filteredStudent.letterPublicId
        const status = value
        try {
            const response = await
                axios.put(`${url}/api/attendance/updateStatusOfStudent/${id}`,
                    { studentId: filteredStudent.id, status, letterUrl, letterPublicId }, headers);
            handleGetStudent()
            alert(`Successfully updated status to ${value}!`)
        } catch (error) {
            console.error('An error occurred:', error);
            alert("Something went wrong while updating")
        }
    };

    const handleUploadLetter = async (id, filteredStudent) => {
        const letterUrl = ""
        const letterPublicId = ""
        const status = filteredStudent.status
        try {
            const response = await
                axios.put(`${url}/api/attendance/updateStatusOfStudent/${id}`,
                    { studentId: filteredStudent.id, status, letterUrl, letterPublicId }, headers);
            handleGetStudent()
            alert(`Successfully uploaded the letter!`)
        } catch (error) {
            console.error('An error occurred:', error);
            alert("Something went wrong while uploading")
        }
    };


    return (
        <>
            <ConfirmationDialog />

            <div className="w-full mb-4 text-green-700 border-green-700 border-b-2 flex justify-between">
                <div className="pl-4 p-2 text-lg">{student?.firstName} {student?.lastName}</div>
                <Link className="pl-4 p-2 text-lg" href={`StudentAttendance/AddFacePhoto?id=${studentId}`}>Upload Profile</Link>
            </div>
            <div className="w-full flex justify-center gap-4">
                {loading && <LoadingSpin loading={loading} />}
                <div className="grid gap-4 w-full mx-4">
                    {Object.keys(groupedSchedule)?.map((day, index) => (
                        <ul className="px-6 text-white bg-green-700 rounded-lg py-2 grid " key={index}>
                            <h2 className="text-white">{day}</h2>
                            {groupedSchedule[day].map((item, itemIndex) => (
                                <li className="flex justify-between w-full my-1" key={itemIndex}>
                                    <p>{item.time} &#40;{item.section}&#41; {item.event}</p>
                                    <div>
                                        {item.students.filter((student) => student.id === studentId).map((filteredStudent) => (
                                            <div className="flex gap-4" key={filteredStudent.id}>
                                                <div className="flex gap-2">
                                                    {filteredStudent.status === "present" ?
                                                        <button onClick={() => handleChangeStatus(item.id, filteredStudent, "absent")} className="bg-white rounded-full text-green-700 p-1">
                                                            <FaCheck size={14} /></button> :
                                                        <button onClick={() => handleChangeStatus(item.id, filteredStudent, "present")} className="bg-white rounded-full text-red-700 p-1">
                                                            <IoClose size={16} /></button>}
                                                    {filteredStudent.letterUrl ?
                                                        <button onClick={() => setViewLetter(!viewLetter)} className="bg-white rounded-full text-blue-700 p-1">
                                                            <MdOutlineMailOutline size={14} /></button> :
                                                        // <button onClick={() => handleUploadLetter(item.id, filteredStudent)} className="bg-white rounded-full text-blue-700 p-1">
                                                        //     <MdOutlineMailOutline size={16} /></button> :
                                                        <button onClick={() => setUploadLetter(!uploadLetter)} className="bg-white rounded-full text-green-700 p-1">
                                                            <FaPlus size={14} /></button>}
                                                </div>
                                                {viewLetter && filteredStudent.letterUrl && <Modal>
                                                    <div className="relative w-full h-full">
                                                        <button className="absolute rounded-full bg-white text-red-700 -top-2 -right-2"
                                                            onClick={() => setViewLetter(!viewLetter)}><IoMdCloseCircle size={28} style={{ color: 'red' }} /></button>
                                                        <Link href={filteredStudent.letterUrl} target="blank">
                                                            <Image src={filteredStudent.letterUrl} height={400} width={400} alt="letter" />
                                                        </Link>
                                                    </div>
                                                </Modal>}
                                                {uploadLetter && <SelectImage
                                                    handleGetStudent={handleGetStudent}
                                                    uploadLetter={uploadLetter}
                                                    setUploadLetter={setUploadLetter}
                                                    id={item.id}
                                                    studentId={filteredStudent.id}
                                                    status={filteredStudent.status}
                                                    letterUrl={filteredStudent.letterUrl}
                                                    letterPublicId={filteredStudent.letterPublicId} />}
                                            </div>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>
            <div className={`fixed bottom-2 flex w-full justify-center`}>
                <div className={`flex justify-between mx-4 ${active === "/Admin" ? "grid gap-2 w-full" : "w-full md:w-1/4"}`}>
                    <button onClick={goBack} className="bg-green-700 text-white px-4 rounded-full" >Back</button>
                </div>
            </div>
        </>
    );
}

export default Page;