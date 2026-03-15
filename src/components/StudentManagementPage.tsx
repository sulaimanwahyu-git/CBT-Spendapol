import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase';

export default function StudentManagementPage({ onBack }: { onBack: () => void }) {
  const [students, setStudents] = useState<any[]>([]);
  const [newStudent, setNewStudent] = useState({ name: '', class: '', username: '', password: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase.from('students').select('*');
    if (error) console.error('Error fetching students:', error);
    else setStudents(data || []);
  };

  const addStudent = async () => {
    const { error } = await supabase.from('students').insert([newStudent]);
    if (error) console.error('Error adding student:', error);
    else {
      setNewStudent({ name: '', class: '', username: '', password: '' });
      fetchStudents();
    }
  };

  const deleteStudent = async (id: string) => {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) console.error('Error deleting student:', error);
    else fetchStudents();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data as { name: string; class: string; username: string; password: string }[];
        const { error } = await supabase.from('students').insert(data);
        if (error) console.error('Error uploading CSV:', error);
        else fetchStudents();
      },
    });
  };

  const downloadTemplate = () => {
    const csvContent = "name,class,username,password\nContoh Nama,Contoh Kelas,contohusername,password123";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_murid.csv';
    a.click();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">← Kembali ke Dashboard</button>
      <h2 className="text-2xl font-bold mb-6">Manajemen Murid</h2>
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-4">
          <input placeholder="Nama" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} className="p-2 border rounded" />
          <input placeholder="Kelas" value={newStudent.class} onChange={(e) => setNewStudent({...newStudent, class: e.target.value})} className="p-2 border rounded" />
          <input placeholder="Username" value={newStudent.username} onChange={(e) => setNewStudent({...newStudent, username: e.target.value})} className="p-2 border rounded" />
          <input placeholder="Password" type="password" value={newStudent.password} onChange={(e) => setNewStudent({...newStudent, password: e.target.value})} className="p-2 border rounded" />
          <button onClick={addStudent} className="bg-green-600 text-white px-4 py-2 rounded">Tambah Murid</button>
        </div>
        <div className="flex gap-4 items-center">
          <input type="file" accept=".csv" onChange={handleFileUpload} className="p-2 border rounded" />
          <button onClick={downloadTemplate} className="bg-blue-600 text-white px-4 py-2 rounded">Download Template CSV</button>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Nama</th>
            <th className="p-2 border">Kelas</th>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Password</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="p-2 border">{student.name}</td>
              <td className="p-2 border">{student.class}</td>
              <td className="p-2 border">{student.username}</td>
              <td className="p-2 border">{student.password}</td>
              <td className="p-2 border">
                <button onClick={() => deleteStudent(student.id)} className="text-red-600">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
