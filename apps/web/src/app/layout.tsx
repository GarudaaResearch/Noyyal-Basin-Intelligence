import "./globals.css";

export const metadata = {
  title: "Noyyal Basin Intelligence",
  description: "Smart river basin monitoring, tree intelligence, and alerts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </body>
    </html>
  );
}

