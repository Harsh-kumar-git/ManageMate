import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { UserCircle } from 'lucide-react';

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-700">Welcome, {user?.name}</h2>
      </div>
      <div className="flex items-center space-x-4">
        <UserCircle className="h-8 w-8 text-gray-500" />
        <Button variant="ghost" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
