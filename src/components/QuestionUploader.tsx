import React, { useState } from 'react';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase';

interface Props {
  examId: string;
  onUploadSuccess: () => void;
}

export default function QuestionUploader({ examId, onUploadSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  
  React.useEffect(() => {
    console.log("QuestionUploader examId:", examId);
  }, [examId]);

  const downloadTemplate = () => {
    const csvContent = "question,type,options,correct_answer\n" +
                       "Contoh Soal Pilihan Ganda?,multiple_choice,\"[\"\"A\"\",\"\"B\"\",\"\"C\"\",\"\"D\"\"]\",a\n" +
                       "Contoh Soal Essay?,essay,\"[]\",";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_soal.csv';
    a.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("File:", file);
    if (!file || !examId) return;

    setLoading(true);
    const reader = new FileReader();

    const insertQuestions = async (questions: any[]) => {
      const BATCH_SIZE = 50; // Proses 50 soal per batch
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < questions.length; i += BATCH_SIZE) {
        const batch = questions.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('questions').insert(batch);
        
        if (error) {
          console.error(`Error uploading batch ${i / BATCH_SIZE + 1}:`, error);
          console.error("Error details:", JSON.stringify(error, null, 2));
          errorCount += batch.length;
        } else {
          successCount += batch.length;
        }
      }

      setLoading(false);
      if (errorCount > 0) {
        alert(`Selesai. Berhasil: ${successCount}, Gagal: ${errorCount}. Periksa konsol untuk detail error.`);
      } else {
        alert(`Berhasil mengunggah ${successCount} soal!`);
      }
      onUploadSuccess();
    };

    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        Papa.parse(text, {
          header: true,
          complete: async (results) => {
            const questions = results.data.map((row: any) => {
              let parsedOptions = [];
              try {
                parsedOptions = JSON.parse(row.options || '[]');
              } catch (e) {
                console.error("Error parsing options for row:", row, e);
              }
              return {
                exam_id: examId,
                question: row.question,
                type: row.type,
                option_a: parsedOptions[0] || '',
                option_b: parsedOptions[1] || '',
                option_c: parsedOptions[2] || '',
                option_d: parsedOptions[3] || '',
                correct_answer: row.correct_answer
              };
            });
            await insertQuestions(questions);
          }
        });
      };
      reader.readAsText(file);
    } else if (file.type === 'text/html' || file.name.endsWith('.html')) {
      reader.onload = async (e) => {
        const html = e.target?.result as string;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const rows = doc.querySelectorAll('.question-row');
        const questions = Array.from(rows).map(row => {
          let parsedOptions = [];
          try {
            parsedOptions = JSON.parse(row.querySelector('.options')?.textContent || '[]');
          } catch (e) {
            console.error("Error parsing options for HTML row:", row, e);
          }
          return {
            exam_id: examId,
            question: row.querySelector('.question')?.textContent,
            type: row.querySelector('.type')?.textContent,
            option_a: parsedOptions[0] || '',
            option_b: parsedOptions[1] || '',
            option_c: parsedOptions[2] || '',
            option_d: parsedOptions[3] || '',
            correct_answer: row.querySelector('.correct_answer')?.textContent
          };
        });
        await insertQuestions(questions);
      };
      reader.readAsText(file);
    } else {
      alert("Tipe file tidak didukung.");
      setLoading(false);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">Unggah Soal (CSV/HTML)</h3>
      <button onClick={downloadTemplate} className="text-blue-600 underline text-sm mb-2 block">Download Template CSV</button>
      
      <input 
        type="file" 
        ref={fileInputRef}
        accept=".csv,.html" 
        onChange={handleFileUpload} 
        className="hidden"
        disabled={loading || !examId} 
      />
      
      <button 
        onClick={() => {
          if (!examId) {
            alert("Harap pilih ujian terlebih dahulu!");
            return;
          }
          fileInputRef.current?.click();
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
        disabled={loading}
      >
        Pilih File & Unggah
      </button>

      {loading && <p className="mt-2 text-sm text-blue-600">Mengunggah...</p>}
    </div>
  );
}
