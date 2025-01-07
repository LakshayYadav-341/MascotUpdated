import React, { useState } from "react";
import jobHuntImg from "../../assets/images/job-hunt.svg";
import { useGetter } from "@client/hooks/fetcher.js";
import urls, { serverPath, basePath } from "../../../utils/urls";
import { Autocomplete, Chip, IconButton, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { selectSession } from "../auth/authSlice";
import tempImage from "@client/assets/images/profile.png";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const INITIAL_FORM = {
  title: "",
  company: "",
  description: "",
  endsAt: "",
  experienceYears: ""
};

const JobContainer = () => {
  const navigate = useNavigate();
  const session = useSelector(selectSession);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [company, setCompany] = useState("");
  const [currentSkills, setCurrentSkills] = useState([]);
  const [changedSkill, setChangedSkill] = useState("");

  // API URLs
  const profileUrl = session?.user ? basePath + urls.user.profile.get.replace(':id', session.user) : null;
  const companyUrl = basePath + urls.company.findAll;
  const jobGetUrl = basePath + urls.job.findAll;

  // Data Fetching
  const { data: tempUser } = useGetter(profileUrl, { enabled: !!profileUrl });
  const { data: companyData } = useGetter(companyUrl);
  const { data: jobData, mutate: jobMutate } = useGetter(jobGetUrl);
  const { data: skillsData } = useGetter(basePath + urls.skills);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChangeFormData = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        company,
        skills: currentSkills.map(skill => skill._id)
      };

      const res = await axios.post(basePath + urls.job.create, data, {
        headers: {
          authorization: `Bearer ${session?.token}`
        }
      });

      if (res?.status === 200) {
        setFormData(INITIAL_FORM);
        setCompany("");
        setCurrentSkills([]);
        toast.success("Job Posted Successfully");
        jobMutate();
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const renderJobPost = () => (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-md">
      <div className="mb-4 text-lg">
        <h4 className="font-semibold">Checkout the referrals posted by you.</h4>
        <Link
          to={`/userJob/${session?.user}`}
          className="text-blue-500 hover:underline"
        >
          My Referrals
        </Link>
      </div>
      <hr className="border-gray-700 mb-6" />
      <h3 className="text-2xl font-bold mb-4">Create Referral</h3>
      <form className="space-y-4">
        <div>
          <label htmlFor="job-title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="job-title"
            name="title"
            required
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChangeFormData}
            value={formData.title}
          />
        </div>

        <div>
          <label htmlFor="company-name" className="block text-sm font-medium mb-1">
            Company Name
          </label>
          <Autocomplete
            sx={{
              bgcolor: "transparent",
              "& .MuiOutlinedInput-root.Mui-focused": {
                color: "#fff",
                borderColor: "#1E40AF",
              },
              "& .MuiInputLabel-outlined.Mui-focused": {
                color: "#fff",
              },
            }}
            freeSolo
            options={companyData?.data?.map((company) => company.name) || []}
            renderInput={(params) => (
              <TextField
                {...params}
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            )}
            onChange={(_, value) => setCompany(value)}
            value={company}
          />
        </div>

        <div>
          <label htmlFor="job-description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="job-description"
            name="description"
            required
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChangeFormData}
            value={formData.description}
          />
        </div>

        <div>
          <label htmlFor="job-skills" className="block text-sm font-medium mb-1">
            Skills
          </label>
          <Autocomplete
            sx={{
              bgcolor: "transparent",
              "& .MuiOutlinedInput-root.Mui-focused": {
                color: "#fff",
                borderColor: "#1E40AF",
              },
              "& .MuiInputLabel-outlined.Mui-focused": {
                color: "#fff",
              },
            }}
            freeSolo
            options={
              skillsData?.data
                ?.filter((skill) =>
                  !currentSkills.map((e) => e?._id)?.includes(skill?._id)
                )
                ?.map((e) => e?.name) || []
            }
            renderInput={(params) => <TextField {...params} />}
            value={changedSkill}
            onChange={(_, value, reason) => {
              if (reason === "clear") {
                setChangedSkill("");
                return;
              }
              const selectedSkill = skillsData?.data?.find((k) => k.name === value);
              if (selectedSkill && !currentSkills.some((s) => s._id === selectedSkill._id)) {
                setCurrentSkills((prev) => [...prev, selectedSkill]);
              }
              setChangedSkill("");
            }}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {currentSkills.map((skill, i) => (
              <Chip
                key={i}
                label={skillsData?.data?.find((k) => k._id === skill._id)?.name}
                variant="outlined"
                className="text-gray-100 border-gray-500"
                onDelete={() => {
                  setCurrentSkills((prev) => prev.filter((_, index) => index !== i));
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="job-location" className="block text-sm font-medium mb-1">
            Apply Before
          </label>
          <input
            type="date"
            id="job-location"
            name="endsAt"
            required
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChangeFormData}
            value={formData.endsAt}
          />
        </div>

        <div>
          <label htmlFor="job-salary" className="block text-sm font-medium mb-1">
            Experience in Years
          </label>
          <input
            type="number"
            id="job-salary"
            name="experienceYears"
            required
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChangeFormData}
            value={formData.experienceYears}
          />
        </div>

        <button
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-500 text-gray-300 py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleCreateCompany}
        >
          Post Job
        </button>
      </form>
    </div>
  );

  const renderJobList = () => {
    if (!jobData?.length) {
      return <div style={{ textAlign: "center", margin: "auto 0" }}><h1>No Referral Opportunity. Please visit later. </h1></div>;
    }

    return (
      <div className="bg-gray-800 p-2 rounded-lg">
        <div className="mb-6 text-xl font-semibold text-gray-300">
          Referrals, recommended for you
        </div>
        {jobData.map((job) => (
          <div
            key={job._id}
            className="bg-gray-700 p-4 mb-6 rounded-lg shadow-md flex flex-col space-y-4"
          >
            {/* User Profile Section */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={job?.from?.profilePhoto ? serverPath + job.from.profilePhoto : tempImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-gray-300">
                <h5 className="text-lg font-medium">{job.from.name.first} {job.from.name.last}</h5>
                <p className="text-sm text-gray-400">{job.from.bio}</p>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="flex items-center justify-around text-gray-300 gap-5">
              <div className="text-lg font-medium">
                <p className="me-3 mb-2">
                  Role:
                </p>
                {job.title}
              </div>
              {/* <div className="font-medium">
                <p className="me-3 mb-2">
                  Job Description:
                </p>
                {job.description}
              </div> */}
              <div className="text-gray-300">
                Company: <div className="mt-2 font-semibold">{job.company.name}</div>
              </div>
              <div className="text-gray-400">Experience Years: <div className="mt-2">{job.experienceYears}</div></div>
              <div className="text-gray-400">Apply Before: <div className="mt-2">{formatDate(job.endsAt)}</div></div>
            </div>
            <div className="text-gray-400">
              Skills Required:
              <div className="flex flex-wrap gap-2 mt-1">
                {job?.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-500 text-gray-300 text-sm rounded-full"
                  >
                    {skill?.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => navigate(`/chat?userId=${job?.from?._id}`)}
              className="self-end px-4 py-2 bg-blue-600 text-gray-300 rounded-full shadow hover:bg-blue-500 transition"
            >
              Send Message
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderJobGuidance = () => (
    <div className="bg-gray-800 text-gray-300 p-6 rounded-lg shadow-md space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Job Seeker Guidance</h2>
      </div>
      <div className="text-lg text-gray-300 space-y-4">
        <img
          src={jobHuntImg}
          alt="job-hunt"
          className="w-4/5 mx-auto rounded-lg shadow-md"
        />
        <p>
          Job postings are shared by alumni who have referral opportunities. You can view the job description to determine if it aligns with your needs and interests.
        </p>
        <hr className="border-gray-600" />
        <p>
          If you're interested in a position, feel free to reach out to the alumni directly through chat and inquire about a referral.
        </p>
      </div>
    </div>
  );

  const isAlumni = tempUser?.data?.role === "alumni";

  return (
    <main className="flex flex-col lg:flex-row bg-gray-900 text-gray-300 p-4 gap-6">
      {/* Main Content */}
      <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
        {isAlumni ? renderJobPost() : renderJobList()}
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-2/5 bg-gray-800 p-6 rounded-lg shadow-lg">
        {!isAlumni ? renderJobGuidance() : renderJobList()}
      </div>
    </main>

  );
};

export default JobContainer;