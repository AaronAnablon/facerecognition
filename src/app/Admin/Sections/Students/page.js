"use client"

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { LoadingSpin } from "@/utils/LoadingSpin";
import { url, headers } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { useSession } from 'next-auth/react';
import { NoRecord } from "@/utils/NoRecord";
import AddStudent from "./AddStudent";
import { FaClipboardList, FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import EditStudent from "./EditStudent";
import { FcDataProtection } from "react-icons/fc";
import Link from "next/link";
import useConfirmation from "@/utils/ConfirmationHook";

const Page = () => {
    const [add, setAdd] = useState(false)
    const [edit, setEdit] = useState(false)
    const [clickedStudent, setClickedStudent] = useState()
    const [attendance, setAttendance] = useState()
    const [loading, setLoading] = useState(false)
    const currentPathname = usePathname()
    const [active, setActive] = useState()
    const { data: session } = useSession();
    const { showConfirmation, ConfirmationDialog } = useConfirmation();

    const searchParams = useSearchParams()
    const sectionName = searchParams.get('section')

    useEffect(() => {
        setActive(currentPathname)
    }, [currentPathname])

    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${url}/api/people/getStudents/${sectionName}`, { headers });
            setAttendance(response?.data)
            setLoading(false)
        } catch (err) {
            alert("Something went wrong!")
            console.log(err);
            setLoading(false)
        }
    }

    const handleDelete = (id) => {
        showConfirmation(<div className='grid justify-center gap-4'>
            <div className='bg-green-700 flex items-center text-white gap-4 rounded-t-lg w-full'><FcDataProtection size={32} />Delete Student</div>
            <p className='text-xl p-6'>Are you sure you want to delete this account?</p>
        </div>, () => {
            handleDeleteApi(id)
        });
    };

    const handleRemoveStudent = async (id) => {
        try {
            const response = await
                axios.put(`${url}/api/attendance/removeStudentFromStudents/${sectionName}`,
                    { studentId: id }, headers);
        } catch (error) {
            console.error('An error occurred:', error);
            alert("Something went wrong in attendance")
        }
    };

    const handleDeleteApi = async (id) => {
        setLoading(true)
        try {
            await axios.delete(`${url}/api/people/${id}`, { headers });
            handleGetData()
            alert("Succesfully Deleted!")
            handleRemoveStudent(id)
            setLoading(false)
        } catch (err) {
            alert("Something went wrong!")
            console.log(err);
            setLoading(false)
        }
    }

    const handleEdit = (student) => {
        setClickedStudent(student)
        setEdit(!edit)
    }

    useEffect(() => {
        handleGetData()
    }, [])


    return (
        <>
            <ConfirmationDialog />
            <div className="border-b-2 w-full border-green-700">
                <p className="my-2 text-green-700 text-lg ml-4">{sectionName}</p>
            </div>
            {edit && <EditStudent setEdit={setEdit} edit={edit} student={clickedStudent} handleGetData={handleGetData} />}

            {loading && <LoadingSpin loading={loading} />}
            <div className="rounded-lg bg-green-700 text-white text-center py-3 my-6 mx-4">Students</div>
            <div className="m-4">
                <div className="grid rounded-lg bg-green-700 py-4 px-2 gap-2">
                    {attendance?.length > 0 ?
                        attendance.map((student, studentIndex) => (
                            <div className="flex px-4 text-white justify-between items-center" key={studentIndex}>
                                <p>{student.firstName} {student.lastName}</p>
                                <div className="flex gap-2">
                                    <Link href={`Students/StudentAttendance?id=${student.id}`} className="bg-white h-max rounded-full text-yellow-500 p-1">
                                        <FaClipboardList size={15} /></Link>
                                    <button onClick={() => handleEdit(student)} className="bg-white h-max rounded-full text-green-700 p-1">
                                        <FaEdit size={14} /></button>
                                    <button onClick={() => handleDelete(student.id)} className="bg-white h-max rounded-full text-red-700 p-1">
                                        <RiDeleteBin5Line size={16} /></button>
                                </div>
                            </div>
                        ))
                        :
                        <div className="text-center text-white">No record</div>
                    }
                </div>
            </div>
            <div className={`fixed bottom-2 flex w-full justify-center`}>
                <div className={`flex justify-between mx-4 ${active === "/Admin" ? "grid gap-2 w-full" : "w-full md:w-1/4"}`}>
                    <button onClick={goBack} className="bg-green-700 text-white px-4 rounded-full" >Back</button>
                    {!add && <button type="button" onClick={() => setAdd(!add)} className="bg-green-700 text-white px-4 rounded-full">Add</button>}
                </div>
            </div>
            {add &&
                <AddStudent sectionName={sectionName} handleGetData={handleGetData} role={2} setAdd={setAdd} add={add} />
            }
        </>
    );
}

export default Page;