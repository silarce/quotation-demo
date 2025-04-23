import { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';

import classNames from 'classnames';
import Image from 'next/image';
import moment from 'moment';

// antd
import { Drawer, Badge, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import MyButton from 'components/global/gear/button/myButton';
import WorkerSelector from 'components/global/gear/modal/workerSelector';
import MealSelector from './MealSelector';
import LicensePlateSelector from './LicensePlateSelector';
import CheckButton from 'components/global/gear/button/checkButton';

// css
import scss from './reportTable.module.scss';

// api
import { TdailyReportDto, useApiDailyReports } from 'js/api/api_dailyReport';

// option
import { optionsCreator_dailyReportPeriod } from 'js/utils/options/options';

// class
import { Class_reportItem } from 'pages/home/dailyReport';
import { TdailyReportItemDto, TdailyReportWokerDto } from 'js/api/dtoTypes';

// icon
import { IconAddCircle, IconRemoveCircle, IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';
import iconArrow from 'public/image/icon/arrow03_left.svg';
import { IconCheck02 } from 'public/image/icon/svgComponent/svgIcons';
import iconMove from 'public/image/icon/move.svg';

// other
import { AppContext } from 'pages/_app';
import { DailyReportContext } from 'pages/home/dailyReport';

// dnd
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  // DraggableAttributes,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  // horizontalListSortingStrategy
} from '@dnd-kit/sortable';

import {
  restrictToVerticalAxis,
  // restrictToHorizontalAxis,
  // restrictToWindowEdges
} from '@dnd-kit/modifiers';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ==================================================

interface TtimeTrigger {
  rIndex: number;
  key: string;
}

// ==================================================
// 防抖
let timeoutId: NodeJS.Timeout;
//
const optionArr_period = optionsCreator_dailyReportPeriod();

// ==================================================
export default function ReportTable({
  addDailyReportItem,
}: {
  addDailyReportItem: () => void;
  // removeDailyReportItem: (index: number) => void;
}) {
  const router = useRouter();
  const isMine = router.query.isMine === 'true' ? true : false;

  const {
    reportInEdit,
    userInfo,
    //
    reportItemKeyArr,
    setReportItemKeyArr,
  } = useContext(DailyReportContext);
  const { rwd1023 } = useContext(AppContext);

  const {
    id,
    isEdit,
    prevDate,
    isReviewedByOther,
    isReviewCompleted,
    isReviewedByUser,

    itemList,
  } = reportInEdit ?? {};

  const isReviewed = isReviewedByOther || isReviewCompleted || isReviewedByUser;

  const [monthStart, setMonthStart] = useState<string>();
  const [monthEnd, setMonthEnd] = useState<string>();

  const userId = userInfo.employee?.id;

  const param = {
    pageSize: 999,
    filter: {
      $and: {
        'employee.id': { $eq: userId },
        date: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      },
    },
  };

  // ----------------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);
  const disabledOri = !(isEdit && !isReviewed);
  // ----------------------------------------------------------
  /**從當月的上個月到當月的下個月的資料 */
  const {
    dailyReport: dailyReport_calendar,
    setDailyReports: setDailyReports_calendar,
    updateDailyReports: updateDailyReports_calendar,
    controller,
  } = useApiDailyReports(param);

  const isYesterdayHasReport = useMemo(() => {
    if (!reportInEdit) {
      return false;
    }

    const yesterday = moment(reportInEdit.date).subtract(1, 'day');

    // dailyReport_calendar是undefined就代表日期選擇器沒有被渲染出來
    // 就代表不是新增日報表，而是編輯已存在日報表
    if (!dailyReport_calendar) {
      // prevDate為該日報表前一筆資料的日期
      return moment(prevDate).isSame(yesterday);
    }
    /**其實在編輯已存在日報表時可以用isYesterdayHaveReport的作法把總表送進來處理
     * 但是prevDate已經做好了，所以就繼續用prevDate來處理
     */

    /**該日報表日期的前一天 */
    const isYesterdayHaveReport = dailyReport_calendar?.some((report) => {
      const reportDateM = moment(report.date);

      return moment(reportDateM).isSame(yesterday, 'day');
    });

    return isYesterdayHaveReport ?? false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportInEdit?.date]);

  const cancelReq = () => {
    if (controller) {
      controller.abort();
    }
  };

  useEffect(() => {
    if (itemList === undefined) {
      return;
    }

    const now = moment();
    setMonthStart(now.clone().subtract(1, 'month').startOf('month').toISOString());
    setMonthEnd(now.clone().add(1, 'month').startOf('month').toISOString());
  }, [itemList]);

  useEffect(() => {
    if (!monthStart || !monthEnd) {
      return;
    }

    clearTimeout(timeoutId);
    setIsLoading(true);

    timeoutId = setTimeout(async () => {
      try {
        await updateDailyReports_calendar();
      } catch {}

      setIsLoading(false);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthStart, monthEnd]);

  useEffect(() => {
    if (isEdit) {
      return;
    }

    setDailyReports_calendar(undefined);
    setMonthStart(undefined);
    setMonthEnd(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  const [showModal_worker, setShowModal_worker] = useState(false);
  const [showModal_meals, setShowModal_meals] = useState(false);
  const [showModal_licensePlate, setShowModal_licensePlate] = useState(false);

  const [activeItem, setActiveItem] = useState<Class_reportItem>();

  const toShowModal_worker = async () => {
    setShowModal_worker(true);
  };

  const modalOnCancel_worker = () => {
    setShowModal_worker(false);
    setActiveItem(undefined);
  };

  const toShowModal_meals = async () => {
    setShowModal_meals(true);
  };

  const modalOnCancel_meals = () => {
    setShowModal_meals(false);
    setActiveItem(undefined);
  };

  const modalOnConfirm_worker = (workerArr: TdailyReportWokerDto[]) => {
    if (!activeItem || workerArr.length === 0) {
      return;
    }

    activeItem.addWorker(workerArr);
  };

  const modalOnConfirm_meals = (v: TdailyReportItemDto['meals']) => {
    if (!activeItem) {
      return;
    }

    v.forEach((value) => activeItem.addMeals(value));
    modalOnCancel_meals();
  };

  const modalOnConfirm_licensePlate = (v: string | undefined) => {
    if (!activeItem) {
      return;
    }

    activeItem.licensePlate = v ?? '';
    setShowModal_licensePlate(false);
  };

  // ------------------------------------------------
  const theHeaderKeyArr = rwd1023 ? headerKeyArr_mobile : headerKeyArr;
  const theBodyKeyArr = rwd1023 ? headerKeyArr_mobile : bodyKeyArr;

  // ------------------------------------------------
  /**用來觸發目的地、離工地的focus */
  const [timeTrigger, setTimeTrigger] = useState<TtimeTrigger>({ rIndex: -1, key: '' });
  // ------------------------------------------------
  // dnd

  const sensors = useSensors(useSensor(PointerSensor));
  const [movingId, setMovingId] = useState<string>();

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id) {
      // 有bug，光是點一下就會移動
      const oldIndex = reportItemKeyArr.indexOf(active.id as string);
      const newIndex = reportItemKeyArr.indexOf(over?.id as string);

      const newKeyArr = arrayMove(reportItemKeyArr, oldIndex, newIndex);
      setReportItemKeyArr(newKeyArr);

      return newKeyArr;
    }

    setMovingId(undefined);
  };

  function onDragStart(e: DragStartEvent) {
    const { id } = e.active;
    setMovingId(id as string);
  }

  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------

  // MARK: ROW

  const Row = useCallback(
    function Row({
      item,
      rIndex,
      delSelf,
      disabledOri,
      id,
      isMoving,
    }: {
      item: Class_reportItem;
      rIndex: number;
      delSelf: () => void;
      disabledOri: boolean;
      id: string;
      isMoving: boolean;
    }) {
      const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id,
      });

      const itemStyle = {
        transform: CSS.Transform.toString(transform),
        // transition,
      };

      return (
        <div
          className={classNames(scss.row, isMoving && scss.isMoving)} //
          style={itemStyle}
          ref={setNodeRef}
        >
          {/*  */}
          <div className={classNames(scss.cell, scss.moveCell, 'row-span-3')}>
            <Image src={iconMove} alt="" {...attributes} {...listeners} />
          </div>
          {/*  */}
          {theBodyKeyArr.map((key, cIndex) => {
            const { suffix, render, wrapperClassName } = config[key] ?? {};

            let disabled = disabledOri;

            if (key === 'meals' || key === 'stayLength') {
              disabled = !isEdit;
            }

            const onWorkersAddClick = () => {
              if (disabled) {
                return;
              }

              setActiveItem(item);
              toShowModal_worker();
            };

            const onMealAddClick = () => {
              if (disabled) {
                return;
              }

              setActiveItem(item);
              toShowModal_meals();
            };

            const onLicensePlateAddClick = () => {
              if (disabled) {
                return;
              }

              setActiveItem(item);
              setShowModal_licensePlate(true);
            };

            const onRemoveClick = disabled ? undefined : delSelf;

            return (
              <div key={cIndex} className={classNames(scss.cell, wrapperClassName?.(rwd1023).body)}>
                {render?.({
                  class_reportItem: item,
                  disabled,
                  rwd1023,
                  onWorkersAddClick: onWorkersAddClick,
                  onMealAddClick: onMealAddClick,
                  onLicensePlateAddClick: onLicensePlateAddClick,
                  onRemoveClick: onRemoveClick,
                  timeTrigger,
                  setTimeTrigger,
                  index: rIndex,
                  isMine,
                })}
                {suffix && disabled && <span>{suffix}</span>}
              </div>
            );
          })}
        </div>
      );
    },
    [reportInEdit]
  );

  //

  // MARK: RENDER

  return (
    <Drawer
      className={scss.drawer}
      visible={!!itemList}
      // getContainer={false}
      getContainer={rwd1023 ? undefined : false}
      width={'100%'}
      closable={false}
    >
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {rwd1023 && <Panel />}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {!reportInEdit?.id && (
        <DatePicker
          disabled={disabledOri}
          setMonthStart={setMonthStart}
          setMonthEnd={setMonthEnd}
          isLoading={isLoading}
          dailyReport={dailyReport_calendar}
          cancelReq={cancelReq}
        />
      )}

      <div className={classNames(scss.table)} key={id}>
        <div className={scss.roof} />

        <div className={classNames(scss.thead)}>
          <div className={classNames(scss.cell, scss.empty, 'row-span-6')}></div>

          {theHeaderKeyArr.map((key) => {
            const { createLabel, wrapperClassName } = config[key] ?? {};

            const label = key === 'remove' && !isMine ? '' : createLabel?.(rwd1023);

            return (
              <div key={key} className={classNames(scss.cell, wrapperClassName?.(rwd1023).header)}>
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        <div className={classNames(scss.tbody)}>
          <DndContext
            sensors={sensors}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
          >
            <SortableContext items={reportItemKeyArr} strategy={verticalListSortingStrategy}>
              {reportItemKeyArr?.map((key, rIndex) => {
                const item = itemList?.[key];

                if (!item) {
                  return null;
                }

                const delSelf = item.delSelf;

                const isMoving = key === movingId;

                return (
                  <Row
                    key={key}
                    id={key}
                    item={item}
                    rIndex={rIndex}
                    delSelf={delSelf}
                    disabledOri={disabledOri}
                    isMoving={isMoving}
                  />
                );
              })}
            </SortableContext>
          </DndContext>

          {!disabledOri && (
            <MyButton label="新增回報" preImg="add" className={scss.newReportBtn} onClick={addDailyReportItem} />
          )}
        </div>
        <WorkerSelector
          showModal={showModal_worker}
          onConfirm={modalOnConfirm_worker}
          onCancel={modalOnCancel_worker}
          label="選擇工務人員"
          // selLimit={1}
        />

        <MealSelector
          visible={showModal_meals}
          onConfirm={modalOnConfirm_meals}
          onCancel={modalOnCancel_meals}
          isYesterdaySamePrevDate={isYesterdayHasReport}
        />

        <LicensePlateSelector
          visible={showModal_licensePlate}
          onConfirm={modalOnConfirm_licensePlate}
          onCancel={() => setShowModal_licensePlate(false)}
        />
      </div>
    </Drawer>
  );
}
// =================================================================

type TclassKeys = keyof Class_reportItem;

const headerKeyArr: (TclassKeys | 'workingTime' | 'remove')[] = [
  'periodOfDay',
  'workingTime',
  'customerName',
  'description',
  'workers',
  'dispatchOrderId',
  'meals',
  'remove',

  'departureTime',
  'departureWorksiteTime',
  'contactName',
  'licensePlate',
  'stayLength',
  'arrivalTime',
];
const headerKeyArr_mobile: (TclassKeys | 'remove')[] = [
  'periodOfDay',
  'departureTime',
  'arrivalTime',
  'departureWorksiteTime',
  'customerName',
  'contactName',
  'description',
  'workers',
  'dispatchOrderId',
  'licensePlate',
  'meals',
  'stayLength',
  'remove',
];

const bodyKeyArr: (TclassKeys | 'remove')[] = [
  'periodOfDay',
  'departureTime',
  'departureWorksiteTime',
  'customerName',
  'description',
  'workers',
  'dispatchOrderId',
  'meals',
  'remove',
  'arrivalTime',
  'contactName',
  'licensePlate',
  'stayLength',
];

type Tconfig = {
  [key in TclassKeys | 'workingTime' | 'remove']?: {
    color?: 'black' | 'main';
    suffix?: React.ReactNode;
    createLabel: (rwd1023: boolean) => React.ReactNode;
    wrapperClassName: (rwd1023: boolean) => {
      header: string;
      body: string;
    };
    render: (props: {
      class_reportItem: Class_reportItem;
      disabled: boolean;
      rwd1023: boolean;
      onWorkersAddClick: () => void;
      onMealAddClick: () => void;
      onLicensePlateAddClick: () => void;
      onRemoveClick: (() => void) | undefined;

      timeTrigger: TtimeTrigger;
      setTimeTrigger: React.Dispatch<React.SetStateAction<TtimeTrigger>>;
      index: number;

      isMine: boolean;
    }) => React.ReactNode;
  };
};

// MARK: config
const config: Tconfig = {
  periodOfDay: {
    createLabel: (rwd1023) => '上午/下午',
    wrapperClassName(rwd1023) {
      const header = classNames('w-[104px] row-span-6', rwd1023 && 'h-[43px]');
      const body = classNames(header, '!row-span-2', rwd1023 && 'h-[43px]');

      return { header, body };
    },

    render({ class_reportItem, disabled }) {
      return (
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          placeholder={'時段'}
          selectProps={{
            options: optionArr_period,
            value: class_reportItem.periodOfDay,
            onChange: (v) => {
              const value = (v?.value || null) as 'AM' | 'PM' | null;
              class_reportItem.periodOfDay = value;
            },
            arrowType: 'black',
            fontSize: '16px',
          }}
        />
      );
    },
  },
  workingTime: {
    createLabel: (rwd1023) => '工務時間',
    wrapperClassName(rwd1023) {
      const header = classNames('w-[170px] row-span-2 col-span-2', rwd1023 && 'h-[43px]');
      const body = classNames(header, '', rwd1023 && 'h-[43px]');

      return { header, body };
    },

    render() {
      return null;
    },
  },
  customerName: {
    createLabel: (rwd1023) => (rwd1023 ? '客戶名稱' : '客戶名稱/工程名稱'),
    wrapperClassName(rwd1023) {
      const header = classNames('w-[250px] row-span-3', scss.textLeft, rwd1023 && 'h-[62px]');
      const body = classNames(header, '!row-span-1', rwd1023 && 'h-[62px]');

      return { header, body };
    },

    render({ class_reportItem, disabled, rwd1023 }) {
      return (
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          placeholder={rwd1023 ? '客戶名稱' : '客戶名稱/工程名稱'}
          textareaProps={{
            value: class_reportItem.customerName,
            onChange: (v) => {
              class_reportItem.customerName = v;
            },
            className: classNames(scss.textarea, scss.customerName),
            props: {
              maxLength: 600,
            },
          }}
        />
      );
    },
  },
  contactName: {
    createLabel: (rwd1023) => '接洽人',
    wrapperClassName(rwd1023) {
      const header = classNames('w-[250px] row-span-3', scss.textLeft, rwd1023 && 'h-[62px]');
      const body = classNames(header, '!row-span-1', rwd1023 && 'h-[62px]');

      return { header, body };
    },

    render({ class_reportItem, disabled }) {
      return (
        <InputSel
          className="inline-grid"
          disabled={disabled}
          showBaseline="auto"
          placeholder={'請輸入接洽人'}
          inputProps={{
            value: class_reportItem.contactName,
            onChange: (v) => {
              class_reportItem.contactName = v;
            },
          }}
        />
      );
    },
  },
  description: {
    createLabel: (rwd1023) => '工作內容',
    wrapperClassName(rwd1023) {
      const header = classNames('w-auto row-span-6', scss.textLeft, rwd1023 && 'h-[300px]');
      const body = classNames(scss.textareaCell, header, '!row-span-2', rwd1023 && 'h-[300px]');

      return { header, body };
    },

    render({ class_reportItem, disabled }) {
      return (
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          placeholder={'請輸入接洽內容'}
          textareaProps={{
            value: class_reportItem.description,
            onChange: (v) => {
              class_reportItem.description = v;
            },
            className: classNames(scss.textarea, scss.description),
            allowNewLineByUser: true,
            props: {
              maxLength: 600,
            },
          }}
        />
      );
    },
  },
  workers: {
    createLabel: (rwd1023) => '工務人員',
    wrapperClassName(rwd1023) {
      const header = classNames('w-[140px] row-span-6', scss.textLeft, rwd1023 && 'h-[120px]');
      const body = classNames(scss.workerCell, header, '!row-span-2', rwd1023 && 'h-[120px]');

      return { header, body };
    },

    render({ class_reportItem, disabled, onWorkersAddClick }) {
      const workersArr = class_reportItem.workers;

      return (
        <>
          {!workersArr[0] && !disabled && (
            <div className={scss.worker}>
              <span></span>
              <IconAddCircle className={scss.icon} onClick={onWorkersAddClick} />
            </div>
          )}
          {workersArr?.map((worker, wIndex, arr) => {
            const onRemove = () => {
              class_reportItem.removeWorker(wIndex);
            };

            return (
              <div key={wIndex} className={scss.worker}>
                <InputSel
                  disabled={true}
                  showBaseline={disabled ? 'invisible' : 'always'}
                  inputProps={{
                    value: worker.chName,
                  }}
                />
                {!disabled && <IconRemoveCircle className={scss.icon} onClick={onRemove} />}
              </div>
            );
          })}

          {workersArr[0] && !disabled && (
            <div className={scss.worker}>
              <span></span>
              <IconAddCircle className={scss.icon} onClick={onWorkersAddClick} />
            </div>
          )}
        </>
      );
    },
  },
  dispatchOrderId: {
    createLabel: (rwd1023) => '派工單序號',
    wrapperClassName(rwd1023) {
      const header = classNames('w-[160px] row-span-3', scss.textLeft, rwd1023 && 'h-[43px]');
      const body = classNames(header, '!row-span-1', rwd1023 && 'h-[43px]');

      return { header, body };
    },

    render({ class_reportItem, disabled }) {
      return (
        <InputSel
          className="inline-grid"
          disabled={disabled}
          showBaseline="auto"
          placeholder={'派工單序號'}
          inputProps={{
            value: class_reportItem.dispatchOrderId ?? '',
            onChange: (v) => {
              class_reportItem.dispatchOrderId = v;
            },
          }}
        />
      );
    },
  },
  meals: {
    createLabel: (rwd1023) => '餐費',
    wrapperClassName(rwd1023) {
      const header = classNames('w-[100px] row-span-3', rwd1023 && 'h-[120px]');
      const body = classNames(scss.workerCell, header, '!row-span-1', rwd1023 && 'h-[120px]');

      return { header, body };
    },

    render({ class_reportItem, disabled, onMealAddClick }) {
      const mealsArr = class_reportItem['meals'];

      return (
        <>
          {!mealsArr[0] && !disabled && (
            <div className={scss.worker}>
              <span></span>
              <IconAddCircle className={scss.icon} onClick={onMealAddClick} />
            </div>
          )}
          {mealsArr?.map((meals, wIndex, arr) => {
            const onRemove = () => {
              class_reportItem.removeMeals(wIndex);
            };

            return (
              <div key={wIndex} className={scss.worker}>
                <InputSel
                  disabled={true}
                  showBaseline={disabled ? 'invisible' : 'always'}
                  inputProps={{
                    value: mealsLookup[meals],
                  }}
                />
                {!disabled && <IconRemoveCircle className={scss.icon} onClick={onRemove} />}
              </div>
            );
          })}

          {mealsArr[0] && !disabled && (
            <div className={scss.worker}>
              <span></span>
              <IconAddCircle className={scss.icon} onClick={onMealAddClick} />
            </div>
          )}
        </>
      );
    },
  },
  departureTime: {
    createLabel: (rwd1023) => '出發',
    wrapperClassName(rwd1023) {
      const header = classNames('w-[85px] row-span-2', rwd1023 && 'h-[43px]', scss.single);
      const body = classNames(header, '!row-span-1', scss.single, rwd1023 && 'h-[43px]');

      return { header, body };
    },

    render({ class_reportItem, disabled, index, timeTrigger, setTimeTrigger }) {
      const focusTrigger = timeTrigger.rIndex === index && timeTrigger.key === 'departureTime';

      const time = moment(class_reportItem.departureTime);
      const isBeforeAM8 = time.isBefore(moment(time).startOf('day').add(8, 'hours'));

      return (
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          placeholder={'時間'}
          timePickerProps={{
            timePickerClassName: classNames(isBeforeAM8 && scss.date_redColor),
            value: class_reportItem.departureTime ?? '',
            onChange02: (v) => {
              const value = v?.toISOString();
              class_reportItem.departureTime = value;
              setTimeTrigger({ rIndex: index, key: 'arrivalTime' });
            },
            focusTrigger: focusTrigger,
          }}
        />
      );
    },
  },
  departureWorksiteTime: {
    createLabel: (rwd1023) => '離工地',
    wrapperClassName(rwd1023) {
      const header = classNames('w-[85px] row-span-4', rwd1023 && 'h-[43px]');
      const body = classNames(header, '!row-span-2', rwd1023 && 'h-[43px]');

      return { header, body };
    },

    render({ class_reportItem, disabled, index, timeTrigger, setTimeTrigger }) {
      const focusTrigger = timeTrigger.rIndex === index && timeTrigger.key === 'arrivalTime';

      const time = moment(class_reportItem.departureWorksiteTime);
      const isAfter1715 = time.isAfter(moment(time).startOf('day').add(17, 'hours').add(15, 'minutes'));

      return (
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          placeholder={'時間'}
          timePickerProps={{
            timePickerClassName: classNames(isAfter1715 && scss.date_redColor),
            value: class_reportItem.departureWorksiteTime ?? '',
            onChange02: (v) => {
              const value = v?.toISOString();
              class_reportItem.departureWorksiteTime = value;
              setTimeTrigger({ rIndex: index, key: '' });
            },
            focusTrigger: focusTrigger,
          }}
        />
      );
    },
  },
  arrivalTime: {
    createLabel: (rwd1023) => '目的地',
    wrapperClassName(rwd1023) {
      const header = classNames('w-[85px] row-span-2', rwd1023 && 'h-[43px]', scss.single);
      const body = classNames(header, '!row-span-1', scss.single, rwd1023 && 'h-[43px]');

      return { header, body };
    },

    render({ class_reportItem, disabled, index, timeTrigger, setTimeTrigger }) {
      const focusTrigger = timeTrigger.rIndex === index && timeTrigger.key === 'arrivalTime';

      return (
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          placeholder={'時間'}
          timePickerProps={{
            value: class_reportItem.arrivalTime ?? '',
            onChange02: (v) => {
              const value = v?.toISOString();
              class_reportItem.arrivalTime = value;
              setTimeTrigger({ rIndex: index, key: 'departureWorksiteTime' });
            },
            focusTrigger: focusTrigger,
          }}
        />
      );
    },
  },
  licensePlate: {
    createLabel: (rwd1023) => '車牌',
    wrapperClassName(rwd1023) {
      const header = classNames('w-[160px] row-span-3', scss.textLeft, rwd1023 && 'h-[43px]');
      const body = classNames(scss.workerCell, header, '!row-span-1', rwd1023 && 'h-[43px]');

      return { header, body };
    },

    render({ class_reportItem, disabled, onLicensePlateAddClick }) {
      return (
        <div className={scss.worker}>
          <InputSel
            disabled={true}
            showBaseline={disabled ? 'invisible' : 'always'}
            placeholder={'請選擇'}
            inputProps={{
              value: class_reportItem['licensePlate'] ?? '',
            }}
          />
          {!disabled && <IconAddCircle className={scss.icon} onClick={onLicensePlateAddClick} />}
        </div>
      );
    },
  },
  stayLength: {
    createLabel: (rwd1023) => '住宿',
    suffix: '天',
    wrapperClassName(rwd1023) {
      const header = classNames('w-[100px] row-span-3', rwd1023 && 'h-[43px]');
      const body = classNames(header, '!row-span-1', scss.suffix, rwd1023 && 'h-[43px]', scss.stayLength);

      return { header, body };
    },

    render({ class_reportItem, disabled }) {
      return (
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          placeholder={'天數'}
          selectProps={{
            options: [
              { value: '0', label: '無' },
              { value: '1', label: '有' },
            ],
            value: class_reportItem.stayLength,
            onChange: (v) => {
              class_reportItem.stayLength = v!.value;
            },
            arrowType: 'black',
            fontSize: '16px',
          }}
        />
      );
    },
  },
  remove: {
    createLabel: (rwd1023) => '刪除',
    wrapperClassName(rwd1023) {
      const header = classNames('w-[60px] row-span-6', scss.rightEdge, rwd1023 && 'h-[43px]');
      const body = classNames(header, '!row-span-2', rwd1023 && 'h-[43px]');

      return { header, body };
    },

    render({ isMine, disabled, onRemoveClick }) {
      return <>{isMine && !disabled && <IconDelete01 onClick={onRemoveClick} />}</>;
    },
  },
};

// ==============================================================================
// ==============================================================================
// ==============================================================================
const DatePicker = ({
  disabled,
  setMonthStart,
  setMonthEnd,
  isLoading,
  dailyReport,
  cancelReq,
}: {
  disabled: boolean;
  setMonthStart: (ISOstring: string) => void;
  setMonthEnd: (ISOstring: string) => void;
  isLoading: boolean;
  dailyReport: TdailyReportDto[] | undefined;
  cancelReq: () => void;
}) => {
  const { reportInEdit, changeReportDate } = useContext(DailyReportContext);
  const isEdit = reportInEdit?.isEdit;

  const defaultValue = useMemo(() => {
    if (!dailyReport) {
      return undefined;
    }

    const inEditDate = moment();

    if (!dailyReport?.[0]) {
      if (reportInEdit) {
        reportInEdit.date = inEditDate.toISOString();
      }

      return inEditDate;
    }

    const lastDate = moment(dailyReport?.[0].date);

    if (lastDate.isSame(inEditDate, 'day')) {
      return undefined;
    } else {
      if (reportInEdit) {
        reportInEdit.date = inEditDate.toISOString();
      }

      return inEditDate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!dailyReport]);

  return (
    <div className={scss.datePickerWrapper}>
      <InputSel
        /**key是為了使defaultValue更新 */
        // key={`${defaultValue}`}
        key={`${defaultValue} ${isEdit}`}
        label="日報表日期"
        captionColor="main"
        gap="24px"
        width={'245px'}
        className={scss.datePicker}
        placeholder="請選擇日期"
        disabled={disabled}
        datePickerProps={{
          // value: reportInEdit?.date || "",
          value: undefined,
          onChange02(moment, dateString) {
            const dateStr = moment?.toISOString() ?? '';
            changeReportDate(dateStr);
          },
          antdDatePickerProps: {
            // defaultValue: moment(reportInEdit?.date || undefined),
            defaultValue: defaultValue,
            disabledDate: (date) => {
              if (isLoading) {
                return true;
              }

              // 比當日晚的日期都不能選
              if (date.isAfter(moment())) {
                return true;
              }

              // // 已經存在的日期都不能選
              if (!dailyReport) {
                return true;
              }

              const isDisabledDate = dailyReport.some((report) => {
                const isSame = date.isSame(moment(report.date), 'day');

                return isSame;
              });

              return isDisabledDate;
            },
            onPanelChange: (theMoment, mode) => {
              cancelReq();
              const start = theMoment.clone().subtract(1, 'month').startOf('month').toISOString();
              const end = theMoment.clone().endOf('month').add(1, 'month').toISOString();
              setMonthStart(start);
              setMonthEnd(end);
            },
            dateRender: isLoading ? DateRender : undefined,
          },
        }}
      />
    </div>
  );
};

const DateRender = () => {
  return <Spin indicator={<LoadingOutlined />} />;
};

// ==============================================================================
// ==============================================================================
// ==============================================================================
// mobile
const Panel = () => {
  const { identity, reportInEdit, isReportEdit, userInfo } = useContext(DailyReportContext);

  const Below = (() => {
    if (reportInEdit?.isUserIsViewer) {
      return () => null;
    }

    if (identity === 'manager') {
      if (!reportInEdit) {
        return () => null;
      } else if (reportInEdit.isAllowToReview) {
        return Bar_reviewer_inEdit_user;
      } else {
        return () => null;
      }
    }

    if (identity === 'reviewer') {
      if (!reportInEdit) {
        return () => null;
      } else {
        if (!reportInEdit?.employeeId || reportInEdit?.employeeId === userInfo?.employee?.id) {
          if (isReportEdit) {
            return Bar_reporter_inEdit02;
          }

          // if (reportInEdit.isReviewedByOther) {
          //   return Bar_reporter_reviewed;
          // }

          return Bar_reporter_inEdit02;
        } else if (reportInEdit.isAllowToReview) {
          return Bar_reviewer_inEdit_user;
        }

        return () => null;
      }
    }

    if (identity === 'reporter') {
      if (!reportInEdit) {
        return () => null;
      } else {
        // if (reportInEdit.isReviewedByOther) {
        //   return Bar_reporter_reviewed;
        // }

        if (isReportEdit) {
          return Bar_reporter_inEdit02;
        }

        return Bar_reporter_inEdit02;
      }
    }

    return () => null;
  })();

  return (
    <div>
      <TitlePanel />
      <Below />
    </div>
  );
};

const TitlePanel = () => {
  const {
    reportInEdit,
    cancelEditNewDailyReport,
    isReportEdit,
    // setShowReviewerForReportModal
    reqApiPatchDailyReports_my,
  } = useContext(DailyReportContext);
  const employeeChName = reportInEdit?.employeeChName;
  let date = moment(reportInEdit?.date).subtract(1911, 'year').format('y-MM-DD');

  if (date === 'Invalid date') {
    date = '請選擇日期';
  }

  return (
    <div className={scss.TitlePanel}>
      <div className={classNames(scss.left)}>
        <Image src={iconArrow} alt="return" onClick={cancelEditNewDailyReport} />
      </div>
      <div className={classNames(scss.center)}>
        <span>
          {employeeChName} {date}
        </span>
      </div>
      {isReportEdit && (
        <div
          className={classNames(scss.right)}
          onClick={() => {
            reqApiPatchDailyReports_my();
            // setShowReviewerForReportModal(true)
          }}
        >
          <IconCheck02 />
        </div>
      )}
    </div>
  );
};

function Bar_reporter_inEdit02() {
  const { isReportEdit, switchIsEdit, reportInEdit } = useContext(DailyReportContext);

  return (
    <div className={scss.bar}>
      {/* {isReportEdit &&
        <MyButton label="上傳"
          onClick={() => { setShowReviewerForReportModal(true) }} />
      } */}
      <MyButton label={isReportEdit ? '取消' : '編輯'} onClick={switchIsEdit} />
      {reportInEdit?.isReviewedByOther && <Badge className={scss.antdBadge02} color="auto" text="已檢視" />}
    </div>
  );
}

function Bar_reviewer_inEdit_user() {
  const { reportInEdit, doCheck } = useContext(DailyReportContext);

  return (
    <div className={scss.bar}>
      <CheckButton checkLabel="已讀" uncheckLable="未讀" value={!!reportInEdit?.isReviewedByUser} onClick={doCheck} />
    </div>
  );
}

const mealsLookup = {
  none: '無',
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
} as const;

export { mealsLookup };
