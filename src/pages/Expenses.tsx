import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { api, ExpenseCategory, MonthlyExpense } from '../lib/api';

interface MonthlyExpense {
  month: string;
  amount: number;
  change: number;
}

const Expenses = () => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [monthly, setMonthly] = useState<MonthlyExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getExpenses()
      .then(res => {
        setCategories(res.categories || []);
        setMonthly(res.monthly || []);
      })
      .catch(() => {
        setError('Failed to load expenses.');
      })
      .finally(() => setLoading(false));
  }, []);

  const totalExpenses = categories.reduce((sum, cat) => sum + (cat.amount || 0), 0);

  if (loading) {
    return <div className="text-center py-8"><p className="text-gray-500">Loading expenses...</p></div>;
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
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Expenses</p>
          <p className="text-2xl font-bold text-blue-700">${totalExpenses.toLocaleString()}</p>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-gray-600">${category.amount?.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color || 'bg-blue-500'}`}
                      style={{ width: `${category.percentage || 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 text-right">{category.percentage || 0}% of total</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthly.map((month) => (
                <div
                  key={month.month}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{month.month} 2025</p>
                    <p className="text-sm text-gray-500">
                      {month.change > 0 ? '▲' : '▼'} {Math.abs(month.change)}% from previous
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${month.amount?.toLocaleString()}</p>
                    <p className={`text-sm ${month.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {month.change > 0 ? '+' : ''}{month.change}%
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

export default Expenses;
