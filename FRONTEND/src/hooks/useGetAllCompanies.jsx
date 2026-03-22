import { setCompanies } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "../utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get`,
          {
            withCredentials: true, // 🔥 important for auth cookie
          }
        );

        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        console.log("GET COMPANIES ERROR:", error);
      }
    };

    fetchCompanies(); // ✅ directly call (no condition needed)
  }, [dispatch]); // ✅ dependency fixed
};

export default useGetAllCompanies;