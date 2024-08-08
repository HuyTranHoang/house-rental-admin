import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

export function customFormatDate(createdAt: string | undefined): string {
  if (!createdAt) {
    return 'Invalid date';
  }

  try {
    const date = parseISO(createdAt);
    const now = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (now.getTime() - date.getTime() < oneDayInMs) {
      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } else {
      return format(date, 'dd MMMM, yyyy', { locale: vi });
    }
  } catch (error) {
    return 'Invalid date';
  }
}