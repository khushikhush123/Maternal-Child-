// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    collection,
    addDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyATmhOumFbcnxiacjtwnFN6DBnei9ZQB0A",
    authDomain: "music-a-36028.firebaseapp.com",
    projectId: "music-a-36028",
    storageBucket: "music-a-36028.firebasestorage.app",
    messagingSenderId: "650542631968",
    appId: "1:650542631968:web:401c6884e2a712dc15c045"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const registerUser = async (email, password, userData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update user profile
        await updateProfile(user, {
            displayName: `${userData.firstName} ${userData.lastName}`
        });
        
        // Save user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            mobileNo: userData.mobileNo,
            userType: userData.userType || 'patient',
            createdAt: serverTimestamp(),
            uid: user.uid
        });
        
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            // Create user document if doesn't exist
            await setDoc(doc(db, 'users', user.uid), {
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                email: user.email,
                userType: 'patient',
                createdAt: serverTimestamp(),
                uid: user.uid
            });
        }
        
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getUserData = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return { success: true, data: userDoc.data() };
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const submitMedicalForm = async (formData, userId) => {
    try {
        await addDoc(collection(db, 'medical-forms'), {
            ...formData,
            userId: userId,
            submittedAt: serverTimestamp(),
            status: 'pending'
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Auth state observer
export const observeAuthState = (callback) => {
    return onAuthStateChanged(auth, callback);
};
