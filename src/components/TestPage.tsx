import { useState, useEffect } from 'react';
import { UserData } from '../types';
import { getQuestions } from '../services/supabaseService';

interface Props {
  userData: UserData;
}

interface Question {
  id: string;
  question_text: string;
  options: { id: string; text: string }[];
}

export default function TestPage({ userData }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await getQuestions(userData.examId);
      if (data) setQuestions(data);
    };
    fetchQuestions();
  }, [userData.examId]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Soal nomor 1</h2>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm">INFORMASI SOAL</button>
          <div className="bg-gray-200 px-4 py-1 rounded text-sm">Sisa Waktu : 01:14:53</div>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="border-t pt-6">
          <p className="mb-6">{questions[0].question_text}</p>
          
          <div className="space-y-3">
            {questions[0].options.map((option) => (
              <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="answer" className="w-4 h-4" />
                {option.text}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8 pt-6 border-t">
        <button className="bg-red-600 text-white px-6 py-2 rounded-lg">Soal sebelumnya</button>
        <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg">Ragu-ragu</button>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">Soal berikutnya</button>
      </div>
    </div>
  );
}
