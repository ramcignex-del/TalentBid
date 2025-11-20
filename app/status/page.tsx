"use client";

import { useEffect, useState } from 'react';

export default function StatusPage() {
  const [status, setStatus] = useState({
    server: 'checking...',
    auth: 'checking...',
    api: 'checking...'
  });

  useEffect(() => {
    async function checkStatus() {
      // Check if we can reach API
      try {
        const response = await fetch('/api/auth/user');
        setStatus(prev => ({
          ...prev,
          server: '✅ Running',
          api: response.ok || response.status === 401 ? '✅ Working' : '❌ Error',
          auth: response.status === 401 ? '✅ Ready (not logged in)' : '✅ Logged in'
        }));
      } catch (error) {
        setStatus({
          server: '✅ Running',
          auth: '⚠️ Check Supabase setup',
          api: '⚠️ Check logs'
        });
      }
    }
    checkStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🚀 TalentBid Status
          </h1>
          <p className="text-slate-600">Application health check</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <span className="font-medium text-slate-700">Next.js Server:</span>
            <span className="text-xl">{status.server}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <span className="font-medium text-slate-700">API Routes:</span>
            <span className="text-xl">{status.api}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <span className="font-medium text-slate-700">Authentication:</span>
            <span className="text-xl">{status.auth}</span>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h2 className="font-semibold text-slate-900 mb-4">Quick Links:</h2>
          <div className="grid grid-cols-2 gap-4">
            <a 
              href="/"
              className="block p-4 bg-slate-900 text-white rounded-lg text-center hover:bg-slate-800 transition"
            >
              🏠 Home
            </a>
            <a 
              href="/auth/signup"
              className="block p-4 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition"
            >
              ✨ Sign Up
            </a>
            <a 
              href="/auth/login"
              className="block p-4 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition"
            >
              🔐 Login
            </a>
            <a 
              href="/dashboard"
              className="block p-4 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700 transition"
            >
              📊 Dashboard
            </a>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> If you see authentication errors, you need to set up Supabase database. 
            Check <code className="bg-blue-100 px-2 py-1 rounded">/app/DATABASE_SETUP_INSTRUCTIONS.md</code>
          </p>
        </div>
      </div>
    </div>
  );
}
