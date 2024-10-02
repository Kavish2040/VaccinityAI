// app/redirect-dashboard/page.js
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function RedirectDashboard() {
  const router = useRouter();
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Access userType from unsafeMetadata
      const userType = user.unsafeMetadata?.userType;
      console.log('RedirectDashboard: userType =', userType);

      if (userType === 'patient') {
        router.push('/dashboard');
      } else if (userType === 'pharmacy') {
        router.push('/pharmacy-dashboard');
      } else {
        console.log('Unknown userType, redirecting to home');
        router.push('/');
      }
    } else if (isLoaded && !user) {
      console.log('User not loaded, redirecting to sign-in');
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  return <div>Redirecting...</div>;
}