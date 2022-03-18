import { Document } from 'mongodb';

export type FoodEntryDetails = Record<string, { unit: string; amount: number }>;

export type FoodEntryUpdateOptions = Partial<FoodEntryCreateOptions>;

export interface FoodEntryCreateOptions extends Document {
  name: string;
  details?: FoodEntryDetails;
}
