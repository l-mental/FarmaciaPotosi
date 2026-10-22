import React, { useState, useMemo } from 'react';
import { 
  ArrowRightLeft, X, Building2, Package, Check, 
  ArrowRight, History, Printer, Search, AlertCircle, 
  CheckCircle2, ShieldCheck, Pill, ChevronRight, FileText
} from 'lucide-react';
import { Medication, StockTransfer } from '@/types';
import { DEFAULT_BRANCHES } from '@/constants';

interface StockTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  medications: Medication[];
  transfers: StockTransfer[];
  onTransfer: (params: {
    medicationId: string;
    fromBranch: string;
    toBranch: string;
    quantity: number;
    isBoxTransfer: boolean;
    lotNumber?: string;
    notes?: string;
  }) => { success: boolean; message: string; transfer?: StockTransfer };
  currencySymbol: string;
  currentUserRole?: string;
  initialMedicationId?: string;
}

export const StockTransferModal: React.FC<StockTransferModalProps> = ({
  isOpen,
  onClose,
  medications,
  transfers,
  onTransfer,
  currencySymbol,
  currentUserRole,
  initialMedicationId
}) => {
  const [activeTab, setActiveTab] = useState<'NEW' | 'HISTORY'>('NEW');
  const [selectedMedId, setSelectedMedId] = useState<string>(initialMedicationId || (medications[0]?.id || ''));
  const [searchMed, setSearchMed] = useState('');
  const [fromBranch, setFromBranch] = useState<string>(DEFAULT_BRANCHES[0] || 'Sucursal Central (Principal)');
  const [toBranch, setToBranch] = useState<string>(DEFAULT_BRANCHES[1] || 'Sucursal 2 (Norte)');
  const [isBoxTransfer, setIsBoxTransfer] = useState(false);
  const [quantity, setQuantity] = useState<number | ''>(50);
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedReceiptTransfer, setSelectedReceiptTransfer] = useState<StockTransfer | null>(null);

  // Sync initial medication if passed
  React.useEffect(() => {
    if (initialMedicationId) {
      setSelectedMedId(initialMedicationId);
    } else if (!selectedMedId && medications.length > 0) {
      setSelectedMedId(medications[0].id);
    }
  }, [initialMedicationId, medications]);

  const selectedMed = useMemo(() => {
    return medications.find(m => m.id === selectedMedId) || medications[0] || null;
  }, [medications, selectedMedId]);

  const isUnitOnlyMed = Boolean(selectedMed?.isUnitOnly || selectedMed?.unitsPerBox === 1);
  const unitsPerBox = selectedMed?.unitsPerBox || 1;

  // Filter medications for search selector
  const filteredMeds = useMemo(() => {
    if (!searchMed.trim()) return medications.slice(0, 10);
    const q = searchMed.toLowerCase().trim();
    return medications.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.genericName.toLowerCase().includes(q) ||
      (m.laboratory && m.laboratory.toLowerCase().includes(q))
    ).slice(0, 15);
  }, [medications, searchMed]);

  // Calculate current branch stock
  const isCentralOrigin = fromBranch.toLowerCase().includes('central') || fromBranch.toLowerCase().includes('principal');
  const isCentralDest = toBranch.toLowerCase().includes('central') || toBranch.toLowerCase().includes('principal');

  const originStockUnits = selectedMed 
    ? (selectedMed.branchStock?.[fromBranch]?.units ?? (isCentralOrigin ? selectedMed.stockUnits : 0))
    : 0;
  const originStockBoxes = selectedMed
    ? (selectedMed.branchStock?.[fromBranch]?.boxes ?? (isCentralOrigin ? selectedMed.stockBoxes : 0))
    : 0;

  const destStockUnits = selectedMed 
    ? (selectedMed.branchStock?.[toBranch]?.units ?? (isCentralDest ? selectedMed.stockUnits : 0))
    : 0;
  const destStockBoxes = selectedMed
    ? (selectedMed.branchStock?.[toBranch]?.boxes ?? (isCentralDest ? selectedMed.stockBoxes : 0))
    : 0;

  const numQuantity = typeof quantity === 'number' ? quantity : 0;
  const transferUnits = isBoxTransfer && !isUnitOnlyMed ? numQuantity * unitsPerBox : numQuantity;
  const transferBoxes = isUnitOnlyMed ? transferUnits : (isBoxTransfer ? numQuantity : Math.floor(transferUnits / unitsPerBox));

  // Projected new stock
  const projectedOriginUnits = Math.max(0, originStockUnits - transferUnits);
  const projectedOriginBoxes = isUnitOnlyMed ? projectedOriginUnits : Math.floor(projectedOriginUnits / unitsPerBox);

  const projectedDestUnits = destStockUnits + transferUnits;
  const projectedDestBoxes = isUnitOnlyMed ? projectedDestUnits : Math.floor(projectedDestUnits / unitsPerBox);

  const hasEnoughStock = originStockUnits >= transferUnits && transferUnits > 0;

  const handleSwapBranches = () => {
    const temp = fromBranch;
    setFromBranch(toBranch);
    setToBranch(temp);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMed) return;

    if (fromBranch === toBranch) {
      setFeedback({ type: 'error', message: 'La sucursal de origen y destino deben ser distintas.' });
      return;
    }

    if (!transferUnits || transferUnits <= 0) {
      setFeedback({ type: 'error', message: 'Ingresa una cantidad mayor a 0 para transferir.' });
      return;
    }

    if (!hasEnoughStock) {
      setFeedback({ 
        type: 'error', 
        message: `Stock insuficiente en ${fromBranch}. Solo dispone de ${isUnitOnlyMed ? `${originStockUnits} unidades` : `${originStockBoxes} cajas (${originStockUnits} unidades)`}.` 
      });
      return;
    }

    const res = onTransfer({
      medicationId: selectedMed.id,
      fromBranch,
      toBranch,
      quantity: numQuantity,
      isBoxTransfer: isBoxTransfer && !isUnitOnlyMed,
      notes: notes.trim()
    });

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setQuantity('');
      setNotes('');
      if (res.transfer) {
        setSelectedReceiptTransfer(res.transfer);
      }
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const printTransferReceipt = (transfer: StockTransfer) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor permite ventanas emergentes para imprimir el comprobante de traspaso.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Comprobante de Traspaso #${transfer.id}</title>
        <style>
          body { font-family: monospace, sans-serif; font-size: 12px; margin: 20px; color: #1e293b; }
          .header { text-align: center; border-bottom: 2px dashed #94a3b8; padding-bottom: 12px; margin-bottom: 16px; }
          .title { font-size: 16px; font-weight: bold; margin: 4px 0; }
          .field { margin: 6px 0; display: flex; justify-content: space-between; }
          .highlight { background: #f1f5f9; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; margin: 16px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
          .signatures { display: flex; justify-content: space-between; margin-top: 50px; text-align: center; }
          .signature-line { width: 40%; border-top: 1px solid #475569; padding-top: 5px; font-weight: bold; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="font-size: 20px; font-weight: 900; letter-spacing: 2px;">FARMA</div>
          <div class="title">COMPROBANTE DE TRASPASO DE SUCURSAL</div>
          <div>N° Control: <strong>${transfer.id}</strong></div>
          <div>Fecha: ${new Date(transfer.timestamp).toLocaleString('es-BO')}</div>
        </div>

        <div class="field"><span>Sucursal Origen (Sale):</span> <strong>${transfer.fromBranch}</strong></div>
        <div class="field"><span>Sucursal Destino (Entra):</span> <strong>${transfer.toBranch}</strong></div>
        <div class="field"><span>Responsable:</span> <strong>${transfer.responsibleUser}</strong></div>

        <div class="highlight">
          <div style="font-size: 14px; font-weight: 900; margin-bottom: 6px;">${transfer.medicationName}</div>
          <div class="field"><span>Cantidad Transferida:</span> <strong style="font-size: 14px; color: #0f172a;">${transfer.isBoxTransfer ? `${transfer.quantityBoxes} Cajas (${transfer.quantityUnits} unidades)` : `${transfer.quantityUnits} Unidades`}</strong></div>
          <div class="field"><span>Lote asignado:</span> <span>${transfer.lotNumber || 'N/A'}</span></div>
          ${transfer.notes ? `<div class="field"><span>Observaciones:</span> <em>${transfer.notes}</em></div>` : ''}
        </div>

        <div class="signatures">
          <div class="signature-line">Entrega (Origen)<br><span style="font-size: 9px; font-weight: normal;">Firma / Sello</span></div>
          <div class="signature-line">Recibe (Destino)<br><span style="font-size: 9px; font-weight: normal;">Firma / Sello</span></div>
        </div>

        <div class="footer">
          Documento interno de traspaso de inventario entre sucursales - FarmaPOS
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 md:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/40 rounded-2xl text-indigo-300">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-black tracking-tight">Traspaso entre Sucursales</h2>
                <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-black uppercase rounded-full">
                  Fácil y Rápido
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Pasa cajas o unidades de una sucursal a otra en segundos sin complicaciones.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('NEW')}
            className={`px-4 py-2.5 text-xs font-black border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'NEW'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Nuevo Traspaso</span>
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-4 py-2.5 text-xs font-black border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'HISTORY'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historial ({transfers.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 no-scrollbar space-y-4">
          
          {feedback && (
            <div className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold animate-in slide-in-from-top-2 duration-200 ${
              feedback.type === 'success' 
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}>
              <div className="flex items-center gap-2.5">
                {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span>{feedback.message}</span>
              </div>
              <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-700 ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === 'NEW' && (
            <form onSubmit={handleExecuteTransfer} className="space-y-4">
              
              {/* Step 1: Select Medication */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>1. Seleccionar Medicamento</span>
                  {selectedMed && (
                    <span className="text-[10px] text-indigo-600 font-bold">
                      {isUnitOnlyMed ? 'Manejo Solo Unidades' : `Caja de ${unitsPerBox} uds`}
                    </span>
                  )}
                </label>

                {/* Search / Dropdown Input */}
                <div className="relative">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                    <Search className="w-4 h-4 text-slate-400 ml-1.5 shrink-0" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre (ej: Flavical, Paracetamol, Jarabe)..."
                      value={searchMed}
                      onChange={(e) => setSearchMed(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none placeholder:text-slate-400"
                    />
                    {searchMed && (
                      <button type="button" onClick={() => setSearchMed('')} className="text-slate-400 hover:text-slate-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Suggestion List */}
                  {filteredMeds.length > 0 && searchMed.trim() && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-48 overflow-y-auto no-scrollbar p-1">
                      {filteredMeds.map((med) => (
                        <button
                          key={med.id}
                          type="button"
                          onClick={() => {
                            setSelectedMedId(med.id);
                            setSearchMed('');
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            selectedMedId === med.id ? 'bg-indigo-50 text-indigo-900 font-black' : 'hover:bg-slate-50 text-slate-700 font-bold'
                          }`}
                        >
                          <div>
                            <p className="font-black text-slate-800">{med.name}</p>
                            <p className="text-[10px] text-slate-400">{med.genericName} • {med.laboratory}</p>
                          </div>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg font-mono">
                            Stock: {med.stockUnits} uds
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Medication Card */}
                {selectedMed && (
                  <div className="bg-indigo-50/60 p-3 rounded-2xl border border-indigo-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-indigo-200 flex items-center justify-center shrink-0">
                        <Pill className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{selectedMed.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold">
                          {selectedMed.genericName} • {selectedMed.laboratory}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Stock Total Farma</span>
                      <span className="text-sm font-black text-indigo-900">
                        {isUnitOnlyMed ? `${selectedMed.stockUnits} uds` : `${selectedMed.stockBoxes} cajas (${selectedMed.stockUnits} uds)`}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Select Branches (From -> To) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  2. Sucursales (Origen y Destino)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-center">
                  
                  {/* Origin */}
                  <div className="sm:col-span-5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                      Sucursal Origen (DE DÓNDE SALE)
                    </span>
                    <select
                      value={fromBranch}
                      onChange={(e) => setFromBranch(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-black text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {DEFAULT_BRANCHES.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <div className="mt-2 text-xs flex justify-between font-bold">
                      <span className="text-slate-500">Stock Actual:</span>
                      <span className="text-slate-900 font-black">
                        {isUnitOnlyMed ? `${originStockUnits} uds` : `${originStockBoxes} cajas (${originStockUnits} uds)`}
                      </span>
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="sm:col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={handleSwapBranches}
                      className="p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-100 text-slate-600 transition-all shadow-sm active:scale-95"
                      title="Intercambiar origen y destino"
                    >
                      <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                    </button>
                  </div>

                  {/* Destination */}
                  <div className="sm:col-span-5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                      Sucursal Destino (A DÓNDE ENTRA)
                    </span>
                    <select
                      value={toBranch}
                      onChange={(e) => setToBranch(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-black text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {DEFAULT_BRANCHES.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <div className="mt-2 text-xs flex justify-between font-bold">
                      <span className="text-slate-500">Stock Actual:</span>
                      <span className="text-slate-900 font-black">
                        {isUnitOnlyMed ? `${destStockUnits} uds` : `${destStockBoxes} cajas (${destStockUnits} uds)`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Quantity & Mode (Units vs Boxes) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    3. Cantidad a Transferir
                  </label>

                  {!isUnitOnlyMed && (
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setIsBoxTransfer(false)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                          !isBoxTransfer ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
                        }`}
                      >
                        🧪 Por Unidades
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsBoxTransfer(true)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                          isBoxTransfer ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
                        }`}
                      >
                        📦 Por Cajas
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej: 300"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 bg-white border-2 border-slate-300 rounded-2xl text-base font-black text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 uppercase">
                    {isBoxTransfer && !isUnitOnlyMed ? 'Cajas' : 'Unidades'}
                  </span>
                </div>

                {/* Quick amount shortcut pills */}
                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] font-bold text-slate-400">Atajos rápidos:</span>
                  {(isBoxTransfer && !isUnitOnlyMed ? [5, 10, 20, 50] : [20, 50, 100, 300, 500]).map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setQuantity(val)}
                      className="px-2.5 py-0.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors"
                    >
                      {val} {isBoxTransfer && !isUnitOnlyMed ? 'cajas' : 'uds'}
                    </button>
                  ))}
                  {originStockUnits > 0 && (
                    <button
                      type="button"
                      onClick={() => setQuantity(isBoxTransfer && !isUnitOnlyMed ? originStockBoxes : originStockUnits)}
                      className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-bold ml-auto"
                    >
                      Todo el stock ({isBoxTransfer && !isUnitOnlyMed ? originStockBoxes : originStockUnits})
                    </button>
                  )}
                </div>
              </div>

              {/* Step 4: Live Projection Comparison Box (Like the user's example!) */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                    Previsualización del Traspaso
                  </span>
                  <span className="text-indigo-400 font-mono font-bold">
                    Traspaso: {transferUnits} unidades {(!isUnitOnlyMed && isBoxTransfer) ? `(${transferBoxes} cajas)` : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Origin After */}
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] text-rose-300 font-bold block mb-1">
                      {fromBranch} (Quedará en):
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-white">{projectedOriginUnits} uds</span>
                      {!isUnitOnlyMed && (
                        <span className="text-xs text-slate-300 font-bold">({projectedOriginBoxes} cajas)</span>
                      )}
                      <span className="text-[10px] font-bold text-rose-400 ml-auto">-{transferUnits} uds</span>
                    </div>
                  </div>

                  {/* Destination After */}
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] text-emerald-300 font-bold block mb-1">
                      {toBranch} (Aumentará a):
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-white">{projectedDestUnits} uds</span>
                      {!isUnitOnlyMed && (
                        <span className="text-xs text-slate-300 font-bold">({projectedDestBoxes} cajas)</span>
                      )}
                      <span className="text-[10px] font-bold text-emerald-400 ml-auto">+{transferUnits} uds</span>
                    </div>
                  </div>
                </div>

                {!hasEnoughStock && numQuantity > 0 && (
                  <p className="text-xs text-rose-400 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>La cantidad supera el stock disponible en la sucursal de origen ({originStockUnits} uds).</span>
                  </p>
                )}
              </div>

              {/* Optional Notes */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Nota u Observación (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej: Reposición de fin de semana, pedido urgente..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!hasEnoughStock || fromBranch === toBranch}
                  className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-black rounded-2xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Confirmar y Ejecutar Traspaso</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'HISTORY' && (
            <div className="space-y-3">
              {transfers.length === 0 ? (
                <div className="text-center py-12 text-slate-400 italic space-y-2">
                  <History className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                  <p className="text-xs font-bold">Aún no se han realizado traspasos entre sucursales.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {transfers.map((t) => (
                    <div 
                      key={t.id} 
                      className="p-3.5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-400">{t.id}</span>
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-[10px] text-slate-500 font-bold">
                            {new Date(t.timestamp).toLocaleString('es-BO')}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900">{t.medicationName}</h4>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <span className="text-rose-600">{t.fromBranch}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-emerald-600">{t.toBranch}</span>
                        </div>
                        {t.notes && <p className="text-[10px] text-slate-500 italic">"{t.notes}"</p>}
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                        <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-black text-indigo-900">
                          {t.isBoxTransfer ? `${t.quantityBoxes} Cajas (${t.quantityUnits} uds)` : `${t.quantityUnits} Unidades`}
                        </span>
                        <button
                          type="button"
                          onClick={() => printTransferReceipt(t)}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-1 transition-colors"
                        >
                          <Printer className="w-3 h-3 text-indigo-600" />
                          <span>Comprobante</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Receipt Confirmation Modal after Transfer */}
          {selectedReceiptTransfer && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-black text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Comprobante Generado #{selectedReceiptTransfer.id}
                </span>
                <button onClick={() => setSelectedReceiptTransfer(null)} className="text-emerald-700 hover:text-emerald-900">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-emerald-800">
                Se traspasaron con éxito {selectedReceiptTransfer.quantityUnits} unidades de "{selectedReceiptTransfer.medicationName}" a {selectedReceiptTransfer.toBranch}.
              </p>
              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => printTransferReceipt(selectedReceiptTransfer)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Comprobante de Traspaso</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceiptTransfer(null)}
                  className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold"
                >
                  Listo
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
