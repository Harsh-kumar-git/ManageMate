import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, KPI, Report } from '../lib/api';

interface Report {
  title: string;
  description: string;
  date: string;
  stats: {
    value: string;
    change: number;
    label: string;
  }[];
}

interface KPI {
  label: string;
  value: string;
  trend: 'up' | 'down';
  icon?: React.ElementType;
}

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getReports()
      .then(res => {
        setKpis(res.kpis || []);
        setReports(res.reports || []);
      })
      .catch(() => {
        setError('Failed to load reports.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-8"><p className="text-gray-500">Loading reports...</p></div>;
  }
  if (error) {
    return <div className="text-center py-8"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{kpi.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>
                <div className={`p-2 rounded-full ${kpi.trend === 'up' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {kpi.icon && <kpi.icon className={`h-4 w-4 ${kpi.trend === 'up' ? 'text-green-600' : 'text-blue-600'}`} />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.title}>
            <CardHeader>
              <CardTitle>{report.title}</CardTitle>
              <p className="text-sm text-gray-500">{report.description}</p>
              <p className="text-xs text-gray-400">{report.date}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {report.stats.map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="font-medium">{stat.label}</span>
                    <span className="text-gray-700">{stat.value}</span>
                    <span className={`text-xs ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stat.change >= 0 ? '+' : ''}{stat.change}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default Reports;
