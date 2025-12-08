import * as luxon from 'luxon';

export const calcTimeAgo = (dateString: string) => {
  return luxon.DateTime.fromISO(dateString).setLocale('tr').toRelative();
};
