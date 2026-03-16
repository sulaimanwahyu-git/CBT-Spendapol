import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import QuestionUploader from './QuestionUploader';

export default function QuestionManagementPage({ onBack }: { onBack: () => void }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({ exam_id: '', question: '', type: 'multiple_choice', options: '["A", "B", "C", "D"]', correct_answer: 'a' });

  useEffect(() => {
    fetchQuestions();
    fetchExams();
  }, []);

  const fetchQuestions = async () => {
    console.log("Fetching questions...");
    const { data, error } = await supabase.from('questions').select('*, exams(title), option_a, option_b, option_c, option_d');
    if (error) {
      console.error('Error fetching questions:', error);
    } else {
      console.log("Questions fetched from Supabase:", data);
      if (data && data.length > 0) {
        console.log("First question object:", data[0]);
      } else {
        console.log("No questions found in database.");
      }
      setQuestions(data || []);
    }
  };

  const fetchExams = async () => {
    const { data, error } = await supabase.from('exams').select('id, title');
    if (error) console.error('Error fetching exams:', error);
    else setExams(data || []);
  };

  const addQuestion = async () => {
    const { error } = await supabase.from('questions').insert([{
      ...newQuestion,
      options: JSON.parse(newQuestion.options)
    }]);
    if (error) {
      console.error('Error adding question:', error);
      alert('Gagal menambah soal: ' + error.message);
    } else {
      setNewQuestion({ exam_id: '', question: '', type: 'multiple_choice', options: '["A", "B", "C", "D"]', correct_answer: 'a' });
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
        <select value={newQuestion.type} onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})} className="p-2 border rounded">
          <option value="multiple_choice">Pilihan Ganda</option>
          <option value="mcma">Pilihan Ganda Kompleks (MCMA)</option>
          <option value="true_false">Benar/Salah</option>
          <option value="essay">Essay</option>
        </select>
        <input placeholder="Opsi (JSON Array)" value={newQuestion.options} onChange={(e) => setNewQuestion({...newQuestion, options: e.target.value})} className="p-2 border rounded" />
        <input placeholder="Kunci Jawaban" value={newQuestion.correct_answer} onChange={(e) => setNewQuestion({...newQuestion, correct_answer: e.target.value})} className="p-2 border rounded" />
        <button onClick={addQuestion} className="bg-green-600 text-white px-4 py-2 rounded">Tambah Soal</button>
      </div>

      <QuestionUploader examId={newQuestion.exam_id} onUploadSuccess={fetchQuestions} />

      <table className="w-full border-collapse mt-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Ujian</th>
            <th className="p-2 border">Soal</th>
            <th className="p-2 border">Tipe</th>
            <th className="p-2 border">Opsi</th>
            <th className="p-2 border">Kunci</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td className="p-2 border">{q.exams?.title}</td>
              <td className="p-2 border">{q.question}</td>
              <td className="p-2 border">{q.type}</td>
              <td className="p-2 border">
                A: {q.option_a}<br/>
                B: {q.option_b}<br/>
                C: {q.option_c}<br/>
                D: {q.option_d}
              </td>
              <td className="p-2 border">{q.correct_answer}</td>
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
