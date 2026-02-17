import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "ZenithTrack — Transform Tasks into Growth",
  description: "An intelligent productivity platform for high-performers. Track your journey to peak performance with dynamic task management, intelligent scheduling, and data-driven growth tracking.",
  keywords: "productivity, task management, habits, growth tracker, scheduling, analytics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

