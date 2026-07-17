'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, AlertCircle } from 'lucide-react';
import Button from './Button';
import { deliveryApi, ApiError, type PincodeCheckResponse } from '@/lib/api';

export function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<PincodeCheckResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (pincode.length !== 6) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await deliveryApi.checkPincode(pincode);
      setResult(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not check delivery for this pincode.');
    } finally {
      setLoading(false);
    }
  };

  const estimatedDate = result?.estimatedDeliveryDate
    ? new Date(result.estimatedDeliveryDate).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-text-primary text-sm flex items-center gap-2">
        <Truck className="w-4 h-4 text-zumbii-500" />
        Check Delivery
      </h4>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={pincode}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(0, 6);
            setPincode(v);
            setResult(null);
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          placeholder="Enter pincode"
          maxLength={6}
          className="flex-1 h-10 px-3 text-sm border border-border rounded-xl bg-surface-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100 transition-all"
        />
        <Button
          size="sm"
          onClick={handleCheck}
          disabled={pincode.length !== 6 || loading}
          loading={loading}
        >
          Check
        </Button>
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}
        {result && result.serviceable && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 rounded-xl bg-emerald-50 border border-emerald-200"
          >
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-emerald-800">Delivery by {estimatedDate}</p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  {result.city}, {result.state}
                </p>
                <p className="text-xs text-emerald-500 mt-0.5">
                  {result.codAvailable ? 'Cash on Delivery available' : 'Prepaid orders only'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
        {result && !result.serviceable && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800">
              Sorry, we currently don&apos;t deliver to this pincode.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
