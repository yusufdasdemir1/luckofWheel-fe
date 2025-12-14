import React from 'react';

const SiteFooter = () => {
  return (
    <footer className="w-full h-[50px] min-h-[50px] max-h-[50px] items-center bg-slate-50 border-t border-slate-200 mt-20">
      <div className="container">
        <p className="text-right text-slate-600 py-4 text-sm pr-4">
          &copy; {new Date().getFullYear()} cevirkazan360.com | Tüm hakları
          saklıdır.
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
