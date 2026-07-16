export const stats = [
  { label: "Applications", value: 128, change: 12, icon: "Send" },
  { label: "Interviews", value: 14, change: 4, icon: "Video" },
  { label: "Offers", value: 3, change: 1, icon: "Trophy" },
  { label: "Profile Views", value: 892, change: 23, icon: "Eye" },
];

export const activityData = [
  { name: "Mon", applications: 12, interviews: 2 },
  { name: "Tue", applications: 18, interviews: 3 },
  { name: "Wed", applications: 9, interviews: 1 },
  { name: "Thu", applications: 22, interviews: 4 },
  { name: "Fri", applications: 15, interviews: 2 },
  { name: "Sat", applications: 6, interviews: 1 },
  { name: "Sun", applications: 4, interviews: 1 },
];

export const monthlyApps = [
  { m: "Jan", v: 32 }, { m: "Feb", v: 45 }, { m: "Mar", v: 58 },
  { m: "Apr", v: 42 }, { m: "May", v: 78 }, { m: "Jun", v: 92 },
  { m: "Jul", v: 110 }, { m: "Aug", v: 128 },
];

export const skills = [
  { name: "React", level: 92 },
  { name: "TypeScript", level: 88 },
  { name: "Node.js", level: 75 },
  { name: "Python", level: 68 },
  { name: "System Design", level: 60 },
  { name: "AWS", level: 55 },
];

export const jobs = [
  { id: 1, title: "Senior Frontend Engineer", company: "Stripe", logo: "S", location: "Remote", salary: "$180k – $240k", type: "Full-time", exp: "5+ yrs", tags: ["React", "TypeScript", "GraphQL"], match: 96, posted: "2d ago" },
  { id: 2, title: "Product Designer", company: "Linear", logo: "L", location: "San Francisco", salary: "$150k – $200k", type: "Full-time", exp: "3+ yrs", tags: ["Figma", "Design Systems"], match: 89, posted: "1d ago" },
  { id: 3, title: "ML Engineer", company: "OpenAI", logo: "O", location: "Remote", salary: "$220k – $320k", type: "Full-time", exp: "4+ yrs", tags: ["PyTorch", "LLMs", "Python"], match: 84, posted: "5h ago" },
  { id: 4, title: "Full Stack Developer", company: "Vercel", logo: "V", location: "Remote", salary: "$160k – $210k", type: "Full-time", exp: "3+ yrs", tags: ["Next.js", "Node"], match: 91, posted: "3d ago" },
  { id: 5, title: "Data Scientist", company: "Notion", logo: "N", location: "New York", salary: "$140k – $190k", type: "Full-time", exp: "2+ yrs", tags: ["SQL", "Python", "ML"], match: 78, posted: "1w ago" },
  { id: 6, title: "DevOps Engineer", company: "Cloudflare", logo: "C", location: "Remote", salary: "$155k – $200k", type: "Full-time", exp: "4+ yrs", tags: ["K8s", "Terraform"], match: 82, posted: "4d ago" },
];

export const applications = [
  { id: 1, company: "Stripe", role: "Senior Frontend Engineer", status: "Interview", date: "Aug 3", stage: 3 },
  { id: 2, company: "Linear", role: "Product Designer", status: "Applied", date: "Aug 5", stage: 1 },
  { id: 3, company: "Vercel", role: "Full Stack Developer", status: "Offer", date: "Jul 28", stage: 4 },
  { id: 4, company: "Notion", role: "Data Scientist", status: "Rejected", date: "Jul 22", stage: 0 },
  { id: 5, company: "OpenAI", role: "ML Engineer", status: "Screening", date: "Aug 6", stage: 2 },
];

export const notifications = [
  { id: 1, title: "Interview scheduled with Stripe", time: "10m ago", type: "interview" },
  { id: 2, title: "Your resume matches 3 new roles", time: "1h ago", type: "match" },
  { id: 3, title: "Vercel viewed your profile", time: "3h ago", type: "view" },
  { id: 4, title: "New course: Advanced System Design", time: "1d ago", type: "learning" },
];

export const messages = [
  { id: 1, name: "Sarah Chen", role: "Recruiter · Stripe", preview: "Hey! I loved your portfolio. Are you available…", time: "12m", unread: true },
  { id: 2, name: "Marcus Wolf", role: "Engineering Manager · Linear", preview: "Great chat today. Next steps below…", time: "2h", unread: true },
  { id: 3, name: "Priya Patel", role: "Talent · Vercel", preview: "Offer letter attached 🎉", time: "1d", unread: false },
];

export const courses = [
  { id: 1, title: "System Design Masterclass", instructor: "Alex Xu", duration: "12h", progress: 42, level: "Advanced" },
  { id: 2, title: "React 19 Deep Dive", instructor: "Dan Abramov", duration: "8h", progress: 78, level: "Intermediate" },
  { id: 3, title: "Behavioral Interviews", instructor: "Jane Kim", duration: "4h", progress: 20, level: "All levels" },
  { id: 4, title: "LLM Engineering", instructor: "Andrej K.", duration: "10h", progress: 0, level: "Advanced" },
];

export const companies = [
  { id: 1, name: "Stripe", logo: "S", industry: "Fintech", employees: "8000+", openRoles: 42, rating: 4.8 },
  { id: 2, name: "Linear", logo: "L", industry: "Productivity", employees: "80+", openRoles: 6, rating: 4.9 },
  { id: 3, name: "Vercel", logo: "V", industry: "Developer Tools", employees: "500+", openRoles: 18, rating: 4.7 },
  { id: 4, name: "OpenAI", logo: "O", industry: "AI Research", employees: "2000+", openRoles: 87, rating: 4.6 },
  { id: 5, name: "Notion", logo: "N", industry: "Productivity", employees: "600+", openRoles: 22, rating: 4.7 },
  { id: 6, name: "Cloudflare", logo: "C", industry: "Infrastructure", employees: "3000+", openRoles: 55, rating: 4.5 },
];

export const interviews = [
  { id: 1, company: "Stripe", role: "Senior Frontend", when: "Tomorrow · 2:00 PM", type: "Technical" },
  { id: 2, company: "Linear", role: "Product Designer", when: "Thu · 11:00 AM", type: "Portfolio" },
  { id: 3, company: "OpenAI", role: "ML Engineer", when: "Aug 15 · 4:30 PM", type: "System Design" },
];