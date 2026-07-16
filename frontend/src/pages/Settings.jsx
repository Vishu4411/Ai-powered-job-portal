import { useState } from "react";

function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
        Settings
      </h1>

      <div className="space-y-6">

        {/* Account */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
            Account
          </h2>

          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700"
          />
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
            Notifications
          </h2>

          <label className="flex items-center justify-between py-2">
            <span>Email Notifications</span>

            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() =>
                setEmailNotifications(!emailNotifications)
              }
            />
          </label>

          <label className="flex items-center justify-between py-2">
            <span>Job Alerts</span>

            <input
              type="checkbox"
              checked={jobAlerts}
              onChange={() => setJobAlerts(!jobAlerts)}
            />
          </label>
        </div>

        <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg">
          Save Changes
        </button>

      </div>
    </div>
  );
}

export default Settings;