import { useState, useEffect } from 'react';
import { UserData } from '../types';
import { getExams } from '../services/supabaseService';

interface Props {
  username: string;
  onSubmit: (data: UserData) => void;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
}

export default function DataConfirmationPage({ username, onSubmit }: Props) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      const { data } = await getExams('Matematika'); // Default to Matematika for now
      if (data) setExams(data);
    };
    fetchExams();
  }, []);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Konfirmasi data Peserta</h2>
      <div className="space-y-4">
        <div><label className="block text-sm text-gray-500">Kode NIK</label><p className="font-medium">{username}</p></div>
        <div><label className="block text-sm text-gray-500">Nama Peserta</label><p className="font-medium">{username} - PESERTA TKA</p></div>
        
        <div>
          <label className="block text-sm text-gray-500">Mata Ujian</label>
          <select 
            value={selectedExam?.id || ''} 
            onChange={(e) => {
              const exam = exams.find(ex => ex.id === e.target.value);
              setSelectedExam(exam || null);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Pilih Ujian</option>
            {exams.map(exam => (
              <option key={exam.id} value={exam.id}>{exam.title}</option>
            ))}
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
          onClick={() => selectedExam && onSubmit({ username, name: username, subject: selectedExam.subject, examId: selectedExam.id })}
          disabled={!selectedExam}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
