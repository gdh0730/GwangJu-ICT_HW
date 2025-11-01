
import React, { useState } from 'react';
import { Queue } from '../lib/Queue';
import { useDataStructure } from '../hooks/useDataStructure';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import { ArrowRightIcon } from './common/Icons';

const QueueVisualizer: React.FC = () => {
  const { ds, forceUpdate, dsAsArray } = useDataStructure(() => new Queue<string>());

  const [enqueueValue, setEnqueueValue] = useState('');
  const [operationMessage, setOperationMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setOperationMessage(msg);
    setTimeout(() => setOperationMessage(null), 3000);
  };

  const handleEnqueue = () => {
    if (!enqueueValue) return;
    ds.enqueue(enqueueValue);
    forceUpdate();
    showMessage(`Enqueued "${enqueueValue}".`);
    setEnqueueValue('');
  };

  const handleDequeue = () => {
    const value = ds.dequeue();
    forceUpdate();
    if (value !== undefined) {
      showMessage(`Dequeued "${value}".`);
    } else {
      showMessage('Queue is empty.');
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
                <label className="text-sm font-medium text-gray-400">Enqueue Data</label>
                <Input value={enqueueValue} onChange={(e) => setEnqueueValue(e.target.value)} placeholder="e.g., Task 1" onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()} />
              </div>
              <Button onClick={handleEnqueue}>Enqueue</Button>
            </div>
            <Button onClick={handleDequeue} variant="danger" className="w-full">Dequeue</Button>
          </div>
        </Card>
        {(operationMessage || peekValue) && (
          <Card title="Output">
            {operationMessage && <p className="text-yellow-400 font-mono mb-2">{operationMessage}</p>}
            {peekValue && <p className="text-teal-400 font-mono">Front of queue: {peekValue}</p>}
             {!peekValue && !operationMessage && <p className="text-gray-500">No output yet.</p>}
          </Card>
        )}
      </div>

      <Card title="Visualization">
        <div className="min-h-[100px] flex flex-col justify-center p-4 space-y-2">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>Front</span>
                <ArrowRightIcon className="w-4 h-4"/>
            </div>
            <div className="w-full bg-gray-700 rounded-lg p-2 flex items-center space-x-2 overflow-x-auto">
                {dsAsArray.length === 0 ? (
                    <div className="text-gray-500 flex-grow text-center py-6">Queue is empty.</div>
                ) : (
                    dsAsArray.map((data, index) => (
                    <div key={index} className="bg-teal-600 text-white min-w-[80px] h-20 rounded-lg flex items-center justify-center text-lg font-bold shadow-md flex-shrink-0">
                        {data}
                    </div>
                    ))
                )}
            </div>
             <div className="flex items-center space-x-2 text-gray-400 text-sm self-end">
                <ArrowRightIcon className="w-4 h-4 rotate-180"/>
                <span>Back</span>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default QueueVisualizer;
