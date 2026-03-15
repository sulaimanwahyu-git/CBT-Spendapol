import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ExamResultsPage({ onBack }: { onBack: () => void }) {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const { data, error } = await supabase.from('results').select('*, students(name), exams(title)');
    if (error) console.error('Error fetching results:', error);
    else setResults(data || []);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">← Kembali ke Dashboard</button>
      <h2 className="text-2xl font-bold mb-6">Hasil Ujian</h2>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Murid</th>
            <th className="p-2 border">Ujian</th>
            <th className="p-2 border">Skor</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.id}>
              <td className="p-2 border">{r.students?.name}</td>
              <td className="p-2 border">{r.exams?.title}</td>
              <td className="p-2 border">{r.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
