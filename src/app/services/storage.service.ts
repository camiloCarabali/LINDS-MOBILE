import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async set(key: string, value: any): Promise<void> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await Preferences.set({
        key,
        value: stringValue
      });
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      throw error;
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const { value } = await Preferences.get({ key });
      
      if (value === null) {
        return null;
      }

      try {
        return JSON.parse(value);
      } catch {
        return value as T;
      }
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await Preferences.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const { keys } = await Preferences.keys();
      return keys;
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  async getMultiple<T = any>(keys: string[]): Promise<{ [key: string]: T | null }> {
    const result: { [key: string]: T | null } = {};
    
    await Promise.all(
      keys.map(async (key) => {
        result[key] = await this.get<T>(key);
      })
    );
    
    return result;
  }

  async setMultiple(items: { [key: string]: any }): Promise<void> {
    await Promise.all(
      Object.entries(items).map(([key, value]) => this.set(key, value))
    );
  }

  async removeMultiple(keys: string[]): Promise<void> {
    await Promise.all(keys.map(key => this.remove(key)));
  }
}
