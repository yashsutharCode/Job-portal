import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector((store) => store.auth);

    const isResume = Boolean(user?.profile?.resume);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 shadow-sm">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-24 w-24 border">
                            <AvatarImage
                                src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                alt="profile"
                            />
                        </Avatar>
                        <div>
                            <h1 className="font-bold text-2xl text-gray-800">{user?.fullname || "User Name"}</h1>
                            <p className="text-gray-600">{user?.profile?.bio || "No bio added yet."}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} variant="outline" size="icon" className="rounded-full">
                        <Pen size={18}/>
                    </Button>
                </div>

                <div className="my-6 space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="text-gray-400" size={20}/>
                        <span>{user?.email || "NA"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                        <Contact className="text-gray-400" size={20}/>
                        <span>{user?.phoneNumber || "NA"}</span>
                    </div>
                </div>

                <div className="my-6">
                    <h1 className="font-bold text-lg mb-2">Skills</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        {user?.profile?.skills?.length > 0 ? (
                            user.profile.skills.map((item, index) => (
                                <Badge key={index} variant="secondary">{item}</Badge>
                            ))
                        ) : (
                            <span className="text-gray-400 italic text-sm">No skills listed</span>
                        )}
                    </div>
                </div>

                <div className="grid w-full max-w-sm items-center gap-2">
                    <Label className="text-md font-bold">Resume</Label>
                    {isResume ? (
                        <a
                            href={user?.profile?.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#6A38C2] font-medium hover:underline cursor-pointer"
                        >
                            {user?.profile?.resumeOriginalName || "Download Resume"}
                        </a>
                    ) : (
                        <span className="text-gray-400 italic text-sm">No resume uploaded</span>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-10">
                <h1 className="font-bold text-xl mb-5">Applied Jobs History</h1>
                <AppliedJobTable />
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;