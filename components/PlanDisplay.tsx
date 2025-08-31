
import React, { useState } from 'react';
import type { PersonalizedPlan, Meal } from '../types';

const PlanDisplay: React.FC<{ plan: PersonalizedPlan }> = ({ plan }) => {
  const [activeTab, setActiveTab] = useState<'meal' | 'workout'>('meal');

  return (
    <div className="mt-6">
      <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-secondary-800">AI Coach Summary</h3>
        <p className="text-secondary-700">{plan.summary}</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('meal')}
            className={`${activeTab === 'meal' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            aria-current={activeTab === 'meal' ? 'page' : undefined}
          >
            Meal Plan
          </button>
          <button
            onClick={() => setActiveTab('workout')}
            className={`${activeTab === 'workout' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            aria-current={activeTab === 'workout' ? 'page' : undefined}
          >
            Workout Plan
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'meal' && (
          <div className="space-y-4">
            {Object.entries(plan.mealPlan).map(([day, meals]) => {
              const dayMeals = meals as Meal;
              return (
                <div key={day} className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-primary">{day}</h4>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li><strong>Breakfast:</strong> {dayMeals.breakfast}</li>
                    <li><strong>Lunch:</strong> {dayMeals.lunch}</li>
                    <li><strong>Dinner:</strong> {dayMeals.dinner}</li>
                    {dayMeals.snacks && <li><strong>Snacks:</strong> {dayMeals.snacks}</li>}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
        {activeTab === 'workout' && (
          <div className="space-y-4">
            {Object.entries(plan.workoutPlan).map(([day, workout]) => (
              <div key={day} className="bg-white p-4 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-primary">{day}</h4>
                <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{workout}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDisplay;
