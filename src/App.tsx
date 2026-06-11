/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { UserRole, Order, OrderStatus, AfterSalesType } from './types';
import { MOCK_ORDERS } from './mockData';
import { SalesView } from './components/SalesView';
import { CustomerView } from './components/CustomerView';
import { WarehouseView } from './components/WarehouseView';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, ShoppingBag, Warehouse, UserCircle2 } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<UserRole>('SALES');
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const handleAction = (orderId: string, action: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      if (action.startsWith('INITIATE_AFTER_SALES:')) {
        const type = action.split(':')[1] as AfterSalesType;
        if (type === 'REFUND_ONLY') {
          return { 
            ...order, 
            status: 'COMPLETED' as OrderStatus, 
            afterSalesType: type,
            completionTime: new Date().toLocaleString()
          };
        }
        return { ...order, status: 'AFTER_SALES_INITIATED' as OrderStatus, afterSalesType: type };
      }
      
      if (action.startsWith('SUBMIT_LOGISTICS:')) {
        const logisticsNumber = action.split(':')[1];
        return { 
          ...order, 
          status: 'RETURNING' as OrderStatus, 
          returnLogisticsNumber: logisticsNumber,
          returnTime: new Date().toLocaleString()
        };
      }

      if (action === 'RECEIVE_RETURN') {
        return { 
          ...order, 
          status: 'COMPLETED' as OrderStatus,
          receiveTime: new Date().toLocaleString(),
          completionTime: new Date().toLocaleString()
        };
      }

      return order;
    }));
  };

  return (
    <div className="h-screen w-full flex flex-col font-sans text-gray-900 overflow-hidden bg-white">
      {/* Role Switcher - Demo Helper */}
      <div className="bg-gray-900 text-white p-2 flex justify-center items-center gap-6 z-[100] border-b border-white/10 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
          Perspective Switch
        </span>
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
          <button 
            onClick={() => setRole('SALES')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${role === 'SALES' ? 'bg-cyan-500 text-white' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <ShoppingBag className="w-3 h-3" /> B-Sales
          </button>
          <button 
            onClick={() => setRole('CUSTOMER')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${role === 'CUSTOMER' ? 'bg-orange-500 text-white' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <UserCircle2 className="w-3 h-3" /> C-MiniApp
          </button>
          <button 
            onClick={() => setRole('WAREHOUSE')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${role === 'WAREHOUSE' ? 'bg-indigo-600 text-white' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <Warehouse className="w-3 h-3" /> B-Admin (Stock)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {role === 'SALES' && (
            <motion.div 
              key="sales"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="h-full w-full"
            >
              <SalesView orders={orders} onAction={handleAction} />
            </motion.div>
          )}

          {role === 'CUSTOMER' && (
            <motion.div 
              key="customer"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              className="h-full w-full"
            >
              <CustomerView orders={orders} onAction={handleAction} />
            </motion.div>
          )}

          {role === 'WAREHOUSE' && (
            <motion.div 
              key="warehouse"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="h-full w-full"
            >
              <WarehouseView orders={orders} onAction={handleAction} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Role-specific Navigation Bar - Only for Sales/Customer views for realism */}
      {role !== 'WAREHOUSE' && (
        <div className="bg-white border-t py-2 shrink-0 flex justify-around items-center max-w-md mx-auto w-full">
          <div className="flex flex-col items-center gap-1 grayscale opacity-50">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px]">商户</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-cyan-600">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-bold">订单</span>
          </div>
          <div className="flex flex-col items-center gap-1 grayscale opacity-50">
            <UserCircle2 className="w-5 h-5" />
            <span className="text-[10px]">我的</span>
          </div>
        </div>
      )}
    </div>
  );
}
