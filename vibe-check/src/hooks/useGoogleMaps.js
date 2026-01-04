import { useState, useEffect } from 'react';

// ------------------------------------------------------------------
// HOOK: USE GOOGLE MAPS SCRIPT
// ------------------------------------------------------------------
// Responsibly loads the Google Maps JavaScript API.
// It prevents duplicate tags if the hook is used in multiple components
// and detects if the API was already loaded via index.html.

export const useGoogleMapsScript = (apiKey) => {
  const [apiReady, setApiReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ------------------------------------------------------------------
    // CHECK 1: ALREADY LOADED?
    // ------------------------------------------------------------------
    // If window.google.maps exists, the API is fully loaded and ready.
    // We check for 'importLibrary' to ensure it's the modern version.
    if (window.google?.maps?.importLibrary) {
      setApiReady(true);
      return;
    }

    // ------------------------------------------------------------------
    // CHECK 2: CURRENTLY LOADING?
    // ------------------------------------------------------------------
    // If the script tag exists but isn't finished, attach a listener
    // so we know when it's done.
    const existingScript = document.getElementById("google-maps-sdk");
    if (existingScript) {
      existingScript.addEventListener('load', () => setApiReady(true));
      existingScript.addEventListener('error', () => setError("Failed to load existing Maps script."));
      return;
    }

    // ------------------------------------------------------------------
    // ACTION: INJECT SCRIPT
    // ------------------------------------------------------------------
    // If neither of the above, create the tag and append it to head.
    const script = document.createElement("script");
    script.id = "google-maps-sdk";
    // loading=async and v=beta are required for the 2024/2025 Places Library
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=beta&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => setApiReady(true);
    script.onerror = () => setError("Google Maps SDK failed to load.");
    
    document.head.appendChild(script);

    // No cleanup function to remove script needed, as we want it to persist 
    // for other components during the session.
  }, [apiKey]);

  return { apiReady, error };
};