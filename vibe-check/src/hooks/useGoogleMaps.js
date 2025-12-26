import { useState, useEffect } from 'react';

/**
 * Hook to handle Google Maps Script Loading securely.
 * Checks for existing instances to prevent duplicate loading.
 */
export const useGoogleMapsScript = (apiKey) => {
  const [apiReady, setApiReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If already loaded via index.html or another component
    if (window.google?.maps?.importLibrary) {
      setApiReady(true);
      return;
    }

    const existingScript = document.getElementById("google-maps-sdk");
    if (existingScript) {
      existingScript.addEventListener('load', () => setApiReady(true));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-sdk";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=beta&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => setApiReady(true);
    script.onerror = () => setError("Google Maps SDK failed to load.");
    
    document.head.appendChild(script);
  }, [apiKey]);

  return { apiReady, error };
};