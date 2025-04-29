import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { api, Transaction } from '../lib/api';

interface Transaction {
  id: string;
  customer: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

const Sales = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getSales()
      .then(setTransactions)
      .catch(() => {
        setError('Failed to load sales transactions.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-8"><p className="text-gray-500">Loading sales...</p></div>;
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
      <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Today's Sales</p>
                  <p className="text-2xl font-bold text-blue-700">$1,249.99</p>
                  <p className="text-xs text-blue-500">+12% from yesterday</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Monthly Sales</p>
                  <p className="text-2xl font-bold text-green-700">$45,299.99</p>
                  <p className="text-xs text-green-500">+8% from last month</p>
                </div>
              </div>
              <div className="h-[200px] bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Sales chart visualization placeholder</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transaction.customer}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${transaction.amount?.toFixed(2)}</p>
                    <p className={`text-sm ${
                      transaction.status === 'completed' ? 'text-green-600' : transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
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

export default Sales;
