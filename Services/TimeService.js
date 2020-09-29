exports.getCurrentTime = () => {
  const currentDate = new Date();

  let dd = currentDate.getDate();
  if (dd < 10) dd = "0" + dd;

  let mm = currentDate.getMonth() + 1;
  if (mm < 10) mm = "0" + mm;

  let yy = currentDate.getFullYear() % 100;
  if (yy < 10) yy = "0" + yy;

  const hh = currentDate.getHours();
  const min = currentDate.getMinutes();

  return dd + "." + mm + "." + yy + " " + hh + ":" + min;
};
