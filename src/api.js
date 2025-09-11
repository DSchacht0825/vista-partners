// Simple API service for shared database
// Uses JSONBin.io as a free cloud database

const API_KEY = '$2a$10$YourAPIKeyHere'; // You'll get this when you sign up
const BIN_ID = 'your-bin-id'; // Created automatically

class DatabaseAPI {
  constructor() {
    this.baseURL = 'https://api.jsonbin.io/v3/b';
    this.headers = {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY
    };
  }

  async getAll() {
    try {
      const response = await fetch(`${this.baseURL}/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
      });
      const data = await response.json();
      return data.record || [];
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }

  async save(data) {
    try {
      const response = await fetch(`${this.baseURL}/${BIN_ID}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(data)
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  async add(item) {
    const allData = await this.getAll();
    const newItem = {
      ...item,
      id: Date.now().toString(),
      updated: new Date().toLocaleDateString()
    };
    allData.push(newItem);
    return await this.save(allData);
  }

  async update(id, updates) {
    const allData = await this.getAll();
    const index = allData.findIndex(item => item.id === id);
    if (index !== -1) {
      allData[index] = {
        ...allData[index],
        ...updates,
        updated: new Date().toLocaleDateString()
      };
      return await this.save(allData);
    }
    return false;
  }

  async delete(id) {
    const allData = await this.getAll();
    const filteredData = allData.filter(item => item.id !== id);
    return await this.save(filteredData);
  }
}

export const db = new DatabaseAPI();