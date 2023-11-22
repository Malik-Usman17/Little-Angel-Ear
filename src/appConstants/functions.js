export const captilalizeFirstLetter = (word) => {
  const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
  return capitalizedWord
}


export const DateFormat = (date) => {
  var monthName = date.getMonth() + 1
  monthName = monthName < 10 ? '0' + monthName : monthName
  var Dated = date.getDate()
  Dated = Dated < 10 ? '0' + Dated : Dated
  var year = date.getFullYear();
  return `${Dated}-${monthName}-${year}`
}


export const compareDates = (appDataDate, serverDataDate) => {
  if (appDataDate.getTime() > serverDataDate.getTime()) {
    return true
  }
  else {
    return false
  }
}