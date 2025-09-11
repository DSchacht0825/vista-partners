// Run this script to populate Firebase with all 49 organizations
// Navigate to your project folder and run: node populate-data.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, getDocs } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBRH1mqIoufRe8dAYNTv1cCyS-I9ajg9iE",
  authDomain: "vista-partners-db.firebaseapp.com",
  projectId: "vista-partners-db",
  storageBucket: "vista-partners-db.firebasestorage.app",
  messagingSenderId: "568281415398",
  appId: "1:568281415398:web:ac6850ab1e6be0610c0527"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const allData = [
  { name: "Brother Bennos", webAddress: "Support Services & Aid - Brother Benno Foundation", description: "Homeless Services/Day Center", contact: "Steven", phone: "760-410-9497", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Alpha Project", webAddress: "Alpha Project Casa Raphael | Vista, CA", description: "90 day program shelter for men", contact: "Clifford", phone: "760-929-6253", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
  { name: "Oceanside Navigation Center", webAddress: "Oceanside Navigation Center - San Diego Rescue Mission", description: "Shelter", contact: "Jessica", phone: "442-375-9695", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
  { name: "Buena Creek Navigation Center Vista", webAddress: "Our Mission — Retread Housing Services", description: "30 day Shelter for men and women/ no children", contact: "Pete", phone: "442-320-6962", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
  { name: "Jewish family Services", webAddress: "Safe Parking | City of Vista", description: "Safe Parking Vista", contact: "", phone: "858-637-3373", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
  { name: "Interfaith", webAddress: "Interfaith Community Services", description: "Interfaith Recuperative Care", contact: "Kaitlyn", phone: "1-760-270-5361", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
  { name: "Green Oak Ranch", webAddress: "About — Green Oak Ranch", description: "Faith based Recovery Program", contact: "Junior", phone: "1-858-929-9020", staffMember: "Alex/Marsha", updated: new Date().toLocaleDateString() },
  { name: "McCalaster", webAddress: "McAlister Institute", description: "Out Patient treatment for Recovery", contact: "Leilani", phone: "1-760-707-8555", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
  { name: "Interfaith", webAddress: "Basic Needs — Interfaith Community Services", description: "Detox, housing, Recuperative care, food", contact: "Tanea", phone: "1-760-489-6380", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
  { name: "Legal Aid of San Diego", webAddress: "Legal-Aid-Now", description: "legal services", contact: "", phone: "1-877-534-2524", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
  { name: "Home Start", webAddress: "Meet Shannon Beresford, Probation Housing Navigation", description: "Adult Probation North County Housing navigator", contact: "Norma", phone: "619-669-3458", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
  { name: "County of San Diego Probation Depart", webAddress: "Probation Department", description: "Probation", contact: "Jose Riveria Probation Deputy", phone: "760-806-2351", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
  { name: "Catholic Charities", webAddress: "Homeless Men's Services - Catholic Charities", description: "Mens Shelter", contact: "Emiliano Cerda", phone: "760-929-2322", staffMember: "Alex/Marsha", updated: new Date().toLocaleDateString() },
  { name: "Think Dignity", webAddress: "HOME | Humanityshowers", description: "Mobile Shower trailers", contact: "Jordan", phone: "619-859-1412", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
  { name: "La Paloma", webAddress: "Home | La Paloma Healthcare Center", description: "Health Care Centers", contact: "Jennifer", phone: "760-724-2193", staffMember: "Marsha", updated: new Date().toLocaleDateString() },
  { name: "Path", webAddress: "Greater San Diego | epath.org", description: "Homeless Services", contact: "Shannon", phone: "619-366-3899", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Downtown Partnership", webAddress: "Unhoused Care — Downtown San Diego Partnership", description: "Family Reunification", contact: "Rose Harris", phone: "619-501-9520", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "McCalaster Institute", webAddress: "McAlister Institute", description: "Detox, housing, Recuperative care", contact: "Darlene", phone: "619-465-7303", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Father Joe's", webAddress: "Nonprofit Services for Homelessness | Father Joe's Villages", description: "Homeless Services", contact: "Garrett", phone: "619-233-8500", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Salvation Army", webAddress: "Drug and Alcohol Adult Rehabilitation Centers", description: "Homeless Services, Rehabilitation One Year Program", contact: "Kathy", phone: "619-699-2214", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "P.E.R.T", webAddress: "PERT — CRF Behavioral Healthcare", description: "Mental Health Services", contact: "Eduardo", phone: "760-435-4900", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Interfaith", webAddress: "Basic Needs — Interfaith Community Services", description: "Homeless Services", contact: "Valerie", phone: "760-807-6580", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Exodus Recovery", webAddress: "SD Vista CSU | Exodus Recovery Inc", description: "Mental Health Services", contact: "Frank", phone: "760-758-1150", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Monarch", webAddress: "About Monarch - Monarch School in San Diego", description: "Homeless Youth School", contact: "James", phone: "619-652-1621", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Dreams For Change", webAddress: "Safe Parking - Dreams For Change", description: "Safe Parking Oceanside", contact: "Samantha", phone: "619-497-0236", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Solutions For Change", webAddress: "Solutions To Homelessness | Solutions For Change", description: "2 year Rehabilitation Program for men/women with children", contact: "Lilia / intake coordinator", phone: "760-941-6545 ext 301", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Interfaith", webAddress: "Basic Needs — Interfaith Community Services", description: "H.O.T Oceanside", contact: "Kaitlyn", phone: "760-270-5361", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Brother Bennos", webAddress: "Services - Brother Benno Foundation", description: "Homeless Services / Day center", contact: "Steven", phone: "760-410-9497", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Family Resource Center", webAddress: "Family Recovery Center - MHS/TURN", description: "Detox, Rehabilitation, Single Woman", contact: "Rebecca / Admissions", phone: "760-941-6545", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Turn", webAddress: "North Coastal Mental Health Center - MHS/TURN", description: "Mental Health Out Patient Services", contact: "Perla", phone: "760-712-3535", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Turning Point Crisis Center", webAddress: "Turning Point Crisis Center — CRF Behavioral Healthcare", description: "Inpatient BH care for men and woman", contact: "Carey", phone: "760-439-2800", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "La Posada", webAddress: "Homeless Men's Services - Catholic Charities", description: "90 Day Shelter Program For Men", contact: "LeAnne Aubel", phone: "760-929-2322", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Path", webAddress: "Greater San Diego | epath.org", description: "Homeless Services", contact: "Teresa Corona", phone: "619-381-8093", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Lifeline", webAddress: "Housing & Stability San Diego | Lifeline Community Services", description: "Housing Navigation", contact: "Halle Nottage", phone: "760-509-3368", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Operation Hope", webAddress: "Shelter | Operation HOPE - Vista", description: "90 Day Family Program Shelter", contact: "Esperanza Zapico", phone: "760-295-9446", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "The Fellowship Center", webAddress: "The Fellowship Center", description: "Detox/Recovery 90 day Program for men", contact: "Jim Chestnut / Intake Coordinator", phone: "760-745-8478 EXT. 318", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Mcalister North Inland Regional Recovery Center", webAddress: "Programs — McAlister Institute", description: "Out Patient treatment for Recovery", contact: "Ana Davies SUD Treatment Counselor", phone: "760-741-7708 EXT. 1304", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Casa Raphael / Alpha Project", webAddress: "Casa Raphael Residential Treatment Rehab in Vista, CA", description: "Rehabilitation Program for men", contact: "Dina / Intake Coordinator", phone: "760-630-9922", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Equus Workforce Solutions", webAddress: "Equus Workforce Solutions Homepage", description: "CalWorks Program", contact: "Lupe Gonzales Director of Community Outreach", phone: "760-803-8262", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Veterans Affairs Outreach", webAddress: "CalVet Veteran Services Homeless Veterans Outreach", description: "Veterans services, referrals, social work", contact: "Faye Stauber", phone: "619-705-9378", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Interfaith", webAddress: "Basic Needs — Interfaith Community Services", description: "Case Manager for Rapid RE-Housing", contact: "Tehana Owens", phone: "760-504-1283", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "CTC", webAddress: "", description: "Opioid addiction and recovery", contact: "Joseph", phone: "619-392-0582", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "North County Homeless Court", webAddress: "Homeless Court Assistance | Homeless Court", description: "Public Defender", contact: "Terri Peters", phone: "Terri.peters@sdcounty.ca.gov", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "True Care", webAddress: "TrueCare Oceanside", description: "Mobile Clinic Outreach", contact: "Kerry Holloman", phone: "760-736-6767", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Rooted Life", webAddress: "HOME | RootedLife", description: "Inpatient long term BH Facility", contact: "Melissa", phone: "619-648-1600", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Universidad Popular", webAddress: "Universidad Popular", description: "Immigration Advocacy", contact: "Flower Alvarez-Lopez", phone: "619-648-1600", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Immigration @ North County Center", webAddress: "Immigration Attorney in Escondido & San Diego", description: "Immigration Advocacy", contact: "María Inés Delgado García", phone: "760-994-1690", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Casa Cornelia", webAddress: "Pro Bono Immigration Lawyer | Casa Cornelia Law Center", description: "Immigration Advocacy / Staff Attorney", contact: "Meghan Topolski", phone: "619-231-7788 ext 404", staffMember: "Ian", updated: new Date().toLocaleDateString() },
  { name: "Mobile Notary", webAddress: "", description: "Mobile Notary", contact: "Amy Saye", phone: "910-467-1700", staffMember: "Ian", updated: new Date().toLocaleDateString() }
];

async function populateData() {
  try {
    // Check current data count
    const snapshot = await getDocs(collection(db, 'resources'));
    console.log(`Current data count: ${snapshot.size}`);
    
    if (snapshot.size >= 49) {
      console.log('Database already has all data!');
      return;
    }
    
    // Upload all data
    const batch = writeBatch(db);
    allData.forEach((item) => {
      const docRef = doc(collection(db, 'resources'));
      batch.set(docRef, item);
    });
    
    await batch.commit();
    console.log(`Successfully uploaded all ${allData.length} organizations to Firebase!`);
    
    // Verify
    const newSnapshot = await getDocs(collection(db, 'resources'));
    console.log(`New data count: ${newSnapshot.size}`);
    
  } catch (error) {
    console.error('Error populating data:', error);
  }
}

populateData();