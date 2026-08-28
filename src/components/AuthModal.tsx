import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Shield,
  Heart,
  X,
  LogIn,
  UserPlus,
  RefreshCw,
  LogOut,
  Sliders,
  Check,
  Globe2,
  Users,
  AlertCircle
} from 'lucide-react';
import { AuraLogo } from './AuraLogo';
import { UserAccount, UserCycleProfile } from '../types';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  db,
  doc,
  setDoc,
  getDoc,
  handleFirestoreError,
  OperationType,
} from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onRegister: (account: UserAccount, loadSampleData: boolean) => void;
  onLogin: (account: UserAccount) => void;
  onLogout: () => void;
  onUpdateProfile: (updatedProfile: UserCycleProfile) => void;
  initialMode?: 'register' | 'login' | 'profile';
  totalMemberCount?: number;
}

const AVATAR_COLORS = [
  { id: 'terracotta', hex: '#8E3B22', label: 'Warm Terracotta' },
  { id: 'copper', hex: '#C97A5E', label: 'Rose Copper' },
  { id: 'forest', hex: '#2D583F', label: 'Sage Emerald' },
  { id: 'amber', hex: '#B87333', label: 'Golden Amber' },
  { id: 'berry', hex: '#7A3656', label: 'Plum Dusk' },
  { id: 'bronze', hex: '#54463E', label: 'Earth Bronze' },
];

