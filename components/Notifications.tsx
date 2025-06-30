
import React, { useEffect, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { GameNotification } from '../types';

const Notification: React.FC<{ notification: GameNotification }> = ({ notification }) => {
    const { dispatch } = useGameState();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            // Give it time to fade out before removing from state
            setTimeout(() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: { id: notification.id } }), 500);
        }, 4500);

        return () => clearTimeout(timer);
    }, [notification.id, dispatch]);

    const baseStyle = "w-full max-w-sm p-3 rounded-lg shadow-lg text-white mb-2 transition-all duration-500";
    const typeStyles = {
        success: 'bg-brand-green',
        warning: 'bg-brand-orange',
        error: 'bg-brand-red',
        info: 'bg-brand-blue',
    };

    return (
        <div className={`${baseStyle} ${typeStyles[notification.type]} ${visible ? 'animate-notification-fade' : 'opacity-0'}`}>
            <p className="font-semibold">{notification.message}</p>
        </div>
    );
};


const Notifications: React.FC = () => {
  const { state } = useGameState();

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
      {state.notifications.map((notif) => (
         <Notification key={notif.id} notification={notif} />
      ))}
    </div>
  );
};

export default Notifications;
