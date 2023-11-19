import React, { useEffect, useState } from "react";
import ListView from "./ListView";
import { faceDescData } from "./faceDescData";

const TrxDashBoard = (props) => {
    const { participants, present } = props;


    const presentSet = new Set(present);

    // Filter faceDescData based on participant's studentId
    const updatedFaceDescData = participants.map((student) => {
        const isPresent = presentSet?.has(student.id);
        return {
            ...student,
            status: isPresent ? "Present" : "Absent",
            attend_at: ""
        };
    });



    // Filter fullDesc based on the "Present" status
    const attendees = updatedFaceDescData.filter((student) => student.status === "Present");

    // console.log("attendees", attendees)
    return (
        <div className="p-4 border">
            <p className="text-center font-bold text-2xl">
                Attendance: {attendees?.length}/{participants?.length}
            </p>
            <ListView studentList={updatedFaceDescData} />
        </div>
    );
};

TrxDashBoard.displayName = 'TrxDashBoard';


export default TrxDashBoard;