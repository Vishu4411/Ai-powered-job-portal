import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", applications: 12 },
  { month: "Feb", applications: 18 },
  { month: "Mar", applications: 28 },
  { month: "Apr", applications: 36 },
  { month: "May", applications: 52 },
  { month: "Jun", applications: 61 },
  { month: "Jul", applications: 74 },
  { month: "Aug", applications: 88 },
];

function ApplicationChart() {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <h2 className="text-xl font-semibold text-white">
        Applications Over Time
      </h2>

      <p className="text-slate-400 mb-6">
        Last 8 Months
      </p>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            <XAxis dataKey="month" stroke="#94a3b8" />

            <YAxis stroke="#94a3b8" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="applications"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorApp)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ApplicationChart;