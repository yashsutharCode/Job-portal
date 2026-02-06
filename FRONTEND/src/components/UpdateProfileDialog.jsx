import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
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
            console.log("Frontend Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Profile update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>Update your personal info and upload resume.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullname" className="text-right">Name</Label>
                            <Input id="fullname" name="fullname" value={input.fullname} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" name="email" value={input.email} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right">Phone</Label>
                            <Input id="phoneNumber" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bio" className="text-right">Bio</Label>
                            <Input id="bio" name="bio" value={input.bio} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="skills" className="text-right">Skills</Label>
                            <Input id="skills" name="skills" value={input.skills} onChange={changeEventHandler} className="col-span-3" placeholder="React, Node, MongoDB" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="file" className="text-right">Resume</Label>
                            {/* application/pdf */}
                            <Input id="file" type="file" accept="*"  onChange={fileChangeHandler} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Please wait..." : "Update"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;