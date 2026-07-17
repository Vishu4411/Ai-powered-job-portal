import DashboardCard from "../components/DashboardCard";
import "../styles/Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      <div className="welcome">
        <h1>Welcome Back, Vishnu 👋</h1>
        <p>Let's find your dream job today.</p>
      </div>

      <div className="cards">

        <DashboardCard
          title="Jobs"
          value="1250"
        />

        <DashboardCard
          title="Applications"
          value="18"
        />

        <DashboardCard
          title="Resume Score"
          value="92%"
        />

        <DashboardCard
          title="AI Match"
          value="87%"
        />

      </div>

    </div>
  );
}

export default Dashboard;