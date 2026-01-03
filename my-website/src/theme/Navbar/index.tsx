import React, { useEffect, useState } from 'react';
import Navbar from '@theme-original/Navbar';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/contexts/AuthContext';
import { translate } from '@docusaurus/Translate';

export default function NavbarWrapper(props) {
  const { isLoggedIn, logout, checkAuthStatus } = useAuth();
  const [localIsLoggedIn, setLocalIsLoggedIn] = useState(isLoggedIn);

  // Update local state when auth context changes
  useEffect(() => {
    setLocalIsLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  // Check auth status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Listen for authChange events to update navbar when auth state changes from other components
  useEffect(() => {
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [checkAuthStatus]);

  return (
    <>
      <Navbar
        {...props}
        items={[
          // Filter out the GitHub link from original items
          ...((props.items || []).filter(item =>
            item.href !== 'https://github.com/QadirKhan9/Physical-AI-Humanoid-Robotics-Book'
          )),
          // Conditionally render signup/signin or dashboard/profile/signout based on auth status
          ...(!localIsLoggedIn
            ? [
                {
                  to: '/signup',
                  label: translate({ id: 'theme.navbar.signup', message: 'Sign Up' }),
                  position: 'right' as const,
                },
                {
                  to: '/signin',
                  label: translate({ id: 'theme.navbar.signin', message: 'Sign In' }),
                  position: 'right' as const,
                }
              ]
            : [
                {
                  type: 'dropdown',
                  label: translate({ id: 'theme.navbar.account', message: 'Account' }),
                  position: 'right' as const,
                  items: [
                    {
                      to: '/dashboard',
                      label: translate({ id: 'theme.navbar.dashboard', message: 'Dashboard' }),
                    },
                    {
                      to: '/profile',
                      label: translate({ id: 'theme.navbar.profile', message: 'Profile' }),
                    },
                    {
                      type: 'button',
                      label: translate({ id: 'theme.navbar.signout', message: 'Sign Out' }),
                      onClick: () => {
                        logout();
                        // Update local state immediately to reflect change
                        setLocalIsLoggedIn(false);
                        window.location.href = '/';
                      }
                    }
                  ]
                }
              ]
          )
        ]}
      />
    </>
  );
}