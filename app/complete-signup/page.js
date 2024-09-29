// app/complete-signup/page.js
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function CompleteSignup() {
  const router = useRouter();
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      const params = new URLSearchParams(window.location.search);
      const userType = params.get('userType');
      console.log('CompleteSignup: userType =', userType);

      if (!userType) {
        console.error('User type not found in query parameters');
        router.push('/sign-up');
        return;
      }

      // Update user's unsafeMetadata with userType
      user
        .update({
          unsafeMetadata: { userType },
        })
        .then(() => {
          console.log('User metadata updated successfully');
          console.log('Redirecting to appropriate dashboard based on userType');
          if (userType === 'patient') {
            console.log('Redirecting to /dashboard');
            router.push('/dashboard');
          } else if (userType === 'pharmacy') {
            console.log('Redirecting to /pharmacy-dashboard');
            router.push('/pharmacy-dashboard');
          } else {
            console.log('Unknown userType, redirecting to home');
            router.push('/');
          }
        })
        .catch((error) => {
          console.error('Error updating user metadata:', error);
          router.push('/');
        });
    }
  }, [isLoaded, user, router]);

  return <div>Completing sign-up...</div>;
}
