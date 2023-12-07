
import { useState, useEffect } from "react";
import Modal from "@/utils/Modal";
import axios from "axios";
import { LoadingSpin } from "@/utils/LoadingSpin";
import { url, headers } from "@/utils/api";
import useMessageHook from "@/utils/MessageHook";


const EditSchedule = ({ setEdit, edit, attendance, handleGetData }) => {
    const { showMessage, Message } = useMessageHook();
    const [date, setDate] = useState()
    const [toTime, setToTime] = useState()
    const [fromTime, setFromTime] = useState()
    const [uploading, setUploading] = useState()
    const [data, setData] = useState({
        isOn: false,
        date: attendance.date,
        time: attendance.time,
        teacher: attendance.teacher,
        event: attendance.event,
        section: attendance.section
    })

    const handleChange = (name, value) => {
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const formattedDate = () => {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
        return formattedDate;
    };

    useEffect(() => {
        const formattedDateValue = formattedDate();
        handleChange("date", formattedDateValue)
    }, [date]);


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


    const handleSubmit = async (event) => {
        event.preventDefault();
        setUploading(true)
        try {
            const response = await
                axios.put(`${url}/api/attendance/${attendance.id}`,
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




    return (
        <>
            <Modal>
                <Message />
                <div>
                    <form onSubmit={handleSubmit} className="grid px-8 bg-white rounded-xl text-green-700 py-6 border-2 border-green-700 gap-4">
                        <div className="grid">
                            <div className="mb-4 grid text-sm">
                                <label>Date</label>
                                <input
                                    type="date"
                                    className="w-full text-xs rounded-xl px-3 py-2 border border-green-700"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    placeholder="Date"
                                    required
                                />
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
                                {uploading ? <LoadingSpin loading={uploading} /> : "Update"}
                            </button>
                            <button type="button" onClick={() => setEdit(!edit)} className="bg-green-700 w-20 text-white px-4 rounded-full">Cancel</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default EditSchedule;