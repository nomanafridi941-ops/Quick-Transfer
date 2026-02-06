import React, { useState, useEffect } from 'react';
import { Rocket, Mail, MessageSquare, MapPin, Clock, CheckCircle, AlertCircle, Moon, Sun } from 'lucide-react';
import DemoAd from '../components/DemoAd';
import { useTheme } from '../context/ThemeContext';

const Contact: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  
  useEffect(() => {
    document.title = 'Contact – QuickTransfer';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', "Contact QuickTransfer for support, feedback, or questions. We're here to help you share files faster and securely.");
    }
  }, []);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }

    // Simulate form submission
    setSubmitted(true);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-pink-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="bg-red-500 p-1.5 rounded-lg">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">QuickTransfer</span>
          </a>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <a href="/" className="text-red-500 font-medium hover:underline">← Back to Home</a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
              <Mail className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white">Contact Us</h1>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
            Have a question, feedback, or need support? We'd love to hear from you!
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-5 text-center">
              <div className="bg-red-100 dark:bg-red-900/30 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-1">Email</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">support@quicktransfer.site</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-5 text-center">
              <div className="bg-red-100 dark:bg-red-900/30 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-1">Response Time</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Within 24 hours</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-5 text-center">
              <div className="bg-red-100 dark:bg-red-900/30 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-1">Location</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Worldwide Service</p>
            </div>
          </div>

          {submitted ? (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Message Sent!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="text-red-500 font-medium hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="bug">Report a Bug</option>
                  <option value="business">Business Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Send Message
              </button>
            </form>
          )}
          
          {/* Demo Ad - After Form */}
          <div className="mt-8 flex justify-center">
            <DemoAd size="468x60" mobileSize="320x50" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-8 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-400 dark:text-gray-500 text-sm">
          © 2026 QuickTransfer. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Contact;
