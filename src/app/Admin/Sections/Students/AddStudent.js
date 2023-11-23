
import { useState, useEffect } from "react";
import Modal from "@/utils/Modal";
import axios from "axios";
import { LoadingSpin } from "@/utils/LoadingSpin";
import { url, headers } from "@/utils/api";
import Link from "next/link";

const AddStudent = ({ sectionName, role, setAdd, add, handleGetData }) => {

    const [notPassword, setNotPassword] = useState()
    const [uploadPhoto, setUploadPhoto] = useState(false)
    const [teachers, setTeachers] = useState()
    const [uploading, setUploading] = useState()
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        homeAddress: "",
        age:"",
        contact: "",
        section: sectionName,
        adviser: "",
        password: "",
        confirmPassword: "",
        role: role
    })

    const [newStudent, setNewStudent] = useState({
        id: "",
        status: "absent",
        letterUrl: "",
        letterPublicId: "",
    })

    //Update the students in the attendance
    const handleAddnewStudents = async () => {
        try {
            const response = await
                axios.put(`${url}/api/attendance/addNewStudentToStudents/${sectionName}`,
                    { newStudent }, headers);
        } catch (error) {
            console.error('An error occurred:', error);
            alert("Something went wrong while updating")
        }
    };

    const status = "absent"
    const letterUrl = "Yeahhh"
    const letterPublicId = "Yeahhhhh"

    const handleUpdateStudentStatus = async () => {
        try {
            const response = await
                axios.put(`${url}/api/attendance/updateStatusOfStudent/65560c3aa1e75aff60dfe015`,
                    { studentId: "222222", status, letterUrl, letterPublicId }, headers);
            alert("Successfully updated attendance!")
        } catch (error) {
            console.error('An error occurred:', error);
            alert("Something went wrong while updating")
        }
    };

    const handleRemoveStudent = async () => {
        try {
            const response = await
                axios.put(`${url}/api/attendance/removeStudentFromStudents/65560c3aa1e75aff60dfe015`,
                    { studentId: "" }, headers);
            alert("Successfully updated attendance!")
        } catch (error) {
            console.error('An error occurred:', error);
            alert("Something went wrong while updating")
        }
    };


    const handleGetStudent = async () => {
        try {
            const response = await
                axios.get(`${url}/api/attendance/getStudents/${sectionName}`, headers);
            console.log(response)
        } catch (error) {
            console.error('An error occurred:', error);
            alert("Something went wrong while fetching")
        }
    };

    const handleAddnewStudentChange = (value) => {
        setNewStudent((prevData) => ({
            ...prevData,
            id: value,
        }));
    };

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



    useEffect(() => {
        if (newStudent.id !== "") {
            handleAddnewStudents()
        }
    }, [newStudent])


    const handleSubmit = async (event) => {
        event.preventDefault();
        validatePassword(data.password)
        setUploading(true);
        try {
            const response = await axios.get(`${url}/api/findByEmail/${data.email}`, { headers });
            if (Array.isArray(response.data) && response.data.length > 0) {
                alert("Email already exist!")
                setUploading(false)
            } else {
                const response = await axios.post(`${url}/api/people/addStudent`, data, { headers });
                handleAddnewStudentChange(response.data.id)
                setUploading(false)
                handleGetData()
                // setAdd(!add)
                setUploadPhoto(!uploadPhoto)
                alert("Successfully Added!")
            }
        } catch (error) {
            alert("Something went wrong!")
            console.error('Error:', error);
            setUploading(false)
        }
    };



    const validatePassword = (password) => {
        const isLengthValid = password.length >= 8;
        const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasNumbers = /\d/.test(password);

        if (!isLengthValid) {
            alert('Password must be at least 8 characters long.');
        } else if (!hasSpecialCharacters) {
            alert('Password must contain special characters.');
        } else if (!hasNumbers) {
            alert('Password must include numbers.');
        }
    };

    const handleGetTeachers = async () => {
        try {
            const response = await axios.get(`${url}/api/people/getTeachers`, { headers });
            setTeachers(response.data)
        } catch (err) {
            alert("Something went wrong while fetching teachers!")
            console.log(err);
        }
    }

    useEffect(() => {
        handleGetTeachers()
    }, [])


    return (
        <>
            <Modal>
                <form onSubmit={handleSubmit} className="grid px-8 bg-white rounded-xl text-green-700 py-6 border-2 border-green-700 gap-4">
                    <div className="grid gap-4 grid-cols-2">
                        <div className="col-span-1">
                            {/* <button type="button" className="bg-green-700 text-white roundedn-lg px-4"
                                onClick={handleAddnewStudents}>Add Student</button>
                            <button type="button" className="bg-green-700 text-white roundedn-lg px-4"
                                onClick={handleUpdateStudentStatus}>Update Status</button>
                            <button type="button" className="bg-green-700 text-white roundedn-lg px-4"
                                onClick={handleGetStudent}>Get Student</button>
                            <button type="button" className="bg-green-700 text-white roundedn-lg px-4"
                                onClick={handleRemoveStudent}>Remove Student</button> */}
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
                                />
                            </div>
                            <div className="mb-4 grid text-sm">
                                <label>Adviser</label>
                                <select
                                    value={data.teacher}
                                    onChange={(e) => handleChange("adviser", e.target.value)}
                                    required
                                >
                                    <option value="">Select a teacher</option>
                                    {teachers?.map((teacher) => (
                                        <option key={teacher.id} value={`${teacher.firstName} ${teacher.lastName}`}>
                                            {teacher.firstName} {teacher.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4 grid text-sm">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="w-full text-xs rounded-xl px-3 py-2 border border-green-700"
                                    value={data.password}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                    placeholder="Password"
                                    required
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
                                    required
                                />
                                {notPassword && <div className="text-xs italic text-red-700 px-4 rounded-full">Password do not match</div>}
                            </div>
                        </div>
                        <div className="col-span-2 flex mx-16 justify-between">
                            <button
                                type="submit"
                                className={`bg-green-700 w-20 text-white px-4 rounded-full`}
                                disabled={notPassword && uploading}
                            >
                                {uploading ? <LoadingSpin loading={uploading} /> : "Add"}
                            </button>
                            <button type="button" onClick={() => setAdd(!add)} className="bg-green-700 w-20 text-white px-4 rounded-full">Close</button>
                        </div>
                        {uploadPhoto && <Link href={`StudentAttendance/AddFacePhoto?id=${newStudent.id}`}>Upload Photo</Link>}
                    </div>
                </form>
            </Modal>
        </>
    );
}

export default AddStudent;