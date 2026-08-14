import API from "./api";

export const getNotifications = () => {
  return API.get("/notifications");
};

export const getUnreadNotifications = () => {
  return API.get("/notifications/unread");
};

export const getUnreadCount = () => {
  return API.get("/notifications/unread-count");
};

export const markNotificationRead = (id) => {
  return API.put(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = () => {
  return API.put("/notifications/read-all");
};
