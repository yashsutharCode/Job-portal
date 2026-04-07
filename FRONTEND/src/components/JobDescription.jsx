import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Calendar, MapPin, Briefcase, IndianRupee, Users, Sparkles, Target, AlertCircle } from "lucide-react";
import Navbar from "./shared/navbar";

const JobDescription = () => {
    const { id: jobId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { singleJob } = useSelector((store) => store.job);
    const { user } = useSelector((store) => store.auth);

    const [isApplied, setApplied] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    
    // AI States
    const [aiData, setAiData] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);

    // AI Match Logic
    const handleAiMatch = async () => {
        if (!user) {
            toast.error("Please login to use AI matching");
            return;
        }
        if (!user?.profile?.skills || user.profile.skills.length === 0) {
            toast.error("Please add skills to your profile first!");
            return;
        }

        setLoadingAI(true);
        try {
            // Updated to match your folder structure/route
            const res = await axios.post(`https://job-find-8.onrender.com/api/v1/ai/match`, {
                resumeSkills: user?.profile?.skills?.join(", "),
                jobDescription: singleJob?.description
            }, { withCredentials: true });

            if (res.data.success) {
                setAiData(res.data.data);
                toast.success("AI Analysis Complete!");
            }
        } catch (error) {
            toast.error("AI could not analyze this job. Check backend logs.");
        } finally {
            setLoadingAI(false);
        }
    };

    const applyJobHandler = async () => {
        if (!user) {
            toast.error("Please login or signup to apply!");
            navigate("/login");
            return;
        }

        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                setApplied(true);
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
    }, [jobId, dispatch, user?._id]);

    if (!singleJob) return <div className="flex justify-center items-center h-screen text-gray-500 italic text-lg">Loading job details...</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-10">
            <Navbar />
            <div className="max-w-4xl mx-auto my-10 px-4">
                
                {/* Header Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                            <h1 className="font-extrabold text-3xl text-gray-900">{singleJob.title}</h1>
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                <Badge className="text-blue-600 bg-blue-50 border-none px-3 py-1 font-bold" variant="outline">
                                    {singleJob.position} Positions
                                </Badge>
                                <Badge className="text-[#F83002] bg-red-50 border-none px-3 py-1 font-bold" variant="outline">
                                    {singleJob.jobType}
                                </Badge>
                                <Badge className="text-[#7209b7] bg-purple-50 border-none px-3 py-1 font-bold" variant="outline">
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

                {/* AI ANALYSIS SECTION */}
                {user && (
                    <div className="bg-linear-to-br from-[#f3e8ff] to-[#e0e7ff] border border-purple-200 rounded-2xl p-6 mb-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-[#7209b7]" size={22} />
                                <h2 className="font-bold text-gray-800 text-lg">AI Smart Match</h2>
                            </div>
                            {aiData && (
                                <div className="flex items-center gap-1 bg-white/50 px-3 py-1 rounded-full text-xs font-bold text-purple-700 border border-purple-200">
                                    <Target size={14} /> Powered by Gemini
                                </div>
                            )}
                        </div>
                        
                        {!aiData ? (
                            <div className="flex flex-col items-start gap-3">
                                <p className="text-gray-600 text-sm">Check how well your skills match this specific job description using AI analysis.</p>
                                <Button 
                                    onClick={handleAiMatch} 
                                    disabled={loadingAI}
                                    className="bg-white text-[#7209b7] border border-[#7209b7] hover:bg-purple-50 shadow-none font-bold"
                                >
                                    {loadingAI ? "Analyzing..." : "Calculate Match Score"}
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
                                <div className="md:col-span-1 flex flex-col items-center justify-center bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                                    <span className="text-5xl font-black text-[#7209b7]">{aiData.score}%</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter mt-1">Match Percentage</span>
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <div>
                                        <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <AlertCircle size={14} /> Analysis Feedback
                                        </p>
                                        <p className="text-gray-700 text-sm leading-relaxed font-medium italic">"{aiData.feedback}"</p>
                                    </div>
                                    {aiData.missingSkills?.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Recommended to Learn:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {aiData.missingSkills.map((skill, index) => (
                                                    <Badge key={index} className="bg-white text-gray-600 border-gray-200 font-medium hover:bg-white">
                                                        + {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Job Overview Section */}
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
                            <p className="text-gray-600 leading-relaxed text-md whitespace-pre-wrap">
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