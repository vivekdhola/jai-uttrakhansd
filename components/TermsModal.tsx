
import React from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-dark">Terms and Conditions</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          <h3 className="font-semibold text-lg">1. Introduction</h3>
          <p className="text-slate-600">
            Welcome to Jai Uttrakhand ("we", "our", "us"). These Terms and Conditions govern your use of our website and services. By accessing or using our service, you agree to be bound by these terms.
          </p>

          <h3 className="font-semibold text-lg">2. Use of Service</h3>
          <p className="text-slate-600">
            You agree to use our services only for lawful purposes. You are prohibited from posting on or transmitting through the site any material that is infringing, threatening, defamatory, obscene, or otherwise unlawful.
          </p>
          
          <h3 className="font-semibold text-lg">3. Intellectual Property</h3>
          <p className="text-slate-600">
            The service and its original content, features, and functionality are and will remain the exclusive property of Jai Uttrakhand and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
          </p>

          <h3 className="font-semibold text-lg">4. User Content</h3>
          <p className="text-slate-600">
            You are responsible for the content that you upload, link to, or otherwise make available via the service. You represent and warrant that you have all the necessary rights to such content and that it does not infringe on the rights of any third party. We do not claim ownership of your content, but you grant us a license to use it for the purpose of operating the service.
          </p>

          <h3 className="font-semibold text-lg">5. Limitation of Liability</h3>
          <p className="text-slate-600">
            In no event shall Jai Uttrakhand, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>
          
           <h3 className="font-semibold text-lg">6. Changes</h3>
          <p className="text-slate-600">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms and Conditions on this page.
          </p>

        </div>
        <div className="p-4 bg-slate-50 border-t text-right">
          <button
            onClick={onClose}
            className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
