"use client";

const activities = [
  {
    id: 1,
    type: "appointment",
    message: "New appointment scheduled with Dr. Smith",
    time: "2 minutes ago",
    avatar: "DS",
  },
  {
    id: 2,
    type: "staff",
    message: "Sarah Johnson updated her profile",
    time: "1 hour ago",
    avatar: "SJ",
  },
  {
    id: 3,
    type: "doctor",
    message: "Dr. Brown completed 5 appointments",
    time: "3 hours ago",
    avatar: "DB",
  },
  {
    id: 4,
    type: "system",
    message: "Monthly report generated successfully",
    time: "1 day ago",
    avatar: "SY",
  },
];

export default function RecentActivity() {
  return (
    <div className="neumorph-flat p-6 bg-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">
                {activity.avatar}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <button className="text-sm text-primary hover:underline">
          View all activity
        </button>
      </div>
    </div>
  );
}