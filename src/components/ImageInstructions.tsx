import React from 'react';
import { ExternalLink, Download, CheckCircle } from 'lucide-react';

const ImageInstructions = () => {
  const images = [
    {
      id: 'male-front',
      title: 'Male - Front View',
      filename: 'male-front.jpg',
      url: 'https://commons.wikimedia.org/wiki/File:Anterior_view_of_human_male,_retouched.jpg',
      directUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Anterior_view_of_human_male%2C_retouched.jpg',
      description: '3216 × 4824 pixels - High-quality anterior view with clear anatomical landmarks',
      features: ['Clavicles', 'Sternum', 'Ribs', 'Nipples', 'Umbilicus', 'Muscle definition']
    },
    {
      id: 'male-back',
      title: 'Male - Back View', 
      filename: 'male-back.jpg',
      url: 'https://commons.wikimedia.org/wiki/File:Posterior_view_of_human_male,_retouched.jpg',
      directUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Posterior_view_of_human_male%2C_retouched.jpg',
      description: '3328 × 4992 pixels - Detailed posterior view with spine and muscle definition',
      features: ['Vertebrae', 'Scapulae', 'Trapezius', 'Latissimus dorsi', 'Spine midline']
    },
    {
      id: 'female-front',
      title: 'Female - Front View',
      filename: 'female-front.jpg', 
      url: 'https://commons.wikimedia.org/wiki/File:Front_view_of_a_woman.jpg',
      directUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Front_view_of_a_woman.jpg',
      description: '3077 × 4616 pixels - Clear anterior anatomy with visible landmarks',
      features: ['Clavicles', 'Sternum', 'Breasts', 'Ribcage outline', 'Clear landmarks']
    },
    {
      id: 'female-back',
      title: 'Female - Back View',
      filename: 'female-back.jpg',
      url: 'https://commons.wikimedia.org/wiki/File:Posterior_view_of_human_female,_retouched.jpg', 
      directUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Posterior_view_of_human_female%2C_retouched.jpg',
      description: '3051 × 4576 pixels - Detailed posterior anatomy with spinal landmarks',
      features: ['Spinal column', 'Shoulder blades', 'Back muscles', 'Clear vertebrae indication']
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
        <Download className="h-5 w-5 mr-2" />
        Download Professional Anatomical Images
      </h3>
      
      <p className="text-blue-800 mb-6">
        To get medical-grade anatomical images for your body map, download these high-resolution 
        public domain images from Wikimedia Commons and save them to your project's <code className="bg-blue-100 px-1 rounded">public/</code> folder:
      </p>

      <div className="space-y-4">
        {images.map((image) => (
          <div key={image.id} className="bg-white border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{image.title}</h4>
                <p className="text-sm text-gray-600">{image.description}</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                CC0 Public Domain
              </span>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Save as:</strong> <code className="bg-gray-100 px-1 rounded">public/{image.filename}</code>
              </p>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {image.features.map((feature) => (
                  <span key={feature} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View on Wikimedia
              </a>
              
              <button
                onClick={() => copyToClipboard(image.directUrl)}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                <Download className="h-4 w-4 mr-1" />
                Copy Direct URL
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-2">Instructions:</h4>
        <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
          <li>Click "View on Wikimedia" for each image above</li>
          <li>Right-click the image and "Save As..." to your computer</li>
          <li>Save each image with the exact filename shown above</li>
          <li>Place all images in the <code className="bg-yellow-100 px-1 rounded">public/</code> folder of this project</li>
          <li>Refresh the body map page to see the professional images</li>
        </ol>
      </div>

      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <CheckCircle className="h-4 w-4 inline mr-1" />
          These images are CC0 Public Domain - completely free for commercial use in your app!
        </p>
      </div>
    </div>
  );
};

export default ImageInstructions;
