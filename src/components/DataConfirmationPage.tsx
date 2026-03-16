import { useState, useEffect } from 'react';
import { UserData } from '../types';
import { getExams } from '../services/supabaseService';
import { supabase } from '../lib/supabase';

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
  const [studentData, setStudentData] = useState<{ name: string; class: string; username: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch exams
      const { data } = await getExams('Matematika'); // Default to Matematika for now
      if (data) setExams(data);

      // Fetch student data
      console.log('Fetching all student data to verify connection...');
      const { data: students, error: studentError } = await supabase
        .from('students')
        .select('*');
      
      console.log('All students fetch result:', { students, studentError });
      
      if (students) {
        // Mencoba mencocokkan username yang diinput dengan kolom 'username' ATAU 'name'
        const student = students.find(s => 
          s.username === username.trim() || s.name.toLowerCase() === username.trim().toLowerCase()
        );
        if (student) {
          setStudentData({ name: student.name, class: student.class, username: student.username });
        } else {
          console.error('Student not found in list for username/name:', username);
          setStudentData({ name: 'Data tidak ditemukan', class: '', username: '' });
        }
      } else {
        console.error('Error fetching students:', studentError);
        setStudentData({ name: 'Error database', class: '' });
      }
    };
    fetchData();
  }, [username]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Konfirmasi data Peserta</h2>
      <div className="space-y-4">
        <div><label className="block text-sm text-gray-500">No Peserta</label><p className="font-medium">{studentData ? studentData.username : username}</p></div>
        <div><label className="block text-sm text-gray-500">Nama Peserta</label><p className="font-medium">{studentData ? `${studentData.name} - ${studentData.class}` : 'Memuat...'}</p></div>
        
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
          onClick={() => selectedExam && onSubmit({ username, name: studentData?.name || username, subject: selectedExam.subject, examId: selectedExam.id })}
          disabled={!selectedExam || !studentData}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
