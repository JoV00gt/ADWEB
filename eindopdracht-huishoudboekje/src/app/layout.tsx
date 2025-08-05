import { AuthProvider } from "./lib/context/auth-context";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
          <AuthProvider>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
