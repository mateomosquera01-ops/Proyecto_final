import React from 'react';
import { Footer } from '../common/Footer';
import { Header } from '../common/Header';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main id="main-content" className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
