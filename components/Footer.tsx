
import React from 'react';

interface FooterProps {
    onShowTerms: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowTerms }) => {
  return (
    <footer className="bg-white border-t p-4 text-center text-sm text-slate-500">
      &copy; {new Date().getFullYear()} Jai Uttrakhand. All Rights Reserved.
      <span className="mx-2">|</span>
      <button onClick={onShowTerms} className="hover:underline text-primary">
        Terms & Conditions
      </button>
    </footer>
  );
};

export default Footer;
