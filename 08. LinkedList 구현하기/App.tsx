
import React, { useState } from 'react';
import LinkedListVisualizer from './components/LinkedListVisualizer';
import QueueVisualizer from './components/QueueVisualizer';
import StackVisualizer from './components/StackVisualizer';

type DataStructure = 'LinkedList' | 'Queue' | 'Stack';

const App: React.FC = () => {
  const [activeDS, setActiveDS] = useState<DataStructure>('LinkedList');

  const renderContent = () => {
    switch (activeDS) {
      case 'LinkedList':
        return <LinkedListVisualizer />;
      case 'Queue':
        return <QueueVisualizer />;
      case 'Stack':
        return <StackVisualizer />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ name: DataStructure }> = ({ name }) => (
    <button
      onClick={() => setActiveDS(name)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 ${
        activeDS === name
          ? 'bg-teal-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {name}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Data Structure <span className="text-teal-400">Visualizer</span>
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Interactive LinkedList, Queue, and Stack implementations in TypeScript.
          </p>
        </header>

        <nav className="flex justify-center space-x-2 sm:space-x-4 mb-8">
          <TabButton name="LinkedList" />
          <TabButton name="Queue" />
          <TabButton name="Stack" />
        </nav>

        <main>
          {renderContent()}
        </main>
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Crafted with React, TypeScript, and Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
