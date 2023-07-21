import { useState } from 'react';
import _ from 'lodash';

// type
import { TdailyReportItemDto, TuserDto, TdailyReportWokerDto } from 'js/api/dtoTypes';
// api
import { TcreateDailyReportItemDto, TdailyReportDto } from 'js/api/api_dailyReport';
// other

// =================================================================

type ThookEmptyReport = {
  id: string | undefined;
  date: string | null;
  items: Class_reportItem[];
  isAllowToReview: boolean;
  isReviewedByOther: boolean;
  isReviewedByUser: boolean;
  isReviewCompleted: boolean;
  isUserIsViewer: boolean;
  isEdit: boolean;
  employeeId: string | undefined;
  employeeChName: string;
  prevDate: string | undefined;
};

// type TemptyReportItem = Omit<TdailyReportItemDto, "meals"> & { meals: TdailyReportItemDto["meals"] | "none" }
type TemptyReportItem = TdailyReportItemDto;

const emptyTimeCre = () => {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);

  return date.toISOString();
};

const emptyReportItem: TemptyReportItem = {
  id: '',
  order: -1,
  createdAt: '',
  updatedAt: '',
  periodOfDay: 'AM',
  customerName: '',
  contactName: '',
  meals: [],
  description: '',
  departureTime: emptyTimeCre(),
  arrivalTime: emptyTimeCre(),
  departureWorksiteTime: emptyTimeCre(),
  licensePlate: '',
  stayLength: 0,
  workers: [],
  workOrderNumber: '',
};

// =================================================================

/**不送dailyReportItem參數會自動送進emptyDailyReportItem */
class Class_reportItem {
  constructor(reRender: () => void, reportItem: TemptyReportItem = _.cloneDeep(emptyReportItem)) {
    this._reRender = reRender;
    this._item = reportItem;
    this._stayLength = `${this._item.stayLength || 0}`;
    this._workers = (reportItem.workers || []) as TdailyReportWokerDto[];
    this._meals = (reportItem.meals || []) as TdailyReportItemDto['meals'];
  } // constructor
  private _reRender;
  private _item;
  private _stayLength;
  private _workers;
  private _meals;

  get id() {
    if ('id' in this._item) {
      return this._item.id;
    }

    return undefined;
  }

  get periodOfDay() {
    return this._item.periodOfDay;
  }
  set periodOfDay(v) {
    this._item.periodOfDay = v;
    this._reRender();
  }

  get customerName() {
    return this._item.customerName;
  }
  set customerName(v: string) {
    this._item.customerName = v;
    this._reRender();
  }

  get contactName() {
    return this._item.contactName;
  }
  set contactName(v: string) {
    this._item.contactName = v;
    this._reRender();
  }

  get order() {
    if ('order' in this._item) {
      return this._item.order;
    }

    return undefined;
  }

  get meals() {
    return this._meals;
  }

  addMeals = (v: TdailyReportItemDto['meals'][number]) => {
    this._meals.push(v);
    this._reRender();
  };
  removeMeals = (index: number) => {
    this._meals?.splice(index, 1);
    this._reRender();
  };

  get description() {
    return this._item.description;
  }
  set description(v: string) {
    this._item.description = v;
    this._reRender();
  }

  get departureTime() {
    return this._item.departureTime;
  }
  set departureTime(v) {
    this._item.departureTime = v;
    this._reRender();
  }

  get arrivalTime() {
    return this._item.arrivalTime;
  }
  set arrivalTime(v) {
    this._item.arrivalTime = v;
    this._reRender();
  }

  get departureWorksiteTime() {
    return this._item.departureWorksiteTime;
  }
  set departureWorksiteTime(v) {
    this._item.departureWorksiteTime = v;
    this._reRender();
  }

  get licensePlate() {
    return this._item.licensePlate;
  }
  set licensePlate(v) {
    this._item.licensePlate = v;
    this._reRender();
  }

  get stayLength() {
    return this._stayLength;
  }
  set stayLength(v) {
    this._stayLength = v;
    this._item.stayLength = parseInt(v);
    this._reRender();
  }

  get dispatchOrderId() {
    return this._item.workOrderNumber;
  }
  set dispatchOrderId(v) {
    this._item.workOrderNumber = v;
    this._reRender();
  }

  get workers() {
    return this._workers;
  }
  addWorker = (v: TdailyReportWokerDto) => {
    this._workers.push(v);
    this._reRender();
  };
  removeWorker = (index: number) => {
    this._workers?.splice(index, 1);
    this._reRender();
  };

  get postBody(): TcreateDailyReportItemDto {
    const workerIdArr = (() => {
      const idArr = this.workers.map((worker) => {
        return worker.id;
      });

      if (idArr.length === 0) {
        return [];
      }

      return idArr;
    })();

    const meals = (() => {
      if (this._meals.length === 0) {
        return [];
      } else {
        return this._meals;
      }
    })();

    return {
      periodOfDay: this.periodOfDay || 'AM',
      customerName: this.customerName,
      contactName: this.contactName,
      // meals,
      meals,
      description: this.description,
      departureTime: this.departureTime || emptyTimeCre(),
      arrivalTime: this.arrivalTime || emptyTimeCre(),
      departureWorksiteTime: this.departureWorksiteTime || emptyTimeCre(),
      licensePlate: this.licensePlate || '',
      stayLength: this._item.stayLength || 0,
      workerIds: workerIdArr,
      workOrderNumber: this.dispatchOrderId ?? '',
    };
  }
} // Class_dailyReportItem

