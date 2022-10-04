export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function convertTimestamp(t) {
  let a = new Date(t);
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let day = days[a.getDay()];
  let month = (a.getMonth() + 1).toString();
  let date = a.getDate().toString();
  let year = a.getFullYear().toString().slice(2);

  let hours = a.getHours().toString();
  let suffix;
  if (hours > 11) {
    suffix = 'PM';
    if (hours > '12') {
      hours -= 12;
    }
  } else {
    suffix = 'AM';
  }
  let minutes = a.getMinutes().toString();

  return day + ', ' + month + '/' + date + '/' + year + ' @ ' + hours + ':' + minutes + ' ' + suffix;
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

