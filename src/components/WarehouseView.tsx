import React, { useState } from 'react';
import { Warehouse, Search, Scan, Package, CheckCircle, RefreshCcw, LayoutGrid } from 'lucide-react';
import { OrderCard } from './OrderCard';
import { Order } from '../types';
import { motion } from 'motion/react';

interface WarehouseViewProps {
  orders: Order[];
  onAction: (orderId: string, action: string) => void;
}

export const WarehouseView: React.FC<WarehouseViewProps> = ({ orders, onAction }) => {
  const [filter, setFilter] = useState('ALL');
  
  const filteredOrders = orders.filter(o => {
    // Only show orders that are part of a RETURN_AND_REFUND flow or were at least initiated for that
    if (o.afterSalesType === 'REFUND_ONLY') return false; 
    
    if (filter === 'PENDING') return o.status === 'RETURNING';
    return o.status === 'RETURNING' || o.status === 'COMPLETED';
  });

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Warehouse className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">中台仓储系统</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Logistics & Inventory</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setFilter('ALL')}
              className={`p-1.5 rounded-md ${filter === 'ALL' ? 'bg-white shadow-sm' : ''}`}
            >
              <LayoutGrid className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={() => setFilter('PENDING')}
              className={`p-1.5 rounded-md ${filter === 'PENDING' ? 'bg-white shadow-sm' : ''}`}
            >
              <RefreshCcw className="w-4 h-4 text-gray-600" title="待处理" />
            </button>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-200">
            <Scan className="w-4 h-4" /> 扫码退货
          </button>
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-gray-800">退货订单处理</h2>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 退货中 {orders.filter(o => o.status === 'RETURNING').length}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 已退款 {orders.filter(o => o.status === 'COMPLETED').length}
              </span>
            </div>
          </div>

          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div key={order.id} className="relative group">
                <OrderCard order={order} role="WAREHOUSE" onAction={onAction} />
                {order.returnLogisticsNumber && (
                  <div className="absolute top-4 right-4 bg-gray-900/5 px-2 py-1 rounded text-[10px] font-mono text-gray-500">
                    包裹: {order.returnLogisticsNumber}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 h-64 flex flex-col items-center justify-center text-gray-400">
              <Package className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-medium text-sm">当前无售后处理任务</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-500" /> 仓储概况
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">退货入库数</p>
                <p className="text-2xl font-black text-gray-900">{orders.filter(o => o.status === 'COMPLETED').length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">处理中任务</p>
                <p className="text-2xl font-black text-indigo-600">{orders.filter(o => o.status === 'RETURNING').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
            <h3 className="font-bold mb-2">智能面单识别</h3>
            <p className="text-indigo-100 text-xs mb-4 leading-relaxed">
              支持一键扫描退货面单，系统将自动映射并匹配原始发货单，实现毫秒级入库处理。
            </p>
            <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-xs font-bold border border-white/20">
              了解面单匹配逻辑
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
