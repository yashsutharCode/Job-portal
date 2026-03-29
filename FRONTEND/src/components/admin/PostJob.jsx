import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PostJob = () => {
  const navigate = useNavigate();

  // ✅ get companies from redux
  const { companies = [] } = useSelector((store) => store.company);

  // ✅ state
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ input handler
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // ✅ select company handler (FIXED)
  const selectChangeHandler = (value) => {
    setInput({ ...input, companyId: value }); // directly store id
  };

  // ✅ submit
  const submitHandler = async (e) => {
    e.preventDefault();

    // 🔥 basic validation
    if (
      !input.title ||
      !input.description ||
      !input.salary ||
      !input.companyId
    ) {
      return toast.error("Please fill all required fields");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${JOB_API_END_POINT}/post`,
        {
          ...input,
          salary: Number(input.salary), // ✅ fix NaN
          position: Number(input.position),
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl w-full border border-gray-200 shadow-lg rounded-md"
        >
          <div className="grid grid-cols-2 gap-4">

            <div>
              <Label>Title</Label>
              <Input name="title" value={input.title} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Description</Label>
              <Input name="description" value={input.description} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Requirements (comma separated)</Label>
              <Input name="requirements" value={input.requirements} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Salary</Label>
              <Input
                type="number"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input name="location" value={input.location} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Job Type</Label>
              <Input name="jobType" value={input.jobType} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Experience</Label>
              <Input name="experience" value={input.experience} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>No of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
              />
            </div>

            {/* ✅ Company Dropdown FIXED */}
            {companies.length > 0 && (
              <div className="col-span-2">
                <Label>Select Company</Label>

                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company._id} // ✅ FIXED (use ID)
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* ✅ BUTTON */}
          {loading ? (
            <Button className="w-full mt-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </Button>
          ) : (
            <Button type="submit" className="w-full mt-4">
              Post Job
            </Button>
          )}

          {/* ❗ No company warning */}
          {companies.length === 0 && (
            <p className="text-xs text-red-600 text-center mt-3">
              *Please register a company first
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;