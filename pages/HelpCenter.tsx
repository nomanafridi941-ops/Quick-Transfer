import React from 'react';
import { Send, HelpCircle, Upload, Download, Clock, Key, Shield, Zap, MessageCircle } from 'lucide-react';

const HelpCenter: React.FC = () => {
  const faqs = [
    {
      icon: <Upload className="w-5 h-5 text-blue-500" />,
      question: "How do I send a file?",
      answer: "Simply click on the 'Send' card on the homepage, select or drag your file, and click 'Send'. You'll receive a unique 6-digit code to share with the recipient."
    },
    {
      icon: <Download className="w-5 h-5 text-green-500" />,
      question: "How do I receive a file?",
      answer: "Click on the 'Receive' card, enter the 6-digit code shared with you, and click 'Receive'. Your file will be ready to download instantly."
    },
    {
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      question: "How long are files available?",
      answer: "Files are available for 10 minutes after upload. After this time, they are automatically deleted for your privacy and security."
    },
    {
      icon: <Key className="w-5 h-5 text-purple-500" />,
      question: "What is the 6-digit code?",
      answer: "The 6-digit code is a unique identifier for your transfer. Share this code with the person you want to send the file to. They'll use it to receive your file."
    },
    {
      icon: <Shield className="w-5 h-5 text-red-500" />,
      question: "Is my data secure?",
      answer: "Yes! We use secure cloud storage and your files are automatically deleted after 10 minutes. We don't store your files permanently or share them with anyone."
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      question: "What's the maximum file size?",
      answer: "For the free version, you can transfer files up to 100MB. This is suitable for most documents, images, and small videos."
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-cyan-500" />,
      question: "Do I need to create an account?",
      answer: "No! QuickTransfer works without any sign-up or login. Just upload, share the code, and transfer. It's that simple."
    }
  ];

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
              <HelpCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800">Help Center</h1>
          </div>
          
          <p className="text-gray-500 mb-8 text-lg">
            Find answers to common questions about using QuickTransfer.
          </p>

          {/* Quick Start */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 mb-10 text-white">
            <h2 className="text-xl font-bold mb-3">🚀 Quick Start Guide</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-2xl font-black mb-1">1</div>
                <p className="text-sm">Select a file to send or enter a code to receive</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-2xl font-black mb-1">2</div>
                <p className="text-sm">Share the 6-digit code with your recipient</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-2xl font-black mb-1">3</div>
                <p className="text-sm">Recipient enters code and downloads the file</p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg mt-1">
                    {faq.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Still Need Help */}
          <div className="mt-10 bg-gray-50 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Still need help?</h3>
            <p className="text-gray-500 mb-4">Can't find what you're looking for? Contact our support team.</p>
            <a 
              href="/contact" 
              className="inline-block bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-all"
            >
              Contact Support
            </a>
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

export default HelpCenter;
