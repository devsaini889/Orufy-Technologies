import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function ActionModal({ type, product, onClose, onConfirm }) {
  const [editName, setEditName] = useState(product?.name || '');
  const [editPrice, setEditPrice] = useState(product?.price || '');

  return (
    <div class="fixed inset-0 bg-neutral-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
      <div class="bg-white w-full max-w-md rounded-2xl border border-[var(--border)] p-6 shadow-2xl relative space-y-4">
        
        <button onClick={onClose} class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>

        {type === 'EDIT' ? (
          <>
            <div>
              <h3 class="text-lg font-bold text-gray-900">017. Edit Product Specifications</h3>
              <p class="text-xs text-[var(--muted)]">Update catalog items dynamically down to the database row layer.</p>
            </div>
            <div class="space-y-3">
              <div class="space-y-1">
                <label class="block text-xs font-semibold text-gray-700 uppercase">Product Label</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} class="w-full px-3 py-2 border border-[var(--border)] rounded-xl text-sm" />
              </div>
              <div class="space-y-1">
                <label class="block text-xs font-semibold text-gray-700 uppercase">Valuation (USD)</label>
                <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} class="w-full px-3 py-2 border border-[var(--border)] rounded-xl text-sm" />
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <button onClick={onClose} class="flex-1 border border-[var(--border)] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => onConfirm({ ...product, name: editName, price: editPrice })} class="flex-1 bg-neutral-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-800">Save Configuration</button>
            </div>
          </>
        ) : (
          <>
            <div class="text-center p-2 space-y-3">
              <div class="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">018. Confirm Product Destruction</h3>
                <p class="text-xs text-[var(--muted)] mt-1">Are you sure you want to drop <span class="font-semibold text-gray-900">"{product?.name}"</span>? This action cannot be undone.</p>
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <button onClick={onClose} class="flex-1 border border-[var(--border)] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Discard</button>
              <button onClick={() => onConfirm()} class="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-700">Confirm Deletion</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}