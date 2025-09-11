import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Download, Upload, Filter, X, Edit2, Trash2, Save } from 'lucide-react';
import Papa from 'papaparse';
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
    const storedData = localStorage.getItem('resourceData');
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      loadInitialData();
    }
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, filters, data]);

  const loadInitialData = () => {
    const initialData = [
      { id: 1, name: "Brother Bennos", webAddress: "Support Services & Aid - Brother Benno Foundation", description: "Homeless Services/Day Center", contact: "Steven", phone: "760-410-9497", staffMember: "Ian", updated: "" },
      { id: 2, name: "Alpha Project", webAddress: "Alpha Project Casa Raphael | Vista, CA", description: "90 day program shelter for men", contact: "Clifford", phone: "760-929-6253", staffMember: "Marsha", updated: "" },
      { id: 3, name: "Oceanside Navigation Center", webAddress: "Oceanside Navigation Center - San Diego Rescue Mission", description: "Shelter", contact: "Jessica", phone: "442-375-9695", staffMember: "Marsha", updated: "" },
      { id: 4, name: "Buena Creek Navigation Center Vista", webAddress: "Our Mission — Retread Housing Services", description: "30 day Shelter for men and women/ no children", contact: "Pete", phone: "442-320-6962", staffMember: "Marsha", updated: "" },
      { id: 5, name: "Jewish family Services", webAddress: "Safe Parking | City of Vista", description: "Safe Parking Vista", contact: "", phone: "858-637-3373", staffMember: "Marsha", updated: "" },
      { id: 6, name: "Interfaith", webAddress: "Interfaith Community Services", description: "Interfaith Recuperative Care", contact: "Kaitlyn", phone: "1-760-270-5361", staffMember: "Marsha", updated: "" },
      { id: 7, name: "Green Oak Ranch", webAddress: "About — Green Oak Ranch", description: "Faith based Recovery Program", contact: "Junior", phone: "1-858-929-9020", staffMember: "Alex/Marsha", updated: "" },
      { id: 8, name: "McCalaster", webAddress: "McAlister Institute", description: "Out Patient treatment for Recovery", contact: "Leilani", phone: "1-760-707-8555", staffMember: "Marsha", updated: "" },
      { id: 9, name: "Interfaith", webAddress: "Basic Needs — Interfaith Community Services", description: "Detox, housing, Recuperative care, food", contact: "Tanea", phone: "1-760-489-6380", staffMember: "Marsha", updated: "" },
      { id: 10, name: "Legal Aid of San Diego", webAddress: "Legal-Aid-Now", description: "legal services", contact: "", phone: "1-877-534-2524", staffMember: "Marsha", updated: "" },
      { id: 11, name: "Home Start", webAddress: "Meet Shannon Beresford, Probation Housing Navigation", description: "Adult Probation North County Housing navigator", contact: "Norma", phone: "619-669-3458", staffMember: "Marsha", updated: "" },
      { id: 12, name: "County of San Diego Probation Depart", webAddress: "Probation Department", description: "Probation", contact: "Jose Riveria Probation Deputy", phone: "760-806-2351", staffMember: "Marsha", updated: "" },
      { id: 13, name: "Catholic Charities", webAddress: "Homeless Men's Services - Catholic Charities", description: "Mens Shelter", contact: "Emiliano Cerda", phone: "760-929-2322", staffMember: "Alex/Marsha", updated: "" },
      { id: 14, name: "Think Dignity", webAddress: "HOME | Humanityshowers", description: "Mobile Shower trailers", contact: "Jordan", phone: "619-859-1412", staffMember: "Marsha", updated: "" },
      { id: 15, name: "La Paloma", webAddress: "Home | La Paloma Healthcare Center", description: "Health Care Centers", contact: "Jennifer", phone: "760-724-2193", staffMember: "Marsha", updated: "" },
      { id: 16, name: "Path", webAddress: "Greater San Diego | epath.org", description: "Homeless Services", contact: "Shannon", phone: "619-366-3899", staffMember: "Ian", updated: "" },
      { id: 17, name: "Downtown Partnership", webAddress: "Unhoused Care — Downtown San Diego Partnership", description: "Family Reunification", contact: "Rose Harris", phone: "619-501-9520", staffMember: "Ian", updated: "" },
      { id: 18, name: "McCalaster Institute", webAddress: "McAlister Institute", description: "Detox, housing, Recuperative care", contact: "Darlene", phone: "619-465-7303", staffMember: "Ian", updated: "" },
      { id: 19, name: "Father Joe's", webAddress: "Nonprofit Services for Homelessness | Father Joe's Villages", description: "Homeless Services", contact: "Garrett", phone: "619-233-8500", staffMember: "Ian", updated: "" },
      { id: 20, name: "Salvation Army", webAddress: "Drug and Alcohol Adult Rehabilitation Centers", description: "Homeless Services, Rehabilitation One Year Program", contact: "Kathy", phone: "619-699-2214", staffMember: "Ian", updated: "" },
      { id: 21, name: "P.E.R.T", webAddress: "PERT — CRF Behavioral Healthcare", description: "Mental Health Services", contact: "Eduardo", phone: "760-435-4900", staffMember: "Ian", updated: "" },
      { id: 22, name: "Interfaith", webAddress: "Basic Needs — Interfaith Community Services", description: "Homeless Services", contact: "Valerie", phone: "760-807-6580", staffMember: "Ian", updated: "" },
      { id: 23, name: "Exodus Recovery", webAddress: "SD Vista CSU | Exodus Recovery Inc", description: "Mental Health Services", contact: "Frank", phone: "760-758-1150", staffMember: "Ian", updated: "" },
      { id: 24, name: "Monarch", webAddress: "About Monarch - Monarch School in San Diego", description: "Homeless Youth School", contact: "James", phone: "619-652-1621", staffMember: "Ian", updated: "" },
      { id: 25, name: "Dreams For Change", webAddress: "Safe Parking - Dreams For Change", description: "Safe Parking Oceanside", contact: "Samantha", phone: "619-497-0236", staffMember: "Ian", updated: "" },
      { id: 26, name: "Solutions For Change", webAddress: "Solutions To Homelessness | Solutions For Change", description: "2 year Rehabilitation Program for men/women with children", contact: "Lilia / intake coordinator", phone: "760-941-6545 ext 301", staffMember: "Ian", updated: "" },
      { id: 27, name: "Interfaith", webAddress: "Basic Needs — Interfaith Community Services", description: "H.O.T Oceanside", contact: "Kaitlyn", phone: "760-270-5361", staffMember: "Ian", updated: "" },
      { id: 28, name: "Brother Bennos", webAddress: "Services - Brother Benno Foundation", description: "Homeless Services / Day center", contact: "Steven", phone: "760-410-9497", staffMember: "Ian", updated: "" },
      { id: 29, name: "Family Resource Center", webAddress: "Family Recovery Center - MHS/TURN", description: "Detox, Rehabilitation, Single Woman", contact: "Rebecca / Admissions", phone: "760-941-6545", staffMember: "Ian", updated: "" },
      { id: 30, name: "Turn", webAddress: "North Coastal Mental Health Center - MHS/TURN", description: "Mental Health Out Patient Services", contact: "Perla", phone: "760-712-3535", staffMember: "Ian", updated: "" },
      { id: 31, name: "Turning Point Crisis Center", webAddress: "Turning Point Crisis Center — CRF Behavioral Healthcare", description: "Inpatient BH care for men and woman", contact: "Carey", phone: "760-439-2800", staffMember: "Ian", updated: "" },
      { id: 32, name: "La Posada", webAddress: "Homeless Men's Services - Catholic Charities", description: "90 Day Shelter Program For Men", contact: "LeAnne Aubel", phone: "760-929-2322", staffMember: "Ian", updated: "" },
      { id: 33, name: "Path", webAddress: "Greater San Diego | epath.org", description: "Homeless Services", contact: "Teresa Corona", phone: "619-381-8093", staffMember: "Ian", updated: "" },
      { id: 34, name: "Lifeline", webAddress: "Housing & Stability San Diego | Lifeline Community Services", description: "Housing Navigation", contact: "Halle Nottage", phone: "760-509-3368", staffMember: "Ian", updated: "" },
      { id: 35, name: "Operation Hope", webAddress: "Shelter | Operation HOPE - Vista", description: "90 Day Family Program Shelter", contact: "Esperanza Zapico", phone: "760-295-9446", staffMember: "Ian", updated: "" },
      { id: 36, name: "The Fellowship Center", webAddress: "The Fellowship Center", description: "Detox/Recovery 90 day Program for men", contact: "Jim Chestnut / Intake Coordinator", phone: "760-745-8478 EXT. 318", staffMember: "Ian", updated: "" },
      { id: 37, name: "Mcalister North Inland Regional Recovery Center", webAddress: "Programs — McAlister Institute", description: "Out Patient treatment for Recovery", contact: "Ana Davies SUD Treatment Counselor", phone: "760-741-7708 EXT. 1304", staffMember: "Ian", updated: "" },
      { id: 38, name: "Casa Raphael / Alpha Project", webAddress: "Casa Raphael Residential Treatment Rehab in Vista, CA", description: "Rehabilitation Program for men", contact: "Dina / Intake Coordinator", phone: "760-630-9922", staffMember: "Ian", updated: "" },
      { id: 39, name: "Equus Workforce Solutions", webAddress: "Equus Workforce Solutions Homepage", description: "CalWorks Program", contact: "Lupe Gonzales Director of Community Outreach", phone: "760-803-8262", staffMember: "Ian", updated: "" },
      { id: 40, name: "Veterans Affairs Outreach", webAddress: "CalVet Veteran Services Homeless Veterans Outreach", description: "Veterans services, referrals, social work", contact: "Faye Stauber", phone: "619-705-9378", staffMember: "Ian", updated: "" },
      { id: 41, name: "Interfaith", webAddress: "Basic Needs — Interfaith Community Services", description: "Case Manager for Rapid RE-Housing", contact: "Tehana Owens", phone: "760-504-1283", staffMember: "Ian", updated: "" },
      { id: 42, name: "CTC", webAddress: "", description: "Opioid addiction and recovery", contact: "Joseph", phone: "619-392-0582", staffMember: "Ian", updated: "" },
      { id: 43, name: "North County Homeless Court", webAddress: "Homeless Court Assistance | Homeless Court", description: "Public Defender", contact: "Terri Peters", phone: "Terri.peters@sdcounty.ca.gov", staffMember: "Ian", updated: "" },
      { id: 44, name: "True Care", webAddress: "TrueCare Oceanside", description: "Mobile Clinic Outreach", contact: "Kerry Holloman", phone: "760-736-6767", staffMember: "Ian", updated: "" },
      { id: 45, name: "Rooted Life", webAddress: "HOME | RootedLife", description: "Inpatient long term BH Facility", contact: "Melissa", phone: "619-648-1600", staffMember: "Ian", updated: "" },
      { id: 46, name: "Universidad Popular", webAddress: "Universidad Popular", description: "Immigration Advocacy", contact: "Flower Alvarez-Lopez", phone: "619-648-1600", staffMember: "Ian", updated: "" },
      { id: 47, name: "Immigration @ North County Center", webAddress: "Immigration Attorney in Escondido & San Diego", description: "Immigration Advocacy", contact: "María Inés Delgado García", phone: "760-994-1690", staffMember: "Ian", updated: "" },
      { id: 48, name: "Casa Cornelia", webAddress: "Pro Bono Immigration Lawyer | Casa Cornelia Law Center", description: "Immigration Advocacy / Staff Attorney", contact: "Meghan Topolski", phone: "619-231-7788 ext 404", staffMember: "Ian", updated: "" },
      { id: 49, name: "Mobile Notary", webAddress: "", description: "Mobile Notary", contact: "Amy Saye", phone: "910-467-1700", staffMember: "Ian", updated: "" }
    ];
    setData(initialData);
    localStorage.setItem('resourceData', JSON.stringify(initialData));
  };

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

  const handleAddEntry = () => {
    const entry = {
      ...newEntry,
      id: Math.max(...data.map(d => d.id || 0)) + 1,
      updated: new Date().toLocaleDateString()
    };
    const newData = [...data, entry];
    setData(newData);
    localStorage.setItem('resourceData', JSON.stringify(newData));
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
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSaveEdit = (id, field, value) => {
    const newData = data.map(item =>
      item.id === id ? { ...item, [field]: value, updated: new Date().toLocaleDateString() } : item
    );
    setData(newData);
    localStorage.setItem('resourceData', JSON.stringify(newData));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const newData = data.filter(item => item.id !== id);
      setData(newData);
      localStorage.setItem('resourceData', JSON.stringify(newData));
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
          const importedData = results.data.map((row, index) => ({
            id: Math.max(...data.map(d => d.id || 0)) + index + 1,
            name: row['Name of Organization'] || row.name || '',
            webAddress: row['Web Address'] || row.webAddress || '',
            description: row['What the Organization Does'] || row.description || '',
            contact: row['Person of Contact'] || row.contact || '',
            phone: row['Phone Number'] || row.phone || '',
            staffMember: row['Staff Member Connected'] || row.staffMember || '',
            updated: row['UPDATED'] || row.updated || new Date().toLocaleDateString()
          }));
          const newData = [...data, ...importedData];
          setData(newData);
          localStorage.setItem('resourceData', JSON.stringify(newData));
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
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleEdit(item.id)}>{item.name}</span>
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
