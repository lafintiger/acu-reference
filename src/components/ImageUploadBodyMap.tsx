import React, { useState, useRef } from 'react';
import { Upload, Image, X } from 'lucide-react';
import ImageInstructions from './ImageInstructions';

interface ImageUploadBodyMapProps {
  view: 'front' | 'back';
  gender: 'male' | 'female';
  points: Array<{
    id: string;
    name: string;
    x: number; // Percentage coordinates (0-100)
    y: number; // Percentage coordinates (0-100)
    anatomicalLandmark?: string;
  }>;
  showLabels?: boolean;
  onPointClick?: (pointId: string) => void;
  width?: number;
  height?: number;
}

const ImageUploadBodyMap: React.FC<ImageUploadBodyMapProps> = ({
  view,
  gender,
  points,
  showLabels = false,
  onPointClick,
  width = 400,
  height = 600
}) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved image from localStorage or check for pre-loaded images
  React.useEffect(() => {
    const imageKey = `bodymap-${gender}-${view}-image`;
    const savedImage = localStorage.getItem(imageKey);
    
    if (savedImage) {
      setBackgroundImage(savedImage);
    } else {
      // Check for pre-loaded professional images
      const imageMap = {
        'male-front': '/male-front.jpg',
        'male-back': '/male-back.jpg',
        'female-front': '/female-front.jpg',
        'female-back': '/female-back.jpg'
      };
      
      const imagePath = imageMap[`${gender}-${view}` as keyof typeof imageMap];
      if (imagePath) {
        // Test if the image exists
        const img = new window.Image();
        img.onload = () => setBackgroundImage(imagePath);
        img.onerror = () => {
          // Image doesn't exist, will show upload interface
        };
        img.src = imagePath;
      }
    }
  }, [view, gender]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setBackgroundImage(imageData);
      localStorage.setItem(`bodymap-${gender}-${view}-image`, imageData);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setBackgroundImage(null);
    localStorage.removeItem(`bodymap-${gender}-${view}-image`);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-gray-50" style={{ width, height }}>
      {/* Image upload area */}
      {!backgroundImage ? (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center overflow-y-auto">
          <Image className="h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Professional Anatomical Images Needed
          </h3>
          <p className="text-gray-600 mb-4 text-sm max-w-sm">
            For the best clinical experience, download the recommended medical-grade images below.
          </p>
          
          <div className="w-full max-w-2xl">
            <ImageInstructions />
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 w-full max-w-sm">
            <p className="text-sm text-gray-600 mb-3">Or upload your own image:</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tcm-accent"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Custom Image
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <>
          {/* Background anatomical image */}
          <img
            src={backgroundImage}
            alt={`Human body ${view} view`}
            className="w-full h-full object-contain"
            style={{ width, height }}
          />
          
          {/* Overlay SVG for points */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${width} ${height}`}
            style={{ width, height }}
          >
            {/* Acupuncture points */}
            <g id="acupoints">
              {points.map((point) => {
                // Convert percentage coordinates to actual pixels
                const x = (point.x / 100) * width;
                const y = (point.y / 100) * height;
                
                return (
                  <g key={point.id} className="pointer-events-auto">
                    {/* Point marker - smaller and more precise */}
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill="#e53e3e"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="cursor-pointer hover:fill-orange-500 transition-all duration-200 drop-shadow-lg"
                      onClick={() => onPointClick?.(point.id)}
                      filter="url(#glow)"
                    />
                    
                    {/* Inner precision dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r="2"
                      fill="#c53030"
                      className="pointer-events-none"
                    />
                    
                    {/* Point labels */}
                    {showLabels && (
                      <g className="pointer-events-none">
                        <rect
                          x={x - 20}
                          y={y - 30}
                          width="40"
                          height="16"
                          fill="rgba(0,0,0,0.9)"
                          rx="4"
                          className="drop-shadow-lg"
                        />
                        <text
                          x={x}
                          y={y - 19}
                          textAnchor="middle"
                          fill="white"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="Arial, sans-serif"
                        >
                          {point.id}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
            
            {/* Glow filter for points */}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
          
          {/* Image controls */}
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white bg-opacity-90 rounded-lg shadow hover:bg-opacity-100 transition-opacity"
              title="Change image"
            >
              <Upload className="h-4 w-4 text-gray-600" />
            </button>
            
            <button
              onClick={clearImage}
              className="p-2 bg-white bg-opacity-90 rounded-lg shadow hover:bg-opacity-100 transition-opacity"
              title="Remove image"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </>
      )}
    </div>
  );
};

export default ImageUploadBodyMap;
