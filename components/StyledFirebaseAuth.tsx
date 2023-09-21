import firebaseApp from '@/lib/frontend/firebase';
import { GoogleAuthProvider, getAuth, onAuthStateChanged } from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { useEffect, useRef, useState } from 'react';

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
  ],
};

interface Props {
  uiCallback?(ui: firebaseui.auth.AuthUI): void;
  className?: string;
}

const StyledFirebaseAuth = ({ className, uiCallback }: Props) => {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const firebaseAuth = getAuth(firebaseApp);

    const firebaseUiWidget = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebaseAuth);
    if (uiConfig.signInFlow === 'popup') {
      firebaseUiWidget.reset();
    }

    const unregisterAuthObserver = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user && userSignedIn) {
        firebaseUiWidget.reset();
      }
      setUserSignedIn(!!user);
    });

    if (uiCallback) {
      uiCallback(firebaseUiWidget);
    }

    // @ts-ignore
    firebaseUiWidget.start(elementRef.current, uiConfig);

    return () => {
      unregisterAuthObserver();
      firebaseUiWidget.reset();
    };
  }, [firebaseui, uiConfig]);

  return <div className={className} ref={elementRef} />;
};

export default StyledFirebaseAuth;
