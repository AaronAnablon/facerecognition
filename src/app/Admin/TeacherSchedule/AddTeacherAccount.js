
import { useState, useEffect } from "react";
import Modal from "@/utils/Modal";
import axios from "axios";
import { LoadingSpin } from "@/utils/LoadingSpin";
import { url, headers } from "@/utils/api";
import useMessageHook from "@/utils/MessageHook";

const AddTeacherAccount = ({ role, setSuccess, setAdd, add, handleGetData }) => {
    const { showMessage, Message } = useMessageHook();
    const [notPassword, setNotPassword] = useState()
    const [uploading, setUploading] = useState()
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: role
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
        validatePassword(data.password)
        setUploading(true);
        try {
            const response = await axios.get(`${url}/api/findByEmail/${data.email}`, { headers });
            if (Array.isArray(response.data) && response.data.length > 0) {
                showMessage("Email already exist!")
                setUploading(false)
            } else {
                const response = await axios.post(`${url}/api/people`, data, { headers });
                setUploading(false)
                handleGetData()
                setAdd(!add)
                setSuccess(true)
            }
        } catch (error) {
            showMessage("Something went wrong!")
            console.error('Error:', error);
            setUploading(false)
        }
    };


    const validatePassword = (password) => {
        const isLengthValid = password.length >= 8;
        const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasNumbers = /\d/.test(password);

        if (!isLengthValid) {
            showMessage('Password must be at least 8 characters long.');
        } else if (!hasSpecialCharacters) {
            showMessage('Password must contain special characters.');
        } else if (!hasNumbers) {
            showMessage('Password must include numbers.');
        }
    };

    return (
        <>
            <Modal>
                <Message />
                <form onSubmit={handleSubmit} className="grid px-8 bg-white rounded-xl text-green-700 py-6 border-2 border-green-700 gap-4">
                    <div className="grid">
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
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className={`bg-green-700 w-20 text-white px-4 rounded-full`}
                            disabled={uploading}
                        >
                            {uploading ? <LoadingSpin loading={uploading} /> : "Add"}
                        </button>
                        <button type="button" onClick={() => setAdd(!add)} className="bg-green-700 w-20 text-white px-4 rounded-full">Cancel</button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

export default AddTeacherAccount;