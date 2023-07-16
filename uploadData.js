import admin from 'firebase-admin';
import serviceAccount from './service_account.json' assert { type: "json" };
import ailmentsData from './aliments_data.json' assert { type: "json" };

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://misaengghackrx.firebaseio.com',
});


// Upload the data to Firebase
const uploadData = async () => {
  try {
    const db = admin.firestore();
    const collectionRef = db.collection('aliments');

    for (const item of ailmentsData) {
      const { minorAilment, specifiedDrugs } = item;
    
      if (!minorAilment || typeof minorAilment !== 'string') {
        console.warn(`Invalid minorAilment: ${minorAilment} in item`, item);
        continue;
      }
    
      const docId = minorAilment.replace(/\//g, '_');  
    
      const docRef = collectionRef.doc(docId);
    
      await docRef.set({ specifiedDrugs });
    
      console.log(`Uploaded data for ${minorAilment}`);
    }
    

    console.log('Data uploaded successfully!');
  } catch (error) {
    console.error('Error uploading data:', error);
  }
};

uploadData();


const getAilmentsData = async () => {
  try {
    const db = admin.firestore();
    const collectionRef = db.collection('aliments');

    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log('No matching documents found.');
      return;
    }  

    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

getAilmentsData();
