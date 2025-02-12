import { Button } from "@/components/ui/button"
import { User, Home, Users, Book, BarChart, Sparkles, Settings, HelpCircle } from "lucide-react"
import type React from "react" // Added import for React

interface NavItem {
  name: string
  tab: string
  icon: any
}

const navItems: NavItem[] = [
  { name: "Dashboard", tab: "dispatch", icon: Home },
  { name: "Users & Teams", tab: "users", icon: Users },
  { name: "Knowledge Base", tab: "knowledge", icon: Book },
  { name: "Analytics", tab: "analytics", icon: BarChart },
  { name: "AI Assistant", tab: "ai", icon: Sparkles },
  { name: "Settings", tab: "settings", icon: Settings },
  { name: "Help", tab: "help", icon: HelpCircle },
]

interface SidebarProps {
  className?: string
  activeTab: string
  setActiveTab: (tab: string) => void
  setSidebarOpen: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ className = "", activeTab, setActiveTab, setSidebarOpen }) => (
  <div className={`flex flex-col h-full ${className}`}>
    <div className="p-4 border-b">
      <h2 className="text-2xl font-semibold">ServicePRO Elite</h2>
    </div>
    <nav className="flex-grow p-4">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.tab}>
            <Button
              variant={activeTab === item.tab ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab(item.tab)
                setSidebarOpen(false)
              }}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
    <div className="p-4 border-t">
      <div className="flex items-center space-x-4">
        <User className="w-6 h-6" />
        <div>
          <p className="font-medium">Admin User</p>
          <p className="text-sm text-gray-500">admin</p>
        </div>
      </div>
    </div>
  </div>
)

export default Sidebar

