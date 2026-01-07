
export const notificationService = {
  requestPermission: async () => {
    if (!('Notification' in window)) {
      console.warn("Notifications not supported");
      return false;
    }
    if (Notification.permission === 'granted') return true;
    const status = await Notification.requestPermission();
    return status === 'granted';
  },

  send: (title: string, body: string) => {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      const n = new Notification(`SHADOWKEEP: ${title}`, { 
        body, 
        icon: 'https://img.icons8.com/ios-filled/100/ffffff/shield.png',
        silent: false,
        requireInteraction: false
      });
      
      n.onclick = () => {
        window.focus();
        n.close();
      };
    } else {
      console.warn("Notification permission not granted. Current status:", Notification.permission);
    }
  }
};
