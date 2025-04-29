import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '../components/ErrorBoundary';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ErrorBoundary>
          <Topbar />
        </ErrorBoundary>
        <main className="flex-1 overflow-y-auto p-6">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default MainLayout;
