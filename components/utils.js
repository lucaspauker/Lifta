export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function convertTimestamp(t) {
  let a = new Date(t);
  let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let day = days[a.getDay()];
  let localeString = a.toLocaleString('en-US');
  let date = localeString.split(',')[0];
  let time = localeString.split(',')[1];
  let firstTime = time.split(':').slice(0, 2).join(':');
  let lastTime = time.split(' ')[2];
  return day + ', ' + date + ' @ ' + firstTime + ' ' + lastTime;
}

export function convertTimestampCondensed(t) {
  let a = new Date(t);
  let month = (a.getMonth() + 1).toString();
  let date = a.getDate().toString();
  let year = a.getFullYear().toString().slice(2);
  return month + '/' + date + '/' + year;
}

export function formatBigNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
