"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { useAccount } from "@/app/contextProvider/AccountProvider";
import { LoadingSpin } from "@/utils/LoadingSpin";
import { url, headers } from "@/utils/api";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FaCheck, FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import useConfirmation from "@/utils/ConfirmationHook";
import Modal from "@/utils/Modal";
import { IoMdCloseCircle } from "react-icons/io";
import SelectImage from "@/components/SelectImage";
import { FcDataProtection } from "react-icons/fc";
import Link from "next/link";

const Page = () => {
    const { showConfirmation, ConfirmationDialog } = useConfirmation();
    const [section, setSection] = useState();
    const [studentProfile, setStudentProfile] = useState();
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const currentPathname = usePathname();
    const [active, setActive] = useState();
    const [viewLetter, setViewLetter] = useState(false);
    const [uploadLetter, setUploadLetter] = useState(false);
    const profile = useAccount();

    const searchParams = useSearchParams();
    const sectionName = searchParams.get("section");

    useEffect(() => {
        setActive(currentPathname);
    }, [currentPathname]);

    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    const handleGetStudents = async () => {
        try {
            const response = await axios.get(`${url}/api/people/getStudents/${sectionName}`, headers);
            setStudentProfile(response.data)
        } catch (err) {
            alert("Something went wrong!")
            console.log(err);
        }
    }

    const handleGetData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/attendance/${profile.id}`, { headers });
            setSection(response?.data);
            setLoading(false);
        } catch (err) {
            alert("Something went wrong!");
            console.log(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        profile && handleGetData();
        profile && handleGetStudents();
    }, [profile]);

    const filterDataByDate = (date) => {
        const filteredData = section?.filter((item) => item.date === date);
        return filteredData;
    };

    const handleDateChange = (event) => {
        const date = new Date(event.target.value).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const filterData = filterDataByDate(date);
        setFilteredData(filterData || []);
    };


    const handleChangeStatus = (id, studentId, value) => {
        showConfirmation(<div className='grid justify-center gap-4'>
            <div className='bg-green-700 flex items-center text-white gap-4 rounded-t-lg w-full'><FcDataProtection size={32} />Delete Schedule</div>
            <p className='text-xl p-6'>Are you sure you want to change the status to {value}?</p>
        </div>, () => {
            handleChangeStatusApi(id, studentId, value)
        });
    };

    const handleChangeStatusApi = async (id, filteredStudent, value) => {
        setLoading(true)
        const letterUrl = filteredStudent.letterUrl
        const letterPublicId = filteredStudent.letterPublicId
        const status = value
        try {
            const response = await
                axios.put(`${url}/api/attendance/updateStatusOfStudent/${id}`,
                    { studentId: filteredStudent.id, status, letterUrl, letterPublicId }, headers);
            handleGetData();
            handleGetStudents();
            setLoading(false)
            alert(`Successfully updated status to ${value}!`)
        } catch (error) {
            setLoading(false)
            console.error('An error occurred:', error);
            alert("Something went wrong while updating")
        }
    };

    return (
        <>
            <ConfirmationDialog />
            <div className="border-b-2 w-full border-green-700">
                <p className="my-2 text-lg ml-4">{sectionName}</p>
            </div>
            <LoadingSpin loading={loading} />
            <div className=" flex justify-center my-2 gap-2">
                <label htmlFor="datePicker">Select Date:</label>
                {studentProfile && section && <input
                    className="bg-green-700 px-4 text-white rounded-lg"
                    type="date"
                    id="datePicker"
                    onChange={handleDateChange}
                />}
            </div>
            <div className="w-full grid gap-4">
                {filteredData.map((students) => (
                    <div className="bg-green-800 mx-4 px-4 py-2 grid gap-1 rounded-lg text-white" key={students.id}>
                        <div className="flex gap-4">
                            <p>{students.date}</p>
                            <p>{students.time}</p>
                            <p>&#40;{students.event}&#41;</p>
                        </div>
                        {students.students.map((student) => (
                            <div key={student.id} className="flex ml-4 justify-between">
                                {/* <p>{student.id}</p> */}
                                {(studentProfile?.filter((studentes) => studentes.id === student.id)).map((stud) => (
                                    <p>{stud.firstName} {stud.lastName}</p>
                                ))}
                                <div className="flex gap-2 items-center">
                                    {student.status === "present" ? (
                                        <button onClick={() => handleChangeStatus(students.id, student, "absent")} className="bg-white rounded-full text-green-700 p-1">
                                            <FaCheck size={14} />
                                        </button>
                                    ) : (
                                        <button onClick={() => handleChangeStatus(students.id, student, "present")} className="bg-white rounded-full text-red-700 p-1">
                                            <IoClose size={16} />
                                        </button>
                                    )}
                                    {student.letterUrl ? (
                                        <button onClick={() => setViewLetter(!viewLetter)} className="bg-white rounded-full text-blue-700 p-1">
                                            <MdOutlineMailOutline size={14} />
                                        </button>
                                    ) : (
                                        <div className="bg-white rounded-full text-green-700 p-1">
                                            <FaPlus size={14} />
                                        </div>
                                    )}
                                </div>
                                {viewLetter && student.letterUrl && (
                                    <Modal>
                                        <div className="relative w-full h-full">
                                            <button className="absolute rounded-full bg-white text-red-700 -top-2 -right-2" onClick={() => setViewLetter(!viewLetter)}>
                                                <IoMdCloseCircle size={28} style={{ color: 'red' }} />
                                            </button>
                                            <a href={student.letterUrl} target="_blank">
                                                <img src={student.letterUrl} height={400} width={400} alt="letter" />
                                            </a>
                                        </div>
                                    </Modal>
                                )}
                            </div>
                        ))
                        }
                    </div>
                ))}
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
