import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Download, Upload, Filter, X, Edit2, Trash2, Save, Home, RefreshCw } from 'lucide-react';
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
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [editingField, setEditingField] = useState('');
  const [editEntry, setEditEntry] = useState(null);
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
      // Firebase not configured, use localStorage with all organizations
      const storedData = localStorage.getItem('sharedResourceData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.length >= 71) {
          setData(parsedData);
        } else {
          loadInitialData();
        }
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
      // Fallback to localStorage with full data
      loadInitialData();
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

    // Sort alphabetically by organization name
    filtered.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });

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
      { name: "Brother Bennos", webAddress: "https://brotherbenno.org/support-services-aid/", description: "Homeless Services/Day Center", contact: "Steven", phone: "760-410-9497", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Alpha Project", webAddress: "https://www.alphaproject.org/programs/casa-raphael/", description: "90 day program shelter for men", contact: "Clifford", phone: "760-929-6253", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Oceanside Navigation Center", webAddress: "https://www.sdrescue.org/what-we-do/homeless-services/navigation-centers/oceanside/", description: "Shelter", contact: "Jessica", phone: "442-375-9695", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Buena Creek Navigation Center Vista", webAddress: "https://retreadhousing.org/our-mission/", description: "30 day Shelter for men and women/ no children", contact: "Pete", phone: "442-320-6962", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Jewish family Services", webAddress: "https://www.cityofvista.com/government/departments/neighborhood-services/housing-rehabilitation/safe-parking", description: "Safe Parking Vista", contact: "", phone: "858-637-3373", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Interfaith", webAddress: "https://interfaithservices.org/", description: "Interfaith Recuperative Care", contact: "Kaitlyn", phone: "1-760-270-5361", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Green Oak Ranch", webAddress: "https://greenoakranch.org/about/", description: "Faith based Recovery Program", contact: "Junior", phone: "1-858-929-9020", staffMember: "Alex/Marsha", updated: new Date().toLocaleDateString() },
      { name: "McCalaster", webAddress: "https://www.mcalisterinstitute.org/", description: "Out Patient treatment for Recovery", contact: "Leilani", phone: "1-760-707-8555", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Interfaith", webAddress: "https://interfaithservices.org/basic-needs/", description: "Detox, housing, Recuperative care, food", contact: "Tanea", phone: "1-760-489-6380", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Legal Aid of San Diego", webAddress: "https://www.lassd.org/", description: "legal services", contact: "", phone: "1-877-534-2524", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Home Start", webAddress: "https://www.sdcounty.ca.gov/content/sdc/probation/adult_services/housing_navigation.html", description: "Adult Probation North County Housing navigator", contact: "Norma", phone: "619-669-3458", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "County of San Diego Probation Depart", webAddress: "https://www.sdcounty.ca.gov/content/sdc/probation.html", description: "Probation", contact: "Jose Riveria Probation Deputy", phone: "760-806-2351", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Catholic Charities", webAddress: "https://ccdsd.org/homeless-mens-services/", description: "Mens Shelter", contact: "Emiliano Cerda", phone: "760-929-2322", staffMember: "Alex/Marsha", updated: new Date().toLocaleDateString() },
      { name: "Think Dignity", webAddress: "https://www.humanityshowers.org/", description: "Mobile Shower trailers", contact: "Jordan", phone: "619-859-1412", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "La Paloma", webAddress: "https://www.lapalomahealthcare.com/", description: "Health Care Centers", contact: "Jennifer", phone: "760-724-2193", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
      { name: "Path", webAddress: "https://epath.org/greater-san-diego/", description: "Homeless Services", contact: "Shannon", phone: "619-366-3899", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Downtown Partnership", webAddress: "https://downtownsandiego.org/homelessness/unhoused-care/", description: "Family Reunification", contact: "Rose Harris", phone: "619-501-9520", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "McCalaster Institute", webAddress: "https://www.mcalisterinstitute.org/", description: "Detox, housing, Recuperative care", contact: "Darlene", phone: "619-465-7303", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Father Joe's", webAddress: "https://www.neighbor.org/", description: "Homeless Services", contact: "Garrett", phone: "619-233-8500", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Salvation Army", webAddress: "https://www.salvationarmyusa.org/usn/plugins/gdosCenterSearch?mode=query_6&lat=32.715738&lng=-117.161084&code=AR_SA", description: "Homeless Services, Rehabilitation One Year Program", contact: "Kathy", phone: "619-699-2214", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "P.E.R.T", webAddress: "https://crfsd.org/pert/", description: "Mental Health Services", contact: "Eduardo", phone: "760-435-4900", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Interfaith", webAddress: "https://interfaithservices.org/basic-needs/", description: "Homeless Services", contact: "Valerie", phone: "760-807-6580", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Exodus Recovery", webAddress: "https://exodusrecovery.com/locations/sd-vista-csu/", description: "Mental Health Services", contact: "Frank", phone: "760-758-1150", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Monarch", webAddress: "https://www.monarchschools.org/about-monarch/", description: "Homeless Youth School", contact: "James", phone: "619-652-1621", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Dreams For Change", webAddress: "https://dreamsforchange.org/safe-parking/", description: "Safe Parking Oceanside", contact: "Samantha", phone: "619-497-0236", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Solutions For Change", webAddress: "https://solutionsforchange.org/", description: "2 year Rehabilitation Program for men/women with children", contact: "Lilia / intake coordinator", phone: "760-941-6545 ext 301", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Interfaith", webAddress: "https://interfaithservices.org/basic-needs/", description: "H.O.T Oceanside", contact: "Kaitlyn", phone: "760-270-5361", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Brother Bennos", webAddress: "https://brotherbenno.org/services/", description: "Homeless Services / Day center", contact: "Steven", phone: "760-410-9497", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Family Resource Center", webAddress: "https://www.mhsinc.org/family-recovery-center-rehab/", description: "Detox, Rehabilitation, Single Woman", contact: "Rebecca / Admissions", phone: "760-941-6545", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Turn", webAddress: "https://www.mhsinc.org/north-coastal-mental-health-center/", description: "Mental Health Out Patient Services", contact: "Perla", phone: "760-712-3535", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Turning Point Crisis Center", webAddress: "https://crfsd.org/turning-point-crisis-center/", description: "Inpatient BH care for men and woman", contact: "Carey", phone: "760-439-2800", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "La Posada", webAddress: "https://ccdsd.org/homeless-mens-services/", description: "90 Day Shelter Program For Men", contact: "LeAnne Aubel", phone: "760-929-2322", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Path", webAddress: "https://epath.org/greater-san-diego/", description: "Homeless Services", contact: "Teresa Corona", phone: "619-381-8093", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Lifeline", webAddress: "https://www.lifelinesd.org/", description: "Housing Navigation", contact: "Halle Nottage", phone: "760-509-3368", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Operation Hope", webAddress: "https://www.operationhope-vista.org/shelter", description: "90 Day Family Program Shelter", contact: "Esperanza Zapico", phone: "760-295-9446", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "The Fellowship Center", webAddress: "https://thefellowshipcenter.org/", description: "Detox/Recovery 90 day Program for men", contact: "Jim Chestnut / Intake Coordinator", phone: "760-745-8478 EXT. 318", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Mcalister North Inland Regional Recovery Center", webAddress: "https://www.mcalisterinstitute.org/programs/", description: "Out Patient treatment for Recovery", contact: "Ana Davies SUD Treatment Counselor", phone: "760-741-7708 EXT. 1304", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Casa Raphael / Alpha Project", webAddress: "https://casaraphael.org/", description: "Rehabilitation Program for men", contact: "Dina / Intake Coordinator", phone: "760-630-9922", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Equus Workforce Solutions", webAddress: "https://equusworks.com/", description: "CalWorks Program", contact: "Lupe Gonzales Director of Community Outreach", phone: "760-803-8262", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Veterans Affairs Outreach", webAddress: "https://www.calvet.ca.gov/VetServices", description: "Veterans services, referrals, social work", contact: "Faye Stauber", phone: "619-705-9378", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Interfaith", webAddress: "https://interfaithservices.org/basic-needs/", description: "Case Manager for Rapid RE-Housing", contact: "Tehana Owens", phone: "760-504-1283", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "CTC", webAddress: "", description: "Opioid addiction and recovery", contact: "Joseph", phone: "619-392-0582", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "North County Homeless Court", webAddress: "https://www.homelesscourt.org/", description: "Public Defender", contact: "Terri Peters", phone: "Terri.peters@sdcounty.ca.gov", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "True Care", webAddress: "https://www.truecare.org/locations/oceanside/", description: "Mobile Clinic Outreach", contact: "Kerry Holloman", phone: "760-736-6767", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Rooted Life", webAddress: "https://rootedlife.org/", description: "Inpatient long term BH Facility", contact: "Melissa", phone: "619-648-1600", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Universidad Popular", webAddress: "https://www.universidadpopular.org/", description: "Immigration Advocacy", contact: "Flower Alvarez-Lopez", phone: "619-648-1600", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Immigration @ North County Center", webAddress: "https://immigrationattorneyescondido.com/", description: "Immigration Advocacy", contact: "María Inés Delgado García", phone: "760-994-1690", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Casa Cornelia", webAddress: "https://www.casacornelia.org/", description: "Immigration Advocacy / Staff Attorney", contact: "Meghan Topolski", phone: "619-231-7788 ext 404", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Mobile Notary", webAddress: "", description: "Mobile Notary", contact: "Amy Saye", phone: "910-467-1700", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Interfaith Social Services", webAddress: "https://interfaithservices.org/", description: "Program Manager and social services", contact: "Jessica Pomerenke", phone: "760-489-6380 ext 110", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Interfaith Social Services", webAddress: "https://interfaithservices.org/", description: "Tenant Based Rental Assistance", contact: "Mariluna Avila", phone: "760-489-6380", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "IHSS Aging and Independence Services", webAddress: "https://www.sandiegocounty.gov/content/sdc/hhsa/programs/ais.html", description: "IHSS Aging and Independence Services", contact: "Erika Diaz", phone: "442-266-6532", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "CPS", webAddress: "https://www.sandiegocounty.gov/content/sdc/hhsa/programs/cs.html", description: "CPS Cases, Inquiries, Reports Hotline assistance", contact: "Andria Haubruge", phone: "858-717-3139", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Goodwill", webAddress: "https://www.goodwill.org/jobs-training/", description: "Employment Services", contact: "Diane Record", phone: "760-722-8582", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "LGBTQ North County Center", webAddress: "https://www.lgbtqresourcecenter.org/", description: "North County Resource Center", contact: "Jeri Nicolas / Office Administrator", phone: "760-994-1690", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Alpha Project Outreach", webAddress: "https://www.alphaproject.org/programs/casa-raphael/", description: "Outreach Coordinator", contact: "Clifford Morris", phone: "619-929-6253", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Interfaith Coastal Program", webAddress: "https://interfaithservices.org/", description: "Homeless Services - Coastal Program Manager", contact: "Christina Moi", phone: "760-215-9901", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "McAlister Kiva Women's Program", webAddress: "https://www.mcalisterinstitute.org/programs/", description: "Kiva/ Womens 90 day detox programs", contact: "", phone: "619-465-7303", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Downtown Partnership Family Reunification", webAddress: "https://downtownsandiego.org/homelessness/unhoused-care/", description: "Family Reunification Program", contact: "Maria Levin", phone: "619-909-4260", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Comprehensive Treatment Centers", webAddress: "https://www.ctccenters.com/", description: "Opioid addiction and recovery", contact: "Joseph Jacome", phone: "619-392-0582", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Family Recovery Center Women", webAddress: "https://www.mhsinc.org/family-recovery-center-rehab/", description: "Mental Health Services - Women and Children Ages up to 11 years Old", contact: "Fabiola Bellinger / Melissa", phone: "760-439-6702", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "North Coastal Behavioral Health Center", webAddress: "", description: "Mental Health Services/ Crisis Center", contact: "Frank Garcia", phone: "888-724-7240", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Serenity House", webAddress: "https://www.healthright360.org/agency/serenity-house/", description: "Long term sober living program for women", contact: "Marissa Maldando", phone: "760-809-0423", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Community Resource Center", webAddress: "", description: "Match Housing / Food Clothing / Shelter Referral", contact: "Kim Cordova", phone: "760-753-1156 EXT. 1374", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Recovery Moments Recovery", webAddress: "", description: "Veterans Recovery", contact: "Mark Gladden", phone: "619-363-4767", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Legal Aid Society Vista", webAddress: "https://www.crla.org/", description: "Free Legal Services for homeless persons", contact: "", phone: "(760) 966-0511", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Easy Access Line for Medi-Cal", webAddress: "", description: "Info Help Line for Clients To Access Medi-Cal Status, Questions and Concerns", contact: "", phone: "1-855-588-0188 PIN: 19446488", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "VisTAY House", webAddress: "https://www.luckyduckfoundation.org/", description: "Youth Transitional Housing Ages 18-25", contact: "Kim Miller", phone: "314-749-0868", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "North County Assessor Office", webAddress: "https://www.sdcounty.ca.gov/content/sdc/arcc.html", description: "Locations for Birth Certificate", contact: "", phone: "(760) 940-6868", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Women's First Step House", webAddress: "https://www.firststephouse.org/", description: "Women's Alcohol 10 Day Detox Center", contact: "", phone: "(760) 542-6724", staffMember: "Ian", updated: new Date().toLocaleDateString() },
      { name: "Vista Community Clinic", webAddress: "https://www.vcc.org/", description: "Low Income Heath Care Needs", contact: "Lisa Barrera (Program Manager)", phone: "760-661-5000 x1328", staffMember: "Ian", updated: new Date().toLocaleDateString() }
    ];
    
    if (db) {
      // Upload to Firebase
      try {
        const batch = writeBatch(db);
        initialData.forEach((item) => {
          const docRef = doc(collection(db, 'resources'));
          batch.set(docRef, item);
        });
        await batch.commit();
        console.log('Initial data uploaded to Firebase');
      } catch (error) {
        console.error('Error uploading initial data:', error);
        // Fallback to localStorage if Firebase fails
        const dataWithIds = initialData.map((item, index) => ({
          ...item,
          id: (index + 1).toString()
        }));
        saveToStorage(dataWithIds);
      }
    } else {
      // Use localStorage - ensure all 49 are loaded
      const dataWithIds = initialData.map((item, index) => ({
        ...item,
        id: (index + 1).toString()
      }));
      saveToStorage(dataWithIds);
      console.log(`Loaded all ${initialData.length} organizations to localStorage`);
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

  const handleOpenEditForm = (item) => {
    setEditEntry({
      id: item.id,
      name: item.name || '',
      webAddress: item.webAddress || '',
      description: item.description || '',
      contact: item.contact || '',
      phone: item.phone || '',
      staffMember: item.staffMember || '',
      updated: item.updated || new Date().toLocaleDateString()
    });
    setShowEditForm(true);
  };

  const handleUpdateEntry = async () => {
    try {
      if (db) {
        const docRef = doc(db, 'resources', editEntry.id);
        await updateDoc(docRef, {
          name: editEntry.name,
          webAddress: editEntry.webAddress,
          description: editEntry.description,
          contact: editEntry.contact,
          phone: editEntry.phone,
          staffMember: editEntry.staffMember,
          updated: new Date().toLocaleDateString()
        });
      } else {
        const newData = data.map(item =>
          item.id === editEntry.id
            ? { ...editEntry, updated: new Date().toLocaleDateString() }
            : item
        );
        saveToStorage(newData);
      }

      setShowEditForm(false);
      setEditEntry(null);
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('Error updating entry. Please try again.');
    }
  };

  const handleEdit = (id, field, currentValue) => {
    setEditingId(id);
    setEditingField(field);
    setEditingValue(currentValue || '');
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
      setEditingValue('');
      setEditingField('');
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('Error updating entry. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
    setEditingField('');
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
    // Predefined staff list
    const predefinedStaff = [
      'Ian', 'Marsha', 'Alex', 'Daniel', 'Mario', 'Angel', 
      'Sebastian', 'Vanessa', 'Kaylyn', 'Khalia', 'Carolina', 'Kenneth'
    ];
    
    // Get staff from existing data
    const dataStaff = data.map(item => item.staffMember).filter(Boolean);
    
    // Combine and deduplicate
    const allStaff = [...new Set([...predefinedStaff, ...dataStaff])];
    
    return allStaff.sort();
  }, [data]);

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="header-top">
            <div className="header-text">
              <h1>North County Resource Database</h1>
              <p className="subtitle">Vista Partners Community Resource Management</p>
            </div>
            <a 
              href="https://www.sdrescueoutreach.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="home-button"
            >
              <Home size={20} /> Home
            </a>
          </div>
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
              <select
                value={newEntry.staffMember}
                onChange={(e) => setNewEntry({ ...newEntry, staffMember: e.target.value })}
                style={{ padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '15px' }}
              >
                <option value="">Select Staff Member</option>
                {uniqueStaffMembers.map(staff => (
                  <option key={staff} value={staff}>{staff}</option>
                ))}
              </select>
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

      {showEditForm && editEntry && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Entry</h2>
              <button onClick={() => { setShowEditForm(false); setEditEntry(null); }}><X size={20} /></button>
            </div>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Organization Name"
                value={editEntry.name}
                onChange={(e) => setEditEntry({ ...editEntry, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Web Address"
                value={editEntry.webAddress}
                onChange={(e) => setEditEntry({ ...editEntry, webAddress: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                value={editEntry.description}
                onChange={(e) => setEditEntry({ ...editEntry, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Contact Person"
                value={editEntry.contact}
                onChange={(e) => setEditEntry({ ...editEntry, contact: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={editEntry.phone}
                onChange={(e) => setEditEntry({ ...editEntry, phone: e.target.value })}
              />
              <select
                value={editEntry.staffMember}
                onChange={(e) => setEditEntry({ ...editEntry, staffMember: e.target.value })}
                style={{ padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '15px' }}
              >
                <option value="">Select Staff Member</option>
                {uniqueStaffMembers.map(staff => (
                  <option key={staff} value={staff}>{staff}</option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleUpdateEntry}>
                <Save size={20} /> Update Entry
              </button>
              <button className="btn btn-secondary" onClick={() => { setShowEditForm(false); setEditEntry(null); }}>
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
                    {editingId === item.id && editingField === 'name' ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => handleSaveEdit(item.id, 'name', editingValue)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(item.id, 'name', editingValue);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        autoFocus
                        style={{ width: '100%', padding: '4px' }}
                      />
                    ) : (
                      <span onClick={() => handleEdit(item.id, 'name', item.name)} style={{ cursor: 'pointer' }}>
                        {item.name}
                      </span>
                    )}
                  </td>
                )}
                {columnVisibility.webAddress && (
                  <td className="truncate">
                    {editingId === item.id && editingField === 'webAddress' ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => handleSaveEdit(item.id, 'webAddress', editingValue)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(item.id, 'webAddress', editingValue);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        style={{ width: '100%', padding: '4px' }}
                        autoFocus
                      />
                    ) : item.webAddress ? (
                      <span
                        onClick={() => handleEdit(item.id, 'webAddress', item.webAddress)}
                        style={{ cursor: 'pointer' }}
                      >
                        <a
                          href={item.webAddress.startsWith('http') ? item.webAddress : `https://${item.webAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#007bff', textDecoration: 'underline' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.webAddress}
                        </a>
                      </span>
                    ) : (
                      <span onClick={() => handleEdit(item.id, 'webAddress', '')} style={{ cursor: 'pointer', color: '#999' }}>
                        Click to add
                      </span>
                    )}
                  </td>
                )}
                {columnVisibility.description && (
                  <td>
                    {editingId === item.id && editingField === 'description' ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => handleSaveEdit(item.id, 'description', editingValue)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(item.id, 'description', editingValue);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        style={{ width: '100%', padding: '4px' }}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleEdit(item.id, 'description', item.description)} style={{ cursor: 'pointer' }}>
                        {item.description || 'Click to add'}
                      </span>
                    )}
                  </td>
                )}
                {columnVisibility.contact && (
                  <td>
                    {editingId === item.id && editingField === 'contact' ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => handleSaveEdit(item.id, 'contact', editingValue)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(item.id, 'contact', editingValue);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        style={{ width: '100%', padding: '4px' }}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleEdit(item.id, 'contact', item.contact)} style={{ cursor: 'pointer' }}>
                        {item.contact || 'Click to add'}
                      </span>
                    )}
                  </td>
                )}
                {columnVisibility.phone && (
                  <td>
                    {editingId === item.id && editingField === 'phone' ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => handleSaveEdit(item.id, 'phone', editingValue)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(item.id, 'phone', editingValue);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        style={{ width: '100%', padding: '4px' }}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleEdit(item.id, 'phone', item.phone)} style={{ cursor: 'pointer' }}>
                        {item.phone || 'Click to add'}
                      </span>
                    )}
                  </td>
                )}
                {columnVisibility.staffMember && (
                  <td>
                    {editingId === item.id && editingField === 'staffMember' ? (
                      <select
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => handleSaveEdit(item.id, 'staffMember', editingValue)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(item.id, 'staffMember', editingValue);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        style={{ width: '100%', padding: '4px' }}
                        autoFocus
                      >
                        <option value="">Select Staff Member</option>
                        {uniqueStaffMembers.map(staff => (
                          <option key={staff} value={staff}>{staff}</option>
                        ))}
                      </select>
                    ) : (
                      <span onClick={() => handleEdit(item.id, 'staffMember', item.staffMember)} style={{ cursor: 'pointer' }}>
                        {item.staffMember || 'Click to add'}
                      </span>
                    )}
                  </td>
                )}
                {columnVisibility.updated && <td>{item.updated}</td>}
                <td className="actions">
                  <button className="btn-icon" onClick={() => handleOpenEditForm(item)}>
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