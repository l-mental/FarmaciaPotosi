import React from 'react';
import { NavLink } from 'react-router-dom';
import { HeartPulse, LayoutDashboard, ShoppingCart, Pill, BarChart3, Users, Truck, UserCog, LogOut, ShoppingBag, Lock } from 'lucide-react';
import { User, canUserAccessSection } from '@/types';

interface SidebarProps {
  activeTab: string;
  currentUser: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, currentUser, onLogout }) => {
  const roleDisplay = currentUser.customRoleName || (
    currentUser.role === 'ADMIN' ? 'ADMINISTRADOR' : 
    currentUser.role === 'PHARMACIST' ? 'FARMACÉUTICO' : 
    currentUser.role === 'CUSTOM' ? 'ROL PERSONALIZADO' : 'EMPLEADO / CAJERO'
  );

  return (
    <aside className="hidden md:flex w-48 lg:w-52 bg-slate-900 flex-col shrink-0 transition-all duration-300 z-50 h-screen border-r border-white/5">
      {/* Brand Header - Compact & sleek for PC */}
      <div className="px-3.5 py-3 mb-1 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-600 p-2 rounded-xl shrink-0 shadow-md shadow-emerald-900/40">
            <HeartPulse className="text-white w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-white font-black text-base tracking-tight block truncate">
              Farma
            </span>
            <span className="text-emerald-400 text-[9px] block uppercase font-black tracking-wider leading-none">
              FarmaPOS
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-1 overflow-y-auto no-scrollbar">
        {canUserAccessSection(currentUser, 'DASHBOARD') && (
          <NavButton to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
        )}
        {canUserAccessSection(currentUser, 'POS') && (
          <NavButton to="/pos" icon={<ShoppingCart />} label="Punto de Venta" />
        )}
        {canUserAccessSection(currentUser, 'INVENTORY') && (
          <NavButton to="/inventory" icon={<Pill />} label="Inventario" />
        )}
        {canUserAccessSection(currentUser, 'REPORTS') && (
          <NavButton to="/reports" icon={<BarChart3 />} label="Reportes" />
        )}
        {canUserAccessSection(currentUser, 'CUSTOMERS') && (
          <NavButton to="/customers" icon={<Users />} label="Pacientes" />
        )}
        {canUserAccessSection(currentUser, 'SUPPLIERS') && (
          <NavButton to="/suppliers" icon={<Truck />} label="Proveedores" />
        )}
        {canUserAccessSection(currentUser, 'PURCHASES') && (
          <NavButton to="/purchases" icon={<ShoppingBag />} label="Compras" />
        )}
        {canUserAccessSection(currentUser, 'STAFF') && (
          <NavButton to="/staff" icon={<UserCog />} label="Personal" />
        )}
      </nav>

      <div className="p-2.5 mt-auto border-t border-white/5 shrink-0 space-y-2">
        <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-white font-bold text-xs truncate leading-tight">{currentUser.name}</p>
            <p className="text-emerald-400 text-[8px] uppercase font-black truncate">{roleDisplay}</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-rose-400 hover:bg-rose-400/10 transition-all font-bold text-xs group cursor-pointer">
          <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform shrink-0" />
          <span className="truncate">Cerrar Sesión</span>
        </button>

        <div className="pt-1.5 border-t border-white/5 text-center">
          <p className="text-[9px] text-slate-500 font-semibold tracking-wide">
            SoftPlus
          </p>
        </div>
      </div>
    </aside>
  );
};

const NavButton = ({ to, icon, label, isLocked }: { to: string, icon: any, label: string, isLocked?: boolean }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => 
      `w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-200 text-xs ${isActive ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 translate-x-0.5 font-black' : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-0.5 font-bold'}`
    }
  >
    {React.cloneElement(icon, { className: 'w-4 h-4 shrink-0' })}
    <span className="truncate flex-1">{label}</span>
    {isLocked && (
      <Lock className="w-3 h-3 text-amber-500/80 group-hover:text-amber-400 shrink-0" />
    )}
  </NavLink>
);

export default Sidebar;
