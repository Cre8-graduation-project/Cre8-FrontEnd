import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, delay) => {
  let waiting = false;
  return (...args) => {
    if(!waiting) {
      func(...args);
      waiting = true;
      setTimeout(() => { waiting = false }, delay);
    }
  }
}

export const isEmpty = (input) => {
  if (
       typeof input === "undefined" ||
       input === null ||
       input === "" ||
       input === "null" ||
       input.length === 0 ||
       (typeof input === "object" && !Object.keys(input).length)
      )
  {
      return true;
  }
  else return false;
}

export const isFileSizeUnderLimit = (file, limit = 3 * 1024 * 1024) => {
  return file.size < limit;
}

export const areArraysEqual = (a, b) => {
  a.length === b.length && a.every((value, index) => value === b[index]);
}

export const dateTimeExtractor = (dateTimeString) => {
  if(dateTimeString == null) return null;

  const regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
  const match = dateTimeString.match(regex);

  if (match) {
    const [_, year, month, day, hour, minute] = match;
    return { 
      year, month, day, hour, minute,  
      fullString: `${year}-${month}-${day} ${hour}:${minute}`
    };
  } else {
    return null;
  }
}

export const getAMPMTime = (dateTimeString) => {
  if(dateTimeString == null) return null;

  const hours = dateTimeExtractor(dateTimeString).hour;
  const minutes = dateTimeExtractor(dateTimeString).minute;
  const ampm = hours >= 12 ? '오후' : '오전';
  const formattedHours = hours % 12 || 12;
  return `${ampm} ${formattedHours}:${minutes.toString().padStart(2, '0')}`;
}

export const getDateString = (dateTimeString) => {
  if(dateTimeString == null) return null;

  const dateTime = dateTimeExtractor(dateTimeString);
  return `${dateTime.year}년 ${dateTime.month}월 ${dateTime.day}일`;
}

export const timeSince = (timestamp) => {
  if(timestamp == null) return null;

  return formatDistanceToNow(
    new Date(timestamp), 
    { addSuffix: true, locale: ko }
  );
};