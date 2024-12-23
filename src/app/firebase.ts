import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const templates = [
  {
    "title": "Product Manager internship",
    "description": "A message template to ask for opened positions as a Product Manager intern.",
    "templateContent": "Hi [firstname],\nI'm very interested in product management roles and was excited to see your background. I'd love to connect and ask for advice as I look for an internship in the field."
  },
  {
    "title": "M&A internship",
    "description": "A message template to ask for opened positions as a Megers & Acquisitions intern.",
    "templateContent": "Hi [firstname],\nI'm currently exploring opportunities in mergers and acquisitions, and I was really impressed by your experience in the field. I'd love to connect and ask for advice."
  },
  {
    "title": "Sales Trader internship",
    "description": "A message template to ask for opened positions as a Sales Trader intern.",
    "templateContent": "Hi [firstname],\nI'm highly interested in trading and was excited to see your background in the industry. I'd love to connect and seek your guidance as I look for an internship in trading."
  }
]

async function initializeTemplates(uid:string) {
  for (const template of templates) {
    try {
      // Generate a timestamp to use as the document ID (key)
      const timestamp = new Date().getTime().toString();

      // Create a reference to the new template document under the user's collection
      const docRef = doc(db, 'templates', `${uid}-${timestamp}`);

      // Set the new template object
      await setDoc(docRef, {
        uid: uid,
        title: template.title,
        description: template.description,
        templateContent: template.templateContent,
        createdAt: timestamp,
        updatedAt: timestamp
      });
    } catch (error) {
      console.error('Error saving template:', error);
    }
  }
}


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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


export async function initializeProfile(stripeCustomerId: string, uid: string): Promise<void> {
  try {
    const db = getFirestore();
    const docRef = doc(db, "profiles", uid); // Reference to the document in the 'profiles' collection

    // Get the current document
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        stripeCustomerId: stripeCustomerId,
        creditsUsed: 0,
        dateCreditsRefreshed: new Date(new Date().setHours(0, 0, 0, 0))
      });
      await initializeTemplates(uid);

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

export async function sendPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error fetching Stripe Customer ID:", error);
    return null;
  }
};

export { app, db, auth }