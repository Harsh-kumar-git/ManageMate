import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, DollarSign, TrendingUp, Users, Package, Bell } from 'lucide-react';

interface DashboardMetric {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: any;
}

interface RecentActivity {
  id: string;
  type: 'sale' | 'inventory' | 'client' | 'expense';
  description: string;
  timestamp: string;
  amount?: string;
}

const metrics: DashboardMetric[] = [
  {
    label: 'Total Revenue',
    value: '$48,574',
    change: 12.5,
    changeLabel: 'from last month',
    icon: DollarSign,
  },
  {
    label: 'Active Clients',
    value: '128',
    change: 8.2,
    changeLabel: 'new this month',
    icon: Users,
  },
  {
    label: 'Inventory Items',
    value: '1,274',
    change: -3.1,
    changeLabel: 'in stock',
    icon: Package,
  },
  {
    label: 'Growth Rate',
    value: '24.5%',
    change: 4.2,
    changeLabel: 'vs last quarter',
    icon: TrendingUp,
  },
];

const recentActivity: RecentActivity[] = [
  {
    id: 'ACT1',
    type: 'sale',
    description: 'New sale to Tech Solutions Inc.',
    timestamp: '2025-04-12T10:30:00',
    amount: '$2,450',
  },
  {
    id: 'ACT2',
    type: 'inventory',
    description: 'Low stock alert: Premium Widgets',
    timestamp: '2025-04-12T09:45:00',
  },
  {
    id: 'ACT3',
    type: 'client',
    description: 'New client registration: Global Retail',
    timestamp: '2025-04-12T09:15:00',
  },
  {
    id: 'ACT4',
    type: 'expense',
    description: 'Monthly software subscription renewed',
    timestamp: '2025-04-12T08:30:00',
    amount: '$199',
  },
];

const upcomingEvents = [
  {
    title: 'Client Meeting',
    description: 'Review Q2 strategy with Tech Solutions',
    date: '2025-04-13T14:00:00',
  },
  {
    title: 'Inventory Check',
    description: 'Monthly stock verification',
    date: '2025-04-14T10:00:00',
  },
  {
    title: 'Team Review',
    description: 'Monthly performance review',
    date: '2025-04-15T11:00:00',
  },
];

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <Button>
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`p-2 rounded-full ${metric.change >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <metric.icon className={`h-5 w-5 ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <span className={`text-sm ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </span>
                <span className="ml-2 text-sm text-gray-500">{metric.changeLabel}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className={`p-2 rounded-full ${
                    activity.type === 'sale' ? 'bg-green-100' :
                    activity.type === 'inventory' ? 'bg-yellow-100' :
                    activity.type === 'client' ? 'bg-blue-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'sale' ? <DollarSign className="h-4 w-4 text-green-600" /> :
                     activity.type === 'inventory' ? <Package className="h-4 w-4 text-yellow-600" /> :
                     activity.type === 'client' ? <Users className="h-4 w-4 text-blue-600" /> :
                     <TrendingUp className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-medium text-gray-900">{activity.amount}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="p-2 rounded-full bg-blue-100">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.description}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Dashboard;
