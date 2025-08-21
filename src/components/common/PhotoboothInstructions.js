"use client";

import { FiCamera, FiSmile, FiZap, FiDownload } from 'react-icons/fi';

const PhotoboothInstructions = ({ onClose, className = "" }) => {
  return (
    <div className={`bg-white rounded-3xl shadow-xl p-6 md:p-8 ${className}`}>
      <div className="text-center mb-6">
        <FiCamera className="h-12 w-12 mx-auto text-pink-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          How to Use the Photobooth
        </h2>
        <p className="text-gray-600">
          Follow these simple steps for the perfect photobooth experience!
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-pink-600 font-bold text-sm">1</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Allow Camera Access</h3>
            <p className="text-gray-600 text-sm">
              Grant permission to use your camera. Don&apos;t worry - your photos stay on your device!
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <FiSmile className="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Position Yourself</h3>
            <p className="text-gray-600 text-sm">
              Center yourself in the camera view. Make sure you&apos;re well-lit and ready to smile!
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FiZap className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Get Ready for 2 Photos</h3>
            <p className="text-gray-600 text-sm">
              You&apos;ll have 3 seconds between each photo. Strike different poses for variety!
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FiDownload className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Download & Share</h3>
            <p className="text-gray-600 text-sm">
              Your photos will be combined with our special frame. Download or share instantly!
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <h4 className="font-semibold text-yellow-900 mb-2">💡 Pro Tips:</h4>
        <ul className="text-yellow-800 text-sm space-y-1">
          <li>• Use good lighting for the best results</li>
          <li>• Try different expressions for each photo</li>
          <li>• Keep your phone steady during capture</li>
          <li>• Have fun and be creative!</li>
        </ul>
      </div>

      {onClose && (
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoboothInstructions;
