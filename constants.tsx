import { Medication, Category, InsurancePlan, Customer, SaleRecord, Currency, User, Supplier, Purchase, PharmacyInfo, CashRegisterId } from './types';

export const DEFAULT_PHARMACY_INFO: PharmacyInfo = {
  name: 'FARMA',
  commercialName: 'FARMA',
  nit: '1020304050',
  address: 'Av. Principal #100',
  phone: '71523456',
  city: 'La Paz - Bolivia',
  authorizationNumber: '29040011007'
};

export const DEFAULT_DISCOUNT_PLANS: InsurancePlan[] = [
  { id: 'NONE', name: 'Sin Descuento (0%)', coveragePercent: 0 },
  { id: 'CLI_FREQ', name: 'Cliente Frecuente (5%)', coveragePercent: 5 },
  { id: 'AMAYOR', name: 'Adulto Mayor (10%)', coveragePercent: 10 },
  { id: 'PROM', name: 'Promoción Especial (15%)', coveragePercent: 15 }
];

export const INSURANCE_PLANS: InsurancePlan[] = DEFAULT_DISCOUNT_PLANS;

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'BOB', symbol: 'Bs', name: 'Boliviano' },
  { code: 'USD', symbol: '$', name: 'Dólar Estadounidense' },
  { code: 'ARS', symbol: 'ARS$', name: 'Peso Argentino' },
  { code: 'MXN', symbol: 'MXN$', name: 'Peso Mexicano' },
  { code: 'PEN', symbol: 'S/', name: 'Sol Peruano' },
  { code: 'CLP', symbol: 'CLP$', name: 'Peso Chileno' },
  { code: 'COP', symbol: 'COP$', name: 'Peso Colombiano' }
];

// Datos demo eliminados para operación real limpia
export const MOCK_CUSTOMERS: Customer[] = [];

export const MOCK_MEDICATIONS: Medication[] = [];

export const MOCK_STAFF: User[] = [
  {
    id: '1',
    name: 'Administrador Principal',
    username: 'admin',
    password: 'admin',
    role: 'ADMIN',
    originalRole: 'ADMIN',
    assignedRegister: 'Caja 1',
    permissions: {
      allowedSections: ['DASHBOARD', 'POS', 'INVENTORY', 'REPORTS', 'CUSTOMERS', 'SUPPLIERS', 'PURCHASES', 'STAFF'],
      canEditInventory: true
    }
  },
  {
    id: 'U_JOSUE_BALBOA',
    name: 'Josue Balboa',
    username: 'josue',
    password: '123',
    role: 'EMPLOYEE',
    originalRole: 'EMPLOYEE',
    customRoleName: 'Cajero / Ventas',
    assignedRegister: 'Caja 1',
    permissions: {
      allowedSections: ['POS', 'INVENTORY', 'CUSTOMERS'],
      canEditInventory: false
    }
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [];

export const MOCK_SALES: SaleRecord[] = [];

export const MOCK_PURCHASES: Purchase[] = [];

export const DEFAULT_BRANCHES: string[] = [
  'Sucursal Central (Principal)',
  'Sucursal 2 (Norte)',
  'Sucursal 3 (Sur)'
];

export interface CashRegisterInfo {
  id: CashRegisterId;
  name: string;
  number: number;
  branch: string;
  branchShort: string;
  color: 'emerald' | 'blue' | 'purple' | 'amber';
}

export const CASH_REGISTERS: CashRegisterInfo[] = [
  { id: 'Caja 1', name: 'Caja 1', number: 1, branch: 'Sucursal Central (Principal)', branchShort: 'Sucursal 1 (Central)', color: 'emerald' },
  { id: 'Caja 2', name: 'Caja 2', number: 2, branch: 'Sucursal Central (Principal)', branchShort: 'Sucursal 1 (Central)', color: 'blue' },
  { id: 'Caja 3', name: 'Caja 3', number: 3, branch: 'Sucursal 2 (Norte)', branchShort: 'Sucursal 2 (Norte)', color: 'purple' },
  { id: 'Caja 4', name: 'Caja 4', number: 4, branch: 'Sucursal 2 (Norte)', branchShort: 'Sucursal 2 (Norte)', color: 'amber' },
];

export const getRegisterBranch = (registerId?: string): string => {
  if (registerId === 'Caja 3' || registerId === 'Caja 4') {
    return 'Sucursal 2 (Norte)';
  }
  return 'Sucursal Central (Principal)';
};
