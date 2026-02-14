import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import axios from "axios";
import { useParams } from "react-router-dom";
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const JobDescription = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();

  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [isApplied, setApplied] = useState(false);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setApplied(true);

        const updatedSingleJob = {
          ...singleJob,
          applications: [
            ...(singleJob?.applications || []),
            { applicant: user?._id },
          ],
        };

        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to apply for the job"
      );
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get/${jobId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));

          const applied = res.data.job?.applications?.some(
            (application) => application.applicant === user?._id
          );

          setApplied(applied);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (jobId) fetchSingleJob();
  }, [jobId, dispatch, user]);

  if (!singleJob) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleJob.title}</h1>

          <div className="flex items-center gap-2 mt-4">
            <Badge className="text-blue-700 font-bold" variant="ghost">
              {singleJob.position} Positions
            </Badge>
            <Badge className="text-[#F83002] font-bold" variant="ghost">
              {singleJob.jobType}
            </Badge>
            <Badge className="text-[#7209b7] font-bold" variant="ghost">
              {singleJob.salary} LPA
            </Badge>
          </div>
        </div>

        <Button
          onClick={!isApplied ? applyJobHandler : undefined}
          disabled={isApplied}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f079e]"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
        Job Description
      </h1>

      <div className="my-4 space-y-2">
        <p><span className="font-bold">Role:</span> {singleJob.title}</p>
        <p><span className="font-bold">Location:</span> {singleJob.location}</p>
        <p><span className="font-bold">Description:</span> {singleJob.description}</p>
        <p><span className="font-bold">Salary:</span> {singleJob.salary} LPA</p>
        <p><span className="font-bold">Total Applicants:</span> {singleJob?.applications?.length || 0}</p>
        <p><span className="font-bold">Posted Date:</span> {new Date(singleJob.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default JobDescription;
