import React from 'react';
import {
  isFaceDetectionModelLoaded,
  isFeatureExtractionModelLoaded,
  isFacialLandmarkDetectionModelLoaded,
} from '../app/faceUtil';

export default ModelLoadStatus = ({ errorMessage }) => (
  <div className="bg-white opacity-80 p-4 rounded-md">
    <p>
      Face Detector:{' '}
      {isFaceDetectionModelLoaded() ? (
        <strong>Loaded</strong>
      ) : errorMessage && errorMessage.length > 0 ? (
        <span className="text-red-700 font-bold">ERROR</span>
      ) : (
        <>
          <strong>Loading</strong> <span className="animate-spin">⚙️</span>
        </>
      )}
    </p>
    <p>
      Facial Landmark Detector:{' '}
      {isFacialLandmarkDetectionModelLoaded() ? (
        <strong>Loaded</strong>
      ) : errorMessage && errorMessage.length > 0 ? (
        <span className="text-red-700 font-bold">ERROR</span>
      ) : (
        <>
          <strong>Loading</strong> <span className="animate-spin">⚙️</span>
        </>
      )}
    </p>
    <p>
      Feature Extractor:{' '}
      {isFeatureExtractionModelLoaded() ? (
        <strong>Loaded</strong>
      ) : errorMessage && errorMessage.length > 0 ? (
        <span className="text-red-700 font-bold">ERROR</span>
      ) : (
        <>
          <strong>Loading</strong> <span className="animate-spin">⚙️</span>
        </>
      )}
    </p>
  </div>
);
