import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ExamManagementPage({ onBack }: { onBack: () => void }) {
  const [exams, setExams] = useState<any[]>([]);
  const [newExam, setNewExam] = useState({ title: '', subject: '', duration: 60 });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    const { data, error } = await supabase.from('exams').select('*');
    if (error) console.error('Error fetching exams:', error);
    else setExams(data || []);
  };

  const addExam = async () => {
    const { error } = await supabase.from('exams').insert([newExam]);
    if (error) {
      console.error('Error adding exam:', error);
      alert('Gagal menambah ujian: ' + error.message);
    } else {
      setNewExam({ title: '', subject: '', duration: 60 });
      fetchExams();
    }
  };

  const deleteExam = async (id: string) => {
    const { error } = await supabase.from('exams').delete().eq('id', id);
    if (error) console.error('Error deleting exam:', error);
    else fetchExams();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">← Kembali ke Dashboard</button>
      <h2 className="text-2xl font-bold mb-6">Manajemen Ujian</h2>
      
      <div className="flex gap-4 mb-6">
        <input placeholder="Judul Ujian" value={newExam.title} onChange={(e) => setNewExam({...newExam, title: e.target.value})} className="p-2 border rounded" />
        <input placeholder="Mata Pelajaran" value={newExam.subject} onChange={(e) => setNewExam({...newExam, subject: e.target.value})} className="p-2 border rounded" />
        <input type="number" placeholder="Durasi (menit)" value={newExam.duration} onChange={(e) => setNewExam({...newExam, duration: parseInt(e.target.value)})} className="p-2 border rounded" />
        <button onClick={addExam} className="bg-blue-600 text-white px-4 py-2 rounded">Tambah Ujian</button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Judul</th>
            <th className="p-2 border">Mapel</th>
            <th className="p-2 border">Durasi</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id}>
              <td className="p-2 border">{exam.title}</td>
              <td className="p-2 border">{exam.subject}</td>
              <td className="p-2 border">{exam.duration} menit</td>
              <td className="p-2 border">
                <button onClick={() => deleteExam(exam.id)} className="text-red-600">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
