import React from 'react';
import { Monitor, Smartphone, Download } from 'lucide-react';
import InstallButton from '../components/InstallButton';

const DownloadPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white leading-tight">Get the QuickTransfer App</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-3">Install the app on your device for the best experience. Use the PWA install on desktop or install the APK on Android.</p>

              <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li>• Fast native-like experience</li>
                <li>• Works offline for recent transfers</li>
                <li>• Secure & private – no account needed</li>
              </ul>

              <div className="mt-6 flex gap-3">
                <a href="/" className="inline-block px-4 py-2 rounded-lg bg-white text-red-500 font-semibold border border-red-100 hover:bg-red-50">Open Web App</a>
                <a href="/contact" className="inline-block px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">Contact</a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
                  <Smartphone className="w-8 h-8 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">Mobile (Android)</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Install the PWA or download the APK for offline install.</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <a
                  href="/downloads/quicktransfer-android.apk"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:opacity-95"
                  download
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install APK
                </a>

                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert('To install: open this site in your mobile browser and choose Add to Home Screen'); }}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm"
                >
                  How to install
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <Monitor className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">Windows / Desktop</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Install the PWA for a native desktop experience.</p>
                </div>
              </div>

              <div className="mt-4">
                <InstallButton label="Install for Windows" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
