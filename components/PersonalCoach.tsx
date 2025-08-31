import React, { useState, useCallback } from 'react';
import { generatePersonalizedPlan } from '../services/apiService';
import type { UserMetrics, PersonalizedPlan } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import Input from './common/Input';
import Select from './common/Select';
import PlanDisplay from './PlanDisplay';

const PersonalCoach: React.FC = () => {
  const [metrics, setMetrics] = useState<UserMetrics>({
    height: '', weight: '', age: '', gender: '', activityLevel: ''
  });
  const [goal, setGoal] = useState<string>('');
  const [plan, setPlan] = useState<PersonalizedPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof UserMetrics | 'goal', string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetrics({ ...metrics, [name]: value });
    if (validationErrors[name as keyof UserMetrics]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setGoal(e.target.value);
      if (validationErrors.goal) {
        setValidationErrors(prev => ({...prev, goal: undefined}));
      }
  };
  
  const isFormPopulated = () => {
      return Object.values(metrics).every(val => val !== '') && goal.trim() !== '';
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserMetrics | 'goal', string>> = {};

    // Validate Age
    const ageNum = parseInt(metrics.age, 10);
    if (!metrics.age) {
        newErrors.age = 'Age is required.';
    } else if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        newErrors.age = 'Please enter a realistic age (1-120).';
    }

    // Validate Height
    const heightNum = parseFloat(metrics.height);
    if (!metrics.height.trim()) {
        newErrors.height = 'Height is required.';
    } else if (isNaN(heightNum) || heightNum <= 0) {
        newErrors.height = 'Please enter a valid positive number for height.';
    }

    // Validate Weight
    const weightNum = parseFloat(metrics.weight);
    if (!metrics.weight.trim()) {
        newErrors.weight = 'Weight is required.';
    } else if (isNaN(weightNum) || weightNum <= 0) {
        newErrors.weight = 'Please enter a valid positive number for weight.';
    }

    // Validate Gender
    if (!metrics.gender) {
        newErrors.gender = 'Please select your gender.';
    }

    // Validate Activity Level
    if (!metrics.activityLevel) {
        newErrors.activityLevel = 'Please select your activity level.';
    }

    // Validate Goal
    if (!goal.trim()) {
        newErrors.goal = 'Please describe your goal.';
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleGeneratePlan = useCallback(async () => {
    setApiError(null);
    if (!validateForm()) {
        return;
    }

    setIsLoading(true);
    setPlan(null);

    try {
      const result = await generatePersonalizedPlan(metrics, goal);
      setPlan(result);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [metrics, goal]);

  return (
    <Card>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Personal AI Coach</h2>
        <p className="text-gray-600 mb-6">Enter your details and goals to receive a customized plan.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Height (e.g., 180cm or 5ft 11in)" name="height" value={metrics.height} onChange={handleChange} placeholder="Your height" error={validationErrors.height} />
          <Input label="Weight (e.g., 75kg or 165lbs)" name="weight" value={metrics.weight} onChange={handleChange} placeholder="Your weight" error={validationErrors.weight} />
          <Input label="Age" name="age" type="number" value={metrics.age} onChange={handleChange} placeholder="Your age" error={validationErrors.age} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Gender" name="gender" value={metrics.gender} onChange={handleChange} error={validationErrors.gender}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </Select>
            <Select label="Activity Level" name="activityLevel" value={metrics.activityLevel} onChange={handleChange} error={validationErrors.activityLevel}>
                <option value="">Select Activity Level</option>
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
                <option value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                <option value="active">Very active (hard exercise/sports 6-7 days a week)</option>
                <option value="very_active">Extra active (very hard exercise/sports & physical job)</option>
            </Select>
        </div>
        <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Your Goal</label>
            <textarea
                id="goal"
                name="goal"
                rows={3}
                value={goal}
                onChange={handleGoalChange}
                className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${validationErrors.goal ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
                placeholder="e.g., 'Lose 10 pounds in 2 months', 'Gain muscle mass', '跑得更快'"
            />
            {validationErrors.goal ? <p className="mt-1 text-sm text-red-600">{validationErrors.goal}</p> : <p className="mt-1 text-xs text-gray-500">Describe your fitness goal in any language.</p>}
        </div>
      </div>
      
      <div className="mt-6 text-center">
         <Button onClick={handleGeneratePlan} disabled={!isFormPopulated() || isLoading} className="w-full sm:w-auto">
            {isLoading ? <Spinner /> : 'Generate My Plan'}
        </Button>
      </div>

      {apiError && <p className="text-center text-red-500 mt-4">{apiError}</p>}

      {plan && <PlanDisplay plan={plan} />}
    </Card>
  );
};

export default PersonalCoach;