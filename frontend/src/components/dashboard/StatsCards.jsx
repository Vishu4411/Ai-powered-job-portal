import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Send,
  Heart,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

import { getDashboardStats } from "../../services/dashboardService";

function StatsCards() {

  const [stats, setStats] = useState({
    totalJobs: 0,
    appliedJobs: 0,
    savedJobs: 0,
  });

  useEffect(() => {

    const email = localStorage.getItem("email");

    getDashboardStats(email)
      .then((response) => {
        setStats(response.data);
      })
      .catch(console.log);

  }, []);

  const cards = [

    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      color: "from-blue-500 to-cyan-500",
    },

    {
      title: "Applied Jobs",
      value: stats.appliedJobs,
      icon: Send,
      color: "from-violet-500 to-fuchsia-500",
    },

    {
      title: "Saved Jobs",
      value: stats.savedJobs,
      icon: Heart,
      color: "from-pink-500 to-rose-500",
    },

    {
      title: "Success Rate",
      value:
        stats.appliedJobs === 0
          ? "0%"
          : Math.round(
              (stats.savedJobs / stats.appliedJobs) * 100
            ) + "%",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
    },

  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {cards.map((item, index) => {

        const Icon = item.icon;

        return (

          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >

            <div
              className={`absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br ${item.color} opacity-20 blur-3xl`}
            />

            <div className="flex justify-between items-center">

              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
              >
                <Icon className="text-white w-5 h-5" />
              </div>

              <span className="text-green-400 flex items-center text-sm">
                <ArrowUpRight size={16} />
                Live
              </span>

            </div>

            <h2 className="mt-6 text-4xl font-bold text-white">
              {item.value}
            </h2>

            <p className="text-slate-400 mt-1">
              {item.title}
            </p>

          </motion.div>

        );

      })}

    </div>

  );
}

export default StatsCards;