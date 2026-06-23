import React, { useState } from 'react';
import { Search, ChevronDown, ClipboardList } from 'lucide-react';
import { OrderCard } from './OrderCard';
import { Order } from '../types';

interface SalesViewProps {
  orders: Order[];
  onAction: (orderId: string, action: string) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({ orders, onAction }) => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [showTypeSelect, setShowTypeSelect] = useState<string | null>(null);
  
  const filteredOrders = orders.filter(o => {
    if (activeTab === 'SHIPPED') return o.status === 'SHIPPED';
    if (activeTab === 'AFTER_SALES') return (o.status === 'AFTER_SALES_INITIATED' || o.status === 'RETURNING' || o.status === 'RECEIVED') && o.status !== 'COMPLETED' && o.status !== 'UNPAID';
    if (activeTab === 'CLOSED') return o.status === 'COMPLETED' || o.status === 'UNPAID';
    return true;
  });

  const handleInitiate = (id: string, type: 'REFUND_ONLY' | 'RETURN_AND_REFUND') => {
    onAction(id, `INITIATE_AFTER_SALES:${type}`);
    setShowTypeSelect(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white p-4 pb-0 shadow-sm sticky top-0 z-10">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="搜索订单" 
            className="w-full bg-gray-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-black/5"
          />
        </div>
        
        <div className="flex justify-between items-center text-sm mb-4">
          {[
            { id: 'ALL', label: '待确认 10' },
            { id: 'PENDING', label: '待发货 24' },
            { id: 'SHIPPED', label: '已发货 16' },
            { id: 'AFTER_SALES', label: '售后' },
            { id: 'CLOSED', label: '已关闭' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 relative font-medium transition-colors ${isActive ? 'text-cyan-500' : 'text-gray-500'}`}
              >
                {tab.label}
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 rounded-full" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-600 mb-4 cursor-pointer">
          请选择仓库 <ChevronDown className="w-3 h-3" />
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="text-[11px] text-gray-400 mb-3 ml-1 uppercase tracking-tight font-medium">主理人: UNIBUY城市奥莱 (ID:15264)</div>
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              role="SALES" 
              onAction={(id) => setShowTypeSelect(id)} 
            />
          ))
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <ClipboardList className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm">暂无相关订单</p>
          </div>
        )}
      </div>

      {/* Type Selection Modal */}
      {showTypeSelect && (
        <div className="absolute inset-0 bg-black/40 z-[100] flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-6 pb-10">
            <h3 className="font-bold text-lg mb-4 text-center">选择售后方式</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleInitiate(showTypeSelect, 'REFUND_ONLY')}
                className="w-full py-4 border border-gray-100 bg-gray-50 rounded-xl text-left px-5 hover:bg-gray-100 transition-colors"
              >
                <div className="font-bold text-gray-900">仅退款</div>
                <div className="text-[10px] text-gray-400">未收到货，或与卖家协商同意前提下</div>
              </button>
              <button 
                onClick={() => handleInitiate(showTypeSelect, 'RETURN_AND_REFUND')}
                className="w-full py-4 border border-gray-100 bg-gray-50 rounded-xl text-left px-5 hover:bg-gray-100 transition-colors"
              >
                <div className="font-bold text-gray-900">退货退款</div>
                <div className="text-[10px] text-gray-400">已收到货，需要退还商品并退款</div>
              </button>
              <button 
                onClick={() => setShowTypeSelect(null)}
                className="w-full py-3 text-gray-400 text-sm font-medium mt-4"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
