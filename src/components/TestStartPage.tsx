import { UserData } from '../types';

interface Props {
  userData: UserData;
  onStart: () => void;
}

export default function TestStartPage({ userData, onStart }: Props) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-auto text-center">
      <h2 className="text-xl font-semibold mb-6">Konfirmasi Tes</h2>
      <div className="space-y-4 text-left mb-8">
        <div><label className="block text-sm text-gray-500">Nama Tes</label><p className="font-medium">{userData.subject} - SMP Sederajat</p></div>
        <div><label className="block text-sm text-gray-500">Status Tes</label><p className="font-medium">Tes Baru</p></div>
        <div><label className="block text-sm text-gray-500">Waktu Tes</label><p className="font-medium">{new Date().toLocaleString()}</p></div>
        <div><label className="block text-sm text-gray-500">Alokasi Waktu Tes</label><p className="font-medium">75 Menit</p></div>
      </div>
      <button 
        onClick={onStart}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Mulai
      </button>
    </div>
  );
}
