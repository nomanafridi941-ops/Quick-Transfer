import React from 'react';
import { Send, Shield, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="bg-red-500 p-1.5 rounded-lg">
              <Send className="w-5 h-5 text-white transform rotate-45" />
            </div>
            <span className="text-xl font-bold text-gray-800">QuickTransfer</span>
          </a>
          <a href="/" className="text-red-500 font-medium hover:underline">← Back to Home</a>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-3 rounded-xl">
              <FileText className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800">Terms of Service</h1>
          </div>
          
          <p className="text-gray-500 mb-8">Last updated: February 3, 2026</p>

          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using QuickTransfer, you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our service. We reserve the right to modify 
                these terms at any time, and your continued use constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                2. Description of Service
              </h2>
              <p>
                QuickTransfer provides a fast and secure file transfer service that allows users to share files 
                across devices using a unique 6-digit code. Files are temporarily stored and automatically deleted 
                after 10 minutes for your privacy and security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                3. Acceptable Use
              </h2>
              <p className="mb-3">You agree NOT to use QuickTransfer to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Upload or share illegal, harmful, or offensive content</li>
                <li>Distribute malware, viruses, or malicious software</li>
                <li>Violate intellectual property rights of others</li>
                <li>Share copyrighted material without authorization</li>
                <li>Engage in any activity that disrupts or interferes with the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">4. User Responsibilities</h2>
              <p>
                You are solely responsible for the content you upload and share through QuickTransfer. 
                You must ensure that you have the legal right to share any files you upload and that 
                your use complies with all applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">5. Limitation of Liability</h2>
              <p>
                QuickTransfer is provided "as is" without any warranties. We are not liable for any 
                damages arising from the use or inability to use our service, including but not limited 
                to data loss, security breaches, or service interruptions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">6. Privacy</h2>
              <p>
                Your privacy is important to us. Please review our <a href="/privacy" className="text-red-500 hover:underline">Privacy Policy</a> to 
                understand how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">7. Termination</h2>
              <p>
                We reserve the right to terminate or suspend access to our service immediately, without 
                prior notice, for any violation of these Terms of Service or for any other reason at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">8. Contact</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at{' '}
                <a href="/contact" className="text-red-500 hover:underline">our contact page</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-400 text-sm">
          © 2026 QuickTransfer. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Terms;
