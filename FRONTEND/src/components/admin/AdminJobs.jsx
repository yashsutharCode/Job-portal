import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";

const AdminJobs = () => {
  useGetAllAdminJobs(); // 🔥 fetch all admin jobs on component mount
  const navigate = useNavigate();
  const [search, setSearch] = useState(""); // 🔥 filter state

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          {/* ✅ ONLY FILTER (TOP) */}
          <Input
            className="w-fit"
            placeholder="Filter by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button onClick={() => navigate("/admin/jobs/create")}>
            New Jobs
          </Button>
        </div>

        {/* 🔥 PASS FILTER TO TABLE */}
        {/* <CompaniesTable search={search} /> */}
        <AdminJobsTable />
      </div>
    </div>
  );
};

export default AdminJobs;
