
import { useState, useEffect } from "react";
import Modal from "@/utils/Modal";
import axios from "axios";
import { LoadingSpin } from "@/utils/LoadingSpin";
import { url, headers } from "@/utils/api";
import Link from "next/link";
import useMessageHook from "@/utils/MessageHook";

const EditStudent = ({ setEdit, edit, student, handleGetData }) => {
    const [notPassword, setNotPassword] = useState()
    const [teachers, setTeachers] = useState()
    const [changePass, setChangePass] = useState()
    const [uploading, setUploading] = useState()
    const { showMessage, Message } = useMessageHook();
    const [data, setData] = useState({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        homeAddress: student.homeAddress,
        age: student.age,
        contact: student.contact,
        section: student.section,
        adviser: student.adviser,
        password: "",
        confirmPassword: "",
    })

    const handleChange = (name, value) => {
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (data.password !== data.confirmPassword) {
            setNotPassword(true)
        }
        if (data.password === data.confirmPassword) {
            setNotPassword(false)
        }
    }, [data.confirmPassword, data.password])

    const handleSubmit = async (event) => {
        event.preventDefault();
        setUploading(true)
        try {
            const response = await
                axios.put(`${url}/api/people/${student.id}`,
                    { data }, headers);
            showMessage("Successfully updated!")
            setEdit(!edit)
            setUploading(false)
            handleGetData()
        } catch (error) {
            setUploading(false)
            showMessage("Something went wrong while updating")
            console.error('An error occurred:', error);
        }
    };


    const handleGetTeachers = async () => {
        try {
            const response = await axios.get(`${url}/api/people/getTeachers`, { headers });
            setTeachers(response.data)
        } catch (err) {
            showMessage("Something went wrong while fetching teachers!")
            console.log(err);
        }
    }

    useEffect(() => {
        handleGetTeachers()
    }, [])

    return (
        <>
            <Modal>
                <Message />
                <div>
                    <form onSubmit={handleSubmit} className="grid px-8 bg-white rounded-xl text-green-700 py-6 border-2 border-green-700 gap-4">
                        <div className="grid gap-4 grid-cols-2">
                            <Link className="col-span-2" href={`Students/AddFacePhoto?id=${student.id}`}>Upload Photo</Link>
                            <div className="col-span-1">
                                <div className="mb-4 grid text-sm">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        className="w-full text-xs rounded-xl px-3 py-2 border border-green-700"
                                        value={data.firstName}
                                        onChange={(e) => handleChange("firstName", e.target.value)}
                                        placeholder="First Name"
                                        required
                                    />
                                </div>
                                <div className="mb-4 grid text-sm">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full text-xs rounded-xl px-3 py-2 border border-green-700"
                                        value={data.lastName}
                                        onChange={(e) => handleChange("lastName", e.target.value)}
                                        placeholder="Last Name"
                                        required
                                    />
                                </div>
                                <div className="mb-4 grid text-sm">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="w-full text-xs rounded-xl px-3 py-2 border border-green-700"
                                        value={data.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        placeholder="Email"
                                        required
                                    />
                                </div>
                                <div className="mb-4 grid text-sm">
                                    <label>Contact Number</label>
                                    <input
                                        type="text"
                                        className="w-full text-xs rounded-xl px-3 py-2 border border-green-700"
                                        value={data.contact}
                                        onChange={(e) => handleChange("contact", e.target.value)}
                                        placeholder="Contact Number"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="mb-4 grid text-sm">
                                    <label>Home Address</label>
                                    <input
                                        type="text"
                                        className="w-full text-xs rounded-xl px-3 py-2 border border-green-700"
                                        value={data.homeAddress}
                                        onChange={(e) => handleChange("homeAddress", e.target.value)}
                                        placeholder="Home Address"
                                        required
                                    />
                                </div>
                                <div className="mb-4 grid text-sm">
                                    <label>Age</label>
                                    <input
                                        type="text"
                                        className="w-full text-xs rounded-xl px-3 py-2 border border-green-700"
                                        value={data.age}
                                        onChange={(e) => handleChange("age", e.target.value)}
                                        placeholder="Age"
                                        required
                                    />
                                </div>
                                <div className="mb-4 grid text-sm">
                                    <label>Adviser</label>
                                    <select
                                        value={data.adviser}
                                        onChange={(e) => handleChange("adviser", e.target.value)}
                                        required
                                    >
                                        <option value={data.adviser}>{data.adviser}</option>
                                        {teachers?.map((teacher) => (
                                            <option key={teacher.id} value={`${teacher.firstName} ${teacher.lastName}`}>
                                                {teacher.firstName} {teacher.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4 grid text-sm">
                                    <label>Section</label>
                                    <input
                                        type="text"
                                        className="w-full text-xs rounded-xl px-3 py-2 border border-green-700"
                                        value={data.section}
                                        onChange={(e) => handleChange("section", e.target.value)}
                                        placeholder="Section"
                                        required
                                    />
                                </div>
                                {!changePass && <button type="button" onClick={() => setChangePass(!changePass)}>Change Password?</button>}
                                {changePass && <><div className="mb-4 grid text-sm">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="w-full text-xs rounded-xl px-3 py-2 border border-green-700"
                                        value={data.password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        placeholder="Password"
                                    />
                                </div>
                                    <div className="mb-4 grid text-sm">
                                        <label>Confirm Password</label>
                                        <input
                                            type="password"
                                            className={`border ${notPassword ? "border-red-500 border-2" : "border-green-700"} w-full text-xs rounded-xl px-3 py-2`}
                                            value={data.confirmPassword}
                                            onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                            placeholder="Confirm Password."
                                        />
                                        {notPassword && <div className="text-xs italic text-red-700 px-4 rounded-full">Password do not match</div>}
                                    </div>
                                </>}
                            </div>
                            <div className="col-span-2 flex mx-16 justify-between">
                                <button
                                    type="submit"
                                    className={`bg-green-700 w-24 text-white px-4 rounded-full`}
                                    disabled={uploading}
                                >
                                    {uploading ? <LoadingSpin loading={uploading} /> : "Update"}
                                </button>
                                <button type="button" onClick={() => setEdit(!edit)} className="bg-green-700 w-24 text-white px-4 rounded-full">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default EditStudent;