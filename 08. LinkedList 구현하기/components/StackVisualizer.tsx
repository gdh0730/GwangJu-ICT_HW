
import React, { useState } from 'react';
import { Stack } from '../lib/Stack';
import { useDataStructure } from '../hooks/useDataStructure';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';

const StackVisualizer: React.FC = () => {
  const { ds, forceUpdate, dsAsArray } = useDataStructure(() => new Stack<string>());

  const [pushValue, setPushValue] = useState('');
  const [operationMessage, setOperationMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setOperationMessage(msg);
    setTimeout(() => setOperationMessage(null), 3000);
  };

  const handlePush = () => {
    if (!pushValue) return;
    ds.push(pushValue);
    forceUpdate();
    showMessage(`Pushed "${pushValue}".`);
    setPushValue('');
  };

  const handlePop = () => {
    const value = ds.pop();
    forceUpdate();
    if (value !== undefined) {
      showMessage(`Popped "${value}".`);
    } else {
      showMessage('Stack is empty.');
    }
  };

  const peekValue = ds.peek();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <Card title="Controls">
          <div className="space-y-4">
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <label className="text-sm font-medium text-gray-400">Push Data</label>
                <Input value={pushValue} onChange={(e) => setPushValue(e.target.value)} placeholder="e.g., Book A" onKeyDown={(e) => e.key === 'Enter' && handlePush()}/>
              </div>
              <Button onClick={handlePush}>Push</Button>
            </div>
            <Button onClick={handlePop} variant="danger" className="w-full">Pop</Button>
          </div>
        </Card>
         {(operationMessage || peekValue) && (
          <Card title="Output">
            {operationMessage && <p className="text-yellow-400 font-mono mb-2">{operationMessage}</p>}
            {peekValue && <p className="text-teal-400 font-mono">Top of stack: {peekValue}</p>}
            {!peekValue && !operationMessage && <p className="text-gray-500">No output yet.</p>}
          </Card>
        )}
      </div>

      <Card title="Visualization">
        <div className="min-h-[200px] flex justify-center p-4">
          <div className="w-48 bg-gray-700 rounded-lg p-2 flex flex-col-reverse items-center space-y-2 space-y-reverse">
            {dsAsArray.length === 0 ? (
              <div className="text-gray-500 flex-grow flex items-center justify-center">Stack is empty.</div>
            ) : (
              dsAsArray.map((data, index) => (
                <div key={index} className={`w-full bg-teal-600 text-white h-12 rounded-lg flex items-center justify-center text-lg font-bold shadow-md ${index === dsAsArray.length-1 ? 'animate-pulse' : ''}`}>
                  {data}
                </div>
              )).reverse()
            )}
            <div className="text-center text-gray-400 text-sm w-full pt-2 border-t-2 border-dashed border-gray-600">Top</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StackVisualizer;
