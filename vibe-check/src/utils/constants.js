import { Search, Coffee, Heart, Zap, DollarSign } from 'lucide-react';

/**
 * API Configuration
 * NOTE: In production, use import.meta.env.VITE_GOOGLE_API_KEY
 */
export const API_KEY = "AIzaSyDNsov9a3Nx-0k4FiYIDpFd2VNwV7tco_w";

/**
 * Mood Definitions mapping IDs to Google Place Types
 */
export const MOODS = [
  { id: 'all', label: 'Explore All', icon: Search, color: 'text-slate-400', types: ['restaurant', 'cafe', 'bar'] },
  { id: 'work', label: 'Deep Work', icon: Coffee, color: 'text-indigo-600', types: ['cafe'] },
  { id: 'date', label: 'Intimacy', icon: Heart, color: 'text-rose-500', types: ['restaurant'] },
  { id: 'quick bite', label: 'Quick Bite', icon: Zap, color: 'text-amber-500', types: ['fast_food_restaurant', 'sandwich_shop'] },
  { id: 'budget', label: 'Accessible', icon: DollarSign, color: 'text-emerald-600', types: ['restaurant'] },
];