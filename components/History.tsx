
import React, { useState, useEffect, useCallback } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { getHistory, clearHistory } from '../services/apiService';
import type { HistoryData, MealHistoryItem, PlanHistoryItem } from '../types';
import MealAnalysisResult from './MealAnalysisResult';
import PlanDisplay from './PlanDisplay';
import Spinner from './common/Spinner';

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryData>({ meals: [], plans: [] });
  const [activeTab, setActiveTab] = useState<'meals' | 'plans'>('meals');
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
        const data = await getHistory();
        setHistory(data);
    } catch(e) {
        console.error("Failed to fetch history", e);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // When the component mounts, or the active tab changes to one with no data
    // we can re-fetch. This ensures data is fresh if user navigates away and back.
    fetchHistory();
  }, [fetchHistory, activeTab]);

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear your entire history? This action cannot be undone.")) {
      await clearHistory();
      fetchHistory(); // Refetch after clearing
    }
  };
  
  const hasHistory = history.meals.length > 0 || history.plans.length > 0;
  
  const renderContent = () => {
      if (isLoading) {
          return <div className="flex justify-center items-center h-48"><Spinner /></div>;
      }
      
      if (activeTab === 'meals') {
          return (
             <div className="space-y-8">
                {history.meals.length > 0 ? (
                  history.meals.map((item: MealHistoryItem) => (
                    <div key={item.id} className="bg-base-200/50 p-4 sm:p-6 rounded-lg border">
                      <p className="text-sm text-gray-500 mb-4">Analyzed on: {new Date(item.timestamp).toLocaleString()}</p>
                      <div className="w-full max-w-sm mx-auto h-64 bg-base-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden mb-4">
                         <img src={item.imageDataUrl} alt="Meal history" className="w-full h-full object-cover" />
                      </div>
                      <MealAnalysisResult nutritionalInfo={item.nutritionalInfo} />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No meal analyses in your history.</p>
                )}
            </div>
          );
      }
      
      if (activeTab === 'plans') {
          return (
             <div className="space-y-8">
                {history.plans.length > 0 ? (
                  history.plans.map((item: PlanHistoryItem) => (
                    <div key={item.id} className="bg-base-200/50 p-4 sm:p-6 rounded-lg border">
                      <p className="text-sm text-gray-500 mb-2">Generated on: {new Date(item.timestamp).toLocaleString()}</p>
                       <div className="bg-white p-4 rounded-md shadow-sm border mb-4">
                           <p className="font-semibold">Your Goal:</p>
                           <p className="text-gray-700 italic">"{item.goal}"</p>
                           <details className="text-xs text-gray-500 mt-2 cursor-pointer">
                               <summary className="font-medium">Show Metrics Used</summary>
                               <ul className="mt-2 pl-4 list-disc space-y-0.5">
                                   <li><strong>Height:</strong> {item.metrics.height}</li>
                                   <li><strong>Weight:</strong> {item.metrics.weight}</li>
                                   <li><strong>Age:</strong> {item.metrics.age}</li>
                                   <li><strong>Gender:</strong> {item.metrics.gender}</li>
                                   <li><strong>Activity:</strong> {item.metrics.activityLevel.replace(/_/g, ' ')}</li>
                               </ul>
                           </details>
                       </div>
                      <PlanDisplay plan={item.plan} />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No personal plans in your history.</p>
                )}
              </div>
          );
      }
      
      return null;
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <div className="text-center flex-grow">
          <h2 className="text-2xl font-bold">History</h2>
          <p className="text-gray-600">Review your past analyses and plans.</p>
        </div>
        {!isLoading && hasHistory && (
          <Button onClick={handleClearHistory} className="bg-red-600 hover:bg-red-700 focus:ring-red-500 !px-3 !py-2 !text-sm whitespace-nowrap">
            Clear All
          </Button>
        )}
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('meals')}
            className={`${activeTab === 'meals' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            aria-current={activeTab === 'meals' ? 'page' : undefined}
          >
            Meal Analyses ({history.meals.length})
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`${activeTab === 'plans' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            aria-current={activeTab === 'plans' ? 'page' : undefined}
          >
            Personal Plans ({history.plans.length})
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {renderContent()}
      </div>
    </Card>
  );
};

export default History;
