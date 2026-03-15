export default function AdminDashboardPage({ onNavigate }: { onNavigate: (step: 'student-management') => void }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Dashboard Admin</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-semibold text-lg mb-2">Manajemen Ujian</h3>
          <p className="text-gray-600 mb-4">Buat, edit, atau hapus data ujian.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Kelola Ujian</button>
        </div>
        <div className="p-6 bg-green-50 rounded-xl border border-green-100">
          <h3 className="font-semibold text-lg mb-2">Manajemen Soal</h3>
          <p className="text-gray-600 mb-4">Tambah atau edit bank soal.</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Kelola Soal</button>
        </div>
        <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
          <h3 className="font-semibold text-lg mb-2">Manajemen Murid</h3>
          <p className="text-gray-600 mb-4">Tambah atau hapus data murid.</p>
          <button onClick={() => onNavigate('student-management')} className="bg-purple-600 text-white px-4 py-2 rounded-lg">Kelola Murid</button>
        </div>
        <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-100">
          <h3 className="font-semibold text-lg mb-2">Hasil Ujian</h3>
          <p className="text-gray-600 mb-4">Lihat hasil ujian siswa.</p>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg">Lihat Hasil</button>
        </div>
      </div>
    </div>
  );
}
