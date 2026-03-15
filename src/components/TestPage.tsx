import { UserData } from '../types';

interface Props {
  userData: UserData;
}

export default function TestPage({ userData }: Props) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Soal nomor 1</h2>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm">INFORMASI SOAL</button>
          <div className="bg-gray-200 px-4 py-1 rounded text-sm">Sisa Waktu : 01:14:53</div>
        </div>
      </div>

      <div className="border-t pt-6">
        <p className="mb-6">Ani membeli 2 pulpen dan 2 pensil di sebuah toko alat tulis. Harga satuan pulpen adalah Rp12.000,00 dan harga satuan pensil adalah Rp8.000,00. Kebetulan, toko tersebut sedang memberikan promo "Hemat Berempat" dengan ketentuan sebagai berikut: "Setiap pembelian 4 barang (boleh campur) akan mendapat potongan harga sebesar harga 1 barang termurah yang dibeli".</p>
        
        <div className="space-y-3">
          {['Rp32.000,00', 'Rp36.000,00', 'Rp40.000,00', 'Rp44.000,00'].map((option, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="answer" className="w-4 h-4" />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t">
        <button className="bg-red-600 text-white px-6 py-2 rounded-lg">Soal sebelumnya</button>
        <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg">Ragu-ragu</button>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">Soal berikutnya</button>
      </div>
    </div>
  );
}
