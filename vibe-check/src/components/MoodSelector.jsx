const MOODS = [
  { id: 'work', label: '💻 Deep Work', color: '#3b82f6' },
  { id: 'date', label: '❤️ Romantic Date', color: '#ef4444' },
  { id: 'quick', label: '⚡ Quick Bite', color: '#10b981' },
  { id: 'budget', label: '💰 Budget Friendly', color: '#f59e0b' },
];

const MoodSelector = ({ onSelect, activeMood }) => {
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
      {MOODS.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onSelect(mood.id)}
          style={{
            padding: '10px 20px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: activeMood === mood.id ? mood.color : '#333',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
            transform: activeMood === mood.id ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          {mood.label}
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;