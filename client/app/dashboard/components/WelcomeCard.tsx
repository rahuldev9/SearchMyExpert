import NotificationBell from "@/components/NotificationBell";

interface Props {
  name: string;
}

export default function WelcomeCard({ name }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border-none flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {name} 👋</h1>

        <p className="text-gray-500 mt-1">
          Here's what's happening on your dashboard today.
        </p>
      </div>

      <NotificationBell />
    </div>
  );
}