const TRACKING_GOALS = [
  'Spot hormonal symptom patterns',
  'Sync nutrition with cycle phases',
  'Track mood & energy dips',
  'Monitor period & ovulation dates',
  'Explore female rights & safety',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRegister,
  onLogin,
  onLogout,
  onUpdateProfile,
  initialMode = 'register',
  totalMemberCount = 1248,
}) => {
  const [mode, setMode] = useState<'register' | 'login' | 'profile'>(
    currentUser && !currentUser.isGuest ? 'profile' : initialMode
  );

  // Register Form State
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('#8E3B22');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Spot hormonal symptom patterns',
    'Sync nutrition with cycle phases',
  ]);

  // Cycle parameters for Step 2
  const [lastPeriodDate, setLastPeriodDate] = useState<string>(
    new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [loadSampleData, setLoadSampleData] = useState<boolean>(true);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Profile Edit State
  const [editLastPeriod, setEditLastPeriod] = useState<string>(
    currentUser?.cycleProfile?.lastPeriodDate || lastPeriodDate
  );
  const [editCycleLength, setEditCycleLength] = useState<number>(
    currentUser?.cycleProfile?.averageCycleLength || 28
  );
  const [editPeriodLength, setEditPeriodLength] = useState<number>(
    currentUser?.cycleProfile?.averagePeriodLength || 5
  );
  const [profileSavedToast, setProfileSavedToast] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // Synchronize modal mode and clear errors when opened
  React.useEffect(() => {
    if (isOpen) {
      if (currentUser && !currentUser.isGuest) {
        setMode('profile');
      } else {
        setMode(initialMode || 'register');
      }
      setAuthError('');
      setLoginError('');
      if (currentUser?.cycleProfile) {
        setEditLastPeriod(currentUser.cycleProfile.lastPeriodDate || lastPeriodDate);
        setEditCycleLength(currentUser.cycleProfile.averageCycleLength || 28);
        setEditPeriodLength(currentUser.cycleProfile.averagePeriodLength || 5);
      }
    }
  }, [isOpen, initialMode, currentUser, lastPeriodDate]);

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (registerStep === 1) {
      if (!name.trim() || !email.trim()) {
        setAuthError('Please enter your name and email address.');
        return;
      }
      if (!password.trim() || password.trim().length < 6) {
        setAuthError('Password must be at least 6 characters long.');
        return;
      }
      setRegisterStep(2);
      return;
    }

    setIsAuthenticating(true);

    let assignedId = 'usr_' + Date.now();
    let fbUser: any = null;

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      fbUser = userCred.user;
      assignedId = fbUser.uid;
      if (name.trim()) {
        try {
          await updateProfile(fbUser, { displayName: name.trim() });
        } catch (e) {
          // Profile display name update optional
        }
      }
    } catch (fbErr: any) {
      console.warn('Firebase registration error:', fbErr);
      if (fbErr.code === 'auth/email-already-in-use') {
        setIsAuthenticating(false);
        setAuthError('An account with this email already exists. Please go to Sign In or use another email.');
        setRegisterStep(1);
        return;
      } else if (fbErr.code === 'auth/weak-password') {
        setIsAuthenticating(false);
        setAuthError('Password is too weak. Please use at least 6 characters.');
        setRegisterStep(1);
        return;
      } else if (fbErr.code === 'auth/invalid-email') {
        setIsAuthenticating(false);
        setAuthError('Please enter a valid email address.');
        setRegisterStep(1);
        return;
      } else {
        // Fallback for offline mode: record in local storage
        console.warn('Firebase registration offline fallback:', fbErr.message);
      }
    }

    const newAccount: UserAccount = {
      id: assignedId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatarColor: selectedColor,
      isGuest: false,
      createdAt: new Date().toISOString(),
      goals: selectedGoals,
      cycleProfile: {
        lastPeriodDate,
        averageCycleLength: Number(cycleLength),
        averagePeriodLength: Number(periodLength),
        onboardingCompleted: true,
        hasSampleData: loadSampleData,
      },
    };

    // Save profile document to Firestore
    try {
      await setDoc(
        doc(db, 'users', assignedId),
        {
          id: assignedId,
          name: newAccount.name,
          email: newAccount.email,
          avatarColor: newAccount.avatarColor,
          lastPeriodDate: newAccount.cycleProfile.lastPeriodDate,
          cycleLength: newAccount.cycleProfile.averageCycleLength,
          periodLength: newAccount.cycleProfile.averagePeriodLength,
          goals: newAccount.goals || [],
          onboardingCompleted: true,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore write warning:', err);
    }

    setIsAuthenticating(false);
    onRegister(newAccount, loadSampleData);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const uid = fbUser.uid;
      const userEmail = fbUser.email || 'aura.user@gmail.com';
      const userName = fbUser.displayName || userEmail.split('@')[0];

      // Check if user profile already exists in Firestore
      let userProfileDoc = null;
      try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) {
          userProfileDoc = snap.data();
        }
      } catch (err) {
        console.warn('Error reading existing profile:', err);
      }

      const cycleProfile: UserCycleProfile = userProfileDoc
        ? {
            lastPeriodDate: userProfileDoc.lastPeriodDate || new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            averageCycleLength: userProfileDoc.cycleLength || 28,
            averagePeriodLength: userProfileDoc.periodLength || 5,
            onboardingCompleted: true,
            hasSampleData: true,
          }
        : {
            lastPeriodDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            averageCycleLength: 28,
            averagePeriodLength: 5,
            onboardingCompleted: true,
            hasSampleData: true,
          };

      const account: UserAccount = {
        id: uid,
        name: userName,
        email: userEmail,
        avatarColor: userProfileDoc?.avatarColor || '#8E3B22',
        isGuest: false,
        createdAt: new Date().toISOString(),
        goals: userProfileDoc?.goals || ['Spot hormonal symptom patterns', 'Sync nutrition with cycle phases'],
        cycleProfile,
      };

      // Save/update user document in Firestore
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            id: uid,
            name: userName,
            email: userEmail,
            avatarColor: account.avatarColor,
            lastPeriodDate: cycleProfile.lastPeriodDate,
            cycleLength: cycleProfile.averageCycleLength,
            periodLength: cycleProfile.averagePeriodLength,
            goals: account.goals,
            onboardingCompleted: true,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (saveErr) {
        console.warn('Firestore write warning:', saveErr);
      }

      onRegister(account, true);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setAuthError(err.message || 'Google Sign-In was cancelled or failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim()) {
      setLoginError('Please enter your email address');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Please enter your password');
      return;
    }

    setIsAuthenticating(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword.trim());
      const uid = userCred.user.uid;

      // Fetch user document from Firestore
      let userDocData: any = null;
      try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) {
          userDocData = snap.data();
        }
      } catch (dbErr) {
        console.warn('Firestore fetch warning:', dbErr);
      }

      const foundAccount: UserAccount = {
        id: uid,
        name: userDocData?.name || userCred.user.displayName || loginEmail.split('@')[0],
        email: userCred.user.email || loginEmail.trim().toLowerCase(),
        avatarColor: userDocData?.avatarColor || '#8E3B22',
        isGuest: false,
        createdAt: userDocData?.createdAt || new Date().toISOString(),
        goals: userDocData?.goals || ['Spot hormonal symptom patterns', 'Sync nutrition with cycle phases'],
        cycleProfile: userDocData
          ? {
              lastPeriodDate: userDocData.lastPeriodDate || new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              averageCycleLength: userDocData.cycleLength || 28,
              averagePeriodLength: userDocData.periodLength || 5,
              onboardingCompleted: true,
              hasSampleData: true,
            }
          : {
              lastPeriodDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              averageCycleLength: 28,
              averagePeriodLength: 5,
              onboardingCompleted: true,
              hasSampleData: true,
            },
      };

      setIsAuthenticating(false);
      onLogin(foundAccount);
      onClose();
    } catch (fbLoginErr: any) {
      console.warn('Firebase login attempt:', fbLoginErr);
      setIsAuthenticating(false);
      if (
        fbLoginErr.code === 'auth/wrong-password' ||
        fbLoginErr.code === 'auth/invalid-credential' ||
        fbLoginErr.code === 'auth/user-not-found'
      ) {
        setLoginError('Incorrect email or password. Please check your credentials or create a new account.');
      } else if (fbLoginErr.code === 'auth/too-many-requests') {
        setLoginError('Too many failed attempts. Please reset your password or try again in a few minutes.');
      } else if (fbLoginErr.code === 'auth/invalid-email') {
        setLoginError('Please enter a valid email address.');
      } else {
        setLoginError(fbLoginErr.message || 'Unable to sign in. Please verify your email and password.');
      }
    }
  };

  const handleQuickDemoLogin = (demoName: string, demoEmail: string) => {
    const demoAccount: UserAccount = {
      id: 'demo_' + demoName.toLowerCase(),
      name: demoName,
      email: demoEmail,
      avatarColor: '#8E3B22',
      isGuest: false,
      createdAt: new Date().toISOString(),
      goals: ['Spot hormonal symptom patterns', 'Sync nutrition with cycle phases'],
      cycleProfile: {
        lastPeriodDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        averageCycleLength: 28,
        averagePeriodLength: 5,
        onboardingCompleted: true,
        hasSampleData: true,
      },
    };
    onLogin(demoAccount);
    onClose();
  };

  const handleGuestContinue = () => {
    const guestAccount: UserAccount = {
      id: 'guest_' + Date.now(),
      name: 'Guest Explorer',
      email: 'guest@aura.health',
      avatarColor: '#54463E',
      isGuest: true,
      createdAt: new Date().toISOString(),
      cycleProfile: {
        lastPeriodDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        averageCycleLength: 28,
        averagePeriodLength: 5,
        onboardingCompleted: true,
        hasSampleData: true,
      },
    };
    onLogin(guestAccount);
    onClose();
  };

  const handleSaveProfileChanges = () => {
    onUpdateProfile({
      lastPeriodDate: editLastPeriod,
      averageCycleLength: Number(editCycleLength),
      averagePeriodLength: Number(editPeriodLength),
      onboardingCompleted: true,
      hasSampleData: true,
    });
    setProfileSavedToast(true);
    setTimeout(() => {
      setProfileSavedToast(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#18120F]/70 backdrop-blur-sm flex min-h-full items-start justify-center p-3 sm:p-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-white rounded-3xl max-w-lg w-full border border-[#EAE1D5] shadow-2xl relative overflow-hidden flex flex-col my-auto max-h-[90vh]"
      >
        {/* Ambient celestial background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#F6EBE5] to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Sticky Header with Exact AURA Logo & Close Button */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#F2ECE4] relative shrink-0 bg-white/90 backdrop-blur-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AuraLogo variant="horizontal" size="sm" theme="terracotta" showSubtitle={true} />
          </div>

          <div className="flex items-center gap-2">
            {/* Live Sign-In & Member Tracker Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF3EE] text-[#8E3B22] border border-[#ECD9CC] text-[10px] font-bold">
              <Users className="w-3 h-3" />
              <span>{totalMemberCount.toLocaleString()} Members Active</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#8A7D73] hover:text-[#2C2420] hover:bg-[#F5EFE7] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {/* Headline */}
          <div>
            <h2 className="font-serif-editorial text-2xl text-[#2B231F] font-normal">
              {mode === 'profile'
                ? 'Account & Cycle Parameters'
                : mode === 'login'
                ? 'Welcome Back to AURA'
                : 'Create Sovereign Health Profile'}
            </h2>
            <p className="text-xs text-[#7A6F66] mt-0.5">
              Personal biological rhythm intelligence & hormonal pattern verification.
            </p>
          </div>

          {/* MODE SELECTOR TABS */}
          <div className="flex items-center p-1 bg-[#FAF6F0] rounded-2xl border border-[#ECE3D8]">
            {currentUser && !currentUser.isGuest ? (
              <>
                <button
                  type="button"
                  onClick={() => setMode('profile')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'profile'
                      ? 'bg-white text-[#2B231F] shadow-xs border border-[#E0D7CC]'
                      : 'text-[#7A6E64] hover:text-[#2B231F]'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-[#8E3B22]" />
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white text-[#2B231F] shadow-xs border border-[#E0D7CC]'
                      : 'text-[#7A6E64] hover:text-[#2B231F]'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#8E3B22]" />
                  New Account
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setRegisterStep(1);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white text-[#2B231F] shadow-xs border border-[#E0D7CC]'
                      : 'text-[#7A6E64] hover:text-[#2B231F]'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#8E3B22]" />
                  Register / Sign Up
                </button>

                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-[#2B231F] shadow-xs border border-[#E0D7CC]'
                      : 'text-[#7A6E64] hover:text-[#2B231F]'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 text-[#8E3B22]" />
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Quick Google Sign In */}
          {mode !== 'profile' && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isAuthenticating}
                className="w-full py-2.5 px-4 rounded-xl border border-[#DED4C7] bg-[#FAF8F5] hover:bg-[#F2ECE4] text-xs font-bold text-[#2B231F] transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <RefreshCw className="w-4 h-4 text-[#8E3B22] animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>{isAuthenticating ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              {authError && (
                <div className="p-2.5 rounded-xl bg-[#FDF2F0] border border-[#F5C6CB] text-xs text-[#8E3B22] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="leading-tight">{authError}</span>
                </div>
              )}
            </div>
          )}

          {mode !== 'profile' && (
            <div className="flex items-center gap-3">
              <div className="h-px bg-[#EAE1D5] flex-1" />
              <span className="text-[10px] uppercase font-bold text-[#9E9085] tracking-wider">
                Or with Email
              </span>
              <div className="h-px bg-[#EAE1D5] flex-1" />
            </div>
          )}

          {/* -------------------- 1. REGISTER FLOW -------------------- */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Step Indicator Header */}
              <div className="flex items-center justify-between text-xs font-bold text-[#8A7D73] border-b border-[#F2EAE1] pb-2">
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      registerStep === 1
                        ? 'bg-[#8E3B22] text-white font-bold'
                        : 'bg-[#EBF4F0] text-[#2D583F]'
                    }`}
                  >
                    {registerStep === 2 ? '✓' : '1'}
                  </span>
                  Step 1: Account
                </span>

                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      registerStep === 2
                        ? 'bg-[#8E3B22] text-white font-bold'
                        : 'bg-[#F2ECE4] text-[#8A7D73]'
                    }`}
                  >
                    2
                  </span>
                  Step 2: Cycle Data
                </span>
              </div>

              {registerStep === 1 && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#695D53] mb-1">
                      Name or Preferred Alias
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8A7E73] absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anshika, Lucía"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2D8CC] bg-[#FAF8F5] text-sm text-[#2B231F] focus:outline-none focus:ring-2 focus:ring-[#8E3B22]/20 focus:border-[#8E3B22]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#695D53] mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8A7E73] absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2D8CC] bg-[#FAF8F5] text-sm text-[#2B231F] focus:outline-none focus:ring-2 focus:ring-[#8E3B22]/20 focus:border-[#8E3B22]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#695D53] mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8A7E73] absolute left-3.5 top-3" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2D8CC] bg-[#FAF8F5] text-sm text-[#2B231F] focus:outline-none focus:ring-2 focus:ring-[#8E3B22]/20 focus:border-[#8E3B22]"
                      />
                    </div>
                  </div>

                  {/* Profile Hue Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#695D53] mb-1.5">
                      Select Profile Hue
                    </label>
                    <div className="flex items-center gap-2.5">
                      {AVATAR_COLORS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedColor(c.hex)}
                          className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                            selectedColor === c.hex
                              ? 'ring-2 ring-[#2B231F] ring-offset-2 scale-110'
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.label}
                        >
                          {selectedColor === c.hex && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tracking Goals */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#695D53] mb-1.5">
                      Your Tracking Priorities
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {TRACKING_GOALS.map((g) => {
                        const isSelected = selectedGoals.includes(g);
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => toggleGoal(g)}
                            className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#FAF2ED] text-[#8E3B22] border border-[#F2DFD5] font-bold'
                                : 'bg-[#FAF8F5] text-[#695D53] border border-[#EAE3D9] hover:bg-[#F2EDE6]'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '} {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#8E3B22] text-white font-bold text-xs hover:bg-[#772F1B] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Continue to Cycle Calibration</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {registerStep === 2 && (
                <div className="space-y-4">
                  {/* Last Period Date */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#695D53] mb-1">
                      When did your last period start?
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#8A7E73] absolute left-3.5 top-3" />
                      <input
                        type="date"
                        required
                        value={lastPeriodDate}
                        onChange={(e) => setLastPeriodDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2D8CC] bg-[#FAF8F5] text-sm text-[#2B231F] focus:outline-none focus:ring-2 focus:ring-[#8E3B22]/20 focus:border-[#8E3B22]"
                      />
                    </div>
                  </div>

                  {/* Average Cycle Length */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#695D53]">
                        Typical Cycle Length
                      </label>
                      <span className="text-xs font-bold text-[#8E3B22] px-2 py-0.5 rounded bg-[#FAF2ED] border border-[#F2DFD5]">
                        {cycleLength} days
                      </span>
                    </div>
                    <input
                      type="range"
                      min={21}
                      max={38}
                      value={cycleLength}
                      onChange={(e) => setCycleLength(Number(e.target.value))}
                      className="w-full accent-[#8E3B22] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#9E9085] mt-0.5">
                      <span>21 days</span>
                      <span>28 days (Average)</span>
                      <span>38 days</span>
                    </div>
                  </div>

                  {/* Period Length */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#695D53]">
                        Typical Period Duration
                      </label>
                      <span className="text-xs font-bold text-[#8E3B22] px-2 py-0.5 rounded bg-[#FAF2ED] border border-[#F2DFD5]">
                        {periodLength} days
                      </span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={9}
                      value={periodLength}
                      onChange={(e) => setPeriodLength(Number(e.target.value))}
                      className="w-full accent-[#8E3B22] cursor-pointer"
                    />
                  </div>

                  {/* Sample Baseline Option */}
                  <div className="p-3 rounded-2xl bg-[#FAF6F2] border border-[#EDE2D4]">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={loadSampleData}
                        onChange={(e) => setLoadSampleData(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-[#8E3B22] accent-[#8E3B22] cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-[#2B231F] block">
                          Pre-fill multi-cycle sample data
                        </span>
                        <span className="text-[11px] text-[#7A6E64]">
                          Enables immediate Body Receipts, correlation charts, and symptom pattern recognition.
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      className="px-4 py-3 rounded-xl border border-[#E2D8CC] text-[#695D53] font-bold text-xs hover:bg-[#FAF8F5] transition-all cursor-pointer"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="flex-1 py-3 rounded-xl bg-[#8E3B22] text-white font-bold text-xs hover:bg-[#772F1B] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {isAuthenticating ? (
                        <RefreshCw className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      <span>{isAuthenticating ? 'Creating Account & Profile...' : 'Complete Registration'}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* -------------------- 2. SIGN IN FLOW -------------------- */}
          {mode === 'login' && (
            <div className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-xl bg-[#FDF1F1] border border-[#F5C7C7] text-xs text-[#8A2626]">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#695D53] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8A7E73] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2D8CC] bg-[#FAF8F5] text-sm text-[#2B231F] focus:outline-none focus:ring-2 focus:ring-[#8E3B22]/20 focus:border-[#8E3B22]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#695D53] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8A7E73] absolute left-3.5 top-3" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2D8CC] bg-[#FAF8F5] text-sm text-[#2B231F] focus:outline-none focus:ring-2 focus:ring-[#8E3B22]/20 focus:border-[#8E3B22]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 rounded-xl bg-[#8E3B22] text-white font-bold text-xs hover:bg-[#772F1B] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  <span>{isAuthenticating ? 'Signing In...' : 'Sign In to AURA'}</span>
                </button>
              </form>

              {/* Demo Profiles */}
              <div className="pt-3 border-t border-[#F2EAE1] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A7D73] block text-center">
                  Quick Demo Profiles
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('Anshika', 'anshika@aura.health')}
                    className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-left hover:bg-[#F2EDE6] transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-[#2B231F]">Anshika</div>
                    <div className="text-[10px] text-[#7A6E64]">Day 24 · Luteal Phase</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('Lucía', 'lucia@aura.health')}
                    className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-left hover:bg-[#F2EDE6] transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-[#2B231F]">Lucía</div>
                    <div className="text-[10px] text-[#7A6E64]">Day 8 · Follicular Peak</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- 3. USER PROFILE MANAGEMENT -------------------- */}
          {mode === 'profile' && currentUser && (
            <div className="space-y-4">
              {profileSavedToast && (
                <div className="p-3 rounded-xl bg-[#EBF4F0] border border-[#CDE5D8] text-xs text-[#2D583F] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D583F]" />
                  <span>Cycle settings updated successfully!</span>
                </div>
              )}

              {/* User Overview */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE1D5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl text-white flex items-center justify-center font-bold text-base shadow-xs"
                    style={{ backgroundColor: currentUser?.avatarColor || '#8E3B22' }}
                  >
                    {currentUser?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-serif-editorial text-base text-[#2B231F] font-bold">
                      {currentUser?.name || 'AURA Member'}
                    </h3>
                    <p className="text-xs text-[#7A6E64]">{currentUser?.email || ''}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF2ED] text-[#8E3B22] border border-[#F2DFD5]">
                  {currentUser?.isGuest ? 'Guest' : 'Active'}
                </span>
              </div>

              {/* Cycle Adjustments */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-white border border-[#EAE3D9]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B231F] flex items-center gap-1.5 border-b border-[#F2ECE4] pb-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#8E3B22]" />
                  Active Cycle Calibration
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-[#695D53] mb-1">
                    Last Period Start Date
                  </label>
                  <input
                    type="date"
                    value={editLastPeriod}
                    onChange={(e) => setEditLastPeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD5C8] bg-[#FAF8F5] text-xs text-[#2B231F] focus:outline-none focus:ring-1 focus:ring-[#8E3B22]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#695D53]">Average Cycle Length:</span>
                    <span className="font-bold text-[#8E3B22]">{editCycleLength} days</span>
                  </div>
                  <input
                    type="range"
                    min={21}
                    max={38}
                    value={editCycleLength}
                    onChange={(e) => setEditCycleLength(Number(e.target.value))}
                    className="w-full accent-[#8E3B22] cursor-pointer"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveProfileChanges}
                  className="w-full py-2 rounded-xl bg-[#2B231F] text-white font-bold text-xs hover:bg-black transition-all cursor-pointer"
                >
                  Save Recalibration
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F2EAE1]">
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setMode('register');
                    setRegisterStep(1);
                  }}
                  className="text-xs font-bold text-[#8E3B22] hover:text-[#5E2210] flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-xs font-bold text-[#54463E] hover:bg-[#F2EDE6] transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Guest Explorer Option */}
          {mode !== 'profile' && (
            <div className="pt-2 border-t border-[#F2EAE1] text-center">
              <button
                type="button"
                onClick={handleGuestContinue}
                className="text-xs text-[#8A7D73] hover:text-[#2B231F] font-semibold hover:underline cursor-pointer"
              >
                Continue as Guest Explorer (Skip for now)
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

