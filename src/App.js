import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Download, Upload, Filter, X, Edit2, Trash2, Save, RefreshCw } from 'lucide-react';
import Papa from 'papaparse';
import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, writeBatch } from 'firebase/firestore';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    organization: '',
    staffMember: '',
    services: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const [newEntry, setNewEntry] = useState({
    name: '',
    webAddress: '',
    description: '',
    contact: '',
    phone: '',
    staffMember: '',
    updated: new Date().toLocaleDateString()
  });
  const [columnVisibility, setColumnVisibility] = useState({
    name: true,
    webAddress: true,
    description: true,
    contact: true,
    phone: true,
    staffMember: true,
    updated: true
  });

  useEffect(() => {
    if (!db) {
      // Firebase not configured, use localStorage
      const storedData = localStorage.getItem('sharedResourceData');
      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        loadInitialData();
      }
      setLoading(false);
      setLastSync(new Date().toLocaleTimeString());
      return;
    }

    // Set up real-time listener for Firestore
    const unsubscribe = onSnapshot(collection(db, 'resources'), (snapshot) => {
      const resources = [];
      snapshot.forEach((doc) => {
        resources.push({ id: doc.id, ...doc.data() });
      });
      setData(resources);
      setLoading(false);
      setLastSync(new Date().toLocaleTimeString());
      
      // If no data exists, load initial data
      if (resources.length === 0) {
        loadInitialData();
      }
    }, (error) => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filterData = () => {
    let filtered = [...data];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(val =>
          val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filters.organization) {
      filtered = filtered.filter(item =>
        item.name && item.name.toLowerCase().includes(filters.organization.toLowerCase())
      );
    }

    if (filters.staffMember) {
      filtered = filtered.filter(item =>
        item.staffMember && item.staffMember.toLowerCase().includes(filters.staffMember.toLowerCase())
      );
    }

    if (filters.services) {
      filtered = filtered.filter(item =>
        item.description && item.description.toLowerCase().includes(filters.services.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    filterData();
  }, [searchTerm, filters, data]);

  const saveToStorage = (newData) => {
    setData(newData);
    localStorage.setItem('sharedResourceData', JSON.stringify(newData));
    setLastSync(new Date().toLocaleTimeString());
  };

  const loadInitialData = async () => {
    const initialData = [
      { name: "Brother Bennos", webAddress: "Support Services & Aid - Brother Benno Foundation", description: "Homeless Services/Day Center", contact: "Steven", phone: "760-410-9497", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Alpha Project", webAddress: "Alpha Project Casa Raphael | Vista, CA", description: "90 day program shelter for men", contact: "Clifford", phone: "760-929-6253", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Oceanside Navigation Center", webAddress: "Oceanside Navigation Center - San Diego Rescue Mission", description: "Shelter", contact: "Jessica", phone: "442-375-9695", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Buena Creek Navigation Center Vista", webAddress: "Our Mission — Retread Housing Services", description: "30 day Shelter for men and women/ no children", contact: "Pete", phone: "442-320-6962", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Jewish family Services", webAddress: "Safe Parking | City of Vista", description: "Safe Parking Vista", contact: "", phone: "858-637-3373", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Interfaith", webAddress: "Interfaith Community Services", description: "Interfaith Recuperative Care", contact: "Kaitlyn", phone: "1-760-270-5361", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Green Oak Ranch", webAddress: "About — Green Oak Ranch", description: "Faith based Recovery Program", contact: "Junior", phone: "1-858-929-9020", staffMember: "Alex/Marsha", updated: new Date().toLocaleDateString() },
      { name: "McCalaster", webAddress: "McAlister Institute", description: "Out Patient treatment for Recovery", contact: "Leilani", phone: "1-760-707-8555", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Interfaith", webAddress: "Basic Needs — Interfaith Community Services", description: "Detox, housing, Recuperative care, food", contact: "Tanea", phone: "1-760-489-6380", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Legal Aid of San Diego", webAddress: "Legal-Aid-Now", description: "legal services", contact: "", phone: "1-877-534-2524", staffMember: "Marsha", updated: new Date().toLocaleDateString() }
    ];
    
    if (db) {
      // Upload to Firebase
      const batch = writeBatch(db);
      initialData.forEach((item) => {
        const docRef = doc(collection(db, 'resources'));
        batch.set(docRef, item);
      });
      
      try {
        await batch.commit();
        console.log('Initial data uploaded to Firebase');
      } catch (error) {
        console.error('Error uploading initial data:', error);
      }
    } else {
      // Use localStorage
      const dataWithIds = initialData.map((item, index) => ({
        ...item,
        id: (index + 1).toString()
      }));
      saveToStorage(dataWithIds);
    }
  };

  const handleAddEntry = async () => {
    try {
      const entry = {
        ...newEntry,
        updated: new Date().toLocaleDateString()
      };
      
      if (db) {
        await addDoc(collection(db, 'resources'), entry);
      } else {
        entry.id = Date.now().toString();
        const newData = [...data, entry];
        saveToStorage(newData);
      }
      
      setNewEntry({
        name: '',
        webAddress: '',
        description: '',
        contact: '',
        phone: '',
        staffMember: '',
        updated: new Date().toLocaleDateString()
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding entry:', error);
      alert('Error adding entry. Please try again.');
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSaveEdit = async (id, field, value) => {
    try {
      if (db) {
        const docRef = doc(db, 'resources', id);
        await updateDoc(docRef, {
          [field]: value,
          updated: new Date().toLocaleDateString()
        });
      } else {
        const newData = data.map(item =>
          item.id === id ? { ...item, [field]: value, updated: new Date().toLocaleDateString() } : item
        );
        saveToStorage(newData);
      }
      setEditingId(null);
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('Error updating entry. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        if (db) {
          await deleteDoc(doc(db, 'resources', id));
        } else {
          const newData = data.filter(item => item.id !== id);
          saveToStorage(newData);
        }
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Error deleting entry. Please try again.');
      }
    }
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resource_list_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const importCSV = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const importedData = results.data
            .filter(row => row['Name of Organization'] || row.name)
            .map((row) => ({
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              name: row['Name of Organization'] || row.name || '',
              webAddress: row['Web Address'] || row.webAddress || '',
              description: row['What the Organization Does'] || row.description || '',
              contact: row['Person of Contact'] || row.contact || '',
              phone: row['Phone Number'] || row.phone || '',
              staffMember: row['Staff Member Connected'] || row.staffMember || '',
              updated: row['UPDATED'] || row.updated || new Date().toLocaleDateString()
            }));
          const newData = [...data, ...importedData];
          saveToStorage(newData);
          alert(`Successfully imported ${importedData.length} entries!`);
        }
      });
    }
  };

  const uniqueStaffMembers = useMemo(() => {
    return [...new Set(data.map(item => item.staffMember).filter(Boolean))];
  }, [data]);

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <h1>North County Resource Database</h1>
          <p className="subtitle">Vista Partners Community Resource Management</p>
          <div className="sync-info">
            {loading ? (
              <span className="sync-status"><RefreshCw size={16} className="spin" /> Loading...</span>
            ) : (
              <span className="sync-status">
                {db ? '🔥 Firebase Connected • Real-time sync active' : '✅ Local storage • Ready to use'}
                <br />
                <small>Last updated: {lastSync}</small>
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="controls">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search all fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <Filter size={16} />
            <input
              type="text"
              placeholder="Filter by organization..."
              value={filters.organization}
              onChange={(e) => setFilters({ ...filters, organization: e.target.value })}
            />
          </div>
          <div className="filter-group">
            <select
              value={filters.staffMember}
              onChange={(e) => setFilters({ ...filters, staffMember: e.target.value })}
            >
              <option value="">All Staff Members</option>
              {uniqueStaffMembers.map(staff => (
                <option key={staff} value={staff}>{staff}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <input
              type="text"
              placeholder="Filter by services..."
              value={filters.services}
              onChange={(e) => setFilters({ ...filters, services: e.target.value })}
            />
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <Plus size={20} /> Add Entry
          </button>
          <button className="btn btn-secondary" onClick={exportToCSV}>
            <Download size={20} /> Export CSV
          </button>
          <label className="btn btn-secondary">
            <Upload size={20} /> Import CSV
            <input type="file" accept=".csv" onChange={importCSV} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <div className="column-visibility">
        <span>Show columns:</span>
        {Object.keys(columnVisibility).map(col => (
          <label key={col} className="column-toggle">
            <input
              type="checkbox"
              checked={columnVisibility[col]}
              onChange={(e) => setColumnVisibility({ ...columnVisibility, [col]: e.target.checked })}
            />
            {col.charAt(0).toUpperCase() + col.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
        ))}
      </div>

      <div className="stats">
        <div className="stat">Total Entries: {data.length}</div>
        <div className="stat">Filtered: {filteredData.length}</div>
      </div>

      {showAddForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Entry</h2>
              <button onClick={() => setShowAddForm(false)}><X size={20} /></button>
            </div>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Organization Name"
                value={newEntry.name}
                onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Web Address"
                value={newEntry.webAddress}
                onChange={(e) => setNewEntry({ ...newEntry, webAddress: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Contact Person"
                value={newEntry.contact}
                onChange={(e) => setNewEntry({ ...newEntry, contact: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newEntry.phone}
                onChange={(e) => setNewEntry({ ...newEntry, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Staff Member"
                value={newEntry.staffMember}
                onChange={(e) => setNewEntry({ ...newEntry, staffMember: e.target.value })}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleAddEntry}>
                <Save size={20} /> Save Entry
              </button>
              <button className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columnVisibility.name && <th>Organization</th>}
              {columnVisibility.webAddress && <th>Web Address</th>}
              {columnVisibility.description && <th>Services</th>}
              {columnVisibility.contact && <th>Contact</th>}
              {columnVisibility.phone && <th>Phone</th>}
              {columnVisibility.staffMember && <th>Staff Member</th>}
              {columnVisibility.updated && <th>Updated</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id}>
                {columnVisibility.name && (
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleSaveEdit(item.id, 'name', e.target.value)}
                        onBlur={() => setEditingId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleEdit(item.id)} style={{ cursor: 'pointer' }}>
                        {item.name}
                      </span>
                    )}
                  </td>
                )}
                {columnVisibility.webAddress && <td className="truncate">{item.webAddress}</td>}
                {columnVisibility.description && <td>{item.description}</td>}
                {columnVisibility.contact && <td>{item.contact}</td>}
                {columnVisibility.phone && <td>{item.phone}</td>}
                {columnVisibility.staffMember && <td>{item.staffMember}</td>}
                {columnVisibility.updated && <td>{item.updated}</td>}
                <td className="actions">
                  <button className="btn-icon" onClick={() => handleEdit(item.id)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-icon delete" onClick={() => handleDelete(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;