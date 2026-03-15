import { useState } from 'react';
import { UserData } from '../types';

interface Props {
  username: string;
  onSubmit: (data: UserData) => void;
}

export default function DataConfirmationPage({ username, onSubmit }: Props) {
  const [subject, setSubject] = useState('Matematika');
  const [token, setToken] = useState('');

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Konfirmasi data Peserta</h2>
      <div className="space-y-4">
        <div><label className="block text-sm text-gray-500">Kode NIK</label><p className="font-medium">{username}</p></div>
        <div><label className="block text-sm text-gray-500">Nama Peserta</label><p className="font-medium">{username} - PESERTA TKA</p></div>
        
        <div>
          <label className="block text-sm text-gray-500">Mata Ujian</label>
          <select 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option>Matematika</option>
            <option>Bahasa Indonesia</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-500">Token</label>
          <input 
            type="text" 
            placeholder="Ketikkan token di sini"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button 
          onClick={() => onSubmit({ username, name: username, subject })}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
