export const getFullName = (user: { firstName?: string; lastName?: string; hideLastName?: boolean }) => {
  return user.firstName + (user.hideLastName ? '' : ` ${user.lastName || ''}`);
};
