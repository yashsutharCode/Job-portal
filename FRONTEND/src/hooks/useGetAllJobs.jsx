import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector((store) => store.job);
    const { user } = useSelector((store) => store.auth); // 1. Read user state

    useEffect(() => {
        const fetchAllJobs = async () => {
            // 2. Prevent unauthenticated requests if your API requires login
            if (!user) return; 

            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                // 3. Gracefully handle errors without throwing in console
                if (error.response?.status !== 401) {
                    console.log("Error fetching jobs:", error);
                }
            }
        };

        fetchAllJobs();
    }, [searchedQuery, user, dispatch]); // 4. Added missing dependencies
};

export default useGetAllJobs;