export default function RecentActivity() {
  const items = [
    "Project 'Automation Bot' completed",
    "New message from client",
    "New project request received",
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

      <div className="bg-white border rounded-xl p-4 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="text-sm text-gray-600">
            • {item}
          </div>
        ))}
      </div>
    </div>
  );
}
