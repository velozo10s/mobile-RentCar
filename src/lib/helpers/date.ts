// utils/date.ts
export const yearsAgo = (n: number) => {
  const today = new Date();
  const d = new Date(today);
  d.setFullYear(today.getFullYear() - n);
  return d;
};

export const isAtLeastAge = (date: Date, age = 18) => {
  if (!date) return false;
  const today = new Date();
  let years = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) years--;
  return years >= age;
};

export const formatYYYYMMDD = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
