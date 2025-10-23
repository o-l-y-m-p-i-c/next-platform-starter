import { useEffect, useState } from 'react';

export const getTimeSince = (date: Date): string => {
  const now = new Date();
  const dataDate = new Date(date);
  const seconds = Math.floor((now.getTime() - dataDate.getTime()) / 1000); // difference in seconds

  let interval = Math.floor(seconds / (60 * 60 * 24)); // difference in days
  if (interval >= 1) {
    return interval === 1 ? interval + ' day ago' : interval + ' days ago';
  }

  interval = Math.floor(seconds / (60 * 60)); // difference in hours
  if (interval >= 1) {
    return interval === 1 ? interval + ' hour ago' : interval + ' hours ago';
  }

  interval = Math.floor(seconds / 60); // difference in minutes
  if (interval >= 1) {
    return interval === 1
      ? interval + ' minute ago'
      : interval + ' minutes ago';
  }

  // If less than a minute has passed, return seconds

  if (seconds < 0) {
    return 0 + ' seconds ago';
  }

  return seconds === 1 ? seconds + ' second ago' : seconds + ' seconds ago';
};

const getTimeSinceWithTimer = (
  date: Date,
): { time: number; getFullString: (arg: number) => string } => {
  const now = new Date();
  const dataDate = new Date(date);
  const seconds = Math.floor((now.getTime() - dataDate.getTime()) / 1000) + 1;

  let interval = Math.floor(seconds / (60 * 60 * 24)); // difference in days
  if (interval >= 1) {
    return {
      time: interval,
      getFullString: (arg: number): string =>
        arg === 1 ? `${arg} day ago` : `${arg} days ago`,
    };
  }

  interval = Math.floor(seconds / (60 * 60)); // difference in hours
  if (interval >= 1) {
    return {
      time: interval,
      getFullString: (arg: number): string =>
        arg === 1 ? `${arg} hour ago` : `${arg} hours ago`,
    };
  }

  interval = Math.floor(seconds / 60); // difference in minutes
  if (interval >= 1) {
    return {
      time: interval,
      getFullString: (arg: number): string =>
        arg === 1 ? `${arg} minute ago` : `${arg} minutes ago`,
    };
  }

  return {
    time: seconds,
    getFullString: (arg: number): string =>
      arg === 1 ? `${arg} second ago` : `${arg} seconds ago`,
  };
};

export const getShortTimeSinceWithTimer = (
  date: Date,
): { time: number; getFullString: (arg: number) => string } => {
  const now = new Date();
  const dataDate = new Date(date);
  const seconds = Math.floor((now.getTime() - dataDate.getTime()) / 1000) + 1;

  let interval = Math.floor(seconds / (60 * 60 * 24)); // difference in days
  if (interval >= 1) {
    return {
      time: interval,
      getFullString: (arg: number): string =>
        arg === 1 ? `${arg}d ago` : `${arg}d ago`,
    };
  }

  interval = Math.floor(seconds / (60 * 60)); // difference in hours
  if (interval >= 1) {
    return {
      time: interval,
      getFullString: (arg: number): string => `${arg}h ago`,
    };
  }

  interval = Math.floor(seconds / 60); // difference in minutes
  if (interval >= 1) {
    return {
      time: interval,
      getFullString: (arg: number): string => `${arg}m ago`,
    };
  }

  return {
    time: seconds,
    getFullString: (arg: number): string => `${arg}s ago`,
  };
};

export const useMintedTime = (arg: Date): string => {
  const [timeString, setTimeString] = useState<string>(() => {
    const { getFullString, time } = getTimeSinceWithTimer(arg);
    return getFullString(time);
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const { getFullString, time } = getTimeSinceWithTimer(arg);
      setTimeString(getFullString(time));
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [arg]);

  return timeString;
};
