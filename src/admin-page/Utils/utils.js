// for making first letter capital
export const capitalizeFirstLetter = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

export const filterUser = (data, search) => {
  return data?.filter(
    (user) =>
      user.name.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
  );
};
