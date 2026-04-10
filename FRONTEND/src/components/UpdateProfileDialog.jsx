import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, ExternalLink } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { USER_API_END_POINT } from "../utils/constant.js";
import { setUser } from "../redux/authSlice";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    file: null,
  });

  useEffect(() => {
    if (user && open) {
      setInput({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills ? user.profile.skills.join(", ") : "",
        file: null,
      });
    }
  }, [user, open]);

  const changeEventHandler = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type !== "application/pdf") {
      toast.error("Please upload a PDF file for your resume.");
      e.target.value = ""; 
      return;
    }
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) formData.append("file", input.file);

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Increased max-width slightly to accommodate more fields comfortably */}
      <DialogContent className="sm:max-w-106.25 bg-white rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-bold text-gray-800">
            Update Profile
          </DialogTitle>
          <DialogDescription className="text-xs">
            Update your career details and resume.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submitHandler} className="space-y-3">
          
          {/* Full Name */}
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-gray-500">Full Name</Label>
            <Input
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              className="h-9"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-gray-500">Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="h-9"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-gray-500">Phone Number</Label>
            <Input
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              className="h-9"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-gray-500">Bio</Label>
            <Input
              name="bio"
              value={input.bio}
              onChange={changeEventHandler}
              className="h-9"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Skills */}
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-gray-500">Skills</Label>
            <Input
              name="skills"
              value={input.skills}
              onChange={changeEventHandler}
              className="h-9"
              placeholder="React, Node, etc."
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-gray-500">Resume (PDF)</Label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={fileChangeHandler}
              className="h-9 cursor-pointer"
            />
            {user?.profile?.resume && (
              <a
                href={user.profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-purple-600 font-bold flex items-center hover:underline mt-1"
              >
                View Current Resume <ExternalLink size={10} className="ml-1" />
              </a>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-10 rounded-xl mt-4"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;