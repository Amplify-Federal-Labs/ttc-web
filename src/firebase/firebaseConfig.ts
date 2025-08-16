import { initializeApp } from 'firebase/app';
import type { FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import * as firebaseConfigJson from "../../firebaseConfig.json"

// Initialize Firebase
const firebaseConfig: FirebaseOptions = firebaseConfigJson as FirebaseOptions;

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;