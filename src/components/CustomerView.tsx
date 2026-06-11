import React, { useState } from 'react';
import { ArrowLeft, MoreHorizontal, Minus, Circle, User, Package, Truck, CheckCircle2, QrCode, RefreshCcw } from 'lucide-react';
import { OrderCard } from './OrderCard';
import { Order, OrderStatus, AfterSalesType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerViewProps {
  orders: Order[];
  onAction: (orderId: string, action: string) => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({ orders, onAction }) => {
  const [showLogisticsModal, setShowLogisticsModal] = useState<string | null>(null);
  const [logisticsNumber, setLogisticsNumber] = useState('');

  const handleAction = (id: string, action: string) => {
    if (action === 'RETURN_LOGISTICS') {
      setShowLogisticsModal(id);
    } else {
      onAction(id, action);
    }
  };

  const handleLogisticsSubmit = () => {
    if (showLogisticsModal && logisticsNumber) {
      onAction(showLogisticsModal, `SUBMIT_LOGISTICS:${logisticsNumber}`);
      setShowLogisticsModal(null);
      setLogisticsNumber('');
    }
  };

  // Status mapping for progress indicator
  const getProgress = (status: OrderStatus, type?: AfterSalesType) => {
    if (type === 'REFUND_ONLY') {
      const steps = [
        { id: 'SHIPPED', label: '已收货', icon: Truck },
        { id: 'REFUNDING', label: '退款中', icon: RefreshCcw },
        { id: 'COMPLETED', label: '已退款', icon: CheckCircle2 },
      ];
      let currentIdx = status === 'COMPLETED' ? 2 : 1;
      return { steps, currentIdx };
    }

    const steps = [
      { id: 'SHIPPED', label: '已发货', icon: Truck },
      { id: 'AFTER_SALES_INITIATED', label: '待寄回', icon: Package },
      { id: 'RETURNING', label: '退货中', icon: QrCode },
      { id: 'COMPLETED', label: '已退款', icon: CheckCircle2 },
    ];
    
    let currentIdx = 0;
    if (status === 'AFTER_SALES_INITIATED') currentIdx = 1;
    else if (status === 'RETURNING' || status === 'RECEIVED') currentIdx = 2;
    else if (status === 'COMPLETED') currentIdx = 3;
    
    return { steps, currentIdx };
  };

  const mainOrder = orders[0];
  const { steps, currentIdx } = getProgress(mainOrder?.status || 'SHIPPED', mainOrder?.afterSalesType);

  return (
    <div className="flex flex-col h-full bg-gray-50 max-w-md mx-auto relative overflow-hidden flex-1">
      {/* MiniApp Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 border-b border-gray-50">
        <ArrowLeft className="w-5 h-5 text-gray-700" />
        <span className="font-bold text-sm">订单详情</span>
        <div className="flex items-center gap-3">
          <MoreHorizontal className="w-5 h-5 text-gray-700" />
          <div className="flex gap-1 border border-gray-200 rounded-full py-1.5 px-3 items-center bg-gray-50">
            <Minus className="w-3.5 h-3.5 text-gray-400" />
            <Circle className="w-2.5 h-2.5 fill-gray-900" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Status Section */}
        <div className="bg-gray-900 p-6 text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold mb-1">
                {mainOrder?.status === 'SHIPPED' ? '卖家已发货' : 
                 mainOrder?.status === 'AFTER_SALES_INITIATED' ? '请您寄回商品' : 
                 mainOrder?.status === 'COMPLETED' ? (mainOrder.afterSalesType === 'REFUND_ONLY' ? '已退款' : '退款已完成') : '退货处理中'}
              </h2>
              <p className="text-[10px] text-gray-400 font-mono opacity-80">NO. {mainOrder?.orderNumber}</p>
            </div>
            <Truck className="w-8 h-8 opacity-40" />
          </div>

          {/* Stepper Implementation */}
          <div className="relative pt-2 pb-4">
            <div className="absolute top-[18px] left-0 right-0 h-0.5 bg-white/20" />
            <div 
              className="absolute top-[18px] left-0 h-0.5 bg-cyan-400 transition-all duration-700" 
              style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }} 
            />
            
            <div className="flex justify-between relative z-10">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCurrent ? 'bg-cyan-400 border-cyan-400 text-gray-900 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 
                      isActive ? 'bg-white border-white text-gray-900' : 'bg-gray-800 border-gray-700 text-gray-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] mt-2 font-medium ${isActive ? 'text-white' : 'text-gray-600'}`}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 -mt-4">
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 shadow-inner">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-gray-900">{mainOrder?.customerName}</span>
                  <span className="text-xs text-gray-500 font-mono">{mainOrder?.customerPhone}</span>
                </div>
                <p className="text-xs text-gray-500 leading-tight">{mainOrder?.address}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} role="CUSTOMER" onAction={handleAction} />
            ))}
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center text-xs border-b border-gray-50 pb-3 mb-3">
              <span className="text-gray-400">商户备注</span>
              <span className="text-gray-800 font-medium">请保持商品吊牌完好</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">订单流水</span>
              <span className="text-gray-400 font-mono">{mainOrder?.createTime} 下单成功</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t p-4 flex justify-end gap-3 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
        <button className="px-6 py-2 border border-gray-100 rounded-full text-xs font-bold text-gray-600 active:bg-gray-50">查看物流</button>
        <button className="px-6 py-2 bg-gray-900 text-white rounded-full text-xs font-bold active:scale-95 transition-transform">联系客服</button>
      </div>

      {/* Logistics Entry Modal */}
      <AnimatePresence>
        {showLogisticsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-[100] flex items-end justify-center px-4"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full rounded-t-3xl p-6 pb-12 max-w-md shadow-2xl"
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-black mb-1">填写退货物流</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">系统将自动同步给当前卖家及仓库管理人员，请务必核对正确。</p>
              
              <div className="space-y-4">
                <div className="relative">
                  <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="请输入快递单号 (例: SF123...)" 
                    value={logisticsNumber}
                    onChange={(e) => setLogisticsNumber(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setShowLogisticsModal(null)}
                  className="flex-1 py-4 bg-gray-100 rounded-2xl text-sm font-bold text-gray-500 active:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button 
                  disabled={!logisticsNumber}
                  onClick={handleLogisticsSubmit}
                  className="flex-1 py-4 bg-orange-500 text-white shadow-xl shadow-orange-100 rounded-2xl text-sm font-bold disabled:opacity-30 active:scale-95 transition-all"
                >
                  确认提交
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-[60px]" /> {/* Spacer for tab bar if needed */}
    </div>
  );
};
