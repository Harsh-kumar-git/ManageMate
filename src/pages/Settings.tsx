import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Sun, Shield, Mail } from 'lucide-react';

interface SettingSection {
  title: string;
  description: string;
  icon: any;
  settings: {
    id: string;
    label: string;
    type: 'switch' | 'input';
    description: string;
    value?: boolean | string;
  }[];
}

const settingSections: SettingSection[] = [
  {
    title: 'Notifications',
    description: 'Manage how you receive notifications and alerts',
    icon: Bell,
    settings: [
      {
        id: 'email-notifications',
        label: 'Email Notifications',
        type: 'switch',
        description: 'Receive notifications via email',
        value: true,
      },
      {
        id: 'sales-alerts',
        label: 'Sales Alerts',
        type: 'switch',
        description: 'Get notified about new sales',
        value: true,
      },
      {
        id: 'inventory-alerts',
        label: 'Inventory Alerts',
        type: 'switch',
        description: 'Get notified about low stock',
        value: true,
      },
    ],
  },
  {
    title: 'Appearance',
    description: 'Customize how ManageMate looks on your device',
    icon: Sun,
    settings: [
      {
        id: 'dark-mode',
        label: 'Dark Mode',
        type: 'switch',
        description: 'Use dark theme',
        value: false,
      },
      {
        id: 'compact-mode',
        label: 'Compact Mode',
        type: 'switch',
        description: 'Reduce padding and margins',
        value: false,
      },
    ],
  },
  {
    title: 'Security',
    description: 'Manage your security preferences',
    icon: Shield,
    settings: [
      {
        id: 'two-factor',
        label: 'Two-Factor Authentication',
        type: 'switch',
        description: 'Add an extra layer of security',
        value: false,
      },
      {
        id: 'session-timeout',
        label: 'Session Timeout',
        type: 'input',
        description: 'Minutes until automatic logout (15-120)',
        value: '30',
      },
    ],
  },
  {
    title: 'Email Preferences',
    description: 'Configure your email settings',
    icon: Mail,
    settings: [
      {
        id: 'email-signature',
        label: 'Email Signature',
        type: 'input',
        description: 'Add a professional signature to your emails',
        value: 'Sent from ManageMate',
      },
      {
        id: 'reply-to',
        label: 'Reply-To Address',
        type: 'input',
        description: 'Default reply-to email address',
        value: 'support@managemate.com',
      },
    ],
  },
];

const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your preferences and account settings</p>
        </div>
        <Button variant="outline">Save Changes</Button>
      </div>

      <div className="grid gap-6">
        {settingSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-blue-100">
                  <section.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>{section.title}</CardTitle>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {section.settings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={setting.id}>{setting.label}</Label>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  {setting.type === 'switch' ? (
                    <Switch
                      id={setting.id}
                      checked={setting.value as boolean}
                      onCheckedChange={() => {}}
                    />
                  ) : (
                    <Input
                      id={setting.id}
                      value={setting.value as string}
                      onChange={() => {}}
                      className="w-[280px]"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default Settings;
