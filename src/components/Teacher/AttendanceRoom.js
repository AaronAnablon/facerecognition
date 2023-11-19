import React, { useContext, useEffect, useState } from "react";
import { createMatcher } from "@/app/faceUtil";
import ProcessFaceRecognition from "./ProcessFaceRecognition";
import TrxDashboard from "./TrxDashboard";
import { faceDescData } from "./faceDescData";

const AttendanceRoom = (props) => {
    const [isOn, setIsOn] = useState(true);
    const [faceMatcher, setFaceMatcher] = useState([]);

    useEffect(() => {
        async function matcher() {
            //check there should be at least one matcher
            const profileList = faceDescData && await createMatcher(faceDescData, .45);
            setFaceMatcher(profileList);
        }
        matcher()
    }, [faceDescData]);


    const handleIsOnChange = (value) => {
        setIsOn(value);
    };


    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="mx-auto p-6">

                    <div className="mb-8">
                        <h4 className="text-xl font-bold mb-4">Attendance Setting</h4>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Open
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleIsOnChange(e.target.checked)}
                                        checked={isOn}
                                        className="mr-2"
                                    />
                                    {isOn
                                        ? " (Attendance transaction activate)"
                                        : " (Attendance transaction deactivate)"}
                                </div>
                            </div>
                        </form>
                    </div>


                    {faceDescData &&
                        isOn && (
                            <ProcessFaceRecognition
                                {...props}
                                faceMatcher={faceMatcher}
                                participants={faceDescData}
                            />
                        )}

                </div>
            </div>


        </div>
    );
};

export default AttendanceRoom;