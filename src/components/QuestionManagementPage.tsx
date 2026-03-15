import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function QuestionManagementPage({ onBack }: { onBack: () => void }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({ exam_id: '', question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'a' });

  useEffect(() => {
    fetchQuestions();
    fetchExams();
  }, []);

  const fetchQuestions = async () => {
    const { data, error } = await supabase.from('questions').select('*, exams(title)');
    if (error) console.error('Error fetching questions:', error);
    else setQuestions(data || []);
  };

  const fetchExams = async () => {
    const { data, error } = await supabase.from('exams').select('id, title');
    if (error) console.error('Error fetching exams:', error);
    else setExams(data || []);
  };

  const addQuestion = async () => {
    const { error } = await supabase.from('questions').insert([newQuestion]);
    if (error) {
      console.error('Error adding question:', error);
      alert('Gagal menambah soal: ' + error.message);
    } else {
      setNewQuestion({ exam_id: '', question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'a' });
      fetchQuestions();
    }
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) console.error('Error deleting question:', error);
    else fetchQuestions();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">← Kembali ke Dashboard</button>
      <h2 className="text-2xl font-bold mb-6">Manajemen Soal</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select value={newQuestion.exam_id} onChange={(e) => setNewQuestion({...newQuestion, exam_id: e.target.value})} className="p-2 border rounded">
          <option value="">Pilih Ujian</option>
          {exams.map(exam => <option key={exam.id} value={exam.id}>{exam.title}</option>)}
        </select>
        <input placeholder="Soal" value={newQuestion.question} onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})} className="p-2 border rounded" />
        <input placeholder="Opsi A" value={newQuestion.option_a} onChange={(e) => setNewQuestion({...newQuestion, option_a: e.target.value})} className="p-2 border rounded" />
        <input placeholder="Opsi B" value={newQuestion.option_b} onChange={(e) => setNewQuestion({...newQuestion, option_b: e.target.value})} className="p-2 border rounded" />
        <input placeholder="Opsi C" value={newQuestion.option_c} onChange={(e) => setNewQuestion({...newQuestion, option_c: e.target.value})} className="p-2 border rounded" />
        <input placeholder="Opsi D" value={newQuestion.option_d} onChange={(e) => setNewQuestion({...newQuestion, option_d: e.target.value})} className="p-2 border rounded" />
        <select value={newQuestion.correct_answer} onChange={(e) => setNewQuestion({...newQuestion, correct_answer: e.target.value})} className="p-2 border rounded">
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
          <option value="d">D</option>
        </select>
        <button onClick={addQuestion} className="bg-green-600 text-white px-4 py-2 rounded">Tambah Soal</button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Ujian</th>
            <th className="p-2 border">Soal</th>
            <th className="p-2 border">Kunci</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td className="p-2 border">{q.exams?.title}</td>
              <td className="p-2 border">{q.question}</td>
              <td className="p-2 border">{q.correct_answer.toUpperCase()}</td>
              <td className="p-2 border">
                <button onClick={() => deleteQuestion(q.id)} className="text-red-600">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
