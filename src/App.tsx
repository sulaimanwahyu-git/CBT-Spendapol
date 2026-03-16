/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import DataConfirmationPage from './components/DataConfirmationPage';
import TestStartPage from './components/TestStartPage';
import TestPage from './components/TestPage';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboardPage from './components/AdminDashboardPage';
import StudentManagementPage from './components/StudentManagementPage';
import ExamManagementPage from './components/ExamManagementPage';
import QuestionManagementPage from './components/QuestionManagementPage';
import ExamResultsPage from './components/ExamResultsPage';
import { Step, UserData } from './types';
import { supabase } from './lib/supabase';

export default function App() {
  const [step, setStep] = useState<Step>('login');
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserData({ username: session.user.email || '', name: session.user.email || '', subject: '', examId: '' });
        setStep('data-confirmation');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUserData({ username: session.user.email || '', name: session.user.email || '', subject: '', examId: '' });
        setStep('data-confirmation');
      } else {
        setUserData(null);
        setStep('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-blue-800 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">SPENDAPOL - APLIKASI CBT</h1>
          <div className="flex items-center gap-4">
            {userData && (
              <>
                <span className="text-sm">{userData.username} - {userData.subject}</span>
                <button onClick={() => supabase.auth.signOut()} className="text-xs bg-red-600 px-2 py-1 rounded">Logout</button>
              </>
            )}
            {step !== 'admin-dashboard' && step !== 'admin-login' && !userData && (
              <button onClick={() => setStep('admin-login')} className="text-xs bg-yellow-600 px-2 py-1 rounded">Admin</button>
            )}
            {step === 'admin-dashboard' && (
              <button onClick={() => setStep('login')} className="text-xs bg-red-600 px-2 py-1 rounded">Logout Admin</button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow p-6">
        {step === 'login' && <LoginPage onLogin={(name) => { setUserData({ username: name, name: name, subject: '', examId: '' }); setStep('data-confirmation'); }} />}
        {step === 'data-confirmation' && userData && <DataConfirmationPage username={userData.username} onSubmit={(d) => { setUserData(d); setStep('test-start'); }} />}
        {step === 'test-start' && userData && <TestStartPage userData={userData} onStart={() => setStep('test-active')} />}
        {step === 'test-active' && userData && <TestPage userData={userData} />}
        {step === 'admin-login' && <AdminLoginPage onLogin={() => setStep('admin-dashboard')} />}
        {step === 'admin-dashboard' && <AdminDashboardPage onNavigate={(s) => setStep(s)} />}
        {step === 'student-management' && <StudentManagementPage onBack={() => setStep('admin-dashboard')} />}
        {step === 'exam-management' && <ExamManagementPage onBack={() => setStep('admin-dashboard')} />}
        {step === 'question-management' && <QuestionManagementPage onBack={() => setStep('admin-dashboard')} />}
        {step === 'exam-results' && <ExamResultsPage onBack={() => setStep('admin-dashboard')} />}
      </main>

      <footer className="text-center p-4 text-gray-500 text-sm bg-white border-t">
        Tim Kurikulum SMPN 2 Gempol @2026
      </footer>
    </div>
  );
}
