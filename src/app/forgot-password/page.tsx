'use client'
import { useState, useEffect } from 'react';
import { sendPasswordReset } from '../firebase';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BasicButton from '@/components/general/BasicButton';


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const { data: session } = useSession();

  // Set the mounted state to true once the component has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && session) {
      router.push('/home');
    }
  }, [mounted, session, router]);

  // Prevent rendering the component until hydration is complete
  if (!mounted) return null;

  const reset = async () => {
    try {
      await sendPasswordReset(email)
      setMessage("");
    } catch (error) {
      console.log(error);
      setMessage("Password reset failed. Please try again.");
    }
  };

  return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-10 max-w-lg w-full">
          <div className="flex flex-col items-center">
            <img
              className="h-16 w-16 mb-6"
              src="/images/fire.png"
              alt="Logo"
            />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Forgot Password
            </h2>
            <p className="text-gray-500 mb-6 text-center">
              Enter your email address to reset your password
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-[#ff6b2b] focus:ring-1 focus:ring-[#ff6b2b]"
                />
              </div>
            </div>

            {message && <p className="mt-2 text-center text-sm text-red-500">{message}</p>}

            <div className="flex justify-center">
              <BasicButton
                disabled={!email}
                onClick={reset}
                buttonText="Send Reset Email"
                type="general"
              />
            </div>

          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remembered your password?{' '}
            <button onClick={() => router.push('/signin')} className="text-[#ff6b2b] hover:text-[#e66026] font-semibold">
              Sign In
            </button>
          </p>
        </div>
      </div>
  );
}
