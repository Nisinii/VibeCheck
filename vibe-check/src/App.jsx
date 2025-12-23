import { useGeolocation } from './hooks/useGeolocation';
import MapDisplay from './components/MapDisplay';

function App() {
  const { coords, loading, error } = useGeolocation();

  if (loading) return <div>Locating you...</div>;
  if (error) return <div>Error: {error}. Please enable location.</div>;

  return (
    <div className="app-container">
      <h1>Mood Mapper</h1>
      {/* Default to NYC if coords fail, otherwise use user coords */}
      <MapDisplay center={coords || { lat: 40.7128, lng: -74.0060 }} />
    </div>
  );
}

export default App