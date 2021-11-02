const msInDay = 24 * 60 * 60 * 1000; // this doesn't account for daylight saving time

// [Monday, ..., Friday]
export function getWeekRange(date: Date): Date[] {
  const timestamp = date.getTime();
  const daysFromMonday = (date.getDay() || 7) - 1;
  const getDateByDayOffset = (dayOffset: number) => new Date(timestamp + (dayOffset - daysFromMonday) * msInDay);

  return [0, 1, 2, 3, 4].map(getDateByDayOffset);
}

// YYYY-MM-DD
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
