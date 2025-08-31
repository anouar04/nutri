
import { GoogleGenAI, Type } from '@google/genai';
import type { HistoryData, MealHistoryItem, PlanHistoryItem, NutritionalInfo, PersonalizedPlan, UserMetrics } from '../types';

// In a real application, this data would be in a database and associated with a user.
// We are using a simple in-memory object to simulate it for this demo.
let mockDb: HistoryData = {
  meals: [],
  plans: [],
};

// Function to simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const nutritionalInfoSchema = {
    type: Type.OBJECT,
    properties: {
        foodItems: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of identified food items in the meal."
        },
        macros: {
            type: Type.OBJECT,
            properties: {
                calories: { type: Type.NUMBER, description: "Estimated total calories in kcal." },
                protein: { type: Type.NUMBER, description: "Estimated total protein in grams." },
                carbohydrates: { type: Type.NUMBER, description: "Estimated total carbohydrates in grams." },
                fat: { type: Type.NUMBER, description: "Estimated total fat in grams." }
            },
            required: ["calories", "protein", "carbohydrates", "fat"]
        },
        vitamins: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the vitamin." },
                    amount: { type: Type.STRING, description: "Amount of the vitamin with units (e.g., '150mcg')." }
                },
                required: ["name", "amount"]
            },
            description: "List of significant vitamins found in the meal."
        },
        minerals: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the mineral." },
                    amount: { type: Type.STRING, description: "Amount of the mineral with units (e.g., '2mg')." }
                },
                required: ["name", "amount"]
            },
            description: "List of significant minerals found in the meal."
        },
        summary: {
            type: Type.STRING,
            description: "A brief, encouraging summary of the meal's nutritional value."
        }
    },
    required: ["foodItems", "macros", "vitamins", "minerals", "summary"]
};

const mealObjectSchema = {
    type: Type.OBJECT,
    properties: {
        breakfast: { type: Type.STRING },
        lunch: { type: Type.STRING },
        dinner: { type: Type.STRING },
        snacks: { type: Type.STRING, description: "Optional snacks for the day." },
    },
    required: ["breakfast", "lunch", "dinner"]
};

const personalizedPlanSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A brief, encouraging summary of the overall plan tailored to the user's goal."
        },
        mealPlan: {
            type: Type.OBJECT,
            properties: {
                Monday: mealObjectSchema,
                Tuesday: mealObjectSchema,
                Wednesday: mealObjectSchema,
                Thursday: mealObjectSchema,
                Friday: mealObjectSchema,
                Saturday: mealObjectSchema,
                Sunday: mealObjectSchema,
            },
            required: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            description: "A 7-day meal plan."
        },
        workoutPlan: {
            type: Type.OBJECT,
            properties: {
                Monday: { type: Type.STRING, description: "Workout for Monday." },
                Tuesday: { type: Type.STRING, description: "Workout for Tuesday." },
                Wednesday: { type: Type.STRING, description: "Workout for Wednesday." },
                Thursday: { type: Type.STRING, description: "Workout for Thursday." },
                Friday: { type: Type.STRING, description: "Workout for Friday." },
                Saturday: { type: Type.STRING, description: "Workout for Saturday." },
                Sunday: { type: Type.STRING, description: "Workout for Sunday or rest day." }
            },
            required: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            description: "A 7-day workout plan."
        }
    },
    required: ["summary", "mealPlan", "workoutPlan"]
};


/**
 * Simulates calling a backend to analyze a meal image.
 * This function now makes a real call to the Gemini API.
 */
export const analyzeMealImage = async (base64Image: string, mimeType: string): Promise<NutritionalInfo> => {
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: "Analyze the provided image of a meal. Identify all food items, and provide a detailed nutritional breakdown including macronutrients (calories, protein, carbohydrates, fat), and a list of key vitamins and minerals with their amounts. Provide a brief, encouraging summary. Return the analysis in JSON format.",
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: nutritionalInfoSchema,
    },
  });

  const analysis: NutritionalInfo = JSON.parse(response.text.trim());
  
  // The backend would save the analysis to the user's history in the database.
  const newMealItem: MealHistoryItem = {
    id: `meal-${Date.now()}`,
    timestamp: Date.now(),
    nutritionalInfo: analysis,
    imageDataUrl: `data:${mimeType};base64,${base64Image}`,
  };
  mockDb.meals.unshift(newMealItem);

  return analysis;
};

/**
 * Generates a personalized plan by calling the Gemini API.
 */
export const generatePersonalizedPlan = async (metrics: UserMetrics, goal: string): Promise<PersonalizedPlan> => {
    const prompt = `
You are an expert AI Nutritionist and Personal Trainer.
Based on the following user details, create a personalized 7-day meal and workout plan.

User Metrics:
- Age: ${metrics.age}
- Height: ${metrics.height}
- Weight: ${metrics.weight}
- Gender: ${metrics.gender}
- Activity Level: ${metrics.activityLevel.replace(/_/g, ' ')}

User's Goal: "${goal}"

Generate a detailed 7-day meal plan (breakfast, lunch, dinner, and optional snacks) and a 7-day workout plan tailored to their goal. The plan should be encouraging, realistic, and sustainable. For example, if the goal is to 'lose weight', suggest lower-calorie meals and workouts with more cardio. If the goal is to 'gain muscle', suggest higher-protein meals and a strength-focused workout routine.

Provide the response as a JSON object that adheres to the provided schema.
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: personalizedPlanSchema,
        },
    });

    const plan: PersonalizedPlan = JSON.parse(response.text.trim());

    const newPlanItem: PlanHistoryItem = {
        id: `plan-${Date.now()}`,
        timestamp: Date.now(),
        plan: plan,
        metrics,
        goal,
    };
    mockDb.plans.unshift(newPlanItem);

    return plan;
};

/**
 * Simulates fetching the user's history from the backend database.
 */
export const getHistory = async (): Promise<HistoryData> => {
  await sleep(500);
  // Return a copy to prevent direct mutation of the mock DB
  return JSON.parse(JSON.stringify(mockDb));
};

/**
 * Simulates clearing the user's history in the backend database.
 */
export const clearHistory = async (): Promise<void> => {
  await sleep(500);
  mockDb = { meals: [], plans: [] };
};
