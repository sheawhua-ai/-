import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Truck, User, Search, ArrowLeft, Package, CheckCircle, RefreshCcw, ClipboardList, Warehouse } from 'lucide-react';
import { Order, UserRole, OrderStatus } from '../types';

interface OrderCardProps {
  order: Order;
  role: UserRole;
  onAction: (orderId: string, action: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, role, onAction }) => {
  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'UNPAID': return '待支付';
      case 'SHIPPED': return '已发货';
      case 'AFTER_SALES_INITIATED': return '待退货';
      case 'RETURNING': return '退货中';
      case 'RECEIVED': return '已入库';
      case 'COMPLETED': return '已退款';
      default: return status;
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4"
    >
      <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-2">
          <span className="bg-black/5 text-[10px] px-2 py-0.5 rounded font-medium text-gray-600">供应商: {order.vendorName} (ID:{order.vendorId})</span>
          {order.afterSalesType && (
            <span className="bg-orange-50 text-[10px] px-2 py-0.5 rounded font-bold text-orange-600 border border-orange-100 italic">
              {order.afterSalesType === 'REFUND_ONLY' ? '仅退款' : '退货退款'}
            </span>
          )}
          <span className="text-[10px] text-gray-400">{order.createTime}下单</span>
        </div>
        <span className={`text-[11px] font-medium ${order.status === 'SHIPPED' ? 'text-orange-500' : 'text-blue-500'}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="p-4 flex gap-4">
        <img src={order.productImage} alt={order.productName} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" referrerPolicy="no-referrer" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{order.productName}</h3>
          <p className="text-xs text-gray-500 mt-1">{order.sku}</p>
          <div className="mt-2 flex justify-between items-end">
            <span className="text-sm font-semibold text-gray-900">¥ {order.price}</span>
            <span className="text-xs text-gray-400 font-mono">x{order.quantity}</span>
          </div>
        </div>
      </div>

      {order.returnLogisticsNumber && (
        <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center text-[10px]">
          <span className="text-gray-400">退货物流单号:</span>
          <span className="font-mono text-gray-600 font-bold select-all">{order.returnLogisticsNumber}</span>
        </div>
      )}

      <div className="px-4 py-3 border-t border-gray-50 flex justify-between items-center">
        <div className="text-[11px] text-gray-500">共{order.quantity}件 总计: <span className="text-sm font-bold text-gray-900">¥ {order.price * order.quantity}</span></div>
        <div className="flex gap-2">
          {role === 'SALES' && order.status === 'SHIPPED' && (
            <button 
              onClick={() => onAction(order.id, 'INITIATE_AFTER_SALES')}
              className="px-4 py-1.5 bg-cyan-500 text-white text-xs rounded-full hover:bg-cyan-600 transition-colors font-medium"
            >
              退款
            </button>
          )}
          
          {role === 'CUSTOMER' && order.status === 'AFTER_SALES_INITIATED' && (
            <button 
              onClick={() => onAction(order.id, 'RETURN_LOGISTICS')}
              className="px-4 py-1.5 bg-orange-500 text-white text-xs rounded-full hover:bg-orange-600 transition-colors font-medium"
            >
              填写退货单
            </button>
          )}

          {role === 'WAREHOUSE' && (order.status === 'RETURNING' || order.status === 'RECEIVED') && (
            <button 
              onClick={() => onAction(order.id, 'RECEIVE_RETURN')}
              className="px-4 py-1.5 bg-green-500 text-white text-xs rounded-full hover:bg-green-600 transition-colors font-medium"
            >
              退货入库
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
