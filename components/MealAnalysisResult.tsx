
import React from 'react';
import type { NutritionalInfo, Micronutrient } from '../types';

const NutritionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
        {children}
    </div>
);

const MicronutrientList: React.FC<{ items: Micronutrient[] }> = ({ items }) => (
    <ul className="space-y-1 text-sm text-gray-700">
        {items.map(item => (
            <li key={item.name} className="flex justify-between">
                <span>{item.name}</span>
                <span className="font-medium">{item.amount}</span>
            </li>
        ))}
    </ul>
);

const MealAnalysisResult: React.FC<{ nutritionalInfo: NutritionalInfo }> = ({ nutritionalInfo }) => {
    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-center mb-4">Nutritional Analysis</h3>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                <p className="font-semibold text-green-800">Identified Items:</p>
                <p className="text-green-700">{nutritionalInfo.foodItems.join(', ')}</p>
                <p className="mt-2 text-sm text-green-700">{nutritionalInfo.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-100 text-blue-800 p-4 rounded-lg text-center">
                    <div className="text-sm">Calories</div>
                    <div className="text-3xl font-bold">{nutritionalInfo.macros.calories}<span className="text-xl"> kcal</span></div>
                </div>
                 <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center">
                    <div className="text-sm">Protein</div>
                    <div className="text-3xl font-bold">{nutritionalInfo.macros.protein}<span className="text-xl"> g</span></div>
                </div>
                 <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg text-center">
                    <div className="text-sm">Carbs</div>
                    <div className="text-3xl font-bold">{nutritionalInfo.macros.carbohydrates}<span className="text-xl"> g</span></div>
                </div>
                 <div className="bg-indigo-100 text-indigo-800 p-4 rounded-lg text-center">
                    <div className="text-sm">Fat</div>
                    <div className="text-3xl font-bold">{nutritionalInfo.macros.fat}<span className="text-xl"> g</span></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NutritionCard title="Vitamins">
                    {nutritionalInfo.vitamins.length > 0 ? <MicronutrientList items={nutritionalInfo.vitamins} /> : <p className="text-sm text-gray-500">No significant vitamins identified.</p>}
                </NutritionCard>
                <NutritionCard title="Minerals">
                    {nutritionalInfo.minerals.length > 0 ? <MicronutrientList items={nutritionalInfo.minerals} /> : <p className="text-sm text-gray-500">No significant minerals identified.</p>}
                </NutritionCard>
            </div>
        </div>
    );
};

export default MealAnalysisResult;
