const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Mock service worker setup
if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
  const { worker } = await import('../mocks/browser');
  worker.start();
}

/**
 * Data required for user login
 */
export interface LoginData {
  /**
   * User email
   */
  email: string;
  /**
   * User password
   */
  password: string;
}

/**
 * Data required for user registration
 * @extends LoginData
 */
export interface RegisterData extends LoginData {
  /**
   * User name
   */
  name: string;
}

/**
 * User data
 */
export interface User {
  /**
   * Unique user ID
   */
  id: string;
  /**
   * User name
   */
  name: string;
  /**
   * User email
   */
  email: string;
}

/**
 * Authentication response data
 */
export interface AuthResponse {
  /**
   * User data
   */
  user: User;
  /**
   * JWT token
   */
  token: string;
}

/**
 * Task data
 */
export interface Task {
  /**
   * Unique task ID
   */
  _id: string;
  /**
   * Task title
   */
  title: string;
  /**
   * Task description (optional)
   */
  description?: string;
  /**
   * Task status
   */
  status: 'todo' | 'in-progress' | 'completed';
  /**
   * Task priority
   */
  priority: 'low' | 'medium' | 'high';
  /**
   * Task due date (optional)
   */
  dueDate?: Date;
  /**
   * User ID associated with the task
   */
  userId: string;
  /**
   * Task creation date
   */
  createdAt: Date;
  /**
   * Task update date
   */
  updatedAt: Date;
}

// --- CLIENTS ---
export interface Client {
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

// --- INVENTORY ---
export interface InventoryItem {
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

// --- EXPENSES ---
export interface ExpenseCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}
export interface MonthlyExpense {
  month: string;
  amount: number;
  change: number;
}

// --- SALES ---
export interface Transaction {
  id: string;
  customer: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

// --- REPORTS ---
export interface Report {
  title: string;
  description: string;
  date: string;
  stats: {
    value: string;
    change: number;
    label: string;
  }[];
}
export interface KPI {
  label: string;
  value: string;
  trend: 'up' | 'down';
  icon?: React.ElementType;
}

/**
 * Central API service for ManageMate
 * Handles all network requests with:
 * - Automatic auth token injection
 * - Unified error handling
 * - Response parsing
 */
class ApiService {
  /**
   * Auth token
   */
  private token: string | null = null;

  /**
   * Sets the auth token
   * @param token - JWT token
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * Clears the auth token
   */
  clearToken() {
    this.token = null;
  }

  /**
   * Makes a network request to the API
   * @param endpoint - API route (e.g. '/auth/login')
   * @param options - Fetch options (method, body, etc.)
   * @returns Promise with typed response data
   * @throws {Error} On network errors or server errors (4xx/5xx)
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
          ...(options.headers || {})
        },
        credentials: 'include'
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Connection timeout - server is not responding');
      }
      throw new Error('Network error - please check your connection');
    }
  }

  /**
   * Authenticates user
   * @param data - Contains email and password
   * @returns Promise with user data and JWT token
   */
  async login(data: LoginData): Promise<AuthResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Registers a new user
   * @param data - Contains name, email, and password
   * @returns Promise with user data and JWT token
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Retrieves a list of tasks
   * @returns Promise with an array of task data
   */
  async getTasks(): Promise<Task[]> {
    return this.request('/tasks');
  }

  /**
   * Creates a new task
   * @param task - Task data (title, description, etc.)
   * @returns Promise with the created task data
   */
  async createTask(task: Omit<Task, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task)
    });
  }

  /**
   * Updates an existing task
   * @param id - Task ID
   * @param task - Task data (title, description, etc.)
   * @returns Promise with the updated task data
   */
  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task)
    });
  }

  /**
   * Deletes a task
   * @param id - Task ID
   * @returns Promise with no data
   */
  async deleteTask(id: string): Promise<void> {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * Retrieves a list of clients
   * @returns Promise with an array of client data
   */
  async getClients(): Promise<Client[]> {
    return this.request('/clients');
  }

  /**
   * Retrieves a list of inventory items
   * @returns Promise with an array of inventory item data
   */
  async getInventory(): Promise<InventoryItem[]> {
    return this.request('/inventory');
  }

  /**
   * Retrieves expense data
   * @returns Promise with expense categories and monthly expenses
   */
  async getExpenses(): Promise<{ categories: ExpenseCategory[]; monthly: MonthlyExpense[] }> {
    return this.request('/expenses');
  }

  /**
   * Retrieves a list of transactions
   * @returns Promise with an array of transaction data
   */
  async getSales(): Promise<Transaction[]> {
    return this.request('/sales');
  }

  /**
   * Retrieves report data
   * @returns Promise with KPIs and reports
   */
  async getReports(): Promise<{ kpis: KPI[]; reports: Report[] }> {
    return this.request('/reports');
  }
}

/**
 * Singleton instance of the API service
 */
export const api = new ApiService();
