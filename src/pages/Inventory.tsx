import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { Package, AlertTriangle, Plus, Download, Archive, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, InventoryItem } from '../lib/api';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  lastRestocked: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    api.getInventory()
      .then(setItems)
      .catch(() => {
        setError('Failed to load inventory items.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [items, categoryFilter, statusFilter, searchQuery]);

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleExportItems = () => {
    const itemsToExport = selectedItems.length > 0
      ? items.filter(item => selectedItems.includes(item.id))
      : items;
    
    toast.success(`Exporting ${itemsToExport.length} items...`);
  };

  const handleArchiveItems = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to archive');
      return;
    }
    toast.success(`Archiving ${selectedItems.length} items...`);
  };

  const handleDeleteItems = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to delete');
      return;
    }
    toast.success(`Deleting ${selectedItems.length} items...`);
  };

  const handleAddItem = () => {
    toast.success('Opening add item form...');
  };

  const handleCreateItem = (item: InventoryItem) => {
    api.createInventoryItem(item)
      .then(res => {
        setItems([...items, res.data]);
        toast.success('Item created successfully!');
      })
      .catch(() => {
        toast.error('Failed to create item.');
      });
  };

  const handleUpdateItem = (item: InventoryItem) => {
    api.updateInventoryItem(item)
      .then(res => {
        setItems(items.map(i => i.id === item.id ? res.data : i));
        toast.success('Item updated successfully!');
      })
      .catch(() => {
        toast.error('Failed to update item.');
      });
  };

  const handleDeleteItem = (itemId: string) => {
    api.deleteInventoryItem(itemId)
      .then(() => {
        setItems(items.filter(item => item.id !== itemId));
        toast.success('Item deleted successfully!');
      })
      .catch(() => {
        toast.error('Failed to delete item.');
      });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading...</p>
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

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No items found.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500">Manage your product inventory</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportItems} className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleArchiveItems} className="flex-1 sm:flex-none">
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
          <Button variant="destructive" onClick={handleDeleteItems} className="flex-1 sm:flex-none">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button onClick={handleAddItem} className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Items',
            value: items.length,
            icon: Package,
          },
          {
            label: 'Low Stock Items',
            value: items.filter(item => item.status === 'low-stock').length,
            icon: AlertTriangle,
            alert: true,
          },
          {
            label: 'Out of Stock',
            value: items.filter(item => item.status === 'out-of-stock').length,
            icon: AlertTriangle,
            alert: true,
          },
          {
            label: 'Total Value',
            value: `$${items.reduce((sum, item) => sum + (item.price * item.stock), 0).toLocaleString()}`,
            icon: Package,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-full ${
                  stat.alert ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <stat.icon className={`h-5 w-5 ${
                    stat.alert ? 'text-red-600' : 'text-blue-600'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Inventory Items</CardTitle>
              <SearchInput
                placeholder="Search items..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full sm:w-[300px]"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex gap-2 flex-wrap">
                {['All', ...new Set(items.map(item => item.category))].map((category) => (
                  <Button
                    key={category}
                    variant={categoryFilter === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'in-stock' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('in-stock')}
                >
                  In Stock
                </Button>
                <Button
                  variant={statusFilter === 'low-stock' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('low-stock')}
                >
                  Low Stock
                </Button>
                <Button
                  variant={statusFilter === 'out-of-stock' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('out-of-stock')}
                >
                  Out of Stock
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No items found matching your criteria</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => handleSelectItem(item.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectItem(item.id);
                        }}
                        className="mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{item.name}</h3>
                          <span className="text-sm text-gray-500">({item.sku})</span>
                        </div>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-medium">${item.price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Stock</p>
                        <p className="font-medium">{item.stock}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Reorder Point</p>
                        <p className="font-medium">{item.reorderPoint}</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'in-stock'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'low-stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Inventory;
