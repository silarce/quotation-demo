import { useState, useEffect } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import TextareaAutosize from 'react-textarea-autosize';

// layer
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { TdailyReportItemDto, useApiDailyReports_id } from 'js/api/api_dailyReport';

// css
import scss from '../dailyReport/reportTable.module.scss';
import scss_locale from './reportTable_simple.module.scss';

// other
import { mealsLookup } from 'components/page/home/dailyReport/ReportTable';

export default function ReportTable_simple({ reportId }: { reportId: string }) {
  const { dailyReport_id, updateDailyReports_id } = useApiDailyReports_id(reportId);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await updateDailyReports_id();
      } catch (error) {
        myAlert.err({ title: '取得日報表失敗' });
      }

      setIsLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  return (
    <div className={classNames(scss.table, scss_locale.table)}>
      <div className={scss.roof} />
      <div className={classNames(scss.thead, scss_locale.thead)}>
        {headerKeyArr.map((key, index) => {
          const { label, headerClassName } = config[key] ?? {};

          return (
            <div key={key} className={classNames(scss.cell, headerClassName)}>
              <span>{label}</span>
            </div>
          );
        })}
      </div>{' '}
      {/* thead */}
      <div className={classNames(scss.tbody, scss_locale.tbody)}>
        {dailyReport_id?.items.map((item, index) => {
          const { id } = item;

          return (
            <div key={id} className={classNames(scss.row, scss_locale.row)}>
              {bodyKeyArr.map((key, index) => {
                const { headerClassName, bodyClassName } = config[key] ?? {};

                let value = item[key];

                if (key === 'meals') {
                  value = value as TdailyReportItemDto['meals'];

                  return (
                    <div key={key} className={classNames(scss.cell, headerClassName, bodyClassName)}>
                      {value?.map((meal, mealIndex) => {
                        return <span key={mealIndex}>{mealsLookup[meal]}</span>;
                      })}
                    </div>
                  );
                }

                if (key === 'workers') {
                  value = value as TdailyReportItemDto['workers'];

                  return (
                    <div key={key} className={classNames(scss.cell, headerClassName, bodyClassName)}>
                      {value?.map((worker) => {
                        const { chName, id } = worker;

                        return <span key={id}>{chName}</span>;
                      })}
                    </div>
                  );
                }

                if (key === 'customerName' || key === 'description') {
                  return (
                    <div key={key} className={classNames(scss.cell, headerClassName, bodyClassName)}>
                      <div className={scss_locale.textareaBox}>
                        <TextareaAutosize value={value as string} autoComplete="off" disabled={true} />
                      </div>
                    </div>
                  );
                }

                if (key === 'departureTime' || key === 'departureWorksiteTime' || key === 'arrivalTime') {
                  if (value === null) {
                    value = '00-00';
                  } else {
                    value = dayjs(value as string).format('HH:mm');
                  }
                }

                if (key === 'stayLength') {
                  value = value ? '有' : '無';
                }

                return (
                  <div key={key} className={classNames(scss.cell, headerClassName, bodyClassName, scss.foo)}>
                    <span>{value as string}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <LoadingCover01 isLoading={isLoading} />
    </div>
  );
}

// =============================================================================

const headerKeyArr = [
  'periodOfDay',
  'workingTime',
  'customerName',
  'description',
  'workers',
  'workOrderNumber',
  'meals',

  'departureTime',
  'departureWorksiteTime',
  'contactName',
  'licensePlate',
  'stayLength',
  'arrivalTime',
] as const;

const bodyKeyArr = [
  'periodOfDay',
  'departureTime',
  'departureWorksiteTime',
  'customerName',
  'description',
  'workers',
  'workOrderNumber',
  'meals',
  'arrivalTime',
  'contactName',
  'licensePlate',
  'stayLength',
] as const;

type Tconfig = {
  [key in keyof TdailyReportItemDto | 'workingTime']?: {
    label: string;
    placeholder: string;
    color?: 'black' | 'main';
    headerClassName: string;
    bodyClassName: string;
  };
};

const config: Tconfig = {
  periodOfDay: {
    label: '上午/下午',
    placeholder: '時段',
    headerClassName: classNames('w-[104px] row-span-6'),
    bodyClassName: classNames('row-span-2'),
  },
  workingTime: {
    label: '工務時間',
    placeholder: '時間',
    headerClassName: classNames('w-[170px] row-span-2 col-span-2'),
    bodyClassName: classNames(),
  },
  customerName: {
    label: '客戶名稱/工程名稱',
    placeholder: '客戶名稱/工程名稱',
    headerClassName: classNames('w-[250px] row-span-3', scss.textLeft),
    bodyClassName: classNames('row-span-1'),
  },
  contactName: {
    label: '接洽人',
    placeholder: '請輸入接洽人',
    headerClassName: classNames('w-[250px] row-span-3', scss.textLeft),
    bodyClassName: classNames('row-span-1'),
  },
  description: {
    label: '工作內容',
    placeholder: '請輸入接洽內容',
    headerClassName: classNames('w-auto row-span-6', scss.textLeft),
    bodyClassName: classNames('row-span-2'),
  },
  workers: {
    label: '工務人員',
    placeholder: '工務人員',
    headerClassName: classNames('w-[140px] row-span-6', scss.textLeft),
    bodyClassName: classNames('row-span-2'),
  },
  workOrderNumber: {
    label: '派工單序號',
    placeholder: '派工單序號',
    headerClassName: classNames('w-[160px] row-span-3', scss.textLeft),
    bodyClassName: classNames('row-span-1'),
  },
  meals: {
    label: '餐費',
    placeholder: '餐費',
    headerClassName: classNames('w-[100px] row-span-3'),
    bodyClassName: classNames('row-span-1'),
  },
  departureTime: {
    label: '出發',
    placeholder: '時間',
    headerClassName: classNames('w-[85px] row-span-2'),
    bodyClassName: classNames('row-span-1', scss.single),
  },
  departureWorksiteTime: {
    label: '離工地',
    placeholder: '時間',
    headerClassName: classNames('w-[85px] row-span-4'),
    bodyClassName: classNames('row-span-2'),
  },
  arrivalTime: {
    label: '目的地',
    placeholder: '時間',
    headerClassName: classNames('w-[85px] row-span-2'),
    bodyClassName: classNames('row-span-1', scss.single),
  },
  licensePlate: {
    label: '車牌',
    placeholder: '請選擇',
    headerClassName: classNames('w-[160px] row-span-3', scss.textLeft),
    bodyClassName: classNames('row-span-1'),
  },
  stayLength: {
    label: '住宿',
    placeholder: '天數',
    headerClassName: classNames('w-[100px] row-span-3'),
    bodyClassName: classNames('row-span-1', scss.suffix),
  },
} as const;
