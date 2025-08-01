import './globals.css'; // Import global CSS
import { Inter } from 'next/font/google'; 
import NavBar from '../components/layout/NavBar'  // Make sure this matches your file name exactly

const inter = Inter({ subsets: ['latin'] }); 


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Global layout elements like header, footer can go here */}
        <header>
          <nav>
            {/* Navigation items */}
            <NavBar />
          </nav>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
