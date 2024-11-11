import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/common/Button';

interface ConversionFormProps {
  onConvert: (amount: number, type: 'USDT' | 'USDC') => Promise<void>;
  maxAmount: number;
}

export const ConversionForm: React.FC<ConversionFormProps> = ({
  onConvert,
  maxAmount,
}) => {
  const { address } = useWallet();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'USDT' | 'USDC'>('USDT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !amount || isSubmitting) return;

    const numAmount = parseFloat(amount);
    if (numAmount <= 0 || numAmount > maxAmount) return;

    try {
      setIsSubmitting(true);
      await onConvert(numAmount, type);
      setAmount('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount (USD)
        </label>
        <div className="mt-1">
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            max={maxAmount}
            step="0.01"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="0.00"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Maximum amount: ${maxAmount.toFixed(2)}
        </p>
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Convert to
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as 'USDT' | 'USDC')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="USDT">USDT</option>
          <option value="USDC">USDC</option>
        </select>
      </div>

      <Button
        type="submit"
        disabled={!address || !amount || isSubmitting || parseFloat(amount) > maxAmount}
        className="w-full"
      >
        {isSubmitting ? 'Converting...' : 'Convert'}
      </Button>
    </form>
  );
};