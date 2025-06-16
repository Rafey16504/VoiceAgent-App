'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from 'react';
const Spline = React.lazy(() => import("@splinetool/react-spline"));

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !room) {
      alert('Please enter both your name and a room name.');
      return;
    }
    // Navigate to the voice page with query params
    router.push(`/voice-page?name=${encodeURIComponent(name)}&room=${encodeURIComponent(room)}`);
  };

  return (
    <main className="h-screen flex flex-col justify-center items-center">
      <Spline scene="https://prod.spline.design/WEyEP1ytN7iPp1o0/scene.splinecode" className="absolute inset-0"/>
      <p className="h-96 text-3xl font-bold relative self-center">Join a Room with</p>
      <div  className="p-2 rounded w-128 relative flex space-x-24">
        
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Room Name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
        <button onClick={handleSubmit} className="relative w-96 bg-red-600 text-white py-2 rounded hover:bg-red-700">
          Enter Room
        </button>
          <p className='absolute bottom-4 right-4 bg-zinc-200 w-40 h-12'>

          </p>

    </main>
  );
}
