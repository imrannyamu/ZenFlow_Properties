
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Banknote, PenLine, UserPlus, FileUp, CheckCircle2, ChevronRight, Inbox } from 'lucide-react';
import { Notification } from '../types';
import { useNavigate } from 'react-router-dom';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onMarkAsRead: (id: string) => void;
}

const getRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 172800) return 'Yesterday';
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
};

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'payment': return <Banknote className="text-emerald-600" size={20} />;
    case 'lease': return <PenLine className="text-blue-600" size={20} />;
    case 'inquiry': return <UserPlus className="text-amber-600" size={20} />;
    case 'document': return <FileUp className="text-purple-600" size={20} />;
    default: return <Inbox className="text-slate-400" size={20} />;
  }
};

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAllRead,
  onMarkAsRead
}) => {
  const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    onMarkAsRead(notification.id);
    onClose();
    navigate(notification.link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[110] flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Notification Center</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Activity Feed</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={onMarkAllRead}
                  className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors px-3 py-2 bg-emerald-50 rounded-xl"
                >
                  Mark all as read
                </button>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full text-left p-5 rounded-[2rem] border transition-all relative overflow-hidden group ${
                      n.isRead ? 'bg-white border-slate-100' : 'bg-emerald-50/30 border-emerald-100/50 shadow-sm'
                    } hover:border-emerald-200 hover:bg-white`}
                  >
                    {!n.isRead && (
                      <div className="absolute top-6 left-2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    )}
                    <div className="flex gap-4">
                      <div className={`p-3 rounded-2xl shrink-0 ${
                        n.isRead ? 'bg-slate-50' : 'bg-white shadow-sm'
                      }`}>
                        <NotificationIcon type={n.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h3 className={`text-sm font-black tracking-tight leading-tight truncate ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                            {n.title}
                          </h3>
                          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                            {getRelativeTime(n.timestamp)}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed line-clamp-2 ${n.isRead ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                          {n.message}
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={14} className="text-emerald-500" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="text-slate-900 font-black text-lg tracking-tight">System Zen</p>
                  <p className="text-slate-500 text-sm font-medium">No new notifications at this time.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Automated Intelligence Active</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDrawer;
