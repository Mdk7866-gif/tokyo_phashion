import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BuyNowProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  totalAmount: number;
  userProfile: any; // Must include mobile_no, username, address
}

const BuyNow: React.FC<BuyNowProps> = ({ isOpen, onClose, items, totalAmount, userProfile }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // Enforce profile completion
  React.useEffect(() => {
    if (isOpen && (!userProfile.username || !userProfile.address?.full_address || !userProfile.mobile_no)) {
      alert("Your profile is incomplete. Please provide your Name, Mobile Number, and Address before placing an order.");
      onClose();
      router.push('/account?tab=profile');
    }
  }, [isOpen, userProfile, router, onClose]);

  if (!isOpen) return null;

  const handleCOD = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/saveordereddata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile_no: userProfile.mobile_no,
          customer_name: userProfile.username,
          items: items,
          user_address: userProfile.address,
          total_amount: totalAmount,
          delivery_type: 'COD'
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Order placed successfully via Cash on Delivery!');
        onClose();
        router.push('/account?tab=orders');
      } else {
        alert(data.error || 'Failed to place order.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while placing the order.');
    } finally {
      setLoading(false);
    }
  };

  const handleOnline = () => {
    alert('Online payment integration coming soon!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-black transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-6 text-center">Complete Purchase</h2>
          
          <div className="mb-8 p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Total Amount</span>
              <span className="text-2xl font-black text-black">₹{totalAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Items</span>
              <span className="text-sm font-bold text-black">{items.length}</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase text-center mb-2">Select Payment Method</p>
            
            <button 
              onClick={handleCOD}
              disabled={loading}
              className="w-full bg-black text-white h-16 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <span>PROCESSING...</span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg>
                  Cash on Delivery
                </>
              )}
            </button>

            <button 
              onClick={handleOnline}
              disabled={loading}
              className="w-full bg-white text-black border-2 border-zinc-200 h-16 rounded-xl font-bold text-xs tracking-widest uppercase hover:border-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              Pay via Online
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
