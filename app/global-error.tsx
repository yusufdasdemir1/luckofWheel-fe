'use client';

// Kök layout'ta bile hata olursa gösterilir; kendi <html> ve <body> etiketlerini içermelidir.
// Teknik detay kullanıcıya gösterilmez.
const GlobalError = ({ reset }: { error: Error; reset: () => void }) => {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: '#fffaf5',
          color: '#2a0a14',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ margin: '0 0 12px' }}>Bir şeyler ters gitti</h1>
          <p style={{ margin: '0 0 20px', color: '#6f5a60', lineHeight: 1.6 }}>
            Uygulama şu an açılamadı. Lütfen sayfayı yenile; sorun sürerse biraz
            sonra tekrar dene.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '12px 24px',
              border: 0,
              borderRadius: 999,
              background: '#8e1330',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Tekrar dene
          </button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
