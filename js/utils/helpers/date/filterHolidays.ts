import dayjs from 'dayjs';

// 目前在這邊使用 /demo/downloadHolidays

// https://data.gov.tw/dataset/14718

/**
型別為人事行政局openData JSON版本的資料型別
未來如果有型別改了，Tcalendar就要跟著改
 */
type Tcalendar = {
  西元日期: string;
  星期: string;
  是否放假: string;
  備註: string;
};

/*
這是輸出的型別，或許不應該把Tcalendar弄進來，而應該轉為全新的型別
這樣如果Tcalendar變更的話，處理會比較方便
未來時間較寬裕時再處理吧
*/
type Tcalendar_group = {
  [key: string]: {
    [key: string]: Tcalendar & {
      iso: string;
      dateDay: string;
    };
  };
};

const filterHolidays = (calendar: Tcalendar[]) => {
  const calendar_group: Tcalendar_group = {};

  calendar.forEach((c) => {
    if (c.是否放假 === '2') {
      const month = dayjs(c.西元日期).month() + 1;

      if (!calendar_group[month]) {
        calendar_group[month] = {};
      }

      const iso = dayjs(c.西元日期).toISOString();
      const dateDay = dayjs(c.西元日期).date().toString();

      calendar_group[month][dateDay] = {
        ...c,
        iso,
        dateDay,
      };
    }
  });

  return calendar_group;
};

export { filterHolidays };
