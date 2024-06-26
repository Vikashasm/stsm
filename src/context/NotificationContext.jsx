import { getMessaging } from 'firebase/messaging';
import React, { createContext, useContext } from 'react';
import { messaging } from '../firebase';

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const sendNotification = async (type) => {
    const serverKey =
      'AAAA8fySoyk:APA91bGHLjXYPx8D5P2kBZHzJ6BnJHL3-5sz4S2pK4U4Cg-9EsoluUI-h9Dj-HvuXz6lNgnTGbCAaMWC6adijWKysPTpSEhamRnMy5QRcn8_wE-_tYLz3gQ0fWx34unTnCReFIwDCwoY'; // Your server key from Firebase settings

    let notificationBody;

    if (type === 'authorized') {
      notificationBody = {
        to: 'c-oHe1A9SOGAaL1LLHYIbG:APA91bGcy4yQsOAuWgcbe3h29jBvlu5e_XqZJUq0k3T2Zocx9KA4LiC0vHhCVYejVQw6fS6-kbPkCJZubuvwtNe5aQcJTAlN-ekWGHtR-M943jYxJo-7s9ECv0Y0e2LPoFDV17P5YrQl', // You can change this to a specific token or topic
        notification: {
          title: 'Authorization Status',
          body: 'You are authorized!',
        },
      };
    } else if (type === 'orderAccepted') {
      notificationBody = {
        to: 'c-oHe1A9SOGAaL1LLHYIbG:APA91bGcy4yQsOAuWgcbe3h29jBvlu5e_XqZJUq0k3T2Zocx9KA4LiC0vHhCVYejVQw6fS6-kbPkCJZubuvwtNe5aQcJTAlN-ekWGHtR-M943jYxJo-7s9ECv0Y0e2LPoFDV17P5YrQl', // You can change this to a specific token or topic
        notification: {
          title: 'Order Status',
          body: 'Your order was accepted!',
        },
      };
    } else {
      alert('Invalid notification type');
      return;
    }

    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${serverKey}`,
      },
      body: JSON.stringify(notificationBody),
    });
    console.log(await response.body.values());
    // console.log(response.body.getReader());
    // console.log(response.body.pipeThrough());
    // console.log(response.body.pipeTo());
    // console.log(response.body.tee());
    if (response.ok) {
      alert('Notification sent successfully!');
    } else {
      alert('Failed to send notification');
    }
  };

  return (
    <NotificationContext.Provider value={{ sendNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  return useContext(NotificationContext);
};

export { NotificationProvider, useNotification };
