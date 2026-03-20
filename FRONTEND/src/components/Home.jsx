import Navbar from "./shared/navbar.jsx"
import HeroSection from "./HeroSection.jsx"
import CategoryCarousel from "./CategoryCarousel.jsx"
import LatestJobs from "./LatestJobs.jsx"
import Footer from "./Footer.jsx"
import useGetAllJobs from "@/hooks/useGetAllJobs.jsx"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, []);

  return (
    <div>
        <Navbar />
        <HeroSection/>
        <CategoryCarousel/>
        <LatestJobs/>
        <Footer/>
    </div>
  )
}

export default Home