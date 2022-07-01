export const FUTURE = (time: string) => `in ${time}`;
export const PAST = (time: string) => `${time} ago`;
export const TIMEINTERVAL = {
    SECOND: (count: number, more: number) => `a moment`,
    SECONDS: (count: number, more: number) => `a moment`,
    MINUTE: (count: number, more: number) => `one minute`,
    MINUTES: (count: number, more: number) => `${count} minutes`,
    HOUR: (count: number, more: number) => `one hour`,
    HOUR_15: (count: number, more: number) => `one hour and 15 minutes`,
    HOUR_15S: (count: number, more: number) => `one hour and ${more} minutes`,
    HOURS: (count: number, more: number) => `${count} hours`,
    HOURS_15: (count: number, more: number) => `${count} hours and 15 minutes`,
    HOURS_15S: (count: number, more: number) => `${count} hours and ${more} minutes`,
    DAY: (count: number, more: number) => `one day`,
    DAY_HOUR: (count: number, more: number) => `one day and one hour`,
    DAY_HOURS: (count: number, more: number) => `one day and ${more} hours`,
    DAYS: (count: number, more: number) => `${count} days`,
    DAYS_HOUR: (count: number, more: number) => `${count} days and one hour`,
    DAYS_HOURS: (count: number, more: number) => `${count} days and ${more} hours`,
    WEEK: (count: number, more: number) => `one week`,
    WEEKS: (count: number, more: number) => `${count} weeks`,
    MONTH: (count: number, more: number) => `one month`,
    MONTH_DAY: (count: number, more: number) => `one month and one day`,
    MONTHS: (count: number, more: number) => `${count} months`,
    MONTHS_DAYS: (count: number, more: number) => `${count} months and ${more} days`,
    YEAR: (count: number, more: number) => `one year`,
    YEAR_MONTH: (count: number, more: number) => `one year and one month`,
    YEAR_MONTHS: (count: number, more: number) => `one year and ${more} months`,
    YEARS: (count: number, more: number) => `${more} years`,
    YEARS_MONTH: (count: number, more: number) => `${count}  years and one month`,
    YEARS_MONTHS: (count: number, more: number) => `${count}  years and ${more} months`,
  };

  export const PROJECT = 'project';