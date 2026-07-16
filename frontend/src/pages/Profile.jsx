import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Github,
  Link as LinkIcon,
  Edit3,
  Save,
  User,
} from "lucide-react";

function Profile() {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "",
    phone: "",
    location: "",
    education: "",
    about: "",
    linkedin: "",
    github: "",
  });

  useEffect(() => {
    setProfile({
      fullName: localStorage.getItem("fullName") || "Guest",
      email: localStorage.getItem("email") || "",
      role: localStorage.getItem("role") || "USER",
      phone: localStorage.getItem("phone") || "+91 9876543210",
      location:
        localStorage.getItem("location") || "Hyderabad, India",
      education:
        localStorage.getItem("education") ||
        "MBA - Marketing & Business Analytics",
      about:
        localStorage.getItem("about") ||
        "Passionate software developer with knowledge in Java, Spring Boot, React, MySQL and Full Stack Development.",
      linkedin:
        localStorage.getItem("linkedin") ||
        "linkedin.com/in/yourprofile",
      github:
        localStorage.getItem("github") ||
        "github.com/yourgithub",
    });
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = () => {
    Object.keys(profile).forEach((key) => {
      localStorage.setItem(key, profile[key]);
    });

    alert("Profile Updated Successfully!");
    setEditing(false);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white text-black dark:bg-slate-800 dark:text-white dark:border-slate-600 px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none";

  const skills = [
    "Java",
    "Spring Boot",
    "React",
    "MySQL",
    "JavaScript",
    "HTML",
    "CSS",
    "Git",
  ];

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">

      <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">

        <><div className="h-36 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div><div className="px-8 pb-8 -mt-16">

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            <div className="flex items-center gap-5">

              <div className="w-32 h-32 rounded-full bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-4xl font-bold text-indigo-600">

                {initials}

              </div>

              <div className="space-y-2">

                {editing ? (

                  <input
                    className={inputClass}
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange} />

                ) : (

                  <h1 className="text-3xl font-bold dark:text-white">
                    {profile.fullName}
                  </h1>

                )}

                <p className="text-indigo-500 font-semibold">
                  {profile.role}
                </p>

              </div>

            </div>

            <button
              onClick={() => {
                if (editing) {
                  saveProfile();
                } else {
                  setEditing(true);
                }
              } }
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3"
            >
              {editing ? <Save size={18} /> : <Edit3 size={18} />}
              {editing ? "Save Profile" : "Edit Profile"}
            </button>

          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-8">

            <div className="flex items-center gap-3">

              <Mail className="text-indigo-600" />

              {editing ? (
                <input
                  className={inputClass}
                  name="email"
                  value={profile.email}
                  onChange={handleChange} />
              ) : (
                <span className="dark:text-white">
                  {profile.email}
                </span>
              )}

            </div>

            <div className="flex items-center gap-3">

              <Phone className="text-indigo-600" />

              {editing ? (
                <input
                  className={inputClass}
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange} />
              ) : (
                <span className="dark:text-white">
                  {profile.phone}
                </span>
              )}

            </div>

            <div className="flex items-center gap-3">

              <MapPin className="text-indigo-600" />

              {editing ? (
                <input
                  className={inputClass}
                  name="location"
                  value={profile.location}
                  onChange={handleChange} />
              ) : (
                <span className="dark:text-white">
                  {profile.location}
                </span>
              )}

            </div>

            <div className="flex items-center gap-3">

              <GraduationCap className="text-indigo-600" />

              {editing ? (
                <input
                  className={inputClass}
                  name="education"
                  value={profile.education}
                  onChange={handleChange} />
              ) : (
                <span className="dark:text-white">
                  {profile.education}
                </span>
              )}

            </div>
          </div>

        </div></>
      </div>

      {/* Main Content */}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left Section */}

        <div className="lg:col-span-2 space-y-6">

          {/* About */}

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">

            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              About Me
            </h2>

            {editing ? (
              <textarea
                rows={6}
                name="about"
                value={profile.about}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />
            ) : (
              <p className="leading-8 text-slate-600 dark:text-slate-300">
                {profile.about}
              </p>
            )}

          </div>

          {/* Education */}

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">

            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Education
            </h2>

            <div className="flex items-center gap-3">

              <GraduationCap className="text-indigo-600" />

              <div>

                <h3 className="font-semibold dark:text-white">
                  {profile.education}
                </h3>

                <p className="text-slate-500">
                  Latest Qualification
                </p>

              </div>

            </div>

          </div>

          {/* Experience */}

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">

            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Experience
            </h2>

            <div className="flex items-center gap-3">

              <Briefcase className="text-indigo-600" />

              <div>

                <h3 className="font-semibold dark:text-white">
                  Fresher
                </h3>

                <p className="text-slate-500">
                  Looking for Full Stack Developer Opportunities
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="space-y-6">

          {/* Skills */}

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">

            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Skills
            </h2>

            <div className="flex flex-wrap gap-3">

              {skills.map((skill) => (

                <span
                  key={skill}
                  className="px-3 py-2 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>

          {/* Social Links */}

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">

            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Social Links
            </h2>

            <div className="space-y-4">

              <div className="flex items-center gap-3">

                <LinkIcon className="text-indigo-600"/>

                {editing ? (

                  <input
                    className={inputClass}
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={handleChange}
                  />

                ) : (

                  <span className="break-all dark:text-white">
                    {profile.linkedin}
                  </span>

                )}

              </div>

              <div className="flex items-center gap-3">

                <Github className="text-indigo-600"/>

                {editing ? (

                  <input
                    className={inputClass}
                    name="github"
                    value={profile.github}
                    onChange={handleChange}
                  />

                ) : (

                  <span className="break-all dark:text-white">
                    {profile.github}
                  </span>

                )}

              </div>

            </div>

          </div>

          {/* Profile Summary */}

          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">

            <div className="flex items-center gap-3 mb-4">

              <User />

              <h2 className="text-xl font-bold">
                Profile Summary
              </h2>

            </div>

            <p className="leading-7">

              Keep your profile updated to receive AI-powered job recommendations,
              interview opportunities, resume suggestions and career insights.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;