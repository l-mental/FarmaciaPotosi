import { Category, Medication } from '@/types';

export interface MedicationPreset {
  name: string;
  genericName: string;
  category: Category;
  laboratory: string;
  unitsPerBox: number;
  priceBox: number;
  costPriceBox?: number;
  profitMarginPercent?: number;
  isUnitOnly?: boolean;
  isControlled: boolean;
  description: string;
  imageUrl: string;
}

export const generateAutoLot = (): string => {
  const yearSuffix = new Date().getFullYear().toString().slice(-2);
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `L${yearSuffix}-${randomChars}`;
};

export const getDatePlusYears = (years: number): string => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().split('T')[0];
};

export const getDatePlusMonths = (months: number): string => {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
};

export const getCategoryDefaultImage = (cat: Category): string => {
  switch (cat) {
    case Category.PAINKILLERS:
      return 'https://images.unsplash.com/photo-1550572017-ed200f545dec?q=80&w=400';
    case Category.ANTIBIOTICS:
      return 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=400';
    case Category.VITAMINS:
      return 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400';
    case Category.SKINCARE:
      return 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400';
    case Category.DIGESTIVE:
      return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400';
    case Category.PSYCHOTROPIC:
      return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400';
    default:
      return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400';
  }
};

import { VADEMECUM_RAW_CATALOG } from './vademecumData';

export const COMMON_MEDICATIONS_PRESETS: MedicationPreset[] = VADEMECUM_RAW_CATALOG.map(item => {
  const isUnitOnly = Boolean(item.isUnitOnly || item.unitsPerBox === 1);
  const unitsPerBox = isUnitOnly ? 1 : (item.unitsPerBox || 20);
  const priceBox = item.priceBox || 30.00;
  const costPriceBox = item.costPriceBox || parseFloat((priceBox * 0.65).toFixed(2));
  const profitMarginPercent = costPriceBox > 0 ? parseFloat((((priceBox - costPriceBox) / costPriceBox) * 100).toFixed(1)) : 35;
  const cat = item.category || Category.OTHERS;

  return {
    name: item.name,
    genericName: item.genericName || item.name,
    category: cat,
    laboratory: item.laboratory,
    unitsPerBox,
    priceBox,
    costPriceBox,
    profitMarginPercent,
    isUnitOnly,
    isControlled: Boolean(item.isControlled),
    description: item.description || `Medicamento de ${item.laboratory}. Presentación ${item.name}.`,
    imageUrl: item.imageUrl || getCategoryDefaultImage(cat)
  };
});
