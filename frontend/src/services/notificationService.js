import axiosAuth from "./axiosAuth";

export const getUserNotifications = async (userId) => {
  const res = await axiosAuth.get(`/notifications/user/${userId}`);
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  await axiosAuth.patch(`/notifications/${id}/read`);
};
