import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./shared/navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, FileText, Briefcase, Info } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import UpdateProfileDialog from "./UpdateProfileDialog";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const isResume = Boolean(user?.profile?.resume);

  // Logic for Random Cartoon Profile if no image is uploaded
  const profilePhoto =
    user?.profile?.profilePhoto ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullname || "default"}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* LEFT SIDEBAR: Profile Card with Purple Border */}
          <div className="w-full md:w-1/3 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-28 w-28 border-4 border-purple-600 shadow-md mb-4 bg-gray-100">
                <AvatarImage src={profilePhoto} alt="profile" />
              </Avatar>
              <h1 className="font-bold text-2xl text-gray-800 leading-tight">
                {user?.fullname}
              </h1>
              <Badge className="mt-2 bg-purple-100 text-purple-700 border-none px-4 py-1 text-[11px] font-bold uppercase tracking-wider">
                {user?.role}
              </Badge>

              <div className="w-full border-t border-gray-100 my-6"></div>

              <Button
                onClick={() => setOpen(true)}
                className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white py-6 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Pen size={16} /> Edit Profile
              </Button>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 w-full space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <Label className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-3">
                <Info size={14} /> Professional Bio
              </Label>
              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                {user?.profile?.bio ||
                  "Describe your professional background here..."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <Label className="text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-4 block">
                  Contact Details
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <span className="text-sm font-semibold truncate">
                      {user?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Contact size={18} className="text-gray-400" />
                    </div>
                    <span className="text-sm font-semibold">
                      {user?.phoneNumber || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <Label className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-4">
                  <Briefcase size={14} /> Skills & Tools
                </Label>
                <div className="flex flex-wrap gap-2">
                  {user?.profile?.skills?.length > 0 ? (
                    user.profile.skills.map((item, index) => (
                      <Badge
                        key={index}
                        className="bg-gray-800 text-white hover:bg-black px-3 py-1 text-[11px] font-medium border-none rounded-md"
                      >
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs italic">
                      No skills listed
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <Label className="text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-4 block">
                Attached Documents
              </Label>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="text-purple-600" size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 truncate">
                      {user?.profile?.resumeOriginalName || "Resume.pdf"}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold">
                      Official Document
                    </span>
                  </div>
                </div>

                {isResume && (
                  <a
                    href={user?.profile?.resume?.replace(
                      "/upload/",
                      "/upload/f_auto,q_auto/",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border-2 border-gray-600 px-4 py-2 rounded-lg text-gray-800 text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
                  >
                    View resume
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
