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
  Plus,
  Trash2,
  FolderGit2,
  Award,
  Sparkles,
} from "lucide-react";
import {
  getProfile,
  updateProfile,
  addEducation,
  deleteEducation,
  addExperience,
  deleteExperience,
  addProject,
  deleteProject,
  addCertification,
  deleteCertification,
} from "../services/profileService";
import { useToast } from "../context/ToastContext";

function Profile() {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    fullName: localStorage.getItem("fullName") || "Guest",
    email: localStorage.getItem("email") || "",
    role: localStorage.getItem("role") || "ROLE_USER",
    headline: "",
    phone: "",
    location: "",
    bio: "",
    skills: "Java, Spring Boot, React, MySQL",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    completionPercentage: 15,
    educationList: [],
    experienceList: [],
    projectList: [],
    certificationList: [],
  });

  // Modal / Form states for sub-items
  const [showEduModal, setShowEduModal] = useState(false);
  const [eduForm, setEduForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    grade: "",
  });

  const [showExpModal, setShowExpModal] = useState(false);
  const [expForm, setExpForm] = useState({
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });

  const [showProjModal, setShowProjModal] = useState(false);
  const [projForm, setProjForm] = useState({
    title: "",
    description: "",
    techStack: "",
    projectUrl: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setLoading(true);
    getProfile()
      .then((res) => {
        if (res.data) {
          setProfile((prev) => ({
            ...prev,
            ...res.data,
            fullName: res.data.fullName || prev.fullName,
            email: res.data.email || prev.email,
            role: res.data.role || prev.role,
          }));
        }
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async () => {
    try {
      const res = await updateProfile(profile);
      if (res.data) {
        setProfile(res.data);
      }
      showToast("Profile updated successfully!", "success");
      setEditing(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to save profile.", "error");
    }
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      const res = await addEducation(eduForm);
      setProfile(res.data);
      setShowEduModal(false);
      showToast("Education entry added successfully!", "success");
      setEduForm({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
      });
    } catch (err) {
      console.error(err);
      showToast("Failed to add education entry.", "error");
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      const res = await deleteEducation(id);
      setProfile(res.data);
      showToast("Education entry deleted.", "info");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete education entry.", "error");
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      const res = await addExperience(expForm);
      setProfile(res.data);
      setShowExpModal(false);
      showToast("Experience entry added successfully!", "success");
      setExpForm({
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
      });
    } catch (err) {
      console.error(err);
      showToast("Failed to add experience entry.", "error");
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      const res = await deleteExperience(id);
      setProfile(res.data);
      showToast("Experience entry deleted.", "info");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete experience entry.", "error");
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const res = await addProject(projForm);
      setProfile(res.data);
      setShowProjModal(false);
      showToast("Project entry added successfully!", "success");
      setProjForm({
        title: "",
        description: "",
        techStack: "",
        projectUrl: "",
      });
    } catch (err) {
      console.error(err);
      showToast("Failed to add project entry.", "error");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const res = await deleteProject(id);
      setProfile(res.data);
      showToast("Project entry deleted.", "info");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete project entry.", "error");
    }
  };


  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white text-black dark:bg-slate-800 dark:text-white dark:border-slate-600 px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none";

  const initials = (profile.fullName || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const skillArray = profile.skills
    ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner & Hero */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        <div className="h-36 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="px-8 pb-8 -mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-32 h-32 rounded-full bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-4xl font-bold text-indigo-600">
                {initials}
              </div>

              <div className="space-y-2">
                {editing ? (
                  <input
                    className={inputClass}
                    name="headline"
                    placeholder="Professional Headline (e.g. Full Stack Developer)"
                    value={profile.headline || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <>
                    <h1 className="text-3xl font-bold dark:text-white">
                      {profile.fullName}
                    </h1>
                    <p className="text-slate-400 font-medium">
                      {profile.headline || "Full Stack Developer Candidate"}
                    </p>
                  </>
                )}

                <span className="inline-block px-3 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">
                  {profile.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (editing) {
                    saveProfile();
                  } else {
                    setEditing(true);
                  }
                }}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 font-semibold shadow-lg shadow-indigo-600/30 transition"
              >
                {editing ? <Save size={18} /> : <Edit3 size={18} />}
                {editing ? "Save Profile" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Quick Details Bar */}
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            <div className="flex items-center gap-3">
              <Mail className="text-indigo-600 shrink-0" />
              <span className="dark:text-white text-sm">{profile.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-indigo-600 shrink-0" />
              {editing ? (
                <input
                  className={inputClass}
                  name="phone"
                  placeholder="Phone Number"
                  value={profile.phone || ""}
                  onChange={handleChange}
                />
              ) : (
                <span className="dark:text-white text-sm">
                  {profile.phone || "Not specified"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-indigo-600 shrink-0" />
              {editing ? (
                <input
                  className={inputClass}
                  name="location"
                  placeholder="City, Country"
                  value={profile.location || ""}
                  onChange={handleChange}
                />
              ) : (
                <span className="dark:text-white text-sm">
                  {profile.location || "Not specified"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Me */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">About Me</h2>
            {editing ? (
              <textarea
                rows={4}
                name="bio"
                placeholder="Write a brief professional summary..."
                value={profile.bio || ""}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />
            ) : (
              <p className="leading-8 text-slate-600 dark:text-slate-300">
                {profile.bio || "No summary provided yet. Click 'Edit Profile' to add your professional bio."}
              </p>
            )}
          </div>

          {/* Education Section */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <GraduationCap className="text-indigo-600" />
                Education
              </h2>
              <button
                onClick={() => setShowEduModal(true)}
                className="inline-flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg"
              >
                <Plus size={16} /> Add Education
              </button>
            </div>

            {profile.educationList && profile.educationList.length > 0 ? (
              <div className="space-y-4">
                {profile.educationList.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-start"
                  >
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">
                        {edu.institution}
                      </h3>
                      <p className="text-indigo-500 font-medium text-sm">
                        {edu.degree} — {edu.fieldOfStudy}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {edu.startDate} – {edu.endDate} | Grade: {edu.grade || "N/A"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No education history added yet.</p>
            )}
          </div>

          {/* Experience Section */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <Briefcase className="text-indigo-600" />
                Work Experience
              </h2>
              <button
                onClick={() => setShowExpModal(true)}
                className="inline-flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg"
              >
                <Plus size={16} /> Add Experience
              </button>
            </div>

            {profile.experienceList && profile.experienceList.length > 0 ? (
              <div className="space-y-4">
                {profile.experienceList.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-start"
                  >
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">
                        {exp.position} at {exp.company}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate} | {exp.location}
                      </p>
                      <p className="text-sm text-slate-300 mt-2">{exp.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No work experience added yet.</p>
            )}
          </div>

          {/* Projects Section */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <FolderGit2 className="text-indigo-600" />
                Projects
              </h2>
              <button
                onClick={() => setShowProjModal(true)}
                className="inline-flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg"
              >
                <Plus size={16} /> Add Project
              </button>
            </div>

            {profile.projectList && profile.projectList.length > 0 ? (
              <div className="space-y-4">
                {profile.projectList.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-start"
                  >
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-indigo-400 mt-1">
                        Tech Stack: {proj.techStack}
                      </p>
                      <p className="text-sm text-slate-300 mt-2">{proj.description}</p>
                      {proj.projectUrl && (
                        <a
                          href={proj.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-500 hover:underline mt-2 block"
                        >
                          View Project ↗
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No portfolio projects added yet.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Completion Card */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="text-amber-400" />
                Profile Score
              </h2>
              <span className="text-2xl font-extrabold text-amber-400">
                {profile.completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${profile.completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Complete your bio, skills, education, and experience to reach 100% profile strength.
            </p>
          </div>

          {/* Skills */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Skills</h2>
            {editing ? (
              <input
                className={inputClass}
                name="skills"
                placeholder="Comma separated skills (e.g. Java, React, SQL)"
                value={profile.skills || ""}
                onChange={handleChange}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {skillArray.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Links</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <LinkIcon className="text-indigo-600 shrink-0" />
                {editing ? (
                  <input
                    className={inputClass}
                    name="linkedinUrl"
                    placeholder="LinkedIn URL"
                    value={profile.linkedinUrl || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="break-all dark:text-white">
                    {profile.linkedinUrl || "LinkedIn link not added"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Github className="text-indigo-600 shrink-0" />
                {editing ? (
                  <input
                    className={inputClass}
                    name="githubUrl"
                    placeholder="GitHub URL"
                    value={profile.githubUrl || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="break-all dark:text-white">
                    {profile.githubUrl || "GitHub link not added"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals for Education, Experience, Project */}
      {showEduModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleAddEducation}
            className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md space-y-4"
          >
            <h3 className="text-xl font-bold text-white">Add Education</h3>
            <input
              required
              className={inputClass}
              placeholder="Institution (e.g. Harvard / IIT)"
              value={eduForm.institution}
              onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
            />
            <input
              required
              className={inputClass}
              placeholder="Degree (e.g. B.Tech / MBA)"
              value={eduForm.degree}
              onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Field of Study (e.g. Computer Science)"
              value={eduForm.fieldOfStudy}
              onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
            />
            <div className="flex gap-2">
              <input
                className={inputClass}
                placeholder="Start Year"
                value={eduForm.startDate}
                onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="End Year"
                value={eduForm.endDate}
                onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowEduModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold"
              >
                Save Education
              </button>
            </div>
          </form>
        </div>
      )}

      {showExpModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleAddExperience}
            className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md space-y-4"
          >
            <h3 className="text-xl font-bold text-white">Add Work Experience</h3>
            <input
              required
              className={inputClass}
              placeholder="Company Name"
              value={expForm.company}
              onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
            />
            <input
              required
              className={inputClass}
              placeholder="Job Position / Role"
              value={expForm.position}
              onChange={(e) => setExpForm({ ...expForm, position: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Location"
              value={expForm.location}
              onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
            />
            <div className="flex gap-2">
              <input
                className={inputClass}
                placeholder="Start Date"
                value={expForm.startDate}
                onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="End Date"
                value={expForm.endDate}
                onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
              />
            </div>
            <textarea
              className={`${inputClass} resize-none`}
              placeholder="Role description & key achievements..."
              value={expForm.description}
              onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowExpModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold"
              >
                Save Experience
              </button>
            </div>
          </form>
        </div>
      )}

      {showProjModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleAddProject}
            className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md space-y-4"
          >
            <h3 className="text-xl font-bold text-white">Add Project</h3>
            <input
              required
              className={inputClass}
              placeholder="Project Title"
              value={projForm.title}
              onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Tech Stack (e.g. Java, React, MySQL)"
              value={projForm.techStack}
              onChange={(e) => setProjForm({ ...projForm, techStack: e.target.value })}
            />
            <textarea
              className={`${inputClass} resize-none`}
              placeholder="Project summary..."
              value={projForm.description}
              onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Project Link / GitHub URL"
              value={projForm.projectUrl}
              onChange={(e) => setProjForm({ ...projForm, projectUrl: e.target.value })}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowProjModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Profile;