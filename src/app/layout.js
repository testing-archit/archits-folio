import "./app.css";

export const metadata = {
  title: "Archit Gupta | Developer Intelligence",
  description: "Live, AI-powered developer platform monitoring real-time activity and engineering growth.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/appwrite-icon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code&family=Inter:wght@100..900&family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0a0a] font-['Outfit'] text-white antialiased selection:bg-pink-500/30">
        {children}
      </body>
    </html>
  );
}
