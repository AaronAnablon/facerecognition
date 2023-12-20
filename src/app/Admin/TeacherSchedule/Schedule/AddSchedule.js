
import { useState, useEffect } from "react";
import Modal from "@/utils/Modal";
import axios from "axios";
import { LoadingSpin } from "@/utils/LoadingSpin";
import { url, headers } from "@/utils/api";
import useMessageHook from "@/utils/MessageHook";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoIosCloseCircle } from "react-icons/io";

const AddSchedule = ({ teacher, setAdd, add, handleGetData }) => {
    const { showMessage, Message } = useMessageHook();
    const [date, setDate] = useState([])
    const [openDatePicker, setOpenDatePicker] = useState(false)
    const [triggerApi, setTriggerApi] = useState()
    const [toTime, setToTime] = useState()
    const [fromTime, setFromTime] = useState()
    const [uploading, setUploading] = useState()
    const [data, setData] = useState({
        isOn: false,
        dates: [],
        time: "",
        teacher: teacher,
        event: "",
        section: "",
        students: []
    })

    const handleChange = (name, value) => {
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const formattedDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleDateChange = (selectedDate) => {
        setDate((prevDates) => [...prevDates, selectedDate]);
    };

    const handleRemoveDate = (index) => {
        setDate((prevDates) => {
            const newDates = [...prevDates];
            newDates.splice(index, 1);
            return newDates;
        });
    };

    const handleSetDate = () => {
        const formattedDates = date?.map((date) => formattedDate(date));
        handleChange("dates", formattedDates);
        setOpenDatePicker(false)
    }



    function onTimeChange(value) {
        const [hours, minutes] = value ? value.split(':').map(Number) : [0, 0];
        const meridian = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

        return `${formattedHours}:${minutes} ${meridian}`;
    }

    useEffect(() => {
        const formattedToTime = onTimeChange(toTime);
        const formattedFromTime = onTimeChange(fromTime);
        handleChange("time", `${formattedFromTime} - ${formattedToTime}`);
    }, [fromTime, toTime]);


    const handleAddSchedule = async () => {
        setUploading(true);
        try {
            await axios.post(`${url}/api/attendance`, data, { headers });
            setUploading(false)
            handleGetData()
            setAdd(!add)
            showMessage("Successfully added!")

        } catch (error) {
            showMessage("Something went wrong while adding attendance!")
            console.error('Error:', error);
            setUploading(false)
        }
    };

    useEffect(() => {
        if (triggerApi === "call") {
            handleAddSchedule()
        }
    }, [triggerApi])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.get(`${url}/api/people/getStudents/${data.section}`, { headers });
            const dataOfStudents = response?.data?.map((student) => ({
                id: student.id,
                status: "absent",
                letterUrl: "",
                letterPublicId: "",
            })) || [];
            handleChange("students", dataOfStudents)
            setTriggerApi("call")
        } catch (error) {
            showMessage("Something went wrong while adding attendance!")
            console.error('Error:', error);
        }
    };



    return (
        <>
            <Modal>
                <Message />
                <div>
                    <form onSubmit={handleSubmit} className="grid px-8 bg-white rounded-xl text-green-700 py-6 border-2 border-green-700 gap-4">
                        {openDatePicker && <Modal>
                            <div className="bg-white text-black p-6 grid gap-1 text-sm">
                                <div className="flex gap-2">
                                    <ul>
                                        <h2>Selected Dates:</h2>
                                        {date && date?.map((selectedDate, index) => (
                                            <li className="flex px-1 rounded-lg py-1 mt-1 bg-green-700 text-white justify-between" key={selectedDate.toString()}>
                                                {formattedDate(selectedDate)}
                                                <button className="rounded-full bg-red-700" onClick={() => handleRemoveDate(index)}>
                                                    <IoIosCloseCircle size={20} /></button>
                                            </li>
                                        ))}
                                    </ul>
                                    <DatePicker
                                        selected={null}
                                        onChange={handleDateChange}
                                        inline
                                    />
                                </div>
                                <div className="flex justify-between mx-24">
                                    <button
                                        type="button"
                                        onClick={() => setOpenDatePicker(false)}
                                        className="px-2 py-1 bg-red-700 text-white rounded-lg">
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSetDate}
                                        className="px-2 py-1 bg-green-700 text-white rounded-lg">
                                        Okay
                                    </button>
                                </div>

                            </div>
                        </Modal>}
                        <div className="grid">
                            <div className="mb-4 grid text-sm">
                                <label>Date</label>
                                <button
                                    type="button"
                                    onClick={() => setOpenDatePicker(true)}
                                    className="w-full text-xs rounded-xl px-3 py-2 border border-green-700">
                                    Select Date
                                </button>
                            </div>
                            <div className="mb-4 grid text-sm">
                                <label>Time</label>
                                <div className="flex gap-1">
                                    <input
                                        pattern="[0-9]{2}:[0-9]{2} [APMapm]{2}"
                                        placeholder="HH:mm AM/PM"
                                        type="time"
                                        className="w-full text-xs rounded-xl px-3 py-2 border border-green-700"
                                        value={fromTime}
                                        onChange={(e) => setFromTime(e.target.value)}
                                        required
                                    />
                                    <p className="grid items-center"> to </p>
                                    <input
                                        pattern="[0-9]{2}:[0-9]{2} [APMapm]{2}"
                                        placeholder="HH:mm AM/PM"
                                        type="time"
                                        className="w-full text-xs rounded-xl px-3 py-2 border border-green-700"
                                        value={toTime}
                                        onChange={(e) => setToTime(e.target.value)}
                                        required
                                    />
                                </div>
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
                            <div className="mb-4 grid text-sm">
                                <label>Class or Event</label>
                                <input
                                    type="text"
                                    className="w-full text-xs rounded-xl px-3 py-2 border border-green-700"
                                    value={data.event}
                                    onChange={(e) => handleChange("event", e.target.value)}
                                    placeholder="Class or Event"
                                    required
                                />
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
                </div >
            </Modal>
        </>
    );
}

export default AddSchedule;