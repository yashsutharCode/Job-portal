import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
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

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, file });
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
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent 
                className="w-[95%] sm:max-w-md bg-white rounded-2xl p-0 overflow-hidden border-none shadow-2xl" 
                onInteractOutside={() => setOpen(false)}
            >
                <DialogHeader className="px-6 pt-5 pb-3 bg-gray-50 border-b border-gray-100">
                    <DialogTitle className="text-lg font-bold text-gray-800">Update Profile</DialogTitle>
                    <DialogDescription className="text-xs text-gray-500 font-medium">
                        Refine your professional identity.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitHandler} className="p-5">
                    <div className="space-y-3">
                        {[
                            { id: "fullname", label: "Full Name" },
                            { id: "email", label: "Email Address", type: "email" },
                            { id: "phoneNumber", label: "Phone Number", name: "phoneNumber" },
                            { id: "bio", label: "Bio Description" },
                            { id: "skills", label: "Skills (Comma separated)" }
                        ].map((field) => (
                            <div key={field.id} className="space-y-1">
                                <Label htmlFor={field.id} className="font-bold text-gray-700 text-[10px] uppercase ml-1">
                                    {field.label}
                                </Label>
                                <Input 
                                    id={field.id} 
                                    name={field.name || field.id}
                                    type={field.type || "text"}
                                    value={input[field.name || field.id]} 
                                    onChange={changeEventHandler} 
                                    className="h-9 border-gray-200 text-sm rounded-lg focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:border-purple-600 transition-all outline-none" 
                                />
                            </div>
                        ))}

                        <div className="space-y-1">
                            <Label htmlFor="file" className="font-bold text-gray-700 text-[10px] uppercase ml-1">
                                Upload Photo or Resume (JPG, PNG, PDF)
                            </Label>
                            <Input 
                                id="file" 
                                type="file" 
                                accept="image/*, application/pdf" 
                                onChange={fileChangeHandler} 
                                className="h-9 border-gray-200 text-xs file:bg-gray-100 file:border-none file:text-[10px] file:font-bold file:rounded cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-600" 
                            />
                        </div>
                    </div>

                    <Button 
                        disabled={loading} 
                        type="submit" 
                        className="w-full mt-6 h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all active:scale-95"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" size={18}/> : "Save Changes"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;