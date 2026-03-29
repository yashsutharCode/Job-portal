import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
  const { searchCompanyByText } = useSelector((store) => store.company);
  const { allAdminJobs } = useSelector((store) => store.job);

  const [filterJobs, setFilterJobs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(allAdminJobs)) {
      setFilterJobs([]);
      return;
    }

    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchCompanyByText) return true;

      return job?.company?.name
        ?.toLowerCase()
        .includes(searchCompanyByText.toLowerCase());
    });

    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchCompanyByText]);

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent posted jobs</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!Array.isArray(filterJobs) || filterJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No jobs found.
              </TableCell>
            </TableRow>
          ) : (
            filterJobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job?.company?.name}</TableCell>

                <TableCell>{job?.title}</TableCell>

                <TableCell>
                  {job?.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "N/A"}
                </TableCell>

                <TableCell className="text-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>

                    <PopoverContent className="w-32">
                      <div
                        onClick={() =>
                          navigate(`/admin/jobs/${job._id}`)
                        }
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Edit2 className="w-4" />
                        <span>Edit</span>
                      </div>
                      <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} className="flex items-center w-fit gap-2 cursor-pointer mt-2" >
                        <Eye className="w-4" />
                        <span>Applicants</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;