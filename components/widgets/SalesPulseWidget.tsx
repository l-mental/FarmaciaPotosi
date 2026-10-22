import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Calendar, DollarSign, ShoppingBag, 
  ChevronRight, X, Maximize2, Minimize2, 
  Store, QrCode, CreditCard, Clock, Sparkles, Filter, 
  CheckCircle2, AlertOctagon, BarChart3, ChevronDown
} from 'lucide-react';
import { SaleRecord, PharmacyInfo } from '@/types';

export type TimePeriod = 'DIA' | 'SEMANA' | 'MES' | 'BIMESTRE' | 'TRIMESTRE' | 'ANO';

export const TIME_PERIOD_LABELS: Record<TimePeriod, { label: string; short: string; days: number }> = {
  DIA: { label: 'Hoy (Día)', short: 'Día', days: 1 },
  SEMANA: { label: 'Esta Semana', short: 'Semana', days: 7 },
  MES: { label: 'Este Mes', short: 'Mes', days: 30 },
  BIMESTRE: { label: 'Bimestre (2 Meses)', short: 'Bimestre', days: 60 },
  TRIMESTRE: { label: 'Trimestre (3 Meses)', short: 'Trimestre', days: 90 },
  ANO: { label: 'Este Año', short: 'Año', days: 365 }
};

interface SalesPulseWidgetProps {
  sales: SaleRecord[];
  currencySymbol: string;
  pharmacyInfo?: PharmacyInfo;
  onViewSaleDetail?: (sale: SaleRecord) => void;
  className?: string;
}

export const SalesPulseWidget: React.FC<SalesPulseWidgetProps> = ({
  sales,
  currencySymbol,
  pharmacyInfo,
  onViewSaleDetail,
  className = ''
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('DIA');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Filter sales based on chosen period
  const { filteredSales, activeSales, voidedSales, totalRevenue, totalCount, averageTicket, byRegister, byPayment } = useMemo(() => {
    const now = new Date();
    const days = TIME_PERIOD_LABELS[selectedPeriod].days;
    
    // Calculate cutoff timestamp
    let cutoff: Date;
    if (selectedPeriod === 'DIA') {
      cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    } else {
      cutoff = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    }

    const filtered = sales.filter(s => {
      const saleDate = new Date(s.timestamp);
      return !isNaN(saleDate.getTime()) && saleDate >= cutoff;
    });

    const active = filtered.filter(s => s.status !== 'ANULADA');
    const voided = filtered.filter(s => s.status === 'ANULADA');

    const rev = active.reduce((acc, s) => acc + (s.total || 0), 0);
    const count = active.length;
    const avg = count > 0 ? rev / count : 0;

    // Registers
    const c1 = active.filter(s => (s.cashRegister || 'Caja 1') === 'Caja 1');
    const c2 = active.filter(s => s.cashRegister === 'Caja 2');

    // Payment methods
    const cash = active.filter(s => s.paymentMethod === 'CASH').reduce((a, s) => a + s.total, 0);
    const qr = active.filter(s => s.paymentMethod === 'QR').reduce((a, s) => a + s.total, 0);
    const card = active.filter(s => s.paymentMethod === 'CARD').reduce((a, s) => a + s.total, 0);

    return {
      filteredSales: filtered,
      activeSales: active,
      voidedSales: voided,
      totalRevenue: rev,
      totalCount: count,
      averageTicket: avg,
      byRegister: {
        caja1Count: c1.length,
        caja1Total: c1.reduce((a, s) => a + s.total, 0),
        caja2Count: c2.length,
        caja2Total: c2.reduce((a, s) => a + s.total, 0)
      },
      byPayment: { cash, qr, card }
    };
  }, [sales, selectedPeriod]);

  return (
    <>
      {/* 1. Tarjeta compacta persistente (no incisiva, siempre visible en pantalla) */}
      <div className={`transition-all duration-300 ${className}`}>
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-full shadow-lg border border-emerald-500/30 text-xs font-black hover:bg-slate-800 transition-all active:scale-95"
            title="Expandir tarjeta de ventas"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ventas {TIME_PERIOD_LABELS[selectedPeriod].short}:</span>
            <span className="text-emerald-400 font-mono">{currencySymbol}{totalRevenue.toFixed(0)}</span>
          </button>
        ) : (
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md transition-all p-3 space-y-2 text-slate-800 max-w-sm">
            {/* Header: Title + Period switcher + minimize */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 truncate">
                  Ventas: {TIME_PERIOD_LABELS[selectedPeriod].short}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black transition-colors"
                  title="Abrir ventana emergente con reporte completo"
                >
                  Ver Más ↗
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
                  title="Minimizar tarjeta"
                >
                  <Minimize2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Quick Metrics display */}
            <div className="flex items-baseline justify-between pt-0.5">
              <div>
                <span className="text-lg md:text-xl font-black text-slate-900 font-mono tracking-tight">
                  {currencySymbol}{totalRevenue.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                  {totalCount} {totalCount === 1 ? 'venta' : 'ventas'}
                </span>
              </div>
            </div>

            {/* Sub metrics: Ticket promedio y cajas */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 pt-1 border-t border-slate-100">
              <div className="truncate">
                Promedio: <span className="text-slate-800">{currencySymbol}{averageTicket.toFixed(2)}</span>
              </div>
              <div className="text-right truncate">
                C1: <span className="text-slate-800">{currencySymbol}{byRegister.caja1Total.toFixed(0)}</span> • C2: <span className="text-slate-800">{currencySymbol}{byRegister.caja2Total.toFixed(0)}</span>
              </div>
            </div>

            {/* Configurable Period Selectors (Día, Semana, Mes, Bimestre, Trimestre, Año) */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
              {(Object.keys(TIME_PERIOD_LABELS) as TimePeriod[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all shrink-0 ${
                    selectedPeriod === p 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {TIME_PERIOD_LABELS[p].short}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Ventana emergente con el desglose detallado de ventas */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-4 md:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-emerald-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base md:text-xl font-black tracking-tight">Monitor y Desglose de Ventas</h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Panel interactivo de volumen de facturación configurable por periodo.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Period selector tabs inside modal */}
            <div className="bg-slate-50 border-b border-slate-200 p-3 md:px-6 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider whitespace-nowrap">
                Periodo a evaluar:
              </span>
              <div className="flex items-center gap-1.5">
                {(Object.keys(TIME_PERIOD_LABELS) as TimePeriod[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPeriod(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                      selectedPeriod === p 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {TIME_PERIOD_LABELS[p].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 md:p-6 overflow-y-auto flex-1 no-scrollbar space-y-5">
              
              {/* Stat Cards 4-grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-emerald-50/60 border border-emerald-200/80 p-3.5 rounded-2xl">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block mb-1">Total Facturado</span>
                  <span className="text-xl md:text-2xl font-black text-emerald-950 font-mono">
                    {currencySymbol}{totalRevenue.toFixed(2)}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Ventas Realizadas</span>
                  <span className="text-xl md:text-2xl font-black text-slate-900">
                    {totalCount} <span className="text-xs font-bold text-slate-400">trans.</span>
                  </span>
                </div>

                <div className="bg-blue-50/60 border border-blue-200/80 p-3.5 rounded-2xl">
                  <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider block mb-1">Ticket Promedio</span>
                  <span className="text-xl md:text-2xl font-black text-blue-950 font-mono">
                    {currencySymbol}{averageTicket.toFixed(2)}
                  </span>
                </div>

                <div className="bg-purple-50/60 border border-purple-200/80 p-3.5 rounded-2xl">
                  <span className="text-[10px] font-black text-purple-800 uppercase tracking-wider block mb-1">Ventas Anuladas</span>
                  <span className="text-xl md:text-2xl font-black text-purple-950">
                    {voidedSales.length} <span className="text-xs font-bold text-purple-400">anuladas</span>
                  </span>
                </div>
              </div>

              {/* Point of sale breakdown (Caja 1 vs Caja 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-2">
                      <Store className="w-4 h-4 text-emerald-600" />
                      Caja 1
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      {byRegister.caja1Count} ventas
                    </span>
                  </div>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    {currencySymbol}{byRegister.caja1Total.toFixed(2)}
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${totalRevenue > 0 ? (byRegister.caja1Total / totalRevenue) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-2">
                      <Store className="w-4 h-4 text-blue-600" />
                      Caja 2
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      {byRegister.caja2Count} ventas
                    </span>
                  </div>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    {currencySymbol}{byRegister.caja2Total.toFixed(2)}
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all"
                      style={{ width: `${totalRevenue > 0 ? (byRegister.caja2Total / totalRevenue) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment methods breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                  Distribución por Métodos de Pago
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Efectivo</span>
                    <span className="font-black text-slate-900 font-mono">{currencySymbol}{byPayment.cash.toFixed(2)}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Pago QR</span>
                    <span className="font-black text-emerald-700 font-mono">{currencySymbol}{byPayment.qr.toFixed(2)}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Tarjeta</span>
                    <span className="font-black text-purple-700 font-mono">{currencySymbol}{byPayment.card.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Recent sales in this period */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    Transacciones en este periodo ({filteredSales.length})
                  </span>
                </div>

                {filteredSales.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 italic text-xs font-bold">
                    No se registran ventas en este periodo seleccionado ({TIME_PERIOD_LABELS[selectedPeriod].label}).
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto no-scrollbar border border-slate-200 rounded-2xl bg-white">
                    {filteredSales.map((s) => (
                      <div 
                        key={s.id}
                        onClick={() => onViewSaleDetail?.(s)}
                        className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg text-white font-mono text-[10px] font-bold ${
                            s.status === 'ANULADA' ? 'bg-rose-500' : 'bg-emerald-600'
                          }`}>
                            {s.cashRegister || 'C1'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900">{s.customerName || 'Venta General'}</span>
                              {s.status === 'ANULADA' && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-rose-100 text-rose-800">
                                  ANULADA
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(s.timestamp).toLocaleDateString('es-BO')} {new Date(s.timestamp).toLocaleTimeString('es-BO')} • {s.paymentMethod}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-2">
                          <span className={`font-black font-mono ${s.status === 'ANULADA' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {currencySymbol}{s.total.toFixed(2)}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-xl transition-all"
              >
                Cerrar Monitor
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
