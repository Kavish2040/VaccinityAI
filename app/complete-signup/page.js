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
      // Extract query parameters from the URL
      const params = new URLSearchParams(window.location.search);
      const userType = params.get('userType');
      const condition = params.get('condition'); 

      console.log('CompleteSignup: userType =', userType);
      console.log('CompleteSignup: condition =', condition);

      if (!userType) {
        console.error('User type not found in query parameters');
        router.push('/sign-up');
        return;
      }

  
      user
        .update({
          unsafeMetadata: { userType },
        })
        .then(() => {
          console.log('User metadata updated successfully');
          console.log('Redirecting to appropriate dashboard based on userType');
          if (userType === 'patient') {
          
            console.log('Redirecting to /dashboard');
        
            if (condition) {
              console.log("aaya")
              router.push(`/dashboard?condition=${encodeURIComponent(condition)}`);
            } else {
              router.push('/dashboard');
            }
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
