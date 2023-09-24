import { Auth, onAuthStateChanged } from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { useEffect, useRef, useState } from 'react';

interface Props {
  uiCallback?(ui: firebaseui.auth.AuthUI): void;
  className?: string;
  firebaseAuth: Auth;
  uiConfig: firebaseui.auth.Config;
}

const StyledFirebaseAuth = ({ className, uiCallback, firebaseAuth, uiConfig }: Props) => {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

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
