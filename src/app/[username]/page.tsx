import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProfileComponent from '@/components/ProfileComponent';

async function getProfile(username: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/profile?username=${username}`);
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);

  if (!profile) {
    notFound();
  }

  // Serialize the profile data
  const serializedProfile = JSON.parse(JSON.stringify(profile));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileComponent profile={serializedProfile} />
    </Suspense>
  );
}