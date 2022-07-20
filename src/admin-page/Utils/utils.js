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

export const pageDetail = (currentPage, data) => {
  let pageInfo = { start: 0, end: 0 };
  if (data?.length) {
    if (currentPage > Math.ceil(data?.length / 10)) {
      pageInfo.end = data.length;
      pageInfo.start = (currentPage - 2) * 10;
    } else {
      pageInfo.end =
        currentPage >= Math.ceil(data?.length / 10)
          ? data.length
          : currentPage * 10;
      pageInfo.start = (currentPage - 1) * 10;
    }
  }
  return pageInfo;
};
