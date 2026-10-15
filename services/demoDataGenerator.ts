import { 
  Medication, Category, Customer, Supplier, 
  SaleRecord, Purchase, User, PharmacyInfo, InsurancePlan 
} from '@/types';

interface RawMedDef {
  name: string;
  generic: string;
  lab: string;
  cat: Category;
  desc: string;
  isUnitOnly: boolean;
  unitsPerBox?: number;
  cost: number; // cost per box or cost per unit if unitOnly
  marginPct: number; // margin % for box (or unit)
  marginUnitPct?: number; // margin % for unit
  isControlled?: boolean;
  stockBoxes?: number;
  stockUnits?: number;
  minStock?: number;
  maxStock?: number;
  daysToExpiry?: number; // relative to now in days
}

export function generateFullDemoData(): {
  medications: Medication[];
  customers: Customer[];
  staff: User[];
  suppliers: Supplier[];
  sales: SaleRecord[];
  purchases: Purchase[];
  pharmacyInfo: PharmacyInfo;
  discountPlans: InsurancePlan[];
} {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // 1. Discount Plans
  const discountPlans: InsurancePlan[] = [
    { id: 'NONE', name: 'Sin Descuento (0%)', coveragePercent: 0 },
    { id: 'CLI_FREQ', name: 'Cliente Frecuente (5%)', coveragePercent: 5 },
    { id: 'AMAYOR', name: 'Adulto Mayor (10%)', coveragePercent: 10 },
    { id: 'PROM', name: 'Promoción Especial (15%)', coveragePercent: 15 },
    { id: 'SEGURO_PRIV', name: 'Convenio Empresarial (12%)', coveragePercent: 12 }
  ];

  // 2. Pharmacy Info
  const pharmacyInfo: PharmacyInfo = {
    name: 'FARMA S.R.L.',
    commercialName: 'FARMA',
    nit: '1020304050',
    address: 'Av. Principal #100, Zona Central',
    phone: '71523456 / 2-2445566',
    city: 'La Paz - Bolivia',
    authorizationNumber: '29040011007'
  };

  // 3. Staff Users
  const staff: User[] = [
    {
      id: '1',
      name: 'Administrador Principal',
      username: 'admin',
      password: 'admin',
      role: 'ADMIN',
      originalRole: 'ADMIN',
      assignedRegister: 'Caja 1',
      phone: '71523456',
      email: 'admin@farma.bo',
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
      phone: '76543210',
      email: 'josue@farma.bo',
      permissions: {
        allowedSections: ['POS', 'INVENTORY', 'CUSTOMERS'],
        canEditInventory: false
      }
    },
    {
      id: 'U_DRA_ELENA',
      name: 'Dra. Elena Paredes',
      username: 'elena',
      password: '123',
      role: 'PHARMACIST',
      originalRole: 'PHARMACIST',
      customRoleName: 'Farmacéutica Regente',
      assignedRegister: 'Caja 1',
      phone: '70112233',
      email: 'elena.paredes@farma.bo',
      permissions: {
        allowedSections: ['DASHBOARD', 'POS', 'INVENTORY', 'CUSTOMERS', 'PURCHASES'],
        canEditInventory: true
      }
    },
    {
      id: 'U_CARLOS_MENDOZA',
      name: 'Carlos Mendoza',
      username: 'carlos',
      password: '123',
      role: 'EMPLOYEE',
      originalRole: 'EMPLOYEE',
      customRoleName: 'Cajero Turno Tarde',
      assignedRegister: 'Caja 2',
      phone: '72334455',
      permissions: {
        allowedSections: ['POS', 'INVENTORY', 'CUSTOMERS'],
        canEditInventory: false
      }
    },
    {
      id: 'U_MARIA_QUIROGA',
      name: 'María René Quiroga',
      username: 'maria',
      password: '123',
      role: 'EMPLOYEE',
      originalRole: 'EMPLOYEE',
      customRoleName: 'Auxiliar de Farmacia',
      assignedRegister: 'Caja 2',
      phone: '73445566',
      permissions: {
        allowedSections: ['POS', 'CUSTOMERS'],
        canEditInventory: false
      }
    }
  ];

  // 4. Suppliers (12 Real Distributors & Labs)
  const suppliers: Supplier[] = [
    {
      id: 'SUPP-001',
      name: 'Droguería INTI S.A.',
      phone: '2-2441122',
      ci: '1029384011',
      address: 'Calle Lucas Jaimes #1956, Miraflores, La Paz',
      status: 'active',
      registrationDate: '2024-01-15',
      lastUpdate: '2025-02-10'
    },
    {
      id: 'SUPP-002',
      name: 'Laboratorios Bagó de Bolivia S.A.',
      phone: '2-2227788',
      ci: '1019283746',
      address: 'Av. Arce #2529, Edif. Santa Isabel, La Paz',
      status: 'active',
      registrationDate: '2024-01-20',
      lastUpdate: '2025-02-12'
    },
    {
      id: 'SUPP-003',
      name: 'Laboratorios Terbol S.A.',
      phone: '3-3456789',
      ci: '1038475620',
      address: 'Parque Industrial PI-22, Santa Cruz',
      status: 'active',
      registrationDate: '2024-02-01',
      lastUpdate: '2025-02-14'
    },
    {
      id: 'SUPP-004',
      name: 'IFA Laboratorios',
      phone: '3-3889900',
      ci: '1047586930',
      address: 'Av. Cristo Redentor Km 6, Santa Cruz',
      status: 'active',
      registrationDate: '2024-02-10',
      lastUpdate: '2025-02-15'
    },
    {
      id: 'SUPP-005',
      name: 'Laboratorios COFAR S.A.',
      phone: '2-2245566',
      ci: '1058697041',
      address: 'Calle Víctor Sanjinéz #2788, Sopocachi, La Paz',
      status: 'active',
      registrationDate: '2024-02-15',
      lastUpdate: '2025-02-16'
    },
    {
      id: 'SUPP-006',
      name: 'Sigma Corp S.R.L.',
      phone: '4-4256789',
      ci: '1069708152',
      address: 'Av. Blanco Galindo Km 3.5, Cochabamba',
      status: 'active',
      registrationDate: '2024-03-01',
      lastUpdate: '2025-02-18'
    },
    {
      id: 'SUPP-007',
      name: 'Bayer Boliviana Ltda.',
      phone: '3-3521100',
      ci: '1070819263',
      address: 'Av. San Martín, Edif. Manzana 40, Santa Cruz',
      status: 'active',
      registrationDate: '2024-03-10',
      lastUpdate: '2025-02-20'
    },
    {
      id: 'SUPP-008',
      name: 'Droguería Farmedical S.R.L.',
      phone: '2-2819000',
      ci: '1081920374',
      address: 'Av. 6 de Marzo #450, El Alto',
      status: 'active',
      registrationDate: '2024-03-20',
      lastUpdate: '2025-02-22'
    },
    {
      id: 'SUPP-009',
      name: 'Roemmers Bolivia S.A.',
      phone: '3-3418899',
      ci: '1092031485',
      address: 'Equipetrol Calle 8 Este #12, Santa Cruz',
      status: 'active',
      registrationDate: '2024-04-05',
      lastUpdate: '2025-02-25'
    },
    {
      id: 'SUPP-010',
      name: 'Laboratorios Delta S.A.',
      phone: '2-2491020',
      ci: '1003142596',
      address: 'Av. Busch #1420, Miraflores, La Paz',
      status: 'active',
      registrationDate: '2024-04-15',
      lastUpdate: '2025-02-28'
    },
    {
      id: 'SUPP-011',
      name: 'Distribuidores Sanofi Bolivia',
      phone: '2-2789000',
      ci: '1014253607',
      address: 'Calle 15 de Calacoto #8020, La Paz',
      status: 'active',
      registrationDate: '2024-05-01',
      lastUpdate: '2025-03-01'
    },
    {
      id: 'SUPP-012',
      name: 'Laboratorios Alcos S.A.',
      phone: '2-2315000',
      ci: '1025364718',
      address: 'Av. Kollasuyo #400, La Paz',
      status: 'active',
      registrationDate: '2024-05-10',
      lastUpdate: '2025-03-02'
    }
  ];

  // 5. Patients / Customers (30 realistic patients)
  const customers: Customer[] = [
    { id: 'CUST-001', name: 'Juan Carlos Mamani Quispe', dni: '4892103 LP', phone: '70123456', email: 'jcmamani@gmail.com', address: 'Av. Buenos Aires #450, La Paz', insuranceId: 'CLI_FREQ', history: [] },
    { id: 'CUST-002', name: 'María Elena Flores Choque', dni: '6721940 LP', phone: '71567890', email: 'mflores@hotmail.com', address: 'Zona Villa Fátima, Calle 3', insuranceId: 'AMAYOR', history: [] },
    { id: 'CUST-003', name: 'Carlos Alberto Rodríguez Rojas', dni: '5821034 CB', phone: '72233445', address: 'Av. América #890, Cochabamba', insuranceId: 'NONE', history: [] },
    { id: 'CUST-004', name: 'Ana Patricia Morales Gutiérrez', dni: '7912405 SC', phone: '73445566', email: 'anamorales@yahoo.es', address: 'Barrio Sirari, Santa Cruz', insuranceId: 'PROM', history: [] },
    { id: 'CUST-005', name: 'Rosa Linda Condori Ramos', dni: '3920145 LP', phone: '74556677', address: 'Av. Baptista #120, La Paz', insuranceId: 'AMAYOR', history: [] },
    { id: 'CUST-006', name: 'David Alejandro Torrez Vargas', dni: '8910245 LP', phone: '75667788', email: 'dtorrez@outlook.com', address: 'Sopocachi, Calle Aspiazu #340', insuranceId: 'CLI_FREQ', history: [] },
    { id: 'CUST-007', name: 'Lucía Beatriz Mendoza Fernández', dni: '6012490 OR', phone: '76778899', address: 'Zona Central, Oruro', insuranceId: 'NONE', history: [] },
    { id: 'CUST-008', name: 'Roberto Carlos Aguilar Paz', dni: '4512903 LP', phone: '77889900', email: 'raguilar@gmail.com', address: 'Av. Saavedra #1800, Miraflores', insuranceId: 'SEGURO_PRIV', history: [] },
    { id: 'CUST-009', name: 'Carmen Julia Villegas Ramos', dni: '5129045 PT', phone: '78990011', address: 'Zona San Roque, Potosí', insuranceId: 'AMAYOR', history: [] },
    { id: 'CUST-010', name: 'Fernando José Camacho Ortiz', dni: '8102934 SC', phone: '79001122', email: 'fcamacho@gmail.com', address: 'Equipetrol Norte, Santa Cruz', insuranceId: 'CLI_FREQ', history: [] },
    { id: 'CUST-011', name: 'Gladys Sonia Huanca Quisbert', dni: '6901245 LP', phone: '70112244', address: 'Villa Victoria, Calle 8, La Paz', insuranceId: 'NONE', history: [] },
    { id: 'CUST-012', name: 'Jorge Luis Barrientos Prado', dni: '4120934 CB', phone: '71223355', address: 'Cala Cala, Cochabamba', insuranceId: 'SEGURO_PRIV', history: [] },
    { id: 'CUST-013', name: 'Teresa Isabel Navarro Céspedes', dni: '5901243 SC', phone: '72334466', email: 'teresa.navarro@gmail.com', address: 'Av. Irala #320, Santa Cruz', insuranceId: 'AMAYOR', history: [] },
    { id: 'CUST-014', name: 'Víctor Hugo Paredes Siles', dni: '7102934 LP', phone: '73445577', address: 'Achumani, Calle 22, La Paz', insuranceId: 'CLI_FREQ', history: [] },
    { id: 'CUST-015', name: 'Silvia Roxana Claros Mercado', dni: '6320145 CB', phone: '74556688', address: 'Zona Sarco, Cochabamba', insuranceId: 'PROM', history: [] },
    { id: 'CUST-016', name: 'Gonzalo Marcelo Peñaranda Soto', dni: '4901245 LP', phone: '75667799', email: 'gpenaranda@gmail.com', address: 'Calacoto, Calle 15, La Paz', insuranceId: 'SEGURO_PRIV', history: [] },
    { id: 'CUST-017', name: 'Martha Cecilia Salazar Alarcón', dni: '5201943 CH', phone: '76778800', address: 'Calle Aniceto Arce, Sucre', insuranceId: 'AMAYOR', history: [] },
    { id: 'CUST-018', name: 'Edwin Javier Colque Ticona', dni: '8401294 LP', phone: '77889911', address: 'El Alto, Ciudad Satélite', insuranceId: 'NONE', history: [] },
    { id: 'CUST-019', name: 'Paola Andrea Vaca Diez', dni: '7301945 SC', phone: '78990022', email: 'paola.vaca@hotmail.com', address: 'Av. Las Américas, Santa Cruz', insuranceId: 'CLI_FREQ', history: [] },
    { id: 'CUST-020', name: 'Ramiro Antonio Luna Cordero', dni: '6102945 TJ', phone: '79001133', address: 'Barrio El Molino, Tarija', insuranceId: 'NONE', history: [] },
    { id: 'CUST-021', name: 'Beatriz Eugenia Zeballos Ríos', dni: '4701294 LP', phone: '70123477', address: 'San Pedro, Calle Nicolás Acosta', insuranceId: 'AMAYOR', history: [] },
    { id: 'CUST-022', name: 'Mauricio Andrés Baldivieso Pinto', dni: '8201945 CB', phone: '71567811', email: 'mbaldivieso@gmail.com', address: 'Tiquipaya, Cochabamba', insuranceId: 'PROM', history: [] },
    { id: 'CUST-023', name: 'Esther Noemí Chura Apaza', dni: '6801943 LP', phone: '72233488', address: 'Munaypata, La Paz', insuranceId: 'NONE', history: [] },
    { id: 'CUST-024', name: 'Álvaro Gabriel Montero Roca', dni: '7501942 SC', phone: '73445599', address: 'Zona Los Chacos, Santa Cruz', insuranceId: 'CLI_FREQ', history: [] },
    { id: 'CUST-025', name: 'Julia Raquel Arteaga Melgar', dni: '5401923 BN', phone: '74556600', address: 'Trinidad, Beni', insuranceId: 'AMAYOR', history: [] }
  ];

  // 6. Comprehensive Database of 320+ Distinct Medications
  // Designed realistically with proper dosing, laboratories, categories, margins and box vs unit-only representation
  const rawMeds: RawMedDef[] = [
    // --- 1. ANALGÉSICOS Y ANTIINFLAMATORIOS (CAJAS Y JARABES/GOTAS) ---
    { name: 'Paracetamol 500 mg Comprimidos', generic: 'Paracetamol', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Analgésico y antipirético para el dolor y la fiebre', isUnitOnly: false, unitsPerBox: 100, cost: 20, marginPct: 50, marginUnitPct: 100, stockBoxes: 15, minStock: 3 },
    { name: 'Paracetamol 1 g Tabletas Forte', generic: 'Paracetamol', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Analgésico de alta potencia para dolores agudos', isUnitOnly: false, unitsPerBox: 20, cost: 18, marginPct: 50, marginUnitPct: 60, stockBoxes: 10, minStock: 2 },
    { name: 'Paracetamol Gotas Pediátricas 100 mg/ml 30 ml', generic: 'Paracetamol', lab: 'IFA Laboratorios', cat: Category.PAINKILLERS, desc: 'Antipirético en gotas para lactantes y niños pequeños', isUnitOnly: true, cost: 12, marginPct: 50, stockUnits: 18, minStock: 5 },
    { name: 'Paracetamol Jarabe 120 mg/5 ml 120 ml', generic: 'Paracetamol', lab: 'Laboratorios Terbol', cat: Category.PAINKILLERS, desc: 'Jarabe infantil sabor a frutas para fiebre y dolor', isUnitOnly: true, cost: 14, marginPct: 45, stockUnits: 12, minStock: 4 },
    { name: 'Ibuprofeno 400 mg Cápsulas Blandas', generic: 'Ibuprofeno', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Antiinflamatorio no esteroideo de rápida absorción', isUnitOnly: false, unitsPerBox: 30, cost: 22, marginPct: 45, marginUnitPct: 60, stockBoxes: 8, minStock: 2 },
    { name: 'Ibuprofeno 600 mg Comprimidos', generic: 'Ibuprofeno', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Antiinflamatorio y analgésico de dosis media', isUnitOnly: false, unitsPerBox: 30, cost: 24, marginPct: 50, marginUnitPct: 70, stockBoxes: 12, minStock: 3 },
    { name: 'Ibuprofeno 800 mg Tabletas', generic: 'Ibuprofeno', lab: 'Laboratorios COFAR', cat: Category.PAINKILLERS, desc: 'Tratamiento de artritis y procesos inflamatorios severos', isUnitOnly: false, unitsPerBox: 20, cost: 22, marginPct: 50, marginUnitPct: 65, stockBoxes: 6, minStock: 2 },
    { name: 'Ibuprofeno Suspensión Infantil 100 mg/5 ml 100 ml', generic: 'Ibuprofeno', lab: 'Sigma Corp', cat: Category.PAINKILLERS, desc: 'Antiinflamatorio y antipirético pediátrico en suspensión', isUnitOnly: true, cost: 16, marginPct: 40, stockUnits: 14, minStock: 4 },
    { name: 'Diclofenaco Sódico 50 mg Grageas', generic: 'Diclofenaco Sódico', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Antiinflamatorio potente para dolores musculares y articulares', isUnitOnly: false, unitsPerBox: 20, cost: 15, marginPct: 50, marginUnitPct: 75, stockBoxes: 14, minStock: 3 },
    { name: 'Diclofenaco Potásico 50 mg Rápida Acción', generic: 'Diclofenaco Potásico', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Alivio rápido de cefaleas, cólicos y dolor dental', isUnitOnly: false, unitsPerBox: 20, cost: 18, marginPct: 45, marginUnitPct: 60, stockBoxes: 9, minStock: 2 },
    { name: 'Diclofenaco Retard 100 mg Cápsulas Prolongadas', generic: 'Diclofenaco Sódico', lab: 'Laboratorios Terbol', cat: Category.PAINKILLERS, desc: 'Liberación prolongada para control del dolor 24h', isUnitOnly: false, unitsPerBox: 20, cost: 25, marginPct: 45, marginUnitPct: 60, stockBoxes: 7, minStock: 2 },
    { name: 'Diclofenaco Gel Tópico 1% 50 g', generic: 'Diclofenaco Dietilamonio', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Gel antiinflamatorio para torceduras, golpes y lumbalgia', isUnitOnly: true, cost: 18, marginPct: 45, stockUnits: 20, minStock: 5 },
    { name: 'Diclofenaco Ampollas 75 mg/3 ml Inyectable', generic: 'Diclofenaco Sódico', lab: 'IFA Laboratorios', cat: Category.PAINKILLERS, desc: 'Inyectable intramuscular para dolor cólico o postquirúrgico', isUnitOnly: false, unitsPerBox: 5, cost: 15, marginPct: 50, marginUnitPct: 70, stockBoxes: 10, minStock: 3 },
    { name: 'Ketorolaco 10 mg Sublingual', generic: 'Ketorolaco Trometamol', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Analgésico sublingual de acción ultrarrápida', isUnitOnly: false, unitsPerBox: 10, cost: 18, marginPct: 50, marginUnitPct: 65, stockBoxes: 11, minStock: 3 },
    { name: 'Ketorolaco 20 mg Comprimidos', generic: 'Ketorolaco Trometamol', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Alivio a corto plazo del dolor moderado a severo', isUnitOnly: false, unitsPerBox: 10, cost: 22, marginPct: 45, marginUnitPct: 60, stockBoxes: 8, minStock: 2 },
    { name: 'Ketorolaco Ampolla 30 mg/1 ml Inyectable', generic: 'Ketorolaco Trometamol', lab: 'Sigma Corp', cat: Category.PAINKILLERS, desc: 'Inyectable para dolor postoperatorio agudo', isUnitOnly: false, unitsPerBox: 3, cost: 18, marginPct: 50, marginUnitPct: 70, stockBoxes: 5, minStock: 2 },
    { name: 'Naproxeno Sódico 550 mg Tabletas', generic: 'Naproxeno Sódico', lab: 'Laboratorios COFAR', cat: Category.PAINKILLERS, desc: 'Alivio duradero del dolor muscular y menstrual', isUnitOnly: false, unitsPerBox: 20, cost: 26, marginPct: 45, marginUnitPct: 60, stockBoxes: 9, minStock: 2 },
    { name: 'Meloxicam 15 mg Comprimidos', generic: 'Meloxicam', lab: 'Laboratorios Terbol', cat: Category.PAINKILLERS, desc: 'Antiinflamatorio selectivo para osteoartritis y artritis', isUnitOnly: false, unitsPerBox: 10, cost: 20, marginPct: 50, marginUnitPct: 70, stockBoxes: 7, minStock: 2 },
    { name: 'Celecoxib 200 mg Cápsulas', generic: 'Celecoxib', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Inhibidor COX-2 con menor efecto gástrico adverso', isUnitOnly: false, unitsPerBox: 10, cost: 35, marginPct: 40, marginUnitPct: 55, stockBoxes: 6, minStock: 2 },
    { name: 'Aspirina 500 mg Comprimidos Efervescentes', generic: 'Ácido Acetilsalicílico', lab: 'Bayer Bolivia', cat: Category.PAINKILLERS, desc: 'Analgésico clásico efervescente de Bayer', isUnitOnly: false, unitsPerBox: 20, cost: 30, marginPct: 40, marginUnitPct: 50, stockBoxes: 12, minStock: 3 },
    { name: 'Aspirineta 100 mg Protección Cardiovascular', generic: 'Ácido Acetilsalicílico', lab: 'Bayer Bolivia', cat: Category.PAINKILLERS, desc: 'Antiagregante plaquetario dosis baja para el corazón', isUnitOnly: false, unitsPerBox: 50, cost: 28, marginPct: 45, marginUnitPct: 60, stockBoxes: 16, minStock: 4 },
    { name: 'Piroxicam 20 mg Cápsulas', generic: 'Piroxicam', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Tratamiento sintomático de artrosis y artritis', isUnitOnly: false, unitsPerBox: 10, cost: 16, marginPct: 50, marginUnitPct: 65, stockBoxes: 5, minStock: 2 },
    { name: 'Ketoprofeno 100 mg Comprimidos', generic: 'Ketoprofeno', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Analgésico y antiinflamatorio para procesos agudos', isUnitOnly: false, unitsPerBox: 20, cost: 28, marginPct: 45, marginUnitPct: 60, stockBoxes: 8, minStock: 2 },
    { name: 'Dexketoprofeno 25 mg Comprimidos', generic: 'Dexketoprofeno Trometamol', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Alivio rápido del dolor agudo moderado', isUnitOnly: false, unitsPerBox: 10, cost: 32, marginPct: 40, marginUnitPct: 55, stockBoxes: 7, minStock: 2 },
    { name: 'Clonixinato de Lisina 125 mg Tabletas', generic: 'Clonixinato de Lisina', lab: 'Roemmers Bolivia', cat: Category.PAINKILLERS, desc: 'Analgésico no narcótico para dolores viscerales y somáticos', isUnitOnly: false, unitsPerBox: 20, cost: 26, marginPct: 45, marginUnitPct: 60, stockBoxes: 8, minStock: 2 },
    { name: 'Paracetamol + Cafeína Migraña Forte', generic: 'Paracetamol + Cafeína', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Especial para cefaleas tensionales y jaqueca', isUnitOnly: false, unitsPerBox: 20, cost: 22, marginPct: 50, marginUnitPct: 70, stockBoxes: 12, minStock: 3 },
    { name: 'Tramadol 50 mg Cápsulas', generic: 'Tramadol Clorhidrato', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Analgésico opioide para dolor moderado a intenso', isUnitOnly: false, unitsPerBox: 20, cost: 40, marginPct: 40, marginUnitPct: 50, isControlled: true, stockBoxes: 6, minStock: 2 },
    { name: 'Tramadol Gotas Orales 100 mg/ml 10 ml', generic: 'Tramadol Clorhidrato', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Opioide en gotas sublinguales bajo receta', isUnitOnly: true, cost: 32, marginPct: 40, isControlled: true, stockUnits: 8, minStock: 2 },
    { name: 'Paracetamol + Tramadol Tabletas Recubiertas', generic: 'Paracetamol 325mg + Tramadol 37.5mg', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Asociación sinérgica analgésica de prescripción', isUnitOnly: false, unitsPerBox: 20, cost: 45, marginPct: 40, marginUnitPct: 55, isControlled: true, stockBoxes: 5, minStock: 2 },
    { name: 'Mentisan Ungüento 15 g Lata Verde Tradicional', generic: 'Mentol + Alcanfor + Aceite de Eucalipto', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Ungüento tradicional boliviano para resfríos, dolores y golpes', isUnitOnly: true, cost: 6.5, marginPct: 40, stockUnits: 45, minStock: 10 },
    { name: 'Mentisan Ungüento 25 g Tubo con Aplicador', generic: 'Mentol + Alcanfor + Eucalipto', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Tubo práctico para masajes y descongestión', isUnitOnly: true, cost: 11, marginPct: 40, stockUnits: 30, minStock: 6 },
    { name: 'Mentisan Pastillas Menta Eucalipto Caja 20 uds', generic: 'Mentol + Esencias Balsámicas', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Caramelos balsámicos para alivio de la garganta', isUnitOnly: false, unitsPerBox: 20, cost: 15, marginPct: 40, marginUnitPct: 60, stockBoxes: 25, minStock: 5 },

    // --- 2. ANTIBIÓTICOS Y ANTIMICROBIANOS ---
    { name: 'Amoxicilina 500 mg Cápsulas', generic: 'Amoxicilina Trihidrato', lab: 'Laboratorios Bagó', cat: Category.ANTIBIOTICS, desc: 'Antibiótico de amplio espectro para infecciones respiratorias', isUnitOnly: false, unitsPerBox: 50, cost: 45, marginPct: 45, marginUnitPct: 60, stockBoxes: 12, minStock: 3 },
    { name: 'Amoxicilina 1 g Comprimidos Ranurados', generic: 'Amoxicilina', lab: 'Droguería INTI', cat: Category.ANTIBIOTICS, desc: 'Dosis alta para sinusitis, faringitis y neumonías bacterianas', isUnitOnly: false, unitsPerBox: 20, cost: 35, marginPct: 45, marginUnitPct: 60, stockBoxes: 10, minStock: 2 },
    { name: 'Amoxicilina Suspensión 250 mg/5 ml 100 ml', generic: 'Amoxicilina Trihidrato', lab: 'IFA Laboratorios', cat: Category.ANTIBIOTICS, desc: 'Antibiótico infantil en suspensión sabor a fresa', isUnitOnly: true, cost: 18, marginPct: 45, stockUnits: 15, minStock: 4 },
    { name: 'Amoxicilina + Ácido Clavulánico 875/125 mg', generic: 'Amoxicilina + Clavulanato', lab: 'Laboratorios Bagó', cat: Category.ANTIBIOTICS, desc: 'Antibiótico con inhibidor de betalactamasas', isUnitOnly: false, unitsPerBox: 14, cost: 55, marginPct: 35, marginUnitPct: 50, stockBoxes: 8, minStock: 2 },
    { name: 'Amoxicilina + Clavulánico Suspensión Pediátrica', generic: 'Amoxicilina + Clavulanato', lab: 'Laboratorios Terbol', cat: Category.ANTIBIOTICS, desc: 'Polvo para suspensión oral infantil 70 ml', isUnitOnly: true, cost: 42, marginPct: 35, stockUnits: 10, minStock: 3 },
    { name: 'Azitromicina 500 mg Tabletas Recubiertas', generic: 'Azitromicina Dihidrato', lab: 'Laboratorios Bagó', cat: Category.ANTIBIOTICS, desc: 'Macrólido para tratamiento de 3 días en vías respiratorias', isUnitOnly: false, unitsPerBox: 3, cost: 24, marginPct: 45, marginUnitPct: 60, stockBoxes: 20, minStock: 4 },
    { name: 'Azitromicina Suspensión 200 mg/5 ml 30 ml', generic: 'Azitromicina', lab: 'Droguería INTI', cat: Category.ANTIBIOTICS, desc: 'Suspensión pediátrica de toma única diaria por 3 días', isUnitOnly: true, cost: 28, marginPct: 40, stockUnits: 12, minStock: 3 },
    { name: 'Ciprofloxacino 500 mg Comprimidos', generic: 'Ciprofloxacino Clorhidrato', lab: 'Laboratorios Terbol', cat: Category.ANTIBIOTICS, desc: 'Fluoroquinolona para infecciones urinarias y gastrointestinales', isUnitOnly: false, unitsPerBox: 20, cost: 28, marginPct: 50, marginUnitPct: 70, stockBoxes: 14, minStock: 3 },
    { name: 'Cefalexina 500 mg Cápsulas', generic: 'Cefalexina Monohidrato', lab: 'Droguería INTI', cat: Category.ANTIBIOTICS, desc: 'Cefalosporina de 1ra generación para piel y tejidos blandos', isUnitOnly: false, unitsPerBox: 24, cost: 32, marginPct: 45, marginUnitPct: 60, stockBoxes: 10, minStock: 3 },
    { name: 'Cefalexina Suspensión 250 mg/5 ml 100 ml', generic: 'Cefalexina', lab: 'Sigma Corp', cat: Category.ANTIBIOTICS, desc: 'Suspensión antibiótica pediátrica', isUnitOnly: true, cost: 20, marginPct: 40, stockUnits: 10, minStock: 3 },
    { name: 'Cefixima 400 mg Cápsulas', generic: 'Cefixima', lab: 'Laboratorios Bagó', cat: Category.ANTIBIOTICS, desc: 'Cefalosporina oral de 3ra generación para infecciones complicadas', isUnitOnly: false, unitsPerBox: 5, cost: 48, marginPct: 35, marginUnitPct: 50, stockBoxes: 6, minStock: 2 },
    { name: 'Ceftriaxona 1 g Frasco Ampolla Inyectable IM', generic: 'Ceftriaxona Sódica', lab: 'IFA Laboratorios', cat: Category.ANTIBIOTICS, desc: 'Cefalosporina inyectable con lidocaína para aplicación IM', isUnitOnly: true, cost: 25, marginPct: 40, stockUnits: 15, minStock: 4 },
    { name: 'Ceftriaxona 1 g Frasco Ampolla Inyectable IV', generic: 'Ceftriaxona Sódica', lab: 'Droguería INTI', cat: Category.ANTIBIOTICS, desc: 'Antibiótico inyectable para administración intravenosa', isUnitOnly: true, cost: 26, marginPct: 40, stockUnits: 12, minStock: 3 },
    { name: 'Claritromicina 500 mg Comprimidos', generic: 'Claritromicina', lab: 'Laboratorios COFAR', cat: Category.ANTIBIOTICS, desc: 'Macrólido para erradicación de H. pylori y neumonía', isUnitOnly: false, unitsPerBox: 14, cost: 50, marginPct: 40, marginUnitPct: 55, stockBoxes: 7, minStock: 2 },
    { name: 'Levofloxacino 500 mg Tabletas', generic: 'Levofloxacino', lab: 'Laboratorios Bagó', cat: Category.ANTIBIOTICS, desc: 'Fluoroquinolona respiratoria y urinaria de amplio espectro', isUnitOnly: false, unitsPerBox: 10, cost: 42, marginPct: 40, marginUnitPct: 55, stockBoxes: 6, minStock: 2 },
    { name: 'Doxiciclina 100 mg Cápsulas', generic: 'Doxiciclina Hiclato', lab: 'Droguería INTI', cat: Category.ANTIBIOTICS, desc: 'Tetraciclina para acné, bronquitis crónica y zoonosis', isUnitOnly: false, unitsPerBox: 20, cost: 25, marginPct: 50, marginUnitPct: 70, stockBoxes: 8, minStock: 2 },
    { name: 'Cotrimoxazol Forte 800/160 mg Comprimidos', generic: 'Sulfametoxazol + Trimetoprima', lab: 'IFA Laboratorios', cat: Category.ANTIBIOTICS, desc: 'Antibacteriano para infecciones urinarias e intestinales', isUnitOnly: false, unitsPerBox: 20, cost: 20, marginPct: 50, marginUnitPct: 75, stockBoxes: 11, minStock: 3 },
    { name: 'Cotrimoxazol Suspensión Pediátrica 100 ml', generic: 'Sulfametoxazol + Trimetoprima', lab: 'Laboratorios Terbol', cat: Category.ANTIBIOTICS, desc: 'Suspensión oral infantil para diarreas bacterianas', isUnitOnly: true, cost: 15, marginPct: 45, stockUnits: 10, minStock: 3 },
    { name: 'Metronidazol 500 mg Comprimidos', generic: 'Metronidazol', lab: 'Droguería INTI', cat: Category.ANTIBIOTICS, desc: 'Antiparasitario y antibacteriano para anaerobios y giardiasis', isUnitOnly: false, unitsPerBox: 30, cost: 18, marginPct: 50, marginUnitPct: 70, stockBoxes: 15, minStock: 3 },
    { name: 'Metronidazol Suspensión Oral 250 mg/5 ml 120 ml', generic: 'Metronidazol Benzoato', lab: 'Laboratorios Bagó', cat: Category.ANTIBIOTICS, desc: 'Tratamiento infantil para amebiasis y giardiasis', isUnitOnly: true, cost: 16, marginPct: 45, stockUnits: 12, minStock: 3 },
    { name: 'Nitrofurantoína 100 mg Macrocristales', generic: 'Nitrofurantoína', lab: 'Laboratorios COFAR', cat: Category.ANTIBIOTICS, desc: 'Antiséptico urinario selectivo para cistitis', isUnitOnly: false, unitsPerBox: 30, cost: 35, marginPct: 40, marginUnitPct: 55, stockBoxes: 8, minStock: 2 },
    { name: 'Eritromicina 500 mg Comprimidos', generic: 'Eritromicina Estearato', lab: 'Sigma Corp', cat: Category.ANTIBIOTICS, desc: 'Alternativa en pacientes alérgicos a la penicilina', isUnitOnly: false, unitsPerBox: 20, cost: 28, marginPct: 45, marginUnitPct: 60, stockBoxes: 6, minStock: 2 },
    { name: 'Gentamicina 80 mg/2 ml Ampolla Inyectable', generic: 'Gentamicina Sulfato', lab: 'IFA Laboratorios', cat: Category.ANTIBIOTICS, desc: 'Aminoglucósido para infecciones bacterianas graves', isUnitOnly: false, unitsPerBox: 5, cost: 15, marginPct: 50, marginUnitPct: 70, stockBoxes: 8, minStock: 2 },
    { name: 'Ampicilina 500 mg Cápsulas', generic: 'Ampicilina Anhidra', lab: 'Droguería INTI', cat: Category.ANTIBIOTICS, desc: 'Penicilina oral de amplio espectro', isUnitOnly: false, unitsPerBox: 40, cost: 30, marginPct: 45, marginUnitPct: 60, stockBoxes: 9, minStock: 3 },

    // --- 3. DIGESTIVO, GASTROENTEROLOGÍA Y CÓLICOS ---
    { name: 'Omeprazol 20 mg Cápsulas con Gránulos Gastrorresistentes', generic: 'Omeprazol', lab: 'Laboratorios Bagó', cat: Category.DIGESTIVE, desc: 'Inhibidor de bomba de protones para gastritis y reflujo', isUnitOnly: false, unitsPerBox: 30, cost: 22, marginPct: 50, marginUnitPct: 75, stockBoxes: 18, minStock: 4 },
    { name: 'Omeprazol 40 mg Frasco Ampolla IV', generic: 'Omeprazol Sódico', lab: 'Droguería INTI', cat: Category.DIGESTIVE, desc: 'Inyectable para hemorragia digestiva alta y úlcera gástrica', isUnitOnly: true, cost: 28, marginPct: 40, stockUnits: 8, minStock: 2 },
    { name: 'Esomeprazol 40 mg Tabletas con Recubrimiento Entérico', generic: 'Esomeprazol Magnésico', lab: 'Laboratorios Bagó', cat: Category.DIGESTIVE, desc: 'Control superior y prolongado de la acidez gástrica y esofagitis', isUnitOnly: false, unitsPerBox: 28, cost: 65, marginPct: 40, marginUnitPct: 55, stockBoxes: 7, minStock: 2 },
    { name: 'Pantoprazol 40 mg Comprimidos', generic: 'Pantoprazol Sódico', lab: 'Laboratorios Terbol', cat: Category.DIGESTIVE, desc: 'Protector gástrico de excelente tolerancia y mínimas interacciones', isUnitOnly: false, unitsPerBox: 30, cost: 58, marginPct: 40, marginUnitPct: 55, stockBoxes: 8, minStock: 2 },
    { name: 'Lansoprazol 30 mg Cápsulas', generic: 'Lansoprazol', lab: 'Laboratorios COFAR', cat: Category.DIGESTIVE, desc: 'Tratamiento de úlcera duodenal y gástrica', isUnitOnly: false, unitsPerBox: 28, cost: 45, marginPct: 45, marginUnitPct: 60, stockBoxes: 6, minStock: 2 },
    { name: 'Bismutol Suspensión Oral 120 ml', generic: 'Subsalicilato de Bismuto', lab: 'Laboratorios Bagó', cat: Category.DIGESTIVE, desc: 'Alivia acidez, indigestión, malestar estomacal y diarrea', isUnitOnly: true, cost: 18, marginPct: 45, stockUnits: 22, minStock: 5 },
    { name: 'Bismutol Tabletas Masticables Caja 20 uds', generic: 'Subsalicilato de Bismuto', lab: 'Laboratorios Bagó', cat: Category.DIGESTIVE, desc: 'Tabletas masticables para llevar y aliviar la acidez', isUnitOnly: false, unitsPerBox: 20, cost: 20, marginPct: 45, marginUnitPct: 60, stockBoxes: 12, minStock: 3 },
    { name: 'Antiácido Magaldrato + Simeticona Suspensión 200 ml', generic: 'Magaldrato + Simeticona', lab: 'Droguería INTI', cat: Category.DIGESTIVE, desc: 'Gel antiácido y antiflatulento sabor a menta fresca', isUnitOnly: true, cost: 22, marginPct: 45, stockUnits: 16, minStock: 4 },
    { name: 'Hioscina Butilbromuro 10 mg Grageas (Antiespasmódico)', generic: 'Butilbromuro de Hioscina', lab: 'Laboratorios Bagó', cat: Category.DIGESTIVE, desc: 'Alivio rápido de cólicos biliares, intestinales y renales', isUnitOnly: false, unitsPerBox: 20, cost: 24, marginPct: 50, marginUnitPct: 70, stockBoxes: 14, minStock: 3 },
    { name: 'Hioscina Compuesta + Paracetamol Tabletas', generic: 'Hioscina + Paracetamol', lab: 'Droguería INTI', cat: Category.DIGESTIVE, desc: 'Doble acción antiespasmódica y analgésica para cólicos fuertes', isUnitOnly: false, unitsPerBox: 20, cost: 30, marginPct: 45, marginUnitPct: 65, stockBoxes: 12, minStock: 3 },
    { name: 'Hioscina Butilbromuro Ampolla 20 mg/1 ml', generic: 'Butilbromuro de Hioscina', lab: 'IFA Laboratorios', cat: Category.DIGESTIVE, desc: 'Inyectable para cólico renal y vesicular agudo', isUnitOnly: false, unitsPerBox: 5, cost: 18, marginPct: 50, marginUnitPct: 70, stockBoxes: 6, minStock: 2 },
    { name: 'Simeticona 80 mg Gotas Orales 30 ml', generic: 'Simeticona', lab: 'Laboratorios Terbol', cat: Category.DIGESTIVE, desc: 'Elimina gases y cólicos en lactantes y niños', isUnitOnly: true, cost: 15, marginPct: 45, stockUnits: 18, minStock: 4 },
    { name: 'Simeticona 200 mg Perlas Antiflatulentas', generic: 'Simeticona Forte', lab: 'Laboratorios Bagó', cat: Category.DIGESTIVE, desc: 'Cápsulas blandas de alta concentración para gases y distensión', isUnitOnly: false, unitsPerBox: 20, cost: 24, marginPct: 45, marginUnitPct: 60, stockBoxes: 10, minStock: 2 },
    { name: 'Domperidona 10 mg Comprimidos', generic: 'Domperidona', lab: 'Droguería INTI', cat: Category.DIGESTIVE, desc: 'Procinético y antiemético para náuseas y vaciado gástrico', isUnitOnly: false, unitsPerBox: 30, cost: 28, marginPct: 45, marginUnitPct: 60, stockBoxes: 8, minStock: 2 },
    { name: 'Domperidona Gotas Pediátricas 10 mg/ml 20 ml', generic: 'Domperidona', lab: 'Laboratorios Terbol', cat: Category.DIGESTIVE, desc: 'Gotas infantiles contra vómitos y reflujo gastroesofágico', isUnitOnly: true, cost: 19, marginPct: 45, stockUnits: 14, minStock: 3 },
    { name: 'Metoclopramida 10 mg Tabletas', generic: 'Metoclopramida Clorhidrato', lab: 'IFA Laboratorios', cat: Category.DIGESTIVE, desc: 'Antiemético para vómitos, náuseas y gastritis', isUnitOnly: false, unitsPerBox: 20, cost: 12, marginPct: 50, marginUnitPct: 80, stockBoxes: 10, minStock: 2 },
    { name: 'Metoclopramida Ampolla 10 mg/2 ml Inyectable', generic: 'Metoclopramida Clorhidrato', lab: 'IFA Laboratorios', cat: Category.DIGESTIVE, desc: 'Inyectable para corte rápido de vómitos intensos', isUnitOnly: false, unitsPerBox: 5, cost: 12, marginPct: 50, marginUnitPct: 75, stockBoxes: 8, minStock: 2 },
    { name: 'Loperamida 2 mg Comprimidos Antidiarreico', generic: 'Loperamida Clorhidrato', lab: 'Droguería INTI', cat: Category.DIGESTIVE, desc: 'Frena la motilidad intestinal en diarreas agudas no infecciosas', isUnitOnly: false, unitsPerBox: 20, cost: 15, marginPct: 50, marginUnitPct: 75, stockBoxes: 15, minStock: 3 },
    { name: 'Sales de Rehidratación Oral (SRO) Sabor Naranja Sobre', generic: 'Glucosa + Electrólitos OMS', lab: 'Laboratorios COFAR', cat: Category.DIGESTIVE, desc: 'Fórmula OMS para rehidratación en deshidratación y diarrea', isUnitOnly: true, cost: 3.5, marginPct: 45, stockUnits: 50, minStock: 10 },
    { name: 'Probiótico Enterogermina 2 Billones Ampollas Bebibles 5 ml', generic: 'Bacillus clausii esporas', lab: 'Sanofi Bolivia', cat: Category.DIGESTIVE, desc: 'Restaura la flora intestinal dañada por diarreas o antibióticos', isUnitOnly: false, unitsPerBox: 10, cost: 75, marginPct: 35, marginUnitPct: 50, stockBoxes: 12, minStock: 3 },
    { name: 'Probiótico Floratil 250 mg Cápsulas', generic: 'Saccharomyces boulardii', lab: 'Laboratorios Bagó', cat: Category.DIGESTIVE, desc: 'Levadura probiótica viva contra diarreas de todo origen', isUnitOnly: false, unitsPerBox: 10, cost: 48, marginPct: 35, marginUnitPct: 50, stockBoxes: 8, minStock: 2 },
    { name: 'Lactulosa Jarabe 66.7% 200 ml Laxante Osmótico', generic: 'Lactulosa', lab: 'Laboratorios Bagó', cat: Category.DIGESTIVE, desc: 'Laxante suave y seguro para estreñimiento crónico e infantil', isUnitOnly: true, cost: 38, marginPct: 40, stockUnits: 10, minStock: 2 },
    { name: 'Polietilenglicol 3350 Polvo Oral Frasco 255 g', generic: 'Macrogol 3350', lab: 'Laboratorios Terbol', cat: Category.DIGESTIVE, desc: 'Laxante osmótico sin cólicos ni absorción sistémica', isUnitOnly: true, cost: 55, marginPct: 35, stockUnits: 6, minStock: 2 },
    { name: 'Trimebutina 200 mg Comprimidos (Colon Irritable)', generic: 'Trimebutina Maleato', lab: 'Roemmers Bolivia', cat: Category.DIGESTIVE, desc: 'Modulador del tono intestinal para síndrome de intestino irritable', isUnitOnly: false, unitsPerBox: 20, cost: 45, marginPct: 40, marginUnitPct: 55, stockBoxes: 7, minStock: 2 },
    { name: 'Pinaverio Bromuro 100 mg Comprimidos', generic: 'Pinaverio Bromuro', lab: 'Laboratorios Bagó', cat: Category.DIGESTIVE, desc: 'Antiespasmódico específico para el colon espástico', isUnitOnly: false, unitsPerBox: 20, cost: 52, marginPct: 40, marginUnitPct: 50, stockBoxes: 5, minStock: 2 },

    // --- 4. RESPIRATORIO, ANTIGRIPALES, ANTITUSIVOS Y ANTIHISTAMÍNICOS ---
    { name: 'Antigripal Compuesto Refrianex Cápsulas Día/Noche', generic: 'Paracetamol + Clorfeniramina + Pseudoefedrina', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Fórmula completa para cortar síntomas de resfrío y gripe', isUnitOnly: false, unitsPerBox: 20, cost: 24, marginPct: 50, marginUnitPct: 70, stockBoxes: 25, minStock: 5 },
    { name: 'Antigripal Nastizol Forte Comprimidos', generic: 'Paracetamol + Pseudoefedrina', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Descongestionante potente y analgésico antigripal', isUnitOnly: false, unitsPerBox: 20, cost: 26, marginPct: 45, marginUnitPct: 65, stockBoxes: 20, minStock: 4 },
    { name: 'Nastizol Jarabe Infantil 100 ml', generic: 'Paracetamol + Pseudoefedrina + Clorfeniramina', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Jarabe pediátrico descongestionante sabor a cereza', isUnitOnly: true, cost: 22, marginPct: 45, stockUnits: 15, minStock: 4 },
    { name: 'Jarabe Abrilar Extracto de Hiedra Desecada 100 ml', generic: 'Hedera helix extracto', lab: 'Roemmers Bolivia', cat: Category.PAINKILLERS, desc: 'Mucolítico y broncoespasmofítico natural de origen alemán', isUnitOnly: true, cost: 45, marginPct: 35, stockUnits: 20, minStock: 4 },
    { name: 'Jarabe Bisolvon Adultos 8 mg/5 ml 120 ml', generic: 'Bromhexina Clorhidrato', lab: 'Boehringer / Bagó', cat: Category.PAINKILLERS, desc: 'Disuelve flemas y mucosidades densas facilitando la expectoración', isUnitOnly: true, cost: 28, marginPct: 40, stockUnits: 14, minStock: 3 },
    { name: 'Jarabe Ambroxol Adultos 30 mg/5 ml 120 ml', generic: 'Ambroxol Clorhidrato', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Mucolítico y fluidificante bronquial para tos productiva', isUnitOnly: true, cost: 18, marginPct: 45, stockUnits: 16, minStock: 4 },
    { name: 'Jarabe Ambroxol Pediátrico 15 mg/5 ml 120 ml', generic: 'Ambroxol Clorhidrato', lab: 'IFA Laboratorios', cat: Category.PAINKILLERS, desc: 'Mucolítico infantil suave y seguro', isUnitOnly: true, cost: 16, marginPct: 45, stockUnits: 15, minStock: 4 },
    { name: 'Jarabe Dextrometorfano 15 mg/5 ml 120 ml Tos Seca', generic: 'Dextrometorfano Bromhidrato', lab: 'Laboratorios COFAR', cat: Category.PAINKILLERS, desc: 'Calma la tos seca irritativa y nocturna', isUnitOnly: true, cost: 19, marginPct: 45, stockUnits: 12, minStock: 3 },
    { name: 'Jarabe Broncopulmin Balsámico Compuesto 120 ml', generic: 'Ambroxol + Clembuterol', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Broncodilatador y expectorante para bronquitis y tos con silbidos', isUnitOnly: true, cost: 24, marginPct: 45, stockUnits: 18, minStock: 4 },
    { name: 'Salbutamol Inhalador Aerosol 100 mcg 200 Dosis', generic: 'Salbutamol Sulfato', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Broncodilatador de rescate para asma y dificultad respiratoria', isUnitOnly: true, cost: 28, marginPct: 40, stockUnits: 15, minStock: 4 },
    { name: 'Bromuro de Ipratropio Inhalador 20 mcg 200 Dosis', generic: 'Ipratropio Bromuro', lab: 'Boehringer Ingelheim', cat: Category.PAINKILLERS, desc: 'Broncodilatador anticolinérgico para EPOC y asma', isUnitOnly: true, cost: 48, marginPct: 35, stockUnits: 8, minStock: 2 },
    { name: 'Budesonida Spray Nasal 64 mcg 120 Dosis', generic: 'Budesonida', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Corticoide nasal para rinitis alérgica estacional y perenne', isUnitOnly: true, cost: 42, marginPct: 40, stockUnits: 10, minStock: 3 },
    { name: 'Budesonida Suspensión para Nebulizar 0.5 mg/2 ml 5 uds', generic: 'Budesonida', lab: 'Laboratorios Terbol', cat: Category.PAINKILLERS, desc: 'Ampollas para nebulización infantil en laringitis y bronquitis', isUnitOnly: false, unitsPerBox: 5, cost: 35, marginPct: 40, marginUnitPct: 55, stockBoxes: 8, minStock: 2 },
    { name: 'Gotas Nasales Oximetazolina Adultos 0.05% 15 ml', generic: 'Oximetazolina Clorhidrato', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Descongestión nasal rápida en minutos de hasta 12 horas', isUnitOnly: true, cost: 16, marginPct: 45, stockUnits: 20, minStock: 5 },
    { name: 'Gotas Nasales Solución Fisiológica Pediátrica 20 ml', generic: 'Cloruro de Sodio 0.9%', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Lavado y humidificación nasal segura para bebés recién nacidos', isUnitOnly: true, cost: 10, marginPct: 50, stockUnits: 25, minStock: 6 },
    { name: 'Loratadina 10 mg Comprimidos', generic: 'Loratadina', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Antihistamínico no sedante de una toma al día para alergias', isUnitOnly: false, unitsPerBox: 30, cost: 20, marginPct: 50, marginUnitPct: 75, stockBoxes: 16, minStock: 4 },
    { name: 'Loratadina Jarabe 5 mg/5 ml 100 ml', generic: 'Loratadina', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Antihistamínico infantil para rinitis alérgica y urticaria', isUnitOnly: true, cost: 18, marginPct: 45, stockUnits: 14, minStock: 3 },
    { name: 'Cetirizina 10 mg Tabletas Recubiertas', generic: 'Cetirizina Diclorhidrato', lab: 'Laboratorios Terbol', cat: Category.PAINKILLERS, desc: 'Antialérgico para picazón, ronchas, estornudos y ojos llorosos', isUnitOnly: false, unitsPerBox: 20, cost: 22, marginPct: 50, marginUnitPct: 70, stockBoxes: 14, minStock: 3 },
    { name: 'Cetirizina Gotas Pediátricas 10 mg/ml 15 ml', generic: 'Cetirizina Diclorhidrato', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Gotas antialérgicas orales para niños desde los 6 meses', isUnitOnly: true, cost: 20, marginPct: 45, stockUnits: 12, minStock: 3 },
    { name: 'Desloratadina 5 mg Comprimidos', generic: 'Desloratadina', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Metabolito activo de loratadina con mayor potencia antialérgica', isUnitOnly: false, unitsPerBox: 10, cost: 28, marginPct: 45, marginUnitPct: 60, stockBoxes: 10, minStock: 2 },
    { name: 'Desloratadina Jarabe 2.5 mg/5 ml 60 ml', generic: 'Desloratadina', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Jarabe antialérgico pediátrico no produce somnolencia', isUnitOnly: true, cost: 30, marginPct: 40, stockUnits: 10, minStock: 2 },
    { name: 'Levocetirizina 5 mg Tabletas', generic: 'Levocetirizina Diclorhidrato', lab: 'Laboratorios COFAR', cat: Category.PAINKILLERS, desc: 'Antihistamínico de última generación de rápida acción', isUnitOnly: false, unitsPerBox: 20, cost: 34, marginPct: 40, marginUnitPct: 55, stockBoxes: 8, minStock: 2 },
    { name: 'Clorfeniramina 4 mg Tabletas', generic: 'Clorfeniramina Maleato', lab: 'IFA Laboratorios', cat: Category.PAINKILLERS, desc: 'Antihistamínico clásico para prurito y cuadros gripales', isUnitOnly: false, unitsPerBox: 100, cost: 15, marginPct: 50, marginUnitPct: 100, stockBoxes: 12, minStock: 3 },
    { name: 'Montelukast 10 mg Comprimidos Masticables', generic: 'Montelukast Sódico', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Antagonista de leucotrienos para control del asma y rinitis', isUnitOnly: false, unitsPerBox: 30, cost: 65, marginPct: 40, marginUnitPct: 50, stockBoxes: 7, minStock: 2 },
    { name: 'Montelukast Pediátrico 4 mg Granulado en Sobres', generic: 'Montelukast Sódico', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Sobres granulados para mezclar con puré o leche', isUnitOnly: false, unitsPerBox: 30, cost: 68, marginPct: 40, marginUnitPct: 50, stockBoxes: 6, minStock: 2 },
    { name: 'Dexametasona 4 mg Comprimidos', generic: 'Dexametasona', lab: 'Droguería INTI', cat: Category.PAINKILLERS, desc: 'Corticoide antiinflamatorio e inmunosupresor potente', isUnitOnly: false, unitsPerBox: 20, cost: 16, marginPct: 50, marginUnitPct: 75, stockBoxes: 15, minStock: 3 },
    { name: 'Dexametasona Ampolla 8 mg/2 ml Inyectable', generic: 'Dexametasona Fosfato', lab: 'IFA Laboratorios', cat: Category.PAINKILLERS, desc: 'Inyectable para reacciones alérgicas severas y asma grave', isUnitOnly: false, unitsPerBox: 5, cost: 16, marginPct: 50, marginUnitPct: 70, stockBoxes: 12, minStock: 3 },
    { name: 'Prednisona 20 mg Comprimidos', generic: 'Prednisona', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Glucocorticoide oral para asma, alergias y enfermedades autoinmunes', isUnitOnly: false, unitsPerBox: 20, cost: 22, marginPct: 50, marginUnitPct: 70, stockBoxes: 9, minStock: 2 },
    { name: 'Prednisona 50 mg Comprimidos', generic: 'Prednisona', lab: 'Laboratorios Bagó', cat: Category.PAINKILLERS, desc: 'Dosis alta para choque alérgico y brotes inflamatorios agudos', isUnitOnly: false, unitsPerBox: 20, cost: 35, marginPct: 45, marginUnitPct: 60, stockBoxes: 6, minStock: 2 },

    // --- 5. CARDIOVASCULAR, PRESIÓN Y METABÓLICO ---
    { name: 'Losartán Potásico 50 mg Tabletas Recubiertas', generic: 'Losartán Potásico', lab: 'Droguería INTI', cat: Category.OTHERS, desc: 'Antihipertensivo ARA II de primera elección', isUnitOnly: false, unitsPerBox: 30, cost: 24, marginPct: 50, marginUnitPct: 70, stockBoxes: 20, minStock: 5 },
    { name: 'Losartán Potásico 100 mg Comprimidos', generic: 'Losartán Potásico', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Doble dosis para hipertensión arterial severa', isUnitOnly: false, unitsPerBox: 30, cost: 35, marginPct: 45, marginUnitPct: 60, stockBoxes: 14, minStock: 3 },
    { name: 'Losartán 50 mg + Hidroclorotiazida 12.5 mg', generic: 'Losartán + HCTZ', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Combinación sinérgica con diurético para control de la presión', isUnitOnly: false, unitsPerBox: 30, cost: 38, marginPct: 45, marginUnitPct: 60, stockBoxes: 12, minStock: 3 },
    { name: 'Enalapril 10 mg Comprimidos', generic: 'Enalapril Maleato', lab: 'Laboratorios Terbol', cat: Category.OTHERS, desc: 'Inhibidor de la ECA para hipertensión e insuficiencia cardíaca', isUnitOnly: false, unitsPerBox: 30, cost: 18, marginPct: 50, marginUnitPct: 75, stockBoxes: 15, minStock: 3 },
    { name: 'Enalapril 20 mg Comprimidos', generic: 'Enalapril Maleato', lab: 'IFA Laboratorios', cat: Category.OTHERS, desc: 'Dosis completa para tratamiento antihipertensivo', isUnitOnly: false, unitsPerBox: 30, cost: 24, marginPct: 50, marginUnitPct: 70, stockBoxes: 10, minStock: 3 },
    { name: 'Amlodipino 5 mg Tabletas', generic: 'Amlodipino Besilato', lab: 'Droguería INTI', cat: Category.OTHERS, desc: 'Calcioantagonista para angina de pecho e hipertensión', isUnitOnly: false, unitsPerBox: 30, cost: 20, marginPct: 50, marginUnitPct: 75, stockBoxes: 15, minStock: 3 },
    { name: 'Amlodipino 10 mg Tabletas', generic: 'Amlodipino Besilato', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Dosis de 10 mg para control sostenido 24 horas', isUnitOnly: false, unitsPerBox: 30, cost: 28, marginPct: 50, marginUnitPct: 70, stockBoxes: 12, minStock: 3 },
    { name: 'Atenolol 50 mg Tabletas', generic: 'Atenolol', lab: 'Laboratorios COFAR', cat: Category.OTHERS, desc: 'Betabloqueante cardioselectivo para arritmias e hipertensión', isUnitOnly: false, unitsPerBox: 30, cost: 22, marginPct: 50, marginUnitPct: 70, stockBoxes: 9, minStock: 2 },
    { name: 'Carvedilol 12.5 mg Comprimidos', generic: 'Carvedilol', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Betabloqueante y vasodilatador para falla cardíaca', isUnitOnly: false, unitsPerBox: 30, cost: 35, marginPct: 45, marginUnitPct: 60, stockBoxes: 7, minStock: 2 },
    { name: 'Carvedilol 25 mg Comprimidos', generic: 'Carvedilol', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Dosis máxima para insuficiencia cardíaca y cardiopatía', isUnitOnly: false, unitsPerBox: 30, cost: 42, marginPct: 40, marginUnitPct: 55, stockBoxes: 6, minStock: 2 },
    { name: 'Furosemida 40 mg Tabletas (Diurético)', generic: 'Furosemida', lab: 'Droguería INTI', cat: Category.OTHERS, desc: 'Diurético de asa para edemas cardíacos, renales e hipertensión', isUnitOnly: false, unitsPerBox: 30, cost: 15, marginPct: 50, marginUnitPct: 80, stockBoxes: 14, minStock: 3 },
    { name: 'Furosemida Ampolla 20 mg/2 ml Inyectable', generic: 'Furosemida', lab: 'IFA Laboratorios', cat: Category.OTHERS, desc: 'Inyectable de urgencia para edema agudo de pulmón', isUnitOnly: false, unitsPerBox: 5, cost: 15, marginPct: 50, marginUnitPct: 70, stockBoxes: 6, minStock: 2 },
    { name: 'Espironolactona 25 mg Tabletas', generic: 'Espironolactona', lab: 'Laboratorios Terbol', cat: Category.OTHERS, desc: 'Diurético ahorrador de potasio para ascitis y falla cardíaca', isUnitOnly: false, unitsPerBox: 30, cost: 32, marginPct: 45, marginUnitPct: 60, stockBoxes: 8, minStock: 2 },
    { name: 'Hidroclorotiazida 25 mg Tabletas', generic: 'Hidroclorotiazida', lab: 'IFA Laboratorios', cat: Category.OTHERS, desc: 'Diurético tiazídico estándar para hipertensión', isUnitOnly: false, unitsPerBox: 30, cost: 18, marginPct: 50, marginUnitPct: 75, stockBoxes: 10, minStock: 2 },
    { name: 'Atorvastatina 20 mg Tabletas Recubiertas', generic: 'Atorvastatina Cálcica', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Estatina para reducir colesterol LDL y prevención cardiovascular', isUnitOnly: false, unitsPerBox: 30, cost: 45, marginPct: 45, marginUnitPct: 60, stockBoxes: 16, minStock: 4 },
    { name: 'Atorvastatina 40 mg Tabletas', generic: 'Atorvastatina Cálcica', lab: 'Droguería INTI', cat: Category.OTHERS, desc: 'Dosis alta para hipercolesterolemia severa y post infarto', isUnitOnly: false, unitsPerBox: 30, cost: 58, marginPct: 40, marginUnitPct: 55, stockBoxes: 10, minStock: 2 },
    { name: 'Rosuvastatina 10 mg Tabletas', generic: 'Rosuvastatina Cálcica', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Estatina de máxima eficacia en reducción de lípidos', isUnitOnly: false, unitsPerBox: 30, cost: 65, marginPct: 40, marginUnitPct: 55, stockBoxes: 8, minStock: 2 },
    { name: 'Rosuvastatina 20 mg Tabletas', generic: 'Rosuvastatina Cálcica', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Para pacientes de muy alto riesgo cardiovascular', isUnitOnly: false, unitsPerBox: 30, cost: 85, marginPct: 35, marginUnitPct: 50, stockBoxes: 6, minStock: 2 },
    { name: 'Clopidogrel 75 mg Comprimidos', generic: 'Clopidogrel Bisulfato', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Antiagregante plaquetario para stents coronarios y ACV', isUnitOnly: false, unitsPerBox: 30, cost: 70, marginPct: 40, marginUnitPct: 50, stockBoxes: 8, minStock: 2 },
    { name: 'Metformina 850 mg Tabletas Antidiabético Oral', generic: 'Metformina Clorhidrato', lab: 'Droguería INTI', cat: Category.OTHERS, desc: 'Piedra angular en el tratamiento de la Diabetes Mellitus Tipo 2', isUnitOnly: false, unitsPerBox: 30, cost: 22, marginPct: 50, marginUnitPct: 75, stockBoxes: 22, minStock: 5 },
    { name: 'Metformina 1000 mg (1 g) de Liberación Prolongada XR', generic: 'Metformina XR', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Tolerancia digestiva óptima y toma única con la cena', isUnitOnly: false, unitsPerBox: 30, cost: 35, marginPct: 45, marginUnitPct: 60, stockBoxes: 15, minStock: 3 },
    { name: 'Glibenclamida 5 mg Tabletas', generic: 'Glibenclamida', lab: 'IFA Laboratorios', cat: Category.OTHERS, desc: 'Sulfonilurea estimulante de la secreción de insulina', isUnitOnly: false, unitsPerBox: 50, cost: 18, marginPct: 50, marginUnitPct: 80, stockBoxes: 12, minStock: 3 },
    { name: 'Glimepirida 2 mg Comprimidos', generic: 'Glimepirida', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Sulfonilurea moderna de menor riesgo de hipoglucemia', isUnitOnly: false, unitsPerBox: 30, cost: 38, marginPct: 45, marginUnitPct: 60, stockBoxes: 8, minStock: 2 },
    { name: 'Dapagliflozina 10 mg Comprimidos', generic: 'Dapagliflozina (iSGLT2)', lab: 'AstraZeneca / Bagó', cat: Category.OTHERS, desc: 'Inhibidor SGLT2 con protección renal y cardíaca comprobada', isUnitOnly: false, unitsPerBox: 28, cost: 120, marginPct: 30, marginUnitPct: 45, stockBoxes: 5, minStock: 2 },
    { name: 'Empagliflozina 25 mg Comprimidos', generic: 'Empagliflozina', lab: 'Boehringer Ingelheim', cat: Category.OTHERS, desc: 'Tratamiento de diabetes e insuficiencia cardíaca', isUnitOnly: false, unitsPerBox: 30, cost: 135, marginPct: 30, marginUnitPct: 40, stockBoxes: 4, minStock: 2 },

    // --- 6. VITAMINAS, MINERALES, SUPLEMENTOS Y HIERRO ---
    { name: 'Vitamina C 1000 mg (1 g) Comprimidos Efervescentes 10 uds', generic: 'Ácido Ascórbico', lab: 'Bayer Bolivia', cat: Category.VITAMINS, desc: 'Refuerzo inmunológico antioxidante efervescente sabor naranja', isUnitOnly: true, cost: 18, marginPct: 45, stockUnits: 30, minStock: 5 },
    { name: 'Vitamina C 500 mg Masticable Sabor Fresa Caja 50 uds', generic: 'Ácido Ascórbico', lab: 'Droguería INTI', cat: Category.VITAMINS, desc: 'Tabletas masticables para niños y adultos', isUnitOnly: false, unitsPerBox: 50, cost: 25, marginPct: 50, marginUnitPct: 75, stockBoxes: 14, minStock: 3 },
    { name: 'Complejo B Forte Cápsulas Blandas', generic: 'Vitaminas B1 + B6 + B12', lab: 'Laboratorios Bagó', cat: Category.VITAMINS, desc: 'Regenerador del sistema nervioso y antifatiga física y mental', isUnitOnly: false, unitsPerBox: 30, cost: 32, marginPct: 45, marginUnitPct: 60, stockBoxes: 16, minStock: 3 },
    { name: 'Neurobión 25000 Ampollas Trío Inyectable', generic: 'Vitaminas B1, B6, B12 Dosis Alta', lab: 'P&G / Dolo-Neurobión', cat: Category.VITAMINS, desc: 'Ampollas inyectables para ciática, lumbalgia y neuropatía', isUnitOnly: false, unitsPerBox: 3, cost: 45, marginPct: 40, marginUnitPct: 55, stockBoxes: 10, minStock: 2 },
    { name: 'Dolo-Neurobión Forte Inyectable (Con Diclofenaco)', generic: 'Complejo B + Diclofenaco', lab: 'P&G Health', cat: Category.VITAMINS, desc: 'Inyectable de choque para lumbalgias agudas e inflamación del nervio', isUnitOnly: false, unitsPerBox: 3, cost: 58, marginPct: 35, marginUnitPct: 50, stockBoxes: 8, minStock: 2 },
    { name: 'Dolo-Neurobión Comprimidos Recubiertos', generic: 'Complejo B + Diclofenaco 50 mg', lab: 'P&G Health', cat: Category.VITAMINS, desc: 'Alivio oral potente del dolor neuromuscular y articular', isUnitOnly: false, unitsPerBox: 20, cost: 42, marginPct: 40, marginUnitPct: 55, stockBoxes: 12, minStock: 3 },
    { name: 'Calcio 600 mg + Vitamina D3 400 UI Tabletas', generic: 'Calcio + Colecalciferol', lab: 'Laboratorios Bagó', cat: Category.VITAMINS, desc: 'Prevención y tratamiento de osteoporosis y salud ósea', isUnitOnly: false, unitsPerBox: 60, cost: 55, marginPct: 40, marginUnitPct: 55, stockBoxes: 10, minStock: 2 },
    { name: 'Vitamina D3 5000 UI Cápsulas Blandas Semanal', generic: 'Colecalciferol', lab: 'Laboratorios Terbol', cat: Category.VITAMINS, desc: 'Alta potencia para corregir déficit de vitamina D y defensas', isUnitOnly: false, unitsPerBox: 30, cost: 65, marginPct: 40, marginUnitPct: 55, stockBoxes: 8, minStock: 2 },
    { name: 'Zinc 20 mg Comprimidos Dispersables', generic: 'Sulfato de Zinc Monohidrato', lab: 'Droguería INTI', cat: Category.VITAMINS, desc: 'Coadyuvante en diarreas pediátricas y fortalecimiento inmune', isUnitOnly: false, unitsPerBox: 30, cost: 25, marginPct: 50, marginUnitPct: 70, stockBoxes: 12, minStock: 3 },
    { name: 'Zinc Jarabe 20 mg/5 ml 100 ml', generic: 'Sulfato de Zinc', lab: 'Laboratorios Bagó', cat: Category.VITAMINS, desc: 'Jarabe pediátrico sabor a cereza para crecimiento y defensas', isUnitOnly: true, cost: 22, marginPct: 45, stockUnits: 15, minStock: 3 },
    { name: 'Sulfato Ferroso 200 mg Grageas (Hierro Elemental 60 mg)', generic: 'Sulfato Ferroso Desecado', lab: 'Droguería INTI', cat: Category.VITAMINS, desc: 'Tratamiento de anemia ferropénica en embarazo y adultos', isUnitOnly: false, unitsPerBox: 50, cost: 20, marginPct: 50, marginUnitPct: 80, stockBoxes: 15, minStock: 3 },
    { name: 'Hierro Polimaltosado Gotas Pediátricas 30 ml', generic: 'Complejo de Hierro Polimaltosado', lab: 'Laboratorios Bagó', cat: Category.VITAMINS, desc: 'Hierro que no mancha los dientes ni irrita el estómago del bebé', isUnitOnly: true, cost: 35, marginPct: 40, stockUnits: 12, minStock: 3 },
    { name: 'Ácido Fólico 5 mg Comprimidos', generic: 'Ácido Fólico', lab: 'IFA Laboratorios', cat: Category.VITAMINS, desc: 'Esencial en el primer trimestre de embarazo para prevenir defectos del tubo neural', isUnitOnly: false, unitsPerBox: 30, cost: 15, marginPct: 50, marginUnitPct: 80, stockBoxes: 18, minStock: 4 },
    { name: 'Multivitamínico con Ginseng y Minerales Frasco 30 Cápsulas', generic: 'Vitaminas + Minerales + Panax Ginseng', lab: 'Laboratorios Bagó', cat: Category.VITAMINS, desc: 'Aumenta el rendimiento físico, concentración y energía diaria', isUnitOnly: true, cost: 48, marginPct: 40, stockUnits: 14, minStock: 3 },
    { name: 'Magnesio + Potasio Efervescente 20 Tabletas', generic: 'Citrato de Magnesio + Potasio', lab: 'Droguería INTI', cat: Category.VITAMINS, desc: 'Previene calambres, contracturas musculares y favorece el sueño', isUnitOnly: true, cost: 32, marginPct: 45, stockUnits: 18, minStock: 4 },
    { name: 'Omega 3 1000 mg Aceite de Pescado 60 Cápsulas', generic: 'Ácidos Grasos EPA y DHA', lab: 'Laboratorios Terbol', cat: Category.VITAMINS, desc: 'Protección cardiovascular, memoria y reducción de triglicéridos', isUnitOnly: true, cost: 58, marginPct: 40, stockUnits: 10, minStock: 2 },
    { name: 'Colágeno Hidrolizado con Vitamina C Pote 300 g Polvo', generic: 'Colágeno + Vitamina C + Biotina', lab: 'Laboratorios Bagó', cat: Category.VITAMINS, desc: 'Fortalece articulaciones, cartílagos, piel, cabello y uñas', isUnitOnly: true, cost: 85, marginPct: 35, stockUnits: 8, minStock: 2 },

    // --- 7. DERMATOLOGÍA, CUIDADO DE LA PIEL Y CICATRIZACIÓN ---
    { name: 'Hipoglós Pomada Protectora Cicatrizante 60 g', generic: 'Óxido de Zinc + Vitamina A + D', lab: 'Laboratorios Bagó', cat: Category.SKINCARE, desc: 'Trata y previene la pañalititis, rozaduras y quemaduras leves', isUnitOnly: true, cost: 24, marginPct: 45, stockUnits: 25, minStock: 5 },
    { name: 'Hipoglós con Caléndula y Aloe Vera 100 g', generic: 'Óxido de Zinc + Caléndula', lab: 'Laboratorios Bagó', cat: Category.SKINCARE, desc: 'Fórmula calmante para piel sensible e irritada del bebé', isUnitOnly: true, cost: 34, marginPct: 40, stockUnits: 15, minStock: 3 },
    { name: 'Sulfadiazina de Plata 1% Crema Tubo 50 g (Platsul)', generic: 'Sulfadiazina de Plata', lab: 'Laboratorios Bagó', cat: Category.SKINCARE, desc: 'Antibiótica y cicatrizante para quemaduras de 1er y 2do grado', isUnitOnly: true, cost: 28, marginPct: 45, stockUnits: 16, minStock: 4 },
    { name: 'Clotrimazol Crema Tópica 1% Tubo 20 g', generic: 'Clotrimazol', lab: 'Droguería INTI', cat: Category.SKINCARE, desc: 'Antifúngico eficaz contra pie de atleta, tiña y hongos de la piel', isUnitOnly: true, cost: 12, marginPct: 50, stockUnits: 24, minStock: 5 },
    { name: 'Ketoconazol Crema 2% Tubo 30 g', generic: 'Ketoconazol', lab: 'IFA Laboratorios', cat: Category.SKINCARE, desc: 'Antimicótico para dermatitis seborreica y pitiriasis versicolor', isUnitOnly: true, cost: 16, marginPct: 45, stockUnits: 18, minStock: 4 },
    { name: 'Ketoconazol Shampoo Anticaspa 2% 100 ml', generic: 'Ketoconazol', lab: 'Laboratorios Bagó', cat: Category.SKINCARE, desc: 'Elimina la caspa severa, descamación y comezón del cuero cabelludo', isUnitOnly: true, cost: 35, marginPct: 40, stockUnits: 12, minStock: 3 },
    { name: 'Terbinafina Crema 1% Tubo 15 g', generic: 'Terbinafina Clorhidrato', lab: 'Laboratorios Terbol', cat: Category.SKINCARE, desc: 'Fungicida que elimina hongos en 7 días de aplicación', isUnitOnly: true, cost: 22, marginPct: 45, stockUnits: 15, minStock: 3 },
    { name: 'Crema Triconjugada Betametasona + Clotrimazol + Gentamicina 20 g', generic: 'Antiinflamatorio + Antifúngico + Antibiótico', lab: 'Droguería INTI', cat: Category.SKINCARE, desc: 'Triple acción para eccemas complicados con bacterias u hongos', isUnitOnly: true, cost: 20, marginPct: 45, stockUnits: 22, minStock: 5 },
    { name: 'Hidrocortisona Crema 1% 15 g', generic: 'Hidrocortisona', lab: 'Laboratorios COFAR', cat: Category.SKINCARE, desc: 'Corticoide suave para picaduras de insectos, sarpullidos y alergias cutáneas', isUnitOnly: true, cost: 14, marginPct: 50, stockUnits: 16, minStock: 3 },
    { name: 'Mupirocina Ungüento 2% 15 g', generic: 'Mupirocina', lab: 'Laboratorios Bagó', cat: Category.SKINCARE, desc: 'Antibiótico tópico para impétigo e infecciones estafilocócicas', isUnitOnly: true, cost: 32, marginPct: 40, stockUnits: 10, minStock: 2 },
    { name: 'Protector Solar Facial Toque Seco FPS 50+ 50 ml', generic: 'Filtros Solares UVA/UVB', lab: 'Laboratorios Bagó', cat: Category.SKINCARE, desc: 'Alta protección solar no grasosa ideal para la altura de Bolivia', isUnitOnly: true, cost: 68, marginPct: 35, stockUnits: 14, minStock: 3 },
    { name: 'Gel Aloe Vera Puro Regenerador y Post Solar 150 ml', generic: 'Aloe Barbadensis 99%', lab: 'Droguería INTI', cat: Category.SKINCARE, desc: 'Calma quemaduras solares, hidrata y regenera la piel', isUnitOnly: true, cost: 25, marginPct: 45, stockUnits: 16, minStock: 3 },
    { name: 'Cicatricure Gel para Cicatrices y Estrías 30 g', generic: 'Extractos Botánicos Regeneradores', lab: 'Genomma Lab', cat: Category.SKINCARE, desc: 'Disminuye visiblemente la apariencia de cicatrices y marcas', isUnitOnly: true, cost: 58, marginPct: 35, stockUnits: 10, minStock: 2 },
    { name: 'Crema de Manos con Glicerina y Manzanilla 100 ml', generic: 'Glicerina + Manzanilla', lab: 'Droguería INTI', cat: Category.SKINCARE, desc: 'Hidratación intensiva contra la resequedad del frío y viento', isUnitOnly: true, cost: 18, marginPct: 45, stockUnits: 20, minStock: 4 },

    // --- 8. PSICOTRÓPICOS Y CONTROLADOS (BAJO RECETA RETENIDA) ---
    { name: 'Clonazepam 0.5 mg Comprimidos Ranurados', generic: 'Clonazepam', lab: 'Laboratorios Bagó', cat: Category.PSYCHOTROPIC, desc: 'Ansiolítico y anticonvulsivante benzodiacepínico', isUnitOnly: false, unitsPerBox: 30, cost: 35, marginPct: 40, marginUnitPct: 55, isControlled: true, stockBoxes: 8, minStock: 2 },
    { name: 'Clonazepam 2 mg Comprimidos', generic: 'Clonazepam', lab: 'Laboratorios Bagó', cat: Category.PSYCHOTROPIC, desc: 'Dosis para crisis de pánico y epilepsia bajo receta médica archivada', isUnitOnly: false, unitsPerBox: 30, cost: 48, marginPct: 40, marginUnitPct: 55, isControlled: true, stockBoxes: 7, minStock: 2 },
    { name: 'Clonazepam Gotas Orales 2.5 mg/ml 20 ml', generic: 'Clonazepam', lab: 'Droguería INTI', cat: Category.PSYCHOTROPIC, desc: 'Solución en gotas bajo estricto control de estupefacientes', isUnitOnly: true, cost: 38, marginPct: 40, isControlled: true, stockUnits: 6, minStock: 2 },
    { name: 'Alprazolam 0.5 mg Comprimidos Sublinguales', generic: 'Alprazolam', lab: 'Laboratorios Bagó', cat: Category.PSYCHOTROPIC, desc: 'Tratamiento de crisis de angustia y trastorno de ansiedad', isUnitOnly: false, unitsPerBox: 30, cost: 32, marginPct: 45, marginUnitPct: 60, isControlled: true, stockBoxes: 10, minStock: 2 },
    { name: 'Alprazolam 1 mg Comprimidos', generic: 'Alprazolam', lab: 'Laboratorios Terbol', cat: Category.PSYCHOTROPIC, desc: 'Ansiolítico de alta potencia bajo receta médica', isUnitOnly: false, unitsPerBox: 30, cost: 45, marginPct: 40, marginUnitPct: 55, isControlled: true, stockBoxes: 6, minStock: 2 },
    { name: 'Diazepam 10 mg Comprimidos', generic: 'Diazepam', lab: 'Droguería INTI', cat: Category.PSYCHOTROPIC, desc: 'Miorrelajante central y ansiolítico', isUnitOnly: false, unitsPerBox: 20, cost: 20, marginPct: 50, marginUnitPct: 70, isControlled: true, stockBoxes: 8, minStock: 2 },
    { name: 'Diazepam Ampolla 10 mg/2 ml Inyectable', generic: 'Diazepam', lab: 'IFA Laboratorios', cat: Category.PSYCHOTROPIC, desc: 'Inyectable de urgencia para status epiléptico', isUnitOnly: false, unitsPerBox: 5, cost: 20, marginPct: 50, marginUnitPct: 70, isControlled: true, stockBoxes: 5, minStock: 2 },
    { name: 'Zolpidem 10 mg Comprimidos Inductor del Sueño', generic: 'Zolpidem Hemitartrato', lab: 'Laboratorios Bagó', cat: Category.PSYCHOTROPIC, desc: 'Inductor hipnótico no benzodiacepínico para insomnio agudo', isUnitOnly: false, unitsPerBox: 30, cost: 65, marginPct: 35, marginUnitPct: 50, isControlled: true, stockBoxes: 6, minStock: 2 },
    { name: 'Sertralina 50 mg Tabletas Recubiertas', generic: 'Sertralina Clorhidrato', lab: 'Laboratorios Bagó', cat: Category.PSYCHOTROPIC, desc: 'Antidepresivo ISRS para depresión mayor y TOC', isUnitOnly: false, unitsPerBox: 30, cost: 45, marginPct: 40, marginUnitPct: 55, stockBoxes: 9, minStock: 2 },
    { name: 'Sertralina 100 mg Tabletas', generic: 'Sertralina Clorhidrato', lab: 'Droguería INTI', cat: Category.PSYCHOTROPIC, desc: 'Dosis de mantenimiento para trastornos depresivos severos', isUnitOnly: false, unitsPerBox: 30, cost: 68, marginPct: 40, marginUnitPct: 50, stockBoxes: 5, minStock: 2 },
    { name: 'Fluoxetina 20 mg Cápsulas', generic: 'Fluoxetina Clorhidrato', lab: 'Laboratorios Terbol', cat: Category.PSYCHOTROPIC, desc: 'Antidepresivo inhibidor selectivo de la recaptación de serotonina', isUnitOnly: false, unitsPerBox: 30, cost: 35, marginPct: 45, marginUnitPct: 60, stockBoxes: 7, minStock: 2 },
    { name: 'Amitriptilina 25 mg Comprimidos', generic: 'Amitriptilina Clorhidrato', lab: 'Laboratorios COFAR', cat: Category.PSYCHOTROPIC, desc: 'Antidepresivo tricíclico usado también en migraña y dolor neuropático', isUnitOnly: false, unitsPerBox: 30, cost: 22, marginPct: 50, marginUnitPct: 75, stockBoxes: 8, minStock: 2 },
    { name: 'Carbamazepina 200 mg Tabletas', generic: 'Carbamazepina', lab: 'Droguería INTI', cat: Category.PSYCHOTROPIC, desc: 'Anticonvulsivante y analgésico para neuralgia del trigémino', isUnitOnly: false, unitsPerBox: 30, cost: 28, marginPct: 45, marginUnitPct: 65, stockBoxes: 8, minStock: 2 },

    // --- 9. GINECOLOGÍA, SALUD FEMENINA Y PRUEBAS ---
    { name: 'Fluconazol 150 mg Cápsula Dosis Única', generic: 'Fluconazol', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Tratamiento oral monodosis para candidiasis vaginal', isUnitOnly: false, unitsPerBox: 1, cost: 12, marginPct: 50, marginUnitPct: 50, stockBoxes: 25, minStock: 5 },
    { name: 'Fluconazol 200 mg Cápsulas Caja 4 uds', generic: 'Fluconazol', lab: 'Droguería INTI', cat: Category.OTHERS, desc: 'Para infecciones micóticas sistémicas o recurrentes', isUnitOnly: false, unitsPerBox: 4, cost: 28, marginPct: 45, marginUnitPct: 60, stockBoxes: 10, minStock: 2 },
    { name: 'Óvulos Vaginales Metronidazol 500 mg + Nistatina 10 uds', generic: 'Metronidazol + Nistatina', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Tratamiento combinado para vulvovaginitis mixtas y leucorrea', isUnitOnly: false, unitsPerBox: 10, cost: 32, marginPct: 45, marginUnitPct: 60, stockBoxes: 12, minStock: 3 },
    { name: 'Clotrimazol Óvulos Vaginales 500 mg Monodosis', generic: 'Clotrimazol', lab: 'Droguería INTI', cat: Category.OTHERS, desc: 'Óvulo de liberación sostenida para hongos vaginales en una sola noche', isUnitOnly: false, unitsPerBox: 1, cost: 15, marginPct: 50, marginUnitPct: 50, stockBoxes: 18, minStock: 3 },
    { name: 'Anticonceptivo de Emergencia Levonorgestrel 1.5 mg', generic: 'Levonorgestrel', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Píldora del día después para prevención postcoital en 72 horas', isUnitOnly: false, unitsPerBox: 1, cost: 25, marginPct: 50, marginUnitPct: 50, stockBoxes: 30, minStock: 6 },
    { name: 'Anticonceptivo Oral Mensual Etinilestradiol + Levonorgestrel 28 días', generic: 'Etinilestradiol + Levonorgestrel', lab: 'Droguería INTI', cat: Category.OTHERS, desc: 'Pastillas anticonceptivas de uso diario con recordatorio', isUnitOnly: false, unitsPerBox: 28, cost: 28, marginPct: 45, marginUnitPct: 45, stockBoxes: 16, minStock: 4 },
    { name: 'Anticonceptivo Oral Drospirenona + Etinilestradiol 28 Comprimidos', generic: 'Drospirenona + Etinilestradiol', lab: 'Bayer Bolivia', cat: Category.OTHERS, desc: 'Baja retención de líquidos y control del acné hormonal', isUnitOnly: false, unitsPerBox: 28, cost: 85, marginPct: 35, marginUnitPct: 35, stockBoxes: 8, minStock: 2 },
    { name: 'Prueba de Embarazo Rápida en Tira HCG', generic: 'Inmunocromatografía HCG Orina', lab: 'IFA Laboratorios', cat: Category.OTHERS, desc: 'Detección rápida de embarazo con 99% de precisión en 3 minutos', isUnitOnly: true, cost: 7, marginPct: 70, stockUnits: 40, minStock: 8 },
    { name: 'Prueba de Embarazo Formato Casete con Gotero', generic: 'Test HCG Casete Alta Sensibilidad', lab: 'Droguería INTI', cat: Category.OTHERS, desc: 'Lectura higiénica con gotero y ventana clara de control', isUnitOnly: true, cost: 12, marginPct: 60, stockUnits: 25, minStock: 5 },

    // --- 10. OFTALMOLOGÍA Y ÓTICOS (GOTAS PARA OJOS Y OÍDOS) ---
    { name: 'Lágrimas Artificiales Gotas Oftálmicas 15 ml', generic: 'Carboximetilcelulosa Sódica 0.5%', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Lubricante ocular para ojo seco, fatiga visual y uso de pantallas', isUnitOnly: true, cost: 28, marginPct: 45, stockUnits: 18, minStock: 4 },
    { name: 'Gotas Oftálmicas Nafazolina Descongestionante 15 ml', generic: 'Nafazolina Clorhidrato 0.1%', lab: 'Droguería INTI', cat: Category.OTHERS, desc: 'Alivia ojos rojos irritados por humo, polvo o viento', isUnitOnly: true, cost: 18, marginPct: 50, stockUnits: 20, minStock: 4 },
    { name: 'Ciprofloxacino Gotas Oftálmicas 0.3% 5 ml', generic: 'Ciprofloxacino Solución Oftálmica', lab: 'Laboratorios Terbol', cat: Category.OTHERS, desc: 'Antibiótico tópico para conjuntivitis bacteriana y úlceras corneales', isUnitOnly: true, cost: 22, marginPct: 45, stockUnits: 14, minStock: 3 },
    { name: 'Tobramicina + Dexametasona Gotas Oftálmicas 5 ml', generic: 'Tobramicina + Dexametasona', lab: 'Alcon / Bagó', cat: Category.OTHERS, desc: 'Antibiótico y antiinflamatorio para conjuntivitis alérgica infectada', isUnitOnly: true, cost: 45, marginPct: 40, stockUnits: 10, minStock: 2 },
    { name: 'Gotas Óticas Ciprofloxacino + Hidrocortisona 10 ml', generic: 'Ciprofloxacino + Hidrocortisona Ótico', lab: 'Laboratorios Bagó', cat: Category.OTHERS, desc: 'Tratamiento de otitis externa aguda del nadador', isUnitOnly: true, cost: 35, marginPct: 40, stockUnits: 12, minStock: 3 },
    { name: 'Gotas Óticas Anestésicas con Benzocaína 15 ml', generic: 'Benzocaína + Antipirina', lab: 'Droguería INTI', cat: Category.OTHERS, desc: 'Alivio rápido del dolor intenso de oído en resfríos', isUnitOnly: true, cost: 22, marginPct: 45, stockUnits: 15, minStock: 3 },

    // --- 11. PRIMEROS AUXILIOS, DESINFECTANTES Y MATERIAL DE CURACIÓN ---
    { name: 'Alcohol Etílico 70° Frasco con Dosificador 500 ml', generic: 'Alcohol Etílico 70%', lab: 'Laboratorios Alcos', cat: Category.OTHERS, desc: 'Desinfectante antiséptico para manos y superficies', isUnitOnly: true, cost: 8.5, marginPct: 45, stockUnits: 35, minStock: 8 },
    { name: 'Alcohol en Gel Antibacterial 70% 250 ml con Glicerina', generic: 'Alcohol en Gel 70%', lab: 'Droguería INTI', cat: Category.OTHERS, desc: 'Sanitizante para manos que no reseca la piel', isUnitOnly: true, cost: 12, marginPct: 45, stockUnits: 25, minStock: 5 },
    { name: 'Agua Oxigenada 10 Volúmenes 250 ml', generic: 'Peróxido de Hidrógeno 3%', lab: 'Laboratorios Alcos', cat: Category.OTHERS, desc: 'Limpieza y desinfección de heridas y raspaduras', isUnitOnly: true, cost: 6, marginPct: 50, stockUnits: 30, minStock: 6 },
    { name: 'Povidona Yodada Solución Antiséptica 10% 120 ml', generic: 'Povidona Yodada', lab: 'Droguería INTI', cat: Category.OTHERS, desc: 'Antiséptico microbicida de amplio espectro para curaciones', isUnitOnly: true, cost: 14, marginPct: 45, stockUnits: 20, minStock: 4 },
    { name: 'Povidona Yodada Espuma Jabonosa 120 ml', generic: 'Povidona Espuma Quirúrgica', lab: 'IFA Laboratorios', cat: Category.OTHERS, desc: 'Lavado antiséptico prequirúrgico y de heridas contaminadas', isUnitOnly: true, cost: 16, marginPct: 45, stockUnits: 14, minStock: 3 },
    { name: 'Gasa Estéril Paquete de 5 Sobres (7.5 x 7.5 cm)', generic: 'Gasa Hidrófila Quirúrgica', lab: 'Laboratorios Alcos', cat: Category.OTHERS, desc: 'Para curación y protección de quemaduras y heridas', isUnitOnly: true, cost: 5, marginPct: 60, stockUnits: 40, minStock: 10 },
    { name: 'Venda Elástica de Compresión 10 cm x 5 m', generic: 'Algodón y Elástico', lab: 'Laboratorios Alcos', cat: Category.OTHERS, desc: 'Para esguinces, luxaciones y sujeción de apósitos', isUnitOnly: true, cost: 10, marginPct: 50, stockUnits: 25, minStock: 5 },
    { name: 'Curitas Adhesivas Caja 100 uds Hipoalergénicas', generic: 'Apósito Adhesivo Estéril', lab: 'Droguería INTI', cat: Category.OTHERS, desc: 'Protección para pequeños cortes y rozaduras', isUnitOnly: false, unitsPerBox: 100, cost: 18, marginPct: 50, marginUnitPct: 100, stockBoxes: 15, minStock: 3 },
    { name: 'Cinta Micropore Hipoalergénica 1 pulgada x 10 m', generic: 'Cinta Quirúrgica de Papel', lab: '3M Bolivia', cat: Category.OTHERS, desc: 'No irrita la piel al retirarla, apta para niños y ancianos', isUnitOnly: true, cost: 15, marginPct: 45, stockUnits: 20, minStock: 4 },
    { name: 'Jeringa Desechable con Aguja 3 ml Caja 100 uds', generic: 'Jeringa Estéril Luer Lock', lab: 'Nipro Medical', cat: Category.OTHERS, desc: 'Jeringas estériles atóxicas y libres de pirógenos', isUnitOnly: false, unitsPerBox: 100, cost: 35, marginPct: 45, marginUnitPct: 80, stockBoxes: 8, minStock: 2 },
    { name: 'Jeringa Desechable con Aguja 5 ml Caja 100 uds', generic: 'Jeringa Estéril 5 ml', lab: 'Nipro Medical', cat: Category.OTHERS, desc: 'Jeringas para administración intramuscular y analgésicos', isUnitOnly: false, unitsPerBox: 100, cost: 38, marginPct: 45, marginUnitPct: 80, stockBoxes: 8, minStock: 2 },
    { name: 'Termómetro Digital Punta Flexible Alarma de Fiebre', generic: 'Termómetro Clínico Digital', lab: 'Microlife / INTI', cat: Category.OTHERS, desc: 'Medición rápida y exacta en 60 segundos con display LCD', isUnitOnly: true, cost: 25, marginPct: 45, stockUnits: 15, minStock: 3 }
  ];

  // To reach at least 320 records, we automatically expand and generate variations
  // with different dosages, pack presentations, flavors, laboratories, and specific forms
  const allMedDefs: RawMedDef[] = [...rawMeds];

  const labsList = ['Droguería INTI', 'Laboratorios Bagó', 'Laboratorios Terbol', 'IFA Laboratorios', 'Laboratorios COFAR', 'Sigma Corp', 'Bayer Bolivia', 'Roemmers Bolivia'];
  
  // Supplementary generators for specific categories to ensure diversity and exact numbers > 300
  const supplements = [
    { base: 'Glucosamina 1500 mg + Condroitina 1200 mg Sobres', generic: 'Glucosamina + Condroitina', cat: Category.VITAMINS, cost: 90, margin: 35, box: 30 },
    { base: 'Biotina 10000 mcg (10 mg) Cápsulas Cabello y Uñas', generic: 'Biotina (Vitamina H)', cat: Category.VITAMINS, cost: 55, margin: 40, box: 60 },
    { base: 'Vitamina E 400 UI Cápsulas Blandas Antioxidante', generic: 'D-Alfa Tocoferol', cat: Category.VITAMINS, cost: 42, margin: 45, box: 30 },
    { base: 'Coenzima Q10 100 mg Cápsulas Blandas', generic: 'Ubiquinona CoQ10', cat: Category.VITAMINS, cost: 75, margin: 35, box: 30 },
    { base: 'Spirulina 500 mg Comprimidos Naturales', generic: 'Spirulina Máxima', cat: Category.VITAMINS, cost: 45, margin: 40, box: 100 },
    { base: 'Propóleo con Miel Spray Bucal 30 ml', generic: 'Extracto de Propóleo', cat: Category.PAINKILLERS, cost: 22, margin: 45, unit: true },
    { base: 'Caramelos Balsámicos Eucalipto y Miel Bolsa 50 uds', generic: 'Esencias Balsámicas', cat: Category.PAINKILLERS, cost: 15, margin: 50, box: 50 },
    { base: 'Vitamina A 50000 UI Cápsulas Blandas', generic: 'Retinol Palmitato', cat: Category.VITAMINS, cost: 25, margin: 50, box: 30 },
    { base: 'Citrato de Calcio 1500 mg Tabletas', generic: 'Citrato Cálcico', cat: Category.VITAMINS, cost: 48, margin: 40, box: 60 },
    { base: 'Levadura de Cerveza 500 mg Tabletas', generic: 'Saccharomyces cerevisiae', cat: Category.VITAMINS, cost: 30, margin: 45, box: 100 },
    { base: 'Aceite de Hígado de Bacalao 500 mg Emulsión 200 ml', generic: 'Vitaminas A y D + Omega 3', cat: Category.VITAMINS, cost: 35, margin: 40, unit: true }
  ];

  supplements.forEach((s, idx) => {
    allMedDefs.push({
      name: s.base,
      generic: s.generic,
      lab: labsList[idx % labsList.length],
      cat: s.cat,
      desc: 'Suplemento nutricional de apoyo y bienestar',
      isUnitOnly: !!s.unit,
      unitsPerBox: s.box || 1,
      cost: s.cost,
      marginPct: s.margin,
      stockBoxes: s.unit ? 0 : 8,
      stockUnits: s.unit ? 12 : 8 * (s.box || 1),
      minStock: 2
    });
  });

  // Additional therapeutic lines to reach 325+ items:
  // Antibiotics variants, cardiovascular lines, antiallergics, gastro variants, pediatric forms
  const genericVariations = [
    { prefix: 'Cefadroxilo', gen: 'Cefadroxilo Monohidrato', cat: Category.ANTIBIOTICS, doses: ['500 mg Cápsulas', '1 g Comprimidos', 'Suspensión 250 mg/5 ml 100 ml'] },
    { prefix: 'Cefotaxima', gen: 'Cefotaxima Sódica', cat: Category.ANTIBIOTICS, doses: ['1 g Frasco Ampolla Inyectable IM/IV'] },
    { prefix: 'Ampicilina + Sulbactam', gen: 'Ampicilina + Sulbactam', cat: Category.ANTIBIOTICS, doses: ['1.5 g Frasco Ampolla Inyectable', '375 mg Comprimidos'] },
    { prefix: 'Oxacilina', gen: 'Oxacilina Sódica', cat: Category.ANTIBIOTICS, doses: ['1 g Frasco Ampolla Inyectable'] },
    { prefix: 'Vancomicina', gen: 'Vancomicina Clorhidrato', cat: Category.ANTIBIOTICS, doses: ['500 mg Frasco Ampolla Infusión'] },
    { prefix: 'Flucloxacilina', gen: 'Flucloxacilina Sódica', cat: Category.ANTIBIOTICS, doses: ['500 mg Cápsulas'] },
    { prefix: 'Levofloxacino', gen: 'Levofloxacino', cat: Category.ANTIBIOTICS, doses: ['750 mg Tabletas Forte'] },
    { prefix: 'Moxifloxacino', gen: 'Moxifloxacino Clorhidrato', cat: Category.ANTIBIOTICS, doses: ['400 mg Comprimidos Recubiertos'] },
    { prefix: 'Secnidazol', gen: 'Secnidazol', cat: Category.ANTIBIOTICS, doses: ['500 mg Comprimidos', '1 g Comprimidos Dosis Única', 'Suspensión 500 mg/30 ml'] },
    { prefix: 'Albendazol', gen: 'Albendazol', cat: Category.ANTIBIOTICS, doses: ['200 mg Tabletas Masticables Caja 2 uds', '400 mg Dosis Única', 'Suspensión 400 mg/10 ml'] },
    { prefix: 'Mebendazol', gen: 'Mebendazol', cat: Category.ANTIBIOTICS, doses: ['100 mg Tabletas Caja 6 uds', 'Suspensión 100 mg/5 ml 30 ml'] },
    { prefix: 'Ivermectina', gen: 'Ivermectina', cat: Category.ANTIBIOTICS, doses: ['6 mg Comprimidos', 'Gotas 6 mg/ml 5 ml'] },
    { prefix: 'Nitazoxanida', gen: 'Nitazoxanida', cat: Category.ANTIBIOTICS, doses: ['500 mg Comprimidos Recubiertos', 'Suspensión 100 mg/5 ml 60 ml'] },
    { prefix: 'Tinidazol', gen: 'Tinidazol', cat: Category.ANTIBIOTICS, doses: ['500 mg Tabletas', '1 g Tabletas Caja 2 uds'] },
    { prefix: 'Candesartán', gen: 'Candesartán Cilexetilo', cat: Category.OTHERS, doses: ['8 mg Comprimidos', '16 mg Comprimidos', '16 mg + HCTZ 12.5 mg'] },
    { prefix: 'Valsartán', gen: 'Valsartán', cat: Category.OTHERS, doses: ['80 mg Comprimidos', '160 mg Comprimidos', '160 mg + Amlodipino 5 mg'] },
    { prefix: 'Telmisartán', gen: 'Telmisartán', cat: Category.OTHERS, doses: ['40 mg Tabletas', '80 mg Tabletas', '80 mg + Hidroclorotiazida 12.5 mg'] },
    { prefix: 'Irbesartán', gen: 'Irbesartán', cat: Category.OTHERS, doses: ['150 mg Tabletas', '300 mg Tabletas'] },
    { prefix: 'Bisoprolol', gen: 'Bisoprolol Fumarato', cat: Category.OTHERS, doses: ['2.5 mg Comprimidos', '5 mg Comprimidos', '10 mg Comprimidos'] },
    { prefix: 'Nebivolol', gen: 'Nebivolol Clorhidrato', cat: Category.OTHERS, doses: ['5 mg Comprimidos'] },
    { prefix: 'Metoprolol', gen: 'Metoprolol Tartrato', cat: Category.OTHERS, doses: ['50 mg Tabletas', '100 mg Tabletas'] },
    { prefix: 'Diltiazem', gen: 'Diltiazem Clorhidrato', cat: Category.OTHERS, doses: ['60 mg Tabletas', '90 mg Cápsulas Retard'] },
    { prefix: 'Verapamilo', gen: 'Verapamilo Clorhidrato', cat: Category.OTHERS, doses: ['80 mg Grageas', '120 mg Retard'] },
    { prefix: 'Digoxina', gen: 'Digoxina', cat: Category.OTHERS, doses: ['0.25 mg Comprimidos'] },
    { prefix: 'Amiodarona', gen: 'Amiodarona Clorhidrato', cat: Category.OTHERS, doses: ['200 mg Tabletas'] },
    { prefix: 'Warfarina Sódica', gen: 'Warfarina', cat: Category.OTHERS, doses: ['5 mg Comprimidos Anticoagulante'] },
    { prefix: 'Rivaroxabán', gen: 'Rivaroxabán', cat: Category.OTHERS, doses: ['10 mg Comprimidos', '15 mg Comprimidos', '20 mg Comprimidos'] },
    { prefix: 'Apixabán', gen: 'Apixabán', cat: Category.OTHERS, doses: ['2.5 mg Comprimidos', '5 mg Comprimidos'] },
    { prefix: 'Gemfibrozilo', gen: 'Gemfibrozilo', cat: Category.OTHERS, doses: ['600 mg Comprimidos', '900 mg Tabletas'] },
    { prefix: 'Fenofibrato', gen: 'Fenofibrato Micronizado', cat: Category.OTHERS, doses: ['200 mg Cápsulas'] },
    { prefix: 'Ezetimiba', gen: 'Ezetimiba', cat: Category.OTHERS, doses: ['10 mg Comprimidos', '10 mg + Simvastatina 20 mg'] },
    { prefix: 'Levotiroxina Sódica', gen: 'Levotiroxina', cat: Category.OTHERS, doses: ['25 mcg Tabletas', '50 mcg Tabletas', '75 mcg Tabletas', '100 mcg Tabletas', '125 mcg Tabletas'] },
    { prefix: 'Metimazol', gen: 'Tiamazol (Metimazol)', cat: Category.OTHERS, doses: ['5 mg Tabletas Antitiroideo'] },
    { prefix: 'Alopurinol', gen: 'Alopurinol', cat: Category.OTHERS, doses: ['100 mg Comprimidos', '300 mg Comprimidos (Ácido Úrico)'] },
    { prefix: 'Colquicina', gen: 'Colchicina', cat: Category.OTHERS, doses: ['0.5 mg Comprimidos para Ataque de Gota', '1 mg Comprimidos'] },
    { prefix: 'Finasterida', gen: 'Finasterida', cat: Category.OTHERS, doses: ['1 mg Comprimidos (Caída del Cabello)', '5 mg Comprimidos (Próstata)'] },
    { prefix: 'Dutasterida', gen: 'Dutasterida', cat: Category.OTHERS, doses: ['0.5 mg Cápsulas Blandas'] },
    { prefix: 'Tamsulosina', gen: 'Tamsulosina Clorhidrato', cat: Category.OTHERS, doses: ['0.4 mg Cápsulas de Liberación Prolongada'] },
    { prefix: 'Sildenafil', gen: 'Sildenafil Citrato', cat: Category.OTHERS, doses: ['50 mg Tabletas Masticables', '100 mg Comprimidos Recubiertos'] },
    { prefix: 'Tadalafil', gen: 'Tadalafil', cat: Category.OTHERS, doses: ['5 mg Comprimidos Uso Diario', '20 mg Comprimidos Recubiertos'] },
    { prefix: 'Bromhexina', gen: 'Bromhexina Clorhidrato', cat: Category.PAINKILLERS, doses: ['8 mg Comprimidos'] },
    { prefix: 'Acetilcisteína', gen: 'N-Acetilcisteína', cat: Category.PAINKILLERS, doses: ['200 mg Sobres Efervescentes', '600 mg Sobres Efervescentes', 'Jarabe 100 mg/5 ml'] },
    { prefix: 'Carbocisteína', gen: 'Carbocisteína', cat: Category.PAINKILLERS, doses: ['Jarabe Adultos 250 mg/5 ml 120 ml', 'Jarabe Infantil 100 mg/5 ml'] },
    { prefix: 'Fluticasona Propionato', gen: 'Fluticasona', cat: Category.PAINKILLERS, doses: ['Spray Nasal 50 mcg 120 Dosis'] },
    { prefix: 'Mometasona Furoato', gen: 'Mometasona', cat: Category.PAINKILLERS, doses: ['Spray Nasal Acuoso 50 mcg'] },
    { prefix: 'Betametasona Gotas', gen: 'Betametasona Fosfato', cat: Category.PAINKILLERS, doses: ['Gotas Orales Pediátricas 0.5 mg/ml 20 ml'] },
    { prefix: 'Beclometasona', gen: 'Beclometasona Dipropionato', cat: Category.PAINKILLERS, doses: ['Aerosol Bucal Inhalador 250 mcg 200 Dosis'] },
    { prefix: 'Sucralfato', gen: 'Sucralfato', cat: Category.DIGESTIVE, doses: ['1 g Tabletas Masticables', 'Suspensión 1 g/5 ml 200 ml'] },
    { prefix: 'Mosaprida Citrato', gen: 'Mosaprida', cat: Category.DIGESTIVE, doses: ['5 mg Comprimidos Procinéticos'] },
    { prefix: 'Levosulpirida', gen: 'Levosulpirida', cat: Category.DIGESTIVE, doses: ['25 mg Comprimidos'] },
    { prefix: 'Cinitaprida', gen: 'Cinitaprida Tartrato', cat: Category.DIGESTIVE, doses: ['1 mg Comprimidos'] },
    { prefix: 'Otilonio Bromuro', gen: 'Otilonio Bromuro', cat: Category.DIGESTIVE, doses: ['40 mg Comprimidos Espasmolítico'] },
    { prefix: 'Mebeverina Clorhidrato', gen: 'Mebeverina', cat: Category.DIGESTIVE, doses: ['200 mg Cápsulas de Liberación Prolongada'] },
    { prefix: 'Dimeticona + Pancreatina', gen: 'Enzimas Digestivas + Dimeticona', cat: Category.DIGESTIVE, doses: ['Grageas Digestivas con Enzimas Caja 30 uds'] },
    { prefix: 'Ácido Ursodesoxicólico', gen: 'Ursodiol', cat: Category.DIGESTIVE, doses: ['250 mg Cápsulas para Cálculos Biliares', '500 mg Tabletas'] },
    { prefix: 'Silimarina 150 mg Protector Hepático', generic: 'Cardo Mariano (Silimarina)', cat: Category.DIGESTIVE, doses: ['Cápsulas Caja 30 uds'] },
    { prefix: 'Betahistina Diclorhidrato', gen: 'Betahistina', cat: Category.OTHERS, doses: ['16 mg Comprimidos para Vértigo', '24 mg Comprimidos'] },
    { prefix: 'Difenidol', gen: 'Difenidol Clorhidrato', cat: Category.OTHERS, doses: ['25 mg Tabletas Antivertiginoso'] },
    { prefix: 'Cinarizina', gen: 'Cinarizina', cat: Category.OTHERS, doses: ['75 mg Cápsulas Vasodilatador Cerebral'] },
    { prefix: 'Flunarizina', gen: 'Flunarizina', cat: Category.OTHERS, doses: ['10 mg Comprimidos Prevención Migraña'] },
    { prefix: 'Ergotamina + Cafeína + Paracetamol', gen: 'Antijaquecoso Combinado', cat: Category.PAINKILLERS, doses: ['Comprimidos Caja 20 uds'] },
    { prefix: 'Zolmitriptán', gen: 'Zolmitriptán', cat: Category.PAINKILLERS, doses: ['2.5 mg Tabletas Dispersables para Migraña'] },
    { prefix: 'Sumatriptán', gen: 'Sumatriptán Succinato', cat: Category.PAINKILLERS, doses: ['50 mg Comprimidos Recubiertos', '100 mg Comprimidos'] },
    { prefix: 'Baclofeno', gen: 'Baclofeno', cat: Category.PAINKILLERS, doses: ['10 mg Comprimidos Relajante Muscular', '25 mg Comprimidos'] },
    { prefix: 'Tizanidina', gen: 'Tizanidina Clorhidrato', cat: Category.PAINKILLERS, doses: ['2 mg Comprimidos Miorrelajante', '4 mg Comprimidos'] },
    { prefix: 'Ciclobenzaprina', gen: 'Ciclobenzaprina Clorhidrato', cat: Category.PAINKILLERS, doses: ['5 mg Comprimidos', '10 mg Comprimidos'] },
    { prefix: 'Clorzoxazona + Paracetamol', gen: 'Relajante Muscular + Analgésico', cat: Category.PAINKILLERS, doses: ['Comprimidos Caja 20 uds'] },
    { prefix: 'Pridinol Mesilato', gen: 'Pridinol', cat: Category.PAINKILLERS, doses: ['4 mg Tabletas'] },
    { prefix: 'Carisoprodol', gen: 'Carisoprodol', cat: Category.PAINKILLERS, doses: ['350 mg Comprimidos'] },
    { prefix: 'Pregabalina', gen: 'Pregabalina', cat: Category.PSYCHOTROPIC, doses: ['75 mg Cápsulas para Dolor Neuropático', '150 mg Cápsulas', '300 mg Cápsulas'] },
    { prefix: 'Gabapentina', gen: 'Gabapentina', cat: Category.PSYCHOTROPIC, doses: ['300 mg Cápsulas', '400 mg Cápsulas', '600 mg Comprimidos'] },
    { prefix: 'Topiramato', gen: 'Topiramato', cat: Category.PSYCHOTROPIC, doses: ['25 mg Comprimidos', '50 mg Comprimidos', '100 mg Comprimidos'] },
    { prefix: 'Ácido Valproico (Valproato Sódico)', gen: 'Valproato de Sodio', cat: Category.PSYCHOTROPIC, doses: ['250 mg Cápsulas Blandas', '500 mg Comprimidos Entéricos', 'Jarabe 250 mg/5 ml 120 ml'] },
    { prefix: 'Levetiracetam', gen: 'Levetiracetam', cat: Category.PSYCHOTROPIC, doses: ['500 mg Comprimidos', '1000 mg Comprimidos', 'Solución Oral 100 mg/ml'] },
    { prefix: 'Lamotrigina', gen: 'Lamotrigina', cat: Category.PSYCHOTROPIC, doses: ['25 mg Tabletas Dispersables', '50 mg Tabletas', '100 mg Tabletas'] },
    { prefix: 'Escitalopram', gen: 'Escitalopram Oxalato', cat: Category.PSYCHOTROPIC, doses: ['10 mg Comprimidos Recubiertos', '20 mg Comprimidos'] },
    { prefix: 'Citalopram', gen: 'Citalopram Bromhidrato', cat: Category.PSYCHOTROPIC, doses: ['20 mg Comprimidos'] },
    { prefix: 'Paroxetina', gen: 'Paroxetina Clorhidrato', cat: Category.PSYCHOTROPIC, doses: ['20 mg Tabletas'] },
    { prefix: 'Venlafaxina', gen: 'Venlafaxina Clorhidrato XR', cat: Category.PSYCHOTROPIC, doses: ['75 mg Cápsulas de Liberación Prolongada', '150 mg Cápsulas XR'] },
    { prefix: 'Duloxetina', gen: 'Duloxetina Clorhidrato', cat: Category.PSYCHOTROPIC, doses: ['30 mg Cápsulas Gastrorresistentes', '60 mg Cápsulas'] },
    { prefix: 'Bupropión', gen: 'Bupropión Clorhidrato XL', cat: Category.PSYCHOTROPIC, doses: ['150 mg Tabletas para Dejar de Fumar', '300 mg Tabletas'] },
    { prefix: 'Quetiapina', gen: 'Quetiapina Fumarato', cat: Category.PSYCHOTROPIC, doses: ['25 mg Comprimidos Sedante Nocturno', '100 mg Comprimidos', '200 mg Comprimidos'] },
    { prefix: 'Olanzapina', gen: 'Olanzapina', cat: Category.PSYCHOTROPIC, doses: ['5 mg Comprimidos Bucodispersables', '10 mg Comprimidos'] },
    { prefix: 'Risperidona', gen: 'Risperidona', cat: Category.PSYCHOTROPIC, doses: ['1 mg Comprimidos', '2 mg Comprimidos', 'Gotas Orales 1 mg/ml 30 ml'] },
    { prefix: 'Haloperidol', gen: 'Haloperidol', cat: Category.PSYCHOTROPIC, doses: ['5 mg Tabletas', 'Gotas Orales 2 mg/ml 20 ml', 'Ampolla 5 mg/1 ml'] },
    { prefix: 'Biperideno', gen: 'Biperideno Clorhidrato', cat: Category.PSYCHOTROPIC, doses: ['2 mg Comprimidos'] },
    { prefix: 'Levodopa + Carbidopa', gen: 'Levodopa 250 mg + Carbidopa 25 mg', cat: Category.PSYCHOTROPIC, doses: ['Comprimidos para Parkinson Caja 30 uds'] },
    { prefix: 'Pramipexol', gen: 'Pramipexol Diclorhidrato', cat: Category.PSYCHOTROPIC, doses: ['0.25 mg Comprimidos', '1 mg Comprimidos'] }
  ];

  let varCount = 0;
  for (const group of genericVariations) {
    for (const dose of group.doses) {
      varCount++;
      const isSyrupOrDrops = dose.toLowerCase().includes('jarabe') || 
                             dose.toLowerCase().includes('gotas') || 
                             dose.toLowerCase().includes('solución') ||
                             dose.toLowerCase().includes('suspensión') || 
                             dose.toLowerCase().includes('spray');
      const isControlledItem = group.cat === Category.PSYCHOTROPIC;
      const labName = labsList[varCount % labsList.length];

      allMedDefs.push({
        name: `${group.prefix} ${dose}`,
        generic: (group as any).gen || group.prefix,
        lab: labName,
        cat: group.cat,
        desc: `Tratamiento farmacéutico de prescripción: ${group.prefix}`,
        isUnitOnly: isSyrupOrDrops,
        unitsPerBox: isSyrupOrDrops ? 1 : 20,
        cost: 15 + ((varCount * 7) % 55),
        marginPct: 40 + (varCount % 20),
        marginUnitPct: 55 + (varCount % 25),
        isControlled: isControlledItem,
        stockBoxes: isSyrupOrDrops ? 0 : (8 + (varCount % 15)),
        stockUnits: isSyrupOrDrops ? (10 + (varCount % 15)) : (8 + (varCount % 15)) * 20,
        minStock: 2 + (varCount % 4),
        maxStock: 30 + (varCount % 30)
      });
    }
  }

  // Ensure total is AT LEAST 320 items (user asked for at least 300)
  const finalMedsList: Medication[] = [];

  allMedDefs.forEach((item, index) => {
    const id = `MED-${String(index + 1).padStart(3, '0')}`;
    const unitsPerBox = item.isUnitOnly ? 1 : (item.unitsPerBox || 20);
    const costPriceBox = item.isUnitOnly ? item.cost : item.cost;
    const costPriceUnit = item.isUnitOnly 
      ? item.cost 
      : parseFloat((costPriceBox / unitsPerBox).toFixed(2));

    const profitBox = item.marginPct || 45;
    const profitUnit = item.marginUnitPct || profitBox + 15;

    const priceBox = item.isUnitOnly 
      ? parseFloat((costPriceUnit * (1 + profitUnit / 100)).toFixed(2))
      : parseFloat((costPriceBox * (1 + profitBox / 100)).toFixed(2));

    const priceUnit = parseFloat((costPriceUnit * (1 + profitUnit / 100)).toFixed(2));

    // Stock adjustments:
    // Some are low stock (index 10, 25, 40, 55, 70, 85, 100, 115, 130, 145, 160)
    // Some are out of stock (index 30, 90, 150)
    // Some have short expiry or expired
    const isLowStock = [10, 25, 40, 55, 70, 85, 100, 115, 130, 145, 160, 175, 190, 205, 220].includes(index);
    const isOutOfStock = [30, 90, 150, 210].includes(index);
    const isExpired = [5, 45, 95].includes(index);
    const isShortExpiry = [12, 28, 62, 88, 122, 148, 182, 218].includes(index);

    let stockBoxes = item.stockBoxes ?? 10;
    let stockUnits = item.stockUnits ?? (stockBoxes * unitsPerBox);
    const minStock = item.minStock ?? 5;
    const maxStock = item.maxStock ?? 40;

    if (isOutOfStock) {
      stockBoxes = 0;
      stockUnits = 0;
    } else if (isLowStock) {
      stockBoxes = item.isUnitOnly ? 0 : Math.max(1, minStock - 1);
      stockUnits = item.isUnitOnly ? Math.max(1, minStock - 1) : stockBoxes * unitsPerBox;
    }

    // Expiry date calculation
    let expiryDateStr = '2026-11-30';
    if (isExpired) {
      const pastTime = now - (35 * dayMs);
      expiryDateStr = new Date(pastTime).toISOString().slice(0, 10);
    } else if (isShortExpiry) {
      const shortTime = now + (45 * dayMs);
      expiryDateStr = new Date(shortTime).toISOString().slice(0, 10);
    } else {
      // 1 to 3 years ahead
      const futureTime = now + ((365 + (index * 7 % 600)) * dayMs);
      expiryDateStr = new Date(futureTime).toISOString().slice(0, 10);
    }

    const lotNumber = `L-${24000 + (index * 13 % 9000)}`;

    const med: Medication = {
      id,
      name: item.name,
      genericName: item.generic,
      laboratory: item.lab,
      description: item.desc,
      category: item.cat,
      imageUrl: '',
      isUnitOnly: item.isUnitOnly,
      unitsPerBox,
      costPriceBox: item.isUnitOnly ? costPriceUnit : costPriceBox,
      costPriceUnit,
      profitMarginPercent: profitBox,
      profitMarginUnitPercent: profitUnit,
      priceBox,
      priceUnit,
      stockBoxes: item.isUnitOnly ? 0 : stockBoxes,
      stockUnits,
      minStock,
      maxStock,
      isControlled: !!item.isControlled,
      batches: [
        {
          lotNumber,
          expiryDate: expiryDateStr,
          quantity: stockUnits
        }
      ]
    };

    finalMedsList.push(med);
  });

  // 7. Sales Records (40 realistic sales across past month)
  const sales: SaleRecord[] = [];
  const paymentMethods: Array<'CASH' | 'QR' | 'CARD'> = ['CASH', 'QR', 'CASH', 'CARD', 'CASH', 'QR'];
  const cashiers = ['Josue Balboa', 'Carlos Mendoza', 'Dra. Elena Paredes', 'Administrador Principal'];

  for (let i = 0; i < 40; i++) {
    const saleId = `SALE-${String(i + 1).padStart(3, '0')}`;
    const daysAgo = (39 - i) * 0.75;
    const saleDate = new Date(now - (daysAgo * dayMs));
    const customer = customers[i % customers.length];
    const cashier = cashiers[i % cashiers.length];
    const payMethod = paymentMethods[i % paymentMethods.length];
    const docType = i % 2 === 0 ? 'FACTURA' : 'RECIBO';

    // Pick 2-3 random medications
    const med1 = finalMedsList[(i * 3 + 1) % finalMedsList.length];
    const med2 = finalMedsList[(i * 5 + 4) % finalMedsList.length];
    const med3 = i % 2 === 0 ? finalMedsList[(i * 7 + 8) % finalMedsList.length] : null;

    const items = [
      {
        medication: med1,
        quantity: 1 + (i % 3),
        isFractional: med1.isUnitOnly || (i % 3 !== 0),
        selectedBatch: med1.batches[0]?.lotNumber || 'L-24001',
        subtotal: parseFloat(((med1.isUnitOnly || (i % 3 !== 0) ? med1.priceUnit : med1.priceBox) * (1 + (i % 3))).toFixed(2))
      },
      {
        medication: med2,
        quantity: 1,
        isFractional: med2.isUnitOnly || (i % 2 === 0),
        selectedBatch: med2.batches[0]?.lotNumber || 'L-24002',
        subtotal: med2.isUnitOnly || (i % 2 === 0) ? med2.priceUnit : med2.priceBox
      }
    ];

    if (med3) {
      items.push({
        medication: med3,
        quantity: 1,
        isFractional: true,
        selectedBatch: med3.batches[0]?.lotNumber || 'L-24003',
        subtotal: med3.priceUnit
      });
    }

    const total = parseFloat(items.reduce((acc, curr) => acc + curr.subtotal, 0).toFixed(2));

    sales.push({
      id: saleId,
      timestamp: saleDate.toISOString(),
      items,
      total,
      customerId: customer.id,
      customerName: customer.name,
      clientNit: customer.dni,
      clientBusinessName: customer.name,
      documentType: docType,
      qrVerified: payMethod === 'QR',
      insuranceName: customer.insuranceId === 'NONE' ? 'Sin Descuento' : (discountPlans.find(d => d.id === customer.insuranceId)?.name || 'Particular'),
      userId: (i % 2 === 0) ? 'U_JOSUE_BALBOA' : '1',
      cashierName: cashier,
      cashRegister: (i % 3 === 0) ? 'Caja 2' : 'Caja 1',
      paymentMethod: payMethod
    });
  }

  // 8. Purchases (12 realistic purchase records from suppliers)
  const purchases: Purchase[] = [];
  for (let p = 0; p < 12; p++) {
    const purId = `PUR-${String(p + 1).padStart(3, '0')}`;
    const purDate = new Date(now - ((28 - (p * 2)) * dayMs));
    const supp = suppliers[p % suppliers.length];

    const pMed1 = finalMedsList[(p * 11) % finalMedsList.length];
    const pMed2 = finalMedsList[(p * 17 + 5) % finalMedsList.length];

    const qty1 = 10 + (p * 2);
    const qty2 = 15 + (p * 3);
    const sub1 = parseFloat((pMed1.costPriceBox! * qty1).toFixed(2));
    const sub2 = parseFloat((pMed2.costPriceBox! * qty2).toFixed(2));
    const totalPur = parseFloat((sub1 + sub2).toFixed(2));

    purchases.push({
      id: purId,
      timestamp: purDate.toISOString(),
      invoiceNumber: `FAC-${1000 + p * 34}`,
      supplierId: supp.id,
      supplierName: supp.name,
      warehouseName: 'Almacén Central Farma',
      total: totalPur,
      status: 'Completado',
      registrationDate: purDate.toISOString().slice(0, 10),
      items: [
        {
          medicationId: pMed1.id,
          medicationName: pMed1.name,
          quantity: qty1,
          costPrice: pMed1.costPriceBox!,
          lotNumber: pMed1.batches[0]?.lotNumber || 'L-24010',
          expiryDate: pMed1.batches[0]?.expiryDate || '2027-05-30',
          subtotal: sub1,
          isUnitPurchase: pMed1.isUnitOnly
        },
        {
          medicationId: pMed2.id,
          medicationName: pMed2.name,
          quantity: qty2,
          costPrice: pMed2.costPriceBox!,
          lotNumber: pMed2.batches[0]?.lotNumber || 'L-24011',
          expiryDate: pMed2.batches[0]?.expiryDate || '2027-08-30',
          subtotal: sub2,
          isUnitPurchase: pMed2.isUnitOnly
        }
      ]
    });
  }

  return {
    medications: finalMedsList,
    customers,
    staff,
    suppliers,
    sales,
    purchases,
    pharmacyInfo,
    discountPlans
  };
}
