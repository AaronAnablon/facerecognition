"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { url, headers } from "@/utils/api";
import { LoadingSpin } from "@/utils/LoadingSpin";
import Image from "next/image";
import useMessageHook from "@/utils/MessageHook";

const RegisterAccount = () => {
    const { showMessage, Message } = useMessageHook();
    const [notPassword, setNotPassword] = useState()
    const [uploading, setUploading] = useState()
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: 0
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
            }
        } catch (error) {
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
        <div className="text-green-700 w-screen h-screen flex justify-center items-center">
            <Message />
            <div className="mx-8 md:p-10 md:border md:rounded-xl md:h-max md:w-96">
                <div className="flex mb-6 justify-center w-full items-center">
                    <div className='w-1/4 flex justify-center'>
                        <Image height={100} width={100} src={"/logo.png"} alt='logo' />
                    </div>
                    <h4 className="w-3/4 text-center">Talangan Integrated National High School</h4>
                </div>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid">
                        <div className="mb-4 text-sm">
                            <input
                                type="text"
                                className="w-full text-xs px-3 py-2 border border-black"
                                value={data.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                placeholder="First Name"
                                required
                            />
                        </div>
                        <div className="mb-4 text-sm">
                            <input
                                type="text"
                                className="w-full text-xs px-3 py-2 border border-black"
                                value={data.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                placeholder="Last Name"
                                required
                            />
                        </div>
                        <div className="mb-4 text-sm">
                            <input
                                type="email"
                                className="w-full text-xs px-3 py-2 border border-black"
                                value={data.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="mb-4 text-sm">
                            <input
                                type="password"
                                className="w-full text-xs px-3 py-2 border border-black"
                                value={data.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                placeholder="Password"
                                required
                            />
                        </div>
                        <div className="mb-4 text-sm">
                            <input
                                type="password"
                                className={`border ${notPassword ? "border-red-500 border-2" : "border-black"} w-full text-xs px-3 py-2`}
                                value={data.confirmPassword}
                                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                placeholder="Confirm Password."
                                required
                            />
                        </div>
                    </div>
                    <div className="grid">
                        {notPassword ? <div className="text-white p-2 bg-red-800 w-full h-max flex justify-center">Password do not match</div> :
                            <button
                                type="submit"
                                className={`w-full py-2 rounded-full my-1 px-4 bg-green-700 text-white `}
                                disabled={uploading}
                            >
                                {uploading ? <LoadingSpin loading={uploading} /> : "Register"}
                            </button>}
                        <Link href={'/'} className="text-blue-500 cursor-pointer text-xs text-end">
                            Already have an account? Log in here.
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterAccount;
