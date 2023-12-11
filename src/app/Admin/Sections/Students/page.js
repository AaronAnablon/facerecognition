"use client"

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { LoadingSpin } from "@/utils/LoadingSpin";
import { url, headers } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import useMessageHook from "@/utils/MessageHook";
import AddStudent from "./AddStudent";
import { FaClipboardList, FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import EditStudent from "./EditStudent";
import { FcDataProtection } from "react-icons/fc";
import Link from "next/link";
import useConfirmation from "@/utils/ConfirmationHook";
import Modal from "@/utils/Modal";

const Page = () => {
    const { showMessage, Message } = useMessageHook();
    const [add, setAdd] = useState(false)
    const [edit, setEdit] = useState(false)
    const [clickedStudent, setClickedStudent] = useState()
    const [attendance, setAttendance] = useState()
    const [loading, setLoading] = useState(false)
    const currentPathname = usePathname()
    const [active, setActive] = useState()
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
            setLoading(false)
            showMessage("Something went wrong!")
            console.log(err);
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
            showMessage("Something went wrong in attendance")
        }
    };

    const handleDeleteApi = async (id) => {
        setLoading(true)
        try {
            await axios.delete(`${url}/api/people/${id}`, { headers });
            setLoading(false)
            handleGetData()
            showMessage("Succesfully Deleted!")
            handleRemoveStudent(id)
        } catch (err) {
            setLoading(false)
            showMessage("Something went wrong!")
            console.log(err);
        }
    }

    const handleDeleteStudentInattendance = async (id) => {
        setLoading(true)
        try {
            await axios.put(`${url}/api/people/removeStudentFromStudents/${id}`, { headers });
            setLoading(false)
            handleGetData()
            showMessage("Succesfully Deleted!")
            handleRemoveStudent(id)
        } catch (err) {
            setLoading(false)
            showMessage("Something went wrong!")
            console.log(err);

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
            <Message />
            <div className="border-b-2 w-full border-green-700">
                <p className="my-2 text-green-700 text-lg ml-4">{sectionName}</p>
            </div>
            {loading && <Modal>
                <LoadingSpin loading={loading} />
            </Modal>}
            {edit && <EditStudent setEdit={setEdit} edit={edit} student={clickedStudent} handleGetData={handleGetData} />}
            <div className="bg-green-700 border-b border-gray-400 text-white text-center mt-2 md:mx-4 mx-1 py-4">Students</div>
            <div className="md:mx-4 mx-1 mb-20">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="">
                        <tr className="bg-green-700 text-white rounded-t-lg">
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                NAME
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                VIEW
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                EDIT
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                DELETE
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {attendance?.length > 0 ?
                            attendance.map((student, studentIndex) => (
                                <tr className="bg-green-100 py-4 hover:bg-green-400" key={studentIndex}>
                                    <td className="px-4">{student.firstName} {student.lastName}</td>
                                    <td className="text-center">
                                        <button className="bg-white border-green-700 border-2 rounded-full text-yellow-500 p-1">
                                            <Link href={`Students/StudentAttendance?id=${student.id}`}>
                                                <FaClipboardList size={15} />
                                            </Link>
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        <button onClick={() => handleEdit(student)}
                                            className="bg-white border-green-700 border-2 h-max rounded-full text-green-700 p-1">
                                            <FaEdit size={14} />
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        <button onClick={() => handleDelete(student.id)}
                                            className="bg-white border-green-700 border-2 h-max rounded-full text-red-700 p-1">
                                            <RiDeleteBin5Line size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                            :
                            <div className="text-center text-white">No record</div>
                        }
                    </tbody>
                </table>
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