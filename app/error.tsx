'use client';
import Link from 'next/link';
import { useEffect } from 'react';

// Beklenmeyen hata: teknik detay kullanıcıya gösterilmez
const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    // hata ayrıntısı sadece geliştirici konsolunda kalır (production'da removeConsole siler)
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#fffaf5] text-[#2a0a14]">
      <div className="max-w-[480px] text-center flex flex-col items-center gap-5">
        <h1 className="m-0 text-3xl font-extrabold">Bir şeyler ters gitti</h1>
        <p className="m-0 text-base leading-relaxed text-[#6f5a60]">
          Sayfa şu an yüklenemedi. Lütfen tekrar dene; sorun sürerse biraz sonra
          yeniden uğra.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 rounded-full border-0 bg-[#8e1330] text-white font-bold cursor-pointer"
          >
            Tekrar dene
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full border border-[#8e1330] text-[#8e1330] font-bold no-underline"
          >
            Ana sayfa
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
