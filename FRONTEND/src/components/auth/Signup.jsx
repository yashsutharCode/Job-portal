import React, { useState, useEffect } from "react";
import Navbar from "../shared/navbar.jsx";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { USER_API_END_POINT } from "../../utils/constant";

const Signup = () => {
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth);

    // Local state strictly controls submit loading (prevents Redux lock-up)
    const [loading, setLoadingState] = useState(false);

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: null,
    });

    const changeEventHandler = (e) => {
        setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const changeFileHandler = (e) => {
        setInput((prev) => ({ ...prev, file: e.target.files[0] }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.role) return toast.error("Please select a role");

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) formData.append("file", input.file);

        try {
            setLoadingState(true);
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.error("Signup Error:", error);
            toast.error(error?.response?.data?.message || "Signup failed");
        } finally {
            setLoadingState(false);
        }
    };

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center max-w-7xl mx-auto px-4">
                <form
                    onSubmit={submitHandler}
                    className="w-full md:w-1/2 lg:w-1/3 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 my-10 shadow-sm"
                >
                    <h1 className="font-bold text-2xl mb-5 text-gray-800">Create Account</h1>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="fullname">Full Name</Label>
                            <Input
                                id="fullname"
                                type="text"
                                value={input.fullname}
                                onChange={changeEventHandler}
                                name="fullname"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                name="email"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                type="text"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                name="phoneNumber"
                                placeholder="8080808080"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={input.password}
                                onChange={changeEventHandler}
                                name="password"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-6 py-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="role-student"
                                    name="role"
                                    value="student"
                                    checked={input.role === "student"}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4 accent-[#6A38C2]"
                                />
                                <Label htmlFor="role-student" className="cursor-pointer">
                                    Student
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="role-recruiter"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === "recruiter"}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4 accent-[#6A38C2]"
                                />
                                <Label htmlFor="role-recruiter" className="cursor-pointer">
                                    Recruiter
                                </Label>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="file">Profile Picture</Label>
                            <Input
                                id="file"
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <Button disabled className="w-full mt-6">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full mt-6 bg-[#6A38C2] hover:bg-[#5b30a6]">
                            Signup
                        </Button>
                    )}

                    <p className="text-sm text-center mt-4 text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 font-medium hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;