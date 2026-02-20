import React, { useState } from 'react';
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
              <a
                href="/downloads/quicktransfer-android.apk"
                className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:opacity-95"
                download
              >
                <Download className="inline w-4 h-4 mr-2 align-middle" />
                Install APK
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
              <button
                className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:opacity-95"
                onClick={() => setShowWinModal(true)}
              >
                <Download className="inline w-4 h-4 mr-2 align-middle" />
                Install for Windows
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-10 text-sm text-gray-500 dark:text-gray-400">
          If you prefer using the web app, go back to the homepage and start transferring files instantly.
        </div>
      {/* Windows screenshots modal */}
      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowWinModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-2xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">QuickTransfer for Windows – Preview</h3>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-4">
              <img src="/icons/screenshots/screenshot-wide.png" alt="Windows Screenshot" className="rounded-lg border max-w-xs" />
            </div>
            <div className="flex justify-end gap-3">
              <a
                href="/downloads/quicktransfer-windows.zip"
                download
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold hover:opacity-90"
                onClick={() => setShowWinModal(false)}
              >
                Download Installer
              </a>
              <button onClick={() => setShowWinModal(false)} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default DownloadPage;
