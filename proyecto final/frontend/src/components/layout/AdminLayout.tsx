import React from 'react';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />
      <main id="main-content" className="flex-grow-1 py-4">
        <div className="container">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