const useReport = ({ userInfo }: { userInfo: TuserDto }) => {
  const [render, setRender] = useState(1);
  const reRender = () => setRender((state) => ++state);

  const [report, setReport] = useState<ThookEmptyReport>();
  const [reportTemp, setReportTemp] = useState<ThookEmptyReport>();

  // ------------------------------------------------------------------
  const emptyReportCre = (): ThookEmptyReport => ({
    id: undefined,
    // date: moment().toISOString(),
    date: null,
    items: [new Class_reportItem(reRender)],
    isAllowToReview: false,
    isReviewedByOther: false,
    isReviewedByUser: false,
    isReviewCompleted: false,
    isUserIsViewer: false,
    isEdit: true,
    employeeId: undefined,
    employeeChName: userInfo.employee?.chName || '',
    prevDate: undefined,
  }); // emptyReportCre

  // 建立編輯日報表
  const reNew_report = ({
    dailyReport,
    userInfo,
    prevDate,
  }: {
    dailyReport?: TdailyReportDto;
    userInfo: TuserDto;
    prevDate?: string | undefined;
  }) => {
    if (!dailyReport) {
      const emptyReport = emptyReportCre();
      emptyReport.prevDate = prevDate;

      return setReport(emptyReport);
    }

    let isAllowToReview = false;
    let isReviewedByUser = false;
    let isUserIsViewer = false;
    let isReviewedByOther = false;

    dailyReport.reviewStatus.forEach((statu) => {
      const statuType = statu.type;
      const reviewerId = statu.reviewerEmployee?.id ?? null;
      const reviewedAt = statu.reviewedAt;

      if (reviewerId === userInfo.employee?.id) {
        isAllowToReview = true;

        if (statuType === 'examiner') {
          isUserIsViewer = true;
        }

        if (reviewedAt) {
          isReviewedByUser = true;
        }
      }

      if (!!reviewedAt) {
        isReviewedByOther = true;
      }
    });

    const sortedItems = _.sortBy(dailyReport.items, 'arrivalTime');

    const theReport: ThookEmptyReport = {
      id: dailyReport.id,
      date: dailyReport.date,
      items: sortedItems.map((item) => new Class_reportItem(reRender, item)),
      isAllowToReview,
      isReviewedByOther: isReviewedByOther,
      isReviewedByUser,
      isReviewCompleted: dailyReport.isReviewCompleted,
      isUserIsViewer,
      isEdit: false,
      employeeId: dailyReport.employee?.id,
      employeeChName: dailyReport.employee?.chName,
      prevDate: prevDate,
    };
    setReport(theReport);
  }; // reNew_report

  //
  const addReportItem = () => {
    setReport((report) => {
      if (!report) {
        return report;
      }

      const items = report.items;
      items.push(new Class_reportItem(reRender));

      return { ...report };
    });
  };

  const removeReportItem = (index: number) => {
    setReport((report) => {
      if (!report) {
        return report;
      }

      const items = report.items;
      items.splice(index, 1);

      return { ...report };
    });
  };

  //
  const changeReviewToChecked = (isReviewedByOther: boolean) => {
    setReport((report) => {
      if (!report) {
        return report;
      }

      const isReviewedByUser = true;

      return { ...report, isReviewedByOther, isReviewedByUser };
    });
  };

  //
  const switchIsEdit = () => {
    if (!report) {
      return;
    }

    /** emptyReportCre.isEdit預設為true
     * 所以新增回報後不會有編輯按鈕，就不會曾經執行過setReportTemp(_.cloneDeep(report))
     * 所以reportTemp會是undefine
     * 所以按下取消按鈕執行setReport(_.cloneDeep(reportTemp))後
     * report就變成undefine，就直接關掉編輯面板了
     */
    if (!report.isEdit) {
      setReportTemp(_.cloneDeep(report));
    } else {
      setReport(_.cloneDeep(reportTemp));
      setReportTemp(undefined);

      return;
    }

    setReport((report) => {
      if (!report) {
        return;
      }

      const isEdit = !report.isEdit;

      return { ...report, isEdit };
    });
  };

  //
  const changeReportDate = (v: string) => {
    setReport((report) => {
      if (!report) {
        return report;
      }

      report.date = v;

      return { ...report };
    });
  };

  //
  const reportIsEdit = (() => {
    if (!report) {
      return false;
    }

    // return report.isReviewedByOther || !report.isEdit ? false : true;
    return !report.isEdit ? false : true;
  })();

  //
  //
  return {
    report,
    setReport,
    reNew_report,
    addReportItem,
    removeReportItem,
    changeReviewToChecked,
    switchIsEdit,
    changeReportDate,
    reportIsEdit,
  };
};

export type { ThookEmptyReport };
export { Class_reportItem, useReport };
