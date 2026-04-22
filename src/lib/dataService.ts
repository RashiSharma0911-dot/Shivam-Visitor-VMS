/**
 * DataService handles visitor data persistence.
 * It automatically switches between the API (for web) and
 * LocalStorage (for standalone mobile APK) based on the environment.
 */

export interface Visitor {
  id?: string;
  name: string;
  company?: string;
  phone?: string;
  person: string;
  type: string;
  status: 'Pending' | 'Approved' | 'Checked In' | 'Rejected';
  timestamp?: string;
  time?: string;
  image?: string;
}

const IS_MOBILE = typeof window !== 'undefined' && 
  (window.location.protocol === 'capacitor:' || !window.location.host);

const API_ENDPOINT = '/api/visitors';
const LOCAL_STORAGE_KEY = 'shivam_visitors_data';

export const dataService = {
  async getVisitors(): Promise<Visitor[]> {
    if (IS_MOBILE) {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
    
    try {
      const res = await fetch(API_ENDPOINT);
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch (error) {
      console.warn('API unavailable, falling back to local storage');
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
  },

  async addVisitor(visitor: Visitor): Promise<Visitor> {
    const newVisitor = {
      ...visitor,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: visitor.status || 'Pending'
    };

    if (IS_MOBILE) {
      const visitors = await this.getVisitors();
      visitors.push(newVisitor);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visitors));
      return newVisitor;
    }

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVisitor),
      });
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch (error) {
      const visitors = await this.getVisitors();
      visitors.push(newVisitor);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visitors));
      return newVisitor;
    }
  },

  async updateVisitorStatus(id: string, status: string): Promise<void> {
    if (IS_MOBILE) {
      const visitors = await this.getVisitors();
      const index = visitors.findIndex(v => v.id === id);
      if (index !== -1) {
        visitors[index].status = status as any;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visitors));
      }
      return;
    }

    try {
      await fetch(API_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
    } catch (error) {
      const visitors = await this.getVisitors();
      const index = visitors.findIndex(v => v.id === id);
      if (index !== -1) {
        visitors[index].status = status as any;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visitors));
      }
    }
  },

  async deleteVisitor(id: string): Promise<void> {
    if (IS_MOBILE) {
      let visitors = await this.getVisitors();
      visitors = visitors.filter(v => v.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visitors));
      return;
    }

    try {
      await fetch(API_ENDPOINT, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      let visitors = await this.getVisitors();
      visitors = visitors.filter(v => v.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visitors));
    }
  }
};
