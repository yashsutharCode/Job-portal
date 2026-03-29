import { setAllJobs } from "../redux/jobSlice";
import { JOB_API_END_POINT } from "../utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const {searchedQuery} = useSelector(store => store.job);

  useEffect(() => {
    const controller = new AbortController(); // ✅ cancel request if unmount

    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery} `, {
          withCredentials: true,
          signal: controller.signal, // ✅ attach signal
        });

        if (res?.data?.success) {
          dispatch(setAllJobs(res.data.jobs || []));
        }
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.log(
            "Error fetching jobs:",
            error?.response?.data?.message || error.message
          );
        }
      }
    };

    fetchAllJobs();

    return () => {
      controller.abort(); // ✅ cancel API call on unmount
    };
  }, [dispatch]);
};

export default useGetAllJobs;