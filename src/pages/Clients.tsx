import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { UserPlus, Mail, Phone, MapPin, Star, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, Client } from '../lib/api';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive';
  totalSpent: number;
  lastPurchase: string;
  rating: number;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    api.getClients()
      .then(setClients)
      .catch(() => {
        setError('Failed to load clients.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredClients = useMemo(() => {
    let filtered = clients;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.location && client.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return filtered;
  }, [clients, statusFilter, searchQuery]);

  const handleSelectClient = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleExportClients = () => {
    const clientsToExport = selectedClients.length > 0
      ? clients.filter(c => selectedClients.includes(c.id))
      : clients;
    
    // In a real app, this would export to CSV/Excel
    toast.success(`Exporting ${clientsToExport.length} clients...`);
  };

  const handleAddClient = () => {
    toast.success('Opening add client form...');
    // In a real app, this would open a modal form
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading clients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (filteredClients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No clients found matching your criteria</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500">Manage your client relationships</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportClients} className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddClient} className="flex-1 sm:flex-none">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: clients.length.toString() },
          { label: 'Active Clients', value: clients.filter(c => c.status === 'active').length.toString() },
          { label: 'Average Spend', value: '$' + (clients.reduce((acc, c) => acc + c.totalSpent, 0) / clients.length).toLocaleString() },
          { label: 'Retention Rate', value: '94%' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Client List</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('active')}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('inactive')}
                >
                  Inactive
                </Button>
              </div>
              <SearchInput
                placeholder="Search clients..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full sm:w-[300px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => handleSelectClient(client.id)}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectClient(client.id);
                        }}
                        className="mt-1"
                      />
                      <div>
                        <h3 className="font-medium">{client.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-2 sm:gap-4">
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {client.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {client.phone}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {client.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(client.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="font-medium">${client.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Last purchase: {client.lastPurchase}</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Clients;
