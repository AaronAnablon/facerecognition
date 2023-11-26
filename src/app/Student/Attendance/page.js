"use client"

import Layout from "../Layout";
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
import { FaCheck, FaPlus } from "react-icons/fa";
import Modal from "@/utils/Modal";
import Image from "next/image";
import { MdOutlineMailOutline } from "react-icons/md";
import SelectImage from "@/components/SelectImage";
import { IoMdCloseCircle } from "react-icons/io";
import { useAccount } from "@/app/contextProvider/AccountProvider";

const Page = () => {
    const profile = useAccount()
    const [viewLetter, setViewLetter] = useState(false)
    const [uploadLetter, setUploadLetter] = useState(false)
    const [schedule, setSchedule] = useState()
    const [student, setStudent] = useState()
    const [loading, setLoading] = useState(false)
    const currentPathname = usePathname()
    const [active, setActive] = useState()
    const [studId, setStudId] = useState()
    const [attendId, setAttendId] = useState()

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
            const response = await axios.get(`${url}/api/people/${profile?.id}`, { headers });
            setStudent(response.data)
            setLoading(false)
        } catch (err) {
            alert("Something went wrong!")
            console.log(err);
            setLoading(false)
        }
    }


    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${url}/api/attendance/getStudents/${profile?.section}`, headers);
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


    const handleUploadLetter = (id, studId) => {
        setStudId(studId)
        setAttendId(id)
        setUploadLetter(true)
    }

    return (
        <>
            <Layout>
                <div className="w-full flex justify-center gap-4 mb-20">
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
                                                    <div className="flex gap-2 items-center">
                                                        {filteredStudent.status === "present" ?
                                                            <div className="bg-white h-max rounded-full text-green-700 p-1">
                                                                <FaCheck size={14} /></div> :
                                                            <div className="bg-white h-max rounded-full text-red-700 p-1">
                                                                <IoClose size={16} /></div>}
                                                        {filteredStudent.letterUrl ?
                                                            <button onClick={() => setViewLetter(!viewLetter)} className="bg-white h-max rounded-full text-blue-700 p-1">
                                                                <MdOutlineMailOutline size={14} /></button> :
                                                            <button onClick={() => handleUploadLetter(item.id, filteredStudent.id)} className="bg-white h-max rounded-full text-green-700 p-1">
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
                                                        id={attendId}
                                                        studentId={studId}
                                                    />}
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
            </Layout>
        </>
    );
}

export default Page;