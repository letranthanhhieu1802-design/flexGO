import React from 'react';
import { Bell, Check, ArrowRight, Truck, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { NotificationItem, CurrentView } from '../../types';

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onNavigate: (view: CurrentView) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onClose,
  onNavigate,
  onMarkAllAsRead,
}) => {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'quote_received':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'quote_accepted':
        return <CheckCircle2 className="w-4 h-4 text-indigo-600" />;
      case 'lead_new':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      default:
        return <Truck className="w-4 h-4 text-blue-600" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      id="notification-dropdown-panel"
      className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-sm text-slate-900">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            id="mark-all-read-btn"
            onClick={onMarkAllAsRead}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            No notifications right now
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              id={`notif-${notif.id}`}
              onClick={() => {
                if (notif.actionTarget) {
                  onNavigate(notif.actionTarget);
                  onClose();
                }
              }}
              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3 ${
                !notif.read ? 'bg-indigo-50/40' : ''
              }`}
            >
              <div className="mt-0.5 p-2 rounded-xl bg-white shadow-xs border border-slate-100 shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-semibold truncate ${!notif.read ? 'text-indigo-950' : 'text-slate-800'}`}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 ml-2" />
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {notif.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-slate-400 font-medium">{notif.timeAgo}</span>
                  {notif.actionTarget && (
                    <span className="text-[11px] font-semibold text-indigo-600 flex items-center hover:underline">
                      View details <ArrowRight className="w-3 h-3 ml-0.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
        <button 
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-800 font-medium"
        >
          Close panel
        </button>
      </div>
    </div>
  );
};
