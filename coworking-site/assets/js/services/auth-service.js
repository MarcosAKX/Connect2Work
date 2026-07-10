import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
import { doc, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';
import { auth, db, isFirebaseConfigured } from '../config/firebase.js';

const AUTH_ERRORS = {
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/invalid-email': 'Digite um e-mail válido.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos.',
  'auth/popup-closed-by-user': 'Login com Google cancelado.',
  'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
};

export function isAuthReady() {
  return isFirebaseConfigured() && auth && db;
}

export function mapAuthError(error) {
  return AUTH_ERRORS[error?.code] || 'Ocorreu um erro. Tente novamente.';
}

export async function registerUser({ fullName, email, profession, phone, password }) {
  if (!isAuthReady()) {
    throw new Error('Firebase não configurado. Preencha assets/js/config/firebase.js');
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(credential.user, { displayName: fullName });

  await setDoc(doc(db, 'users', credential.user.uid), {
    fullName,
    email,
    profession,
    phone,
    createdAt: serverTimestamp(),
  });

  return credential.user;
}

export async function loginUser(email, password) {
  if (!isAuthReady()) {
    throw new Error('Firebase não configurado. Preencha assets/js/config/firebase.js');
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginWithGoogle() {
  if (!isAuthReady()) {
    throw new Error('Firebase não configurado. Preencha assets/js/config/firebase.js');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  const credential = await signInWithPopup(auth, provider);
  return credential.user;
}

export async function resetUserPassword(email) {
  if (!isAuthReady()) {
    throw new Error('Firebase não configurado. Preencha assets/js/config/firebase.js');
  }

  await sendPasswordResetEmail(auth, email);
}
