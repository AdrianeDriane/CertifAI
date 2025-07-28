import React from 'react';

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen bg-white px-4 py-20 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl text-center space-y-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          Welcome to <span className="text-blue-600">Certifai</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-500">
          Your trusted platform for managing verifiable and secure documents using blockchain and AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition duration-200">
            Upload Document
          </button>
          <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200">
            My Documents
          </button>
        </div>

        <div className="pt-10 text-sm text-gray-400">
          Secured with Polygon • Stored on IPFS • AI-Powered Validations
        </div>
      </div>
    </div>
  );
}
