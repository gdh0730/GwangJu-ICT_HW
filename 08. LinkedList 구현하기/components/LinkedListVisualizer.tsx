
import React, { useState } from 'react';
import { MyLinkedList } from '../lib/MyLinkedList';
import { useDataStructure } from '../hooks/useDataStructure';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import { ArrowRightIcon } from './common/Icons';

const LinkedListVisualizer: React.FC = () => {
  const { ds, forceUpdate, dsAsArray } = useDataStructure(() => new MyLinkedList<string>());
  
  const [addValue, setAddValue] = useState('');
  const [getIndex, setGetIndex] = useState('');
  const [deleteIndex, setDeleteIndex] = useState('');
  
  const [getResult, setGetResult] = useState<string | null>(null);
  const [operationMessage, setOperationMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setOperationMessage(msg);
    setTimeout(() => setOperationMessage(null), 3000);
  };

  const handleAdd = () => {
    if (!addValue) return;
    ds.add(addValue);
    forceUpdate();
    showMessage(`Added "${addValue}" to the end of the list.`);
    setAddValue('');
  };

  const handleGet = () => {
    const index = parseInt(getIndex, 10);
    if (isNaN(index)) return;
    const value = ds.get(index);
    if (value !== undefined) {
      setGetResult(`Data at index ${index}: ${value}`);
    } else {
      setGetResult(`No data found at index ${index}.`);
    }
    setGetIndex('');
  };

  const handleDelete = () => {
    const index = parseInt(deleteIndex, 10);
    if (isNaN(index)) return;
    const deletedValue = ds.delete(index);
    forceUpdate();
    if (deletedValue !== undefined) {
      showMessage(`Deleted "${deletedValue}" from index ${index}.`);
    } else {
      showMessage(`Could not delete: index ${index} is out of bounds.`);
    }
    setDeleteIndex('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <Card title="Controls">
            <div className="space-y-4">
                {/* Add Operation */}
                <div className="flex items-end space-x-2">
                    <div className="flex-grow">
                        <label className="text-sm font-medium text-gray-400">Add Data</label>
                        <Input value={addValue} onChange={(e) => setAddValue(e.target.value)} placeholder="e.g., Apple" onKeyDown={(e) => e.key === 'Enter' && handleAdd()}/>
                    </div>
                    <Button onClick={handleAdd}>Add</Button>
                </div>
                {/* Get Operation */}
                 <div className="flex items-end space-x-2">
                    <div className="flex-grow">
                         <label className="text-sm font-medium text-gray-400">Get Data by Index</label>
                        <Input type="number" value={getIndex} onChange={(e) => setGetIndex(e.target.value)} placeholder="e.g., 0" onKeyDown={(e) => e.key === 'Enter' && handleGet()}/>
                    </div>
                    <Button onClick={handleGet} variant="secondary">Get</Button>
                </div>
                {/* Delete Operation */}
                 <div className="flex items-end space-x-2">
                    <div className="flex-grow">
                         <label className="text-sm font-medium text-gray-400">Delete Data by Index</label>
                        <Input type="number" value={deleteIndex} onChange={(e) => setDeleteIndex(e.target.value)} placeholder="e.g., 1" onKeyDown={(e) => e.key === 'Enter' && handleDelete()}/>
                    </div>
                    <Button onClick={handleDelete} variant="danger">Delete</Button>
                </div>
            </div>
        </Card>
        {(getResult || operationMessage) && (
             <Card title="Output">
                {getResult && <p className="text-teal-400 font-mono">{getResult}</p>}
                {operationMessage && <p className="text-yellow-400 font-mono">{operationMessage}</p>}
             </Card>
        )}
      </div>

      <Card title="Visualization">
        <div className="min-h-[100px] flex items-center justify-center p-4">
          {dsAsArray.length === 0 ? (
            <div className="text-gray-500">List is empty. Add some data!</div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
              {dsAsArray.map((data, index) => (
                <React.Fragment key={index}>
                  <div className="bg-teal-600 text-white w-20 h-20 rounded-lg flex items-center justify-center text-lg font-bold shadow-md animate-fade-in">
                    {data}
                  </div>
                  {index < dsAsArray.length - 1 && (
                    <ArrowRightIcon className="h-8 w-8 text-gray-500" />
                  )}
                </React.Fragment>
              ))}
              <div className="bg-gray-700 text-gray-400 w-20 h-20 rounded-lg flex items-center justify-center text-sm font-mono shadow-md">
                null
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LinkedListVisualizer;
