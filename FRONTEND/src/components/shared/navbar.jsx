import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { USER_API_END_POINT } from "../../utils/constant.js";
import { setUser } from "../../redux/authSlice";

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, {
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(null));
                toast.success(res.data.message);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        Job<span className="text-[#F83002]">Portal</span>
                    </h1>
                </div>

                <div className="flex items-center gap-12">
                    <ul className="flex font-medium items-center gap-5">
                        {user && user.role === "recruiter" ? (
                            <>
                                <li><Link to="/admin/companies" className="hover:text-[#6A38C2]">Companies</Link></li>
                                <li><Link to="/admin/jobs" className="hover:text-[#6A38C2]">Jobs</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/" className="hover:text-[#6A38C2]">Home</Link></li>
                                <li><Link to="/jobs" className="hover:text-[#6A38C2]">Jobs</Link></li>
                                <li><Link to="/browse" className="hover:text-[#6A38C2]">Browse</Link></li>
                            </>
                        )}
                    </ul>

                    {!user ? (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                                    Signup
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer border border-gray-300">
                                    <AvatarImage
                                        src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                        alt="profile"
                                    />
                                </Avatar>
                            </PopoverTrigger>

                            <PopoverContent className="w-80 p-4">
                                <div>
                                    <div className="flex gap-3 items-center mb-3">
                                        <Avatar>
                                            <AvatarImage
                                                src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                                alt="profile"
                                            />
                                        </Avatar>
                                        <div className="overflow-hidden">
                                            <h4 className="font-semibold truncate">{user?.fullname}</h4>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {user?.profile?.bio || "No bio added"}
                                            </p>
                                        </div>
                                    </div>

                                    <hr className="my-3 border-gray-100" />

                                    <div className="flex flex-col gap-1 text-gray-600">
                                        {/* Added .toLowerCase() to handle role case sensitivity */}
                                        {user && user.role?.toLowerCase() === "student" && (
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-gray-100 hover:text-[#6A38C2] transition-all"
                                            >
                                                <User2 size={18} />
                                                <span className="text-sm font-medium">View Profile</span>
                                            </Link>
                                        )}

                                        <button
                                            onClick={logoutHandler}
                                            className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-gray-100 hover:text-red-600 transition-all text-left"
                                        >
                                            <LogOut size={18} />
                                            <span className="text-sm font-medium">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;