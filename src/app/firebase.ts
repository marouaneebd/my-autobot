import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

// Set the persistence to LOCAL to make sure the user session persists across page reloads
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistence set to LOCAL');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });


export async function updateOrCreateStripeCustomerId(stripeCustomerId: string, uid: string): Promise<void> {
  try {
    const db = getFirestore();
    const docRef = doc(db, "profiles", uid); // Reference to the document in the 'profiles' collection
    
    // Get the current document
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // If the document exists, update the 'prompt' field
      await setDoc(docRef, { stripeCustomerId: stripeCustomerId }, { merge: true });
    } else {
      // If the document does not exist, create a new document with the 'prompt' field
      await setDoc(docRef, { stripeCustomerId: stripeCustomerId });
    }

    console.log("Document successfully written!");
  } catch (error) {
    console.error("Error writing document: ", error);
  }
}

export async function getStripeCustomerId(uid: string): Promise<string | null> {
  try {
    // Reference to the user's document in the 'profiles' collection
    const docRef = doc(db, "profiles", uid);
    const docSnap = await getDoc(docRef);

    // Check if the document exists
    if (docSnap.exists()) {
      const data = docSnap.data();

      // Return the stripeCustomerId if it exists
      return data?.stripeCustomerId || null;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Stripe Customer ID:", error);
    return null;
  }
}

export { app, db, auth }