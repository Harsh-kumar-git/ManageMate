import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Receipt,
  Users,
  BarChart,
  Settings,
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/inventory', icon: Package, label: 'Inventory' },
  { path: '/sales', icon: DollarSign, label: 'Sales' },
  { path: '/expenses', icon: Receipt, label: 'Expenses' },
  { path: '/clients', icon: Users, label: 'Clients' },
  { path: '/reports', icon: BarChart, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">ManageMate</h1>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex items-center space-x-3"
                initial={false}
                animate={{
                  color: isActive ? '#2563eb' : '#4b5563',
                }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
