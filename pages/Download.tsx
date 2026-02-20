import React from 'react';
import { Monitor, Smartphone, Download } from 'lucide-react';
import InstallButton from '../components/InstallButton';

const DownloadPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-800 dark:text-white">Download QuickTransfer</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Choose your platform below to get the app or use the web app.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
                <Smartphone className="w-8 h-8 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Mobile (Android)</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Install the PWA on mobile or download the APK.</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <InstallButton />
              <a
                href="/downloads/quicktransfer-android.apk"
                className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:opacity-95"
                download
              >
                <Download className="inline w-4 h-4 mr-2 align-middle" />
                Download APK
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <Monitor className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Windows / Desktop</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Install the PWA as a desktop app or download the installer.</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <InstallButton />
              <a
                href="/downloads/quicktransfer-windows.zip"
                className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:opacity-95"
                download
              >
                <Download className="inline w-4 h-4 mr-2 align-middle" />
                Download for Windows
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-10 text-sm text-gray-500 dark:text-gray-400">
          If you prefer using the web app, go back to the homepage and start transferring files instantly.
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
