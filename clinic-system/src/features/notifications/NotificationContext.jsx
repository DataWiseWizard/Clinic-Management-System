import { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const addNotification = (title, message, type = "info") => {
        const newNote = {
            id: Date.now(),
            title,
            message,
            type,
            timestamp: new Date(),
            read: false
        };

        setNotifications(prev => [newNote, ...prev]);
        setUnreadCount(prev => prev + 1);

        if (Notification.permission === "granted" && document.hidden) {
            new Notification(title, { body: message });
        }
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    useEffect(() => {
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext);