import { http, HttpResponse } from 'msw';
import { AuthResponse, LoginData, RegisterData, Task } from '../lib/api';

const mockUsers = {
  admin: {
    id: 'user-admin',
    name: 'Admin User',
    email: 'admin@managemate.com',
    role: 'admin'
  },
  manager: {
    id: 'user-manager',
    name: 'Manager User',
    email: 'manager@managemate.com',
    role: 'manager'
  },
  employee: {
    id: 'user-emp',
    name: 'Employee User',
    email: 'employee@managemate.com',
    role: 'employee'
  },
  demo: {
    id: 'user-123',
    name: 'Demo User',
    email: 'user@demo.com'
  }
};

const mockTasks: Task[] = [
  {
    _id: 'task-1',
    title: 'Complete project setup',
    status: 'in-progress',
    priority: 'high',
    userId: 'user-123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as LoginData;

    if (!email || !password) {
      return HttpResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Find user by email
    const user = Object.values(mockUsers).find(u => u.email === email);

    if (!user) {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Simulate delay
    await new Promise(res => setTimeout(res, 150));

    return HttpResponse.json<AuthResponse>({
      user,
      token: 'mock-jwt-token'
    });
  }),

  http.post('/api/auth/register', async () => {
    await new Promise(res => setTimeout(res, 150));
    return HttpResponse.json<AuthResponse>({
      user: mockUsers.demo,
      token: 'mock-jwt-token'
    });
  }),

  http.get('/api/tasks', async () => {
    await new Promise(res => setTimeout(res, 100));
    return HttpResponse.json<Task[]>(mockTasks);
  })
];
