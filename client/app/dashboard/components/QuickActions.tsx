import Link from "next/link";
import {
  FolderPlus,
  Search,
  MessageSquare,
  ClipboardList,
  Folder,
} from "lucide-react";

interface Props {
  role?: "business" | "expert";
}

export default function QuickActions({ role }: Props) {
  const businessActions = [
    { name: "Search Experts", icon: Search, link: "/experts" },
    {
      name: "Post Project",
      icon: FolderPlus,
      link: "/dashboard/projects/create",
    },
    { name: "My Projects", icon: Folder, link: "/dashboard/my-projects" },
    { name: "Messages", icon: MessageSquare, link: "/dashboard/chats" },
  ];

  const expertActions = [
    { name: "Projects", icon: ClipboardList, link: "/dashboard/projects" },
    { name: "My Projects", icon: Folder, link: "/dashboard/projects" },
    { name: "Messages", icon: MessageSquare, link: "/dashboard/chats" },
  ];

  const actions = role === "business" ? businessActions : expertActions;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.name}
              href={action.link}
              className="bg-white border-none rounded-xl p-4 hover:shadow-md transition flex flex-col items-center text-center gap-2"
            >
              <Icon className="text-blue-600" size={28} />
              <span className="text-sm font-medium">{action.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
