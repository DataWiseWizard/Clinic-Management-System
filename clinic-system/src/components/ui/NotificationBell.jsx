import { useState } from "react";
import { useNotifications } from "../../features/notifications/NotificationContext";

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (!isOpen) markAllRead();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button onClick={handleToggle} className="relative p-2 text-gray-600 hover:text-blue-600 transition">
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
            <h3 className="font-bold text-gray-700">Notifications</h3>
            <button onClick={() => setIsOpen(false)} className="text-xs text-gray-500 hover:text-gray-800">Close</button>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-400 text-sm">No new notifications.</p>
            ) : (
              notifications.map(note => (
                <div key={note.id} className={`p-3 border-b hover:bg-gray-50 ${note.read ? 'opacity-60' : 'bg-blue-50'}`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-gray-800">{note.title}</h4>
                    <span className="text-[10px] text-gray-400">{note.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{note.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}