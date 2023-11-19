import React, { useEffect, useState } from "react";
import ListView from "./ListView";
import { faceDescData } from "./faceDescData";

const TrxDashBoard = (props) => {
    const { participants } = props;

    // Create a map of studentIds for faster lookup
    const participantsMap = new Map(participants?.map(({ studentId }) => [studentId, true]));

    // Filter faceDescData based on participant's studentId
    const updatedFaceDescData = faceDescData.map((student) => {
        const isPresent = participantsMap.has(student.studentId);

        return {
            ...student,
            status: isPresent ? "Present" : "Absent",
        };
    });

    // Filter participants based on the "Present" status
    const attendees = updatedFaceDescData.filter((student) => student.status === "Present");

    return (
        <div className="bg-white p-4 rounded-md">
            <p className="text-center font-bold text-2xl">
                Attendance: {attendees.length}/{faceDescData.length}
            </p>
            <div className="w-1/2 pl-2">
                <div className="border p-4">
                    <p className="font-bold text-lg">Attendee: {updatedFaceDescData.length}</p>
                    <ListView studentList={updatedFaceDescData} />
                </div>
            </div>
        </div>
    );
};

TrxDashBoard.displayName = 'TrxDashBoard';


export default TrxDashBoard ;