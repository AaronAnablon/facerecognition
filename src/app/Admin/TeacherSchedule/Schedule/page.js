"use client"

import Layout from "../../Layout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { LoadingSpin } from "@/utils/LoadingSpin";
import { url, headers } from "@/utils/api";
import AddSchedule from "./AddSchedule";
import { useSearchParams } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import EditSchedule from "./EditSchedule";
import useConfirmation from "@/utils/ConfirmationHook";
import { FcDataProtection } from "react-icons/fc";

const Page = () => {
    const { showConfirmation, ConfirmationDialog } = useConfirmation();
    const [add, setAdd] = useState(false)
    const [edit, setEdit] = useState(false)
    const [clickedAttendance, setClickedAttendance] = useState()
    const [schedule, setSchedule] = useState()
    const [teacher, setTeacher] = useState()
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
    const teacherId = searchParams.get('id')

    const handleGetTeacher = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${url}/api/people/${teacherId}`, { headers });
            setTeacher(response.data)
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
            const response = await axios.get(`${url}/api/attendance/${teacherId}`, { headers });
            setSchedule(response.data)
            setLoading(false)
        } catch (err) {
            alert("Something went wrong!")
            console.log(err);
            setLoading(false)
        }
    }

    useEffect(() => {
        handleGetData()
        handleGetTeacher()
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

    const handleDelete = (id) => {
        showConfirmation(<div className='grid justify-center gap-4'>
            <div className='bg-green-700 flex items-center text-white gap-4 rounded-t-lg w-full'><FcDataProtection size={32} />Delete Schedule</div>
            <p className='text-xl p-6'>Are you sure you want to delete this schedule?</p>
        </div>, () => {
            handleDeleteApi(id)
        });
    };

    const handleDeleteApi = async (id) => {
        setLoading(true)
        try {
            await axios.delete(`${url}/api/attendance/${id}`, { headers });
            handleGetData()
            alert("Succesfully Deleted!")
            setLoading(false)
        } catch (err) {
            alert("Something went wrong!")
            console.log(err);
            setLoading(false)
        }
    }

    const handleEdit = (attendance) => {
        setClickedAttendance(attendance)
        setEdit(!edit)
    }


    return (
        <Layout>
            {edit && clickedAttendance && <EditSchedule handleGetData={handleGetData} attendance={clickedAttendance} setEdit={setEdit} edit={edit} />}
            <ConfirmationDialog />
            <div className="w-full flex justify-center gap-4">
                <div className="bg-green-700 w-full text-white mx-4 py-2 rounded-lg mb-4 text-center">{teacher?.firstName} {teacher?.lastName}</div>
            </div>
            <div className="w-full flex justify-center gap-4 mb-20">
                <div className="grid gap-4 w-full mx-4">
                    {Object.keys(groupedSchedule)?.map((day, index) => (
                        <ul className="text-white bg-green-700 rounded-lg py-2 grid " key={index}>
                            <h2 className="text-white px-6">{day}</h2>
                            {groupedSchedule[day].map((item, itemIndex) => (
                                <li className="flex hover:bg-green-500 px-6 justify-between my-1" key={itemIndex}>
                                    <p>{item.time} {item.section}</p>
                                    <div className="flex gap-2">
                                        <LoadingSpin loading={loading} />
                                        <button onClick={() => handleEdit(item)} className="bg-white rounded-full text-green-700 p-1">
                                            <FaEdit size={14} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="bg-white rounded-full text-red-700 p-1">
                                            <RiDeleteBin5Line size={14} /></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>
            <div className={`fixed bottom-2 flex w-full justify-center`}>
                <div className={`flex justify-between mx-4 ${active && active === "/Admin" ? "grid gap-2 w-full" : "w-full md:w-1/4"}`}>
                    <button onClick={goBack} className="bg-green-700 text-white px-4 rounded-full" >Back</button>
                    {!add && <button type="button" onClick={() => setAdd(!add)} className="bg-green-700 text-white px-4 rounded-full">Add</button>}
                </div>
            </div>
            {add &&
                <AddSchedule handleGetData={handleGetData} teacher={teacherId} setAdd={setAdd} add={add} />
            }
        </Layout>
    );
}

export default Page;