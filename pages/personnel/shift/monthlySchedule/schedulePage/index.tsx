import { useRouter } from 'next/router';
import MonthCalendar from 'components/page/personnel/shift/monthlySchedule/MonthCalendar';
import Btn from 'components/global/gear/button/btn_fong';

export default function MonthlyPage() {
  const router = useRouter();
  const { empId, name, year, month } = router.query;

  const schedules = Array.from(
    { length: 31 },
    (_, i) => ['早', '中', '晚', '休'][i % 4] // 假資料
  );

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold ">
          {year} 年 {month} 月班表 - {name} ({empId})
        </h1>
        <Btn
          onClick={() => {
            router.push(`/personnel/shift?tab=monthlySchedule`);
          }}
        >
          返回
        </Btn>
      </div>
      <div className=" px-6 mt-8">
        <MonthCalendar year={Number(year)} monthIndex={Number(month) - 1} schedules={schedules} />
      </div>
    </div>
  );
}
