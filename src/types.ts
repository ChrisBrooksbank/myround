// Core data types for MyRound PWA

export type DrinkCategory = 'pints' | 'wine' | 'spirits' | 'cocktails' | 'soft' | 'shots' | 'zero' | 'custom';

export interface Drink {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  category: DrinkCategory;
  subcategory: string;
}

export interface OrderLine {
  id: string;
  drinkId: string;
  personName: string;
  quantity: number;
  customDrinkName?: string;
  ordered?: boolean;
}

export interface Round {
  id: string;
  createdAt: string;
  completedAt?: string;
  orders: OrderLine[];
}

export interface Regular {
  id: string;
  name: string;
  favouriteDrinkIds: string[];
}

export interface RegularGroup {
  id: string;
  name: string;
  memberIds: string[];
}
