import React, { useState, useRef } from 'react';
import axios from 'axios';

const FishIdentify: React.FC = () => {
  const [result, setResult] = useState<React.ReactNode>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageFileRef = useRef<File | null>(null);

  // Define the fish classes in a separate constant
  const FISH_LABELS: { [key: number]: string } = {
    0: 'Angelfish',
    1: 'Betaa raja',
    2: 'Betta Bellica',
    3: 'Betta Brownorum',
    4: 'Betta Ocellata',
    5: 'Betta coccina',
    6: 'Betta enisae',
    7: 'Betta imbellis',
    8: 'Betta mahachaiensis',
    9: 'Betta persephone',
    10: 'Betta picta',
    11: 'Betta smaragdina',
    12: 'Betta spilotgena',
    13: 'Betta splendens',
    14: 'Bluegill Sunfish',
    15: 'Cherry Barb',
    16: 'Clarias batrachus',
    17: 'Clown loach',
    18: 'Glosssogobious aurues',
    19: 'Guppy',
    20: 'Molly',
    21: 'Neon Tetra',
    22: 'Panda Corydoras',
    23: 'Sinarapan',
    24: 'Swordtail',
    25: 'Zebra Danio',
    26: 'Zebra pleco',
    27: 'Goldfish'
  };

  // Define endangered species
  const ENDANGERED_SPECIES = new Set([
    'Betta spilotgena',
    'Betta enisae',
    'Betta picta',
    'Betta bellica',
    'Betaa raja',
    'Betta ocellata',
    'Betta brownorum',
    'Philippine Goby',
    'Philippine Catfish',
    'Sinarapan',
    'Clown loach',
    'Panda Corydoras',
    'Bluegill Sunfish',
    'Zebra Pleco'
  ]);

  // Define species types
  const SPECIES_TYPE = {
    'Betta fish': [
      'Betaa raja', 'Betta Bellica', 'Betta Brownorum', 'Betta Ocellata', 'Betta coccina',
      'Betta enisae', 'Betta imbellis', 'Betta mahachaiensis', 'Betta persephone', 'Betta picta',
      'Betta smaragdina', 'Betta spilotgena', 'Betta splendens'
    ],
    'Ornamental fish': [
      'Angelfish', 'Bluegill Sunfish', 'Cherry Barb', 'Clarias batrachus', 'Clown loach',
      'Glosssogobious aurues', 'Guppy', 'Molly', 'Neon Tetra', 'Panda Corydoras', 'Sinarapan',
      'Swordtail', 'Zebra Danio', 'Zebra pleco', 'Goldfish'
    ]
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const image = imageRef.current;

    if (file && image) {
      if (!file.type.startsWith('image/')) {
        setResult(<p>Please upload a valid image file!</p>);
        return;
      }

      image.src = URL.createObjectURL(file);
      imageFileRef.current = file;
      image.onload = () => URL.revokeObjectURL(image.src); // Free memory
      setResult(null); // Reset result when a new image is uploaded
    }
  };

  const modelUrl = import.meta.env.VITE_MODEL_URL;

  const identifyFish = async () => {
    if (!imageFileRef.current) {
      setResult(<p>No image uploaded!</p>);
      return;
    }

    const formData = new FormData();
    formData.append('file', imageFileRef.current);

    setLoading(true);

    try {
      const response = await axios.post(`${modelUrl}predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data); // Log the entire response
      if (response.data && typeof response.data.predicted_class_index === 'number') {
        const predictedSpecies = FISH_LABELS[response.data.predicted_class_index]; // Get the fish species from FISH_LABELS
        
        // Determine the species type (Betta fish or Ornamental fish)
        let speciesType = '';
        for (const [type, speciesList] of Object.entries(SPECIES_TYPE)) {
          if (speciesList.includes(predictedSpecies)) {
            speciesType = type;
            break;
          }
        }

        // Determine if the predicted species is endangered
        const isEndangered = ENDANGERED_SPECIES.has(predictedSpecies);

        setResult(
          <p style={{ textAlign: 'justify', color: '#000', fontSize: '16px', fontWeight: 'bold' }} >
            Species Name: <span style={{ fontSize: '14px', fontWeight: 'normal' }}>{predictedSpecies}</span><br />
            Species Type: <span style={{ fontSize: '14px', fontWeight: 'normal' }}>{speciesType}</span><br />
            Species Status: <span style={{ fontSize: '14px', fontWeight: 'normal' }}>{isEndangered ? 'Endangered' : 'Not Endangered'}</span><br />
            {isEndangered ? (
              <span>
                Description: <strong style={{ color: 'red', fontSize: '14px', fontWeight: 'normal' }}>
                  This species is prohibited from being bought or sold due to its endangered status. Engaging in such activities can contribute to the decline of its population in the wild.
                </strong>
              </span>
            ) : (
              <span>
                Description: <strong style={{ color: 'green', fontSize: '14px', fontWeight: 'normal' }}>
                  This species is not endangered and can be bought, sold, or kept as a pet. Proper care and responsible ownership are encouraged to ensure its well-being.
                </strong>
              </span>
            )}
          </p>
        );
      } 
    } catch (error) {
      console.error('Error during prediction:', error);
      // If prediction is invalid or no species detected
      setResult(<p style={{ color: 'red' }}>Sorry, this image is not allowed. Please upload an image containing fish.</p>);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '50px 0',
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: 'bold' }}>
          Fish Identification
        </h1>
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="imageUpload"
            style={{ display: 'block', marginBottom: '10px', fontSize: '16px' }}
          >
            Upload Fish image or Capture by camera
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            style={{
              display: 'block',
              margin: '0 auto 20px auto',
              borderRadius: '5px',
              padding: '8px 12px',
              border: '1px solid #ced4da',
              maxWidth: '200px',
            }}
          />
        </div>
        <div>
          <img
            ref={imageRef}
            id="fishImage"
            className="img-fluid"
            style={{
              maxHeight: '300px',
              width: '100%',
              objectFit: 'cover',
              borderRadius: '10px',
              display: imageFileRef.current ? 'block' : 'none', // Show image if a file is uploaded
            }}
            alt="Fish"
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          <button
            className="btn btn-primary"
            onClick={identifyFish}
            disabled={loading}
            style={{
              width: '120px',
              padding: '12px',
              borderRadius: '5px',
              margin: '0 auto',
              marginTop: '10px',
            }}
          >
            {loading ? 'Identifying...' : 'Identify Fish'}
          </button>
        </div>
        <div style={{ marginTop: '20px' }}>
          {result}
        </div>
      </div>
    </div>
  );
};

export default FishIdentify;
