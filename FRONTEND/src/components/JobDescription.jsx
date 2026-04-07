import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Calendar, MapPin, Briefcase, IndianRupee, Users } from "lucide-react";
import Navbar from "./shared/navbar";

const JobDescription = () => {
    const { id: jobId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Hook for redirection
    
    const { singleJob } = useSelector((store) => store.job);
    const { user } = useSelector((store) => store.auth);

    // Initial state based on whether user is logged in AND has applied
    const initialAppliedStatus = singleJob?.applications?.some(app => app.applicant === user?._id) || false;
    const [isApplied, setApplied] = useState(initialAppliedStatus);
    const [checkingStatus, setCheckingStatus] = useState(true);

    const applyJobHandler = async () => {
        // FIX 1: If no user is logged in, show toast and redirect to login
        if (!user) {
            toast.error("Please login or signup to apply for this job!");
            navigate("/login");
            return;
        }

        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                setApplied(true);
                // Update local Redux store so the UI stays in sync
                const updatedSingleJob = { 
                    ...singleJob, 
                    applications: [...(singleJob?.applications || []), { applicant: user?._id }] 
                };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to apply");
        }
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                setCheckingStatus(true);
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    
                    // FIX 2: Only mark as applied if the user actually exists
                    const applied = user && res.data.job?.applications?.some(app => app.applicant === user?._id);
                    setApplied(!!applied);
                }
            } catch (error) { 
                console.log(error); 
            } finally { 
                setCheckingStatus(false); 
            }
        };
        if (jobId) fetchSingleJob();
    }, [jobId, dispatch, user?._id]); // Effect runs when user logs in or out

    if (!singleJob) return <div className="flex justify-center items-center h-screen text-gray-500 italic">Loading details...</div>;

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />
            <div className="max-w-4xl mx-auto my-10 px-4">
                {/* Header Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                            <h1 className="font-extrabold text-3xl text-gray-900">{singleJob.title}</h1>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className="text-blue-600 bg-blue-50 hover:bg-blue-50 border-none px-3 py-1 font-bold" variant="outline">
                                    {singleJob.position} Positions
                                </Badge>
                                <Badge className="text-[#F83002] bg-red-50 hover:bg-red-50 border-none px-3 py-1 font-bold" variant="outline">
                                    {singleJob.jobType}
                                </Badge>
                                <Badge className="text-[#7209b7] bg-purple-50 hover:bg-purple-50 border-none px-3 py-1 font-bold" variant="outline">
                                    {singleJob.salary} LPA
                                </Badge>
                            </div>
                        </div>

                        <Button
                            onClick={!isApplied && !checkingStatus ? applyJobHandler : undefined}
                            disabled={isApplied || checkingStatus}
                            className={`px-8 py-6 text-md font-bold rounded-xl transition-all duration-300 shadow-md ${
                                isApplied ? "bg-gray-400 cursor-not-allowed" : "bg-[#7209b7] hover:bg-[#5f079e] active:scale-95"
                            }`}
                        >
                            {checkingStatus ? "Checking..." : isApplied ? "Already Applied" : "Apply Now"}
                        </Button>
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-4">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                            <Briefcase size={20} className="text-gray-500" />
                            Job Overview
                        </h2>
                    </div>
                    
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <DetailItem icon={<MapPin size={18}/>} label="Location" value={singleJob.location} />
                            <DetailItem icon={<IndianRupee size={18}/>} label="Salary" value={`${singleJob.salary} LPA`} />
                            <DetailItem icon={<Users size={18}/>} label="Total Applicants" value={singleJob?.applications?.length || 0} />
                            <DetailItem icon={<Calendar size={18}/>} label="Posted Date" value={new Date(singleJob.createdAt).toLocaleDateString()} />
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-3">Description</h3>
                            <p className="text-gray-600 leading-relaxed text-md">
                                {singleJob.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="p-2 bg-gray-100 rounded-lg text-gray-600 mt-0.5">{icon}</div>
        <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-gray-800 font-medium capitalize">{value}</p>
        </div>
    </div>
);

export default JobDescription;