import { useState, useEffect, createContext } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { AxiosError } from 'axios';
import { useRouter, NextRouter } from 'next/router';
import moment from 'moment';

// layer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import PageHeader_mobile_dailyReport from 'pages/home/dailyReport/pageHeader_mobile/PageHeader_mobile_dailyReport';
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import TheCalendar from 'components/page/home/dailyReport/TheCalendar';
import ReporterList from 'components/page/home/dailyReport/ReporterList';
import SetReportEmpModal from 'components/page/home/dailyReport/SetReportEmpModal';
import ReviewerAndExaminerSelector from 'components/page/home/dailyReport/ReviewerAndExaminerSelector';
import ReportTable from 'components/page/home/dailyReport/ReportTable';
import TagCarousel from 'components/page/home/dailyReport/TagCarousel';

// mobile
import SearchDrawer from 'components/page/home/dailyReport/SearchDrawer';

// gear
import CheckButton from 'components/global/gear/button/checkButton';
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// antd
import { Badge } from 'antd';

// hook
import { Class_reportItem, useReport, ThookEmptyReport } from 'hooks/home/useDailyReport';

// tool
import { yearConversion_chToStandard } from 'js/tools/date/yearConversion_chToStandard';
import { filterCre_nextAndPrevMonth } from 'js/utils/helpers/params/filterCreator';

// icon
import iconFourCube from 'public/image/icon/fourCube.svg';
import iconMenu from 'public/image/icon/menu.svg';
// api
import {
  TdailyReportDto,
  Tparams,
  useApiDailyReports,
  useApiDailyReports_reviewers,
  useApiDailyReports_v2,
  apiPatchDailyReports_my,
  apiDailyReports_id,
  apiDailyReports_review,
  apiPatchDailyReports_reviewers,
  apiIsReviewer,
} from 'js/api/api_dailyReport';

import { TemployeeDto, useEmployee } from 'js/api/api_employee';

// type
import { TuserDto } from 'js/api/dtoTypes';
import { TdoSearch, TsearchGroup } from 'components/global/gear/HOC/searchBar/searchBar';

// css
import scss from './dailyReport.module.scss';

// =====================================================================
export type Ttag = {
  reportId: string;
  employeeId: string;
  name: string;
  date: string;
  prevDate: string;
};
export { Class_reportItem };
// =====================================================================

type Tidentity = 'manager' | 'reviewer' | 'reporter' | undefined;

const reportedAtOptions = [
  { label: '全部', value: '全部' },
  { label: '未檢視', value: '未檢視' },
  { label: '已檢視', value: '已檢視' },
];

// =====================================================================
type TdailyReportContext = {
  reportInEdit: ThookEmptyReport | undefined;
  isReportEdit: boolean;
  switchIsEdit: () => void;
  setShowReviewerForReportModal: (v: boolean) => void;
  cancelEditNewDailyReport: () => void;
  changeReportDate: (v: string) => void;
  identity: Tidentity;
  doCheck: () => void;
  userInfo: TuserDto;
  //
  reportItemKeyArr: string[];
  setReportItemKeyArr: React.Dispatch<React.SetStateAction<string[]>>;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const DailyReportContext = createContext<TdailyReportContext>(null!);

// =====================================================================
export default function DailyReport({ userInfo }: { userInfo: TuserDto }) {
  const userId = userInfo.employee?.id ?? '';
  const router = useRouter();
  const searchQuery = {
    isUserReviewed: router.query.isUserReviewed || '全部',
    date: router.query.date || '',
  } as {
    isUserReviewed: (typeof searchObj)['isUserReviewed'];
    date: string;
  };

  const isMine = router.query.isMine === undefined ? true : router.query.isMine === 'true' ? true : false;
  const isCalendar = router.query.isCalendar === 'true' ? true : false;

  const [isLoading, setIsLoading] = useState(false);
  // -----------------------------------------------------------
  /**權限 */
  const [identity, setIdentity] = useState<Tidentity>();

  useEffect(() => {
    (async () => {
      const isSubordinate = checkIsSubordinate(userInfo);

      if (!isSubordinate) {
        return setIdentity('manager');
      }

      const isReviewer = await apiIsReviewer();

      if (isReviewer.isReviewer) {
        return setIdentity('reviewer');
      }

      return setIdentity('reporter');
    })();
  }, [userInfo]);

  // -----------------------------------------------------------
  // state
  // 送進 檢視人員設定 SetReportEmpModal的arr
  const [reviewersPickArr, setReviewersPickArr] = useState<Parameters<typeof SetReportEmpModal>[0]['dataArr']>();

  // 每個日報上傳前要選reviewer，這是那個modal的開關
  const [showReviewerForReportModal, setShowReviewerForReportModal] = useState(false);

  // 日報表tagArr，送進TagCarousel
  const [tagArr, setTagArr] = useState<Ttag[]>([]);

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  const [searchObj, setSearchObj] = useState<{
    isUserReviewed: '全部' | '未檢視' | '已檢視';
    date: string;
  }>({ isUserReviewed: '全部', date: '' });

  const searchObjToQuery = () => {
    setSearchObj({
      isUserReviewed: searchQuery.isUserReviewed,
      date: searchQuery.date,
    });
  };

  // ----------------------------------------------------------------------

  const filterIsMine = (() => {
    if (isMine) {
      return { $eq: userId };
    }

    if (!isMine) {
      return { $ne: userId };
    }

    return undefined;
  })();

  const params = (() => {
    let userId = userInfo.employee?.id;
    let isUserReviewed;
    let isReviewCompleted;

    if (searchQuery?.isUserReviewed === undefined) {
      isUserReviewed = undefined;
      isReviewCompleted = undefined;
    }

    if (searchQuery?.isUserReviewed === '已檢視') {
      isUserReviewed = { $notNull: true };
      isReviewCompleted = true;
    }

    if (searchQuery?.isUserReviewed === '未檢視') {
      isUserReviewed = { $null: true };
      isReviewCompleted = false;
    }

    if (isMine) {
      userId = undefined;
      isUserReviewed = undefined;
    } else {
      isReviewCompleted = undefined;
    }

    const date = yearConversion_chToStandard(searchQuery?.date) || undefined;

    return {
      filter: {
        'employee.id': filterIsMine,
        $and: {
          'reviewStatus.reviewedAt': isUserReviewed,
          'reviewStatus.reviewerEmployee.id': { $eq: userId },
        },
        isReviewCompleted: { $eq: isReviewCompleted },
        date: { $eq: date },
      },
    };
  })();

  const params_calendar = {
    ...params,
    pageSize: 999,
  };

  /**月曆用的 */
  const { dailyReport: dailyReport_calendar, updateDailyReports: updateDailyReports_calendar } =
    useApiDailyReports(params_calendar);

  const update_calendar = async (dynamicFilter?: Tparams['filter']) => {
    try {
      setIsLoading(true);
      await updateDailyReports_calendar(dynamicFilter);
    } catch {
      myAlert.err({ title: '取得月曆日報表列表失敗' });
    }

    setIsLoading(false);
  };

  const update_calendar_thisMonth = async () => {
    const now = moment();
    const filter = filterCre_nextAndPrevMonth(now);

    try {
      setIsLoading(true);
      await updateDailyReports_calendar(filter);
    } catch {
      myAlert.err({ title: '取得月曆日報表列表失敗' });
    }

    setIsLoading(false);
  };

  /**列表用的資料 */
  const { data: dailyReportArr, viewRef, reset, isLoading: isLoading_v2 } = useApiDailyReports_v2(params);

  // 取得所有檢視人員
  const { updateReviewersArr: updateReviewersArr } = useApiDailyReports_reviewers();

  const { update: updateEmployeeArr } = useEmployee({
    pageSize: 999999,
    populate: ['jobs', 'user'],
    sort: 'idNumber',
  });

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------

  const toUpdateDailyReports = async () => {
    if (!router.isReady) {
      return;
    }

    setSearchObj({
      isUserReviewed: (router.query.isUserReviewed ?? '全部') as (typeof searchObj)['isUserReviewed'],
      date: (router.query.date ?? '') as string,
    });
    cancelEditNewDailyReport();

    try {
      setIsLoading(true);

      if (isCalendar) {
        await update_calendar_thisMonth();
      } else {
        await reset();
      }
    } catch {
      if (searchQuery?.date) {
        myAlert.err({ title: '取得總日報失敗', content: '日期格式錯誤，請檢察搜尋日期或網址的date參數' });

        return;
      }

      myAlert.err({ title: '取得總日報失敗' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    toUpdateDailyReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery.isUserReviewed, searchQuery.date, isMine, isCalendar]);

  useEffect(() => {
    if (!dailyReportArr) {
      return;
    }

    router.push({
      query: {
        isUserReviewed: '全部',
        date: '',
        isMine,
      },
    });
    setSearchObj({
      isUserReviewed: '全部',
      date: '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMine]);

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // 編輯中的日報表，送進ReportTable
  const {
    report: reportInEdit,
    setReport,
    reNew_report,
    addReportItem: addDailyReportItem,
    // removeReportItem: removeDailyReportItem,
    changeReviewToChecked,
    switchIsEdit,
    reportIsEdit: isReportEdit,
    changeReportDate,
    //
    reportItemKeyArr,
    setReportItemKeyArr,
  } = useReport({ userInfo });

  const editReport = async (reportId: string, prevDate: string | undefined) => {
    const dailyReport = await reqApiDailyReports_id(reportId);

    if (!dailyReport) {
      return;
    }

    reNew_report({ dailyReport, userInfo, prevDate: prevDate });
    searchObjToQuery();
  };

  const editReport_today = async (prevDate: string | undefined) => {
    reNew_report({ dailyReport: undefined, userInfo, prevDate });
    searchObjToQuery();
  };

  const cancelEditNewDailyReport = () => {
    setReport(undefined);
  };

  // ----------------------------------------------------------------------
  // TagCarousel
  const addTag = async (tag: Ttag) => {
    if (identity === 'reporter') {
      if (userInfo.employee?.id !== tag.employeeId) {
        return myAlert.warning({ title: '只能編輯自己的日報表' });
      }
    }

    await editReport(tag.reportId, tag.prevDate);

    if (tagArr.some((theTag) => theTag.reportId === tag.reportId)) {
      return;
    }

    setTagArr((arr) => {
      const newArr = _.cloneDeep(arr);
      newArr.push(tag);

      return newArr;
    });
  };

  const removeTag = (index: number, tagReportId: string) => {
    setTagArr((arr) => {
      const newArr = _.cloneDeep(arr);
      newArr.splice(index, 1);

      return newArr;
    });

    if (tagReportId === reportInEdit?.id) {
      cancelEditNewDailyReport();
    }
  };

  // ----------------------------------------------------------------------
  // 檢視人員設定
  // SetReportEmpModal

  //**開啟回報人員設定面板 */
  const editRivewerPickArr = async () => {
    const resArr = await Promise.all([
      updateReviewersArr(), // 取得所有檢視人員
      updateEmployeeArr(), // 取得所有人員
    ]);

    const reviewersArr = resArr[0];
    const employeeArr = resArr[1].data;
    const reviewersPickArr = formatRiewerPickArr({
      dailyReports_ReportersArr: reviewersArr,
      employeeArr,
    });
    setReviewersPickArr(reviewersPickArr);
  };

  /**發出設定檢視人員apiReq */
  const reqApiPatchDailyReports_viewers = async (employeeArr: Parameters<typeof SetReportEmpModal>[0]['dataArr']) => {
    const shouldReportEmpArr: typeof employeeArr = [];
    employeeArr.forEach((employee) => {
      if (employee.shouldReport) {
        shouldReportEmpArr.push(employee);
      }
    });
    const isPass = !shouldReportEmpArr.some((emp) => emp.isHaveUser === false);

    if (!isPass) {
      return myAlert.warning({ title: '名單錯誤', content: '只能選擇有ERP操作權限的人員' });
    }

    const employeeIds = shouldReportEmpArr.map((emp) => emp.id);

    try {
      showRootLoading(true);
      await apiPatchDailyReports_reviewers({ employeeIds });
      cancelSetRivewerModal();
      myAlert.success({ title: '更新檢視人員成功' });

      try {
        await updateReviewersArr();
      } catch {
        myAlert.err({ title: '檢視人員取得失敗' });
      }
    } catch {
      myAlert.err({ title: '更新檢視人員失敗' });
    } finally {
      showRootLoading(false);
    }
  };

  /**關閉回報人員設定面板 */
  const cancelSetRivewerModal = () => {
    setReviewersPickArr(undefined);
  };

  // ----------------------------------------------------------------------
  // 更新日報表

  /**發出更新日報表請求 (上傳 按鈕)*/
  const reqApiPatchDailyReports_my = async (reviewerArr: TemployeeDto[], examinerArr: TemployeeDto[]) => {
    if (!reportInEdit) {
      return;
    }

    if (reviewerArr.length === 0) {
      return myAlert.warning({ title: '請選擇檢視人員' });
    }

    const reviewerIds = reviewerArr.map((emp) => emp.id);
    const examinerIds = examinerArr.map((emp) => emp.id);

    const theDate = reportInEdit.date;

    if (!theDate) {
      return myAlert.warning({ title: '請選擇日期' });
    }

    const arr = reportItemKeyArr.map((key) => {
      return reportInEdit.itemList[key];
    });

    // const items = Object.values(reportInEdit.itemList).map((item) => {
    const items = arr.map((item) => {
      const year = new Date(theDate).getFullYear();
      const month = new Date(theDate).getMonth();
      const th = new Date(theDate).getDate();

      const setDateToReportDate = (dateStr: string) => {
        const date = new Date(dateStr);
        date.setFullYear(year);
        date.setMonth(month);
        date.setDate(th);

        return date.toISOString();
      };

      const postBody = item.postBody;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      postBody.arrivalTime = setDateToReportDate(postBody.arrivalTime!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      postBody.departureTime = setDateToReportDate(postBody.departureTime!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      postBody.departureWorksiteTime = setDateToReportDate(postBody.departureWorksiteTime!);

      return postBody;
    });

    try {
      showRootLoading(true);
      await apiPatchDailyReports_my({
        date: moment(theDate).format('YYYY-MM-DD'),
        body: {
          reviewerIds,
          examinerIds,
          items,
        },
      });
      cancelEditNewDailyReport();
      myAlert.success({ title: '更新日報表完成' });

      if (isCalendar) {
        const now = moment();
        const dynamicFilter = filterCre_nextAndPrevMonth(now);
        await update_calendar(dynamicFilter);
      } else {
        reset();
      }
    } catch (error) {
      const err = error as AxiosError<{
        error: string;
        message: string;
        statusCode: number;
      }>;
      const { message, statusCode } = err.response?.data ?? {};

      const isReviewed = message?.includes('has already reviewed');

      if (isReviewed) {
        return myAlert.warning({ title: '更新日報表失敗', content: '該日報表已被檢視，不能再變更' });
      }

      myAlert.err({ title: '更新日報表失敗' });
    } finally {
      showRootLoading(false);
    }

    setShowReviewerForReportModal(false);
  };

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  const onChange_isUserReviewed = (v: string) => {
    setSearchObj((obj) => ({
      ...obj,
      isUserReviewed: v as (typeof searchObj)['isUserReviewed'],
    }));
  };

  const onChange_date = (v: string) => {
    setSearchObj((obj) => ({ ...obj, date: v }));
  };

  const searchTargetList = (() => {
    const arr = [
      {
        options: reportedAtOptions,
        width: '110px',
        value: searchObj?.isUserReviewed,
        onChange: onChange_isUserReviewed,
      },
      {
        placeholder: '搜尋日期',
        width: '80px',
        value: searchObj?.date,
        onChange: onChange_date,
      },
    ];

    return arr;
  })();

  const doSearch: TdoSearch = () => {
    if (searchObj.date) {
      const date = yearConversion_chToStandard(searchObj.date);

      if (!date) {
        return myAlert.warning({ title: '搜尋時間格式錯誤', content: '例:101-01-01' });
      }
    }

    router.push({
      query: {
        isUserReviewed: searchObj.isUserReviewed,
        date: searchObj.date,
        isMine,
        isCalendar,
      },
    });
  }; // doSearch

  const searchGroup: TsearchGroup = {
    searchTargetList,
    doSearch,
    controlled: true,
  };

  // ---------------------------
  const doCheck = async () => {
    if (reportInEdit?.isReviewedByUser === true) {
      return myAlert.warning({ title: '已檢視過' });
    }

    if (!reportInEdit?.id) {
      return;
    }

    try {
      showRootLoading(true);
      const res = await apiDailyReports_review(reportInEdit.id);
      changeReviewToChecked(!!res);
      showRootLoading(false);

      if (isCalendar) {
        const now = moment();
        const dynamicFilter = filterCre_nextAndPrevMonth(now);
        await update_calendar(dynamicFilter);
      } else {
        reset();
      }
    } catch (error) {
      const err = error as AxiosError<{
        error: string;
        message: string;
        statusCode: number;
      }>;
      const { message, statusCode } = err.response?.data ?? {};

      if (statusCode === 403) {
        return myAlert.warning({ title: '您沒有權限檢視該日報表' });
      }

      myAlert.err({ title: '檢視失敗' });
    } finally {
      showRootLoading(false);
    }
  };

  const { panelList } = panelListCreator({
    reportInEdit,
    doCheck,
    switchIsEdit,
    setShowReviewerForReportModal,
    dailyReportArr: dailyReportArr ?? [],
    isCalendar,
    router,
    searchGroup,
    editRivewerPickArr,
    editReport_today,
    identity,
    isReportEdit,
    userInfo,
    dailyReport_calendar,
  });

  // ----------------------------------------------------------------------
  const customeLeft = [
    <TagCarousel
      key="1"
      tagArr={tagArr}
      editReport={editReport}
      removeTag={removeTag}
      activeId={reportInEdit?.id ?? ''}
    />,
  ];

  // ----------------------------------------------------------------------
  const leftTagOnClick = () => {
    cancelEditNewDailyReport();
  };

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // mobile
  const [showSearchDrawer, setShowSearchDrawer] = useState(false);

  const doShowDrawer = () => {
    setShowSearchDrawer(true);
  };

  const closeShowDrawer = () => {
    setShowSearchDrawer(false);
  };

  // ----------------------------------------------------------------------

  const dailyReportContextValue: TdailyReportContext = {
    reportInEdit,
    isReportEdit,
    switchIsEdit,
    setShowReviewerForReportModal,
    cancelEditNewDailyReport,
    changeReportDate,
    identity,
    doCheck,
    userInfo,
    //
    reportItemKeyArr,
    setReportItemKeyArr,
  };

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  return (
    <>
      <SubLayer
        bodyClassName={classNames(scss.subLayer, scss.plus)}
        containerChildren={<LoadingCover01 isLoading={isLoading || isLoading_v2} />}
      >
        {/*  */}
        <PageHeader02
          // key={+isMine}
          tag="日報表"
          tagClassName={classNames(scss.pageHeaderTag, scss.plus, scss.pplus)}
          tagOnClick={leftTagOnClick}
          panelList={panelList}
          customeLeft={customeLeft}
        />
        <PageHeader_mobile_dailyReport
          doShowDrawer={doShowDrawer}
          editRivewerPickArr={editRivewerPickArr}
          employeeChName={reportInEdit?.employeeChName}
          date={reportInEdit?.date}
          identity={identity}
          editReport_today={() => editReport_today(dailyReportArr?.[0]?.date)}
          cancelEditNewDailyReport={cancelEditNewDailyReport}
          isSearch={!!(searchObj?.isUserReviewed !== undefined || searchObj?.date !== undefined)}
        />

        {/*  */}
        {!isCalendar && <ReporterList dailyReportArr={dailyReportArr ?? []} addTag={addTag} viewRef={viewRef} />}
        {isCalendar && (
          <TheCalendar
            isMine={isMine}
            userInfo={userInfo}
            addTag={addTag}
            dailyReportArr={dailyReport_calendar ?? []}
            update_calendar={update_calendar}
          />
        )}

        <DailyReportContext.Provider value={dailyReportContextValue}>
          <ReportTable
            addDailyReportItem={addDailyReportItem}
            //  removeDailyReportItem={removeDailyReportItem}
          />
        </DailyReportContext.Provider>

        {/* mobile */}
        <SearchDrawer
          visible={showSearchDrawer}
          onSearch={doSearch}
          onCancel={closeShowDrawer}
          searchObj={searchObj}
          onChange_isUserReviewed={onChange_isUserReviewed}
          onChange_date={onChange_date}
        />
        {/*  */}
      </SubLayer>

      <SetReportEmpModal
        visible={!!reviewersPickArr}
        onConfirm={reqApiPatchDailyReports_viewers}
        onCancel={cancelSetRivewerModal}
        dataArr={reviewersPickArr ?? []}
        label="檢視人員設定"
        tip="可複選"
      />

      {/* 上傳前選擇兩種人員 */}
      <ReviewerAndExaminerSelector
        visible={showReviewerForReportModal}
        onConfirm={reqApiPatchDailyReports_my}
        onCancel={() => setShowReviewerForReportModal(false)}
        userId={userInfo.employee?.id}
        lastStatus={dailyReportArr?.[0]?.reviewStatus || []}
      />
    </>
  );
}

// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
const reqApiDailyReports_id = async (reportId: string) => {
  try {
    showRootLoading(true);
    const res = await apiDailyReports_id(reportId);

    return res;
  } catch {
    myAlert.err({ title: '取得日報表失敗' });
  } finally {
    showRootLoading(false);
  }
};

// ==========================================================================
/**判斷是否為回報人員權限 */
const checkIsSubordinate = (userInfo: TuserDto) => {
  /**如果使用者是employee，從grade判斷 */
  if (userInfo?.employee?.jobs) {
    const jobs = userInfo.employee.jobs;

    if (!jobs[0]) {
      return true;
    }

    const jobsCopy = _.sortBy(jobs, 'grade').reverse();

    if (jobsCopy[0].grade >= 14) {
      return false;
    } else {
      return true;
    }
  }

  /**使用者不是employee，那就是admin*/
  return false;
};

// ==========================================================================

/** 將員工列表變成可以被SetReportEmpModal使用的樣子*/
const formatRiewerPickArr = ({
  dailyReports_ReportersArr,
  employeeArr,
}: {
  dailyReports_ReportersArr: TemployeeDto[];
  employeeArr: TemployeeDto[] | undefined;
}) => {
  if (!dailyReports_ReportersArr || !employeeArr) {
    return [];
  }

  const result = employeeArr.map((item) => {
    const match = dailyReports_ReportersArr.find((x) => x.id === item.id);
    const shouldReport = match ? true : false;
    const theJobs = (() => {
      if (item.jobs) {
        return _.sortBy(item.jobs, 'grade');
      } else {
        return [];
      }
    })();

    const obj = {
      id: item.id,
      chName: item.chName,
      idNumber: item.idNumber,
      job: theJobs[0]?.name ?? '',
      grade: theJobs[0]?.grade ?? '',
      shouldReport,
      isHaveUser: !!item.user,
    };

    return obj;
  });

  return result;
};

// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================

const panelListCreator = ({
  reportInEdit,
  doCheck,
  switchIsEdit,
  setShowReviewerForReportModal,
  dailyReportArr,
  isCalendar,
  router,
  searchGroup,
  editRivewerPickArr,
  editReport_today,
  identity,
  isReportEdit,
  userInfo,
  dailyReport_calendar,
}: {
  reportInEdit: ThookEmptyReport | undefined;
  doCheck: () => void;
  switchIsEdit: () => void;
  setShowReviewerForReportModal: (v: boolean) => void;
  dailyReportArr: TdailyReportDto[] | undefined;
  isCalendar: boolean;
  router: NextRouter;
  searchGroup: TsearchGroup;
  editRivewerPickArr: () => void;
  editReport_today: (prevDate: string) => void;
  identity: Tidentity;
  isReportEdit: boolean;
  userInfo: TuserDto;
  dailyReport_calendar: TdailyReportDto[] | undefined;
}) => {
  const listSwitchButton: TpanelList[number] = {
    type: 'myButton',
    label: isCalendar ? '列表' : '月曆',
    onClick: () => {
      router.push({
        query: {
          ...router.query,
          isCalendar: isCalendar ? 'false' : 'true',
        },
      });
    },
    img: isCalendar ? iconMenu.src : iconFourCube.src,
  };

  /**manager 檢視人員設定 */
  const panelList_manager_notInEdit: TpanelList = [
    { searchGroup },
    {
      type: 'myButton',
      label: '檢視人員設定',
      onClick: editRivewerPickArr,
    },
    listSwitchButton,
  ];

  /**reporter 新增回報 */
  const panelList_reporter_notInEdit: TpanelList = [
    { searchGroup },
    {
      type: 'myButton',
      label: '新增回報',
      onClick: () => {
        if (isCalendar && dailyReport_calendar) {
          editReport_today(dailyReport_calendar?.[0]?.date);
        }

        if (!isCalendar && dailyReportArr) {
          editReport_today(dailyReportArr?.[0]?.date);
        }
      },
    },
    listSwitchButton,
  ];

  /**reviewer 已讀/未讀 isReviewedByUser */
  const panelList_reviewer_inEdit_user: TpanelList = [
    {
      custom: (
        <CheckButton
          // checkLabel="已讀"
          checkLabel="已讀"
          uncheckLable="未讀"
          value={!!reportInEdit?.isReviewedByUser}
          onClick={doCheck}
        />
      ),
    },
  ];

  /**reporter 編輯 */
  const panelList_reporter_inEdit01: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: switchIsEdit,
    },
  ];

  /**reporter 上傳 取消 */
  const panelList_reporter_inEdit02: TpanelList = [
    {
      type: 'redButton',
      label: '上傳',
      onClick: () => {
        if (!reportInEdit?.date) {
          return myAlert.warning({ title: '請選擇日期' });
        }

        setShowReviewerForReportModal(true);
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: switchIsEdit,
    },
  ];

  const panelList_reporter_reviewed: TpanelList = [
    {
      custom: <Badge className={scss.antdBadge02} color="auto" text="已檢視" />,
    },
  ];

  if (reportInEdit?.isReviewedByOther) {
    panelList_reporter_inEdit01.push(panelList_reporter_reviewed[0]);
    panelList_reporter_inEdit02.push(panelList_reporter_reviewed[0]);
  }

  const panelList = (() => {
    if (reportInEdit?.isUserIsViewer) {
      return [];
    }

    if (identity === 'manager') {
      if (!reportInEdit) {
        return panelList_manager_notInEdit;
      } else if (reportInEdit.isAllowToReview) {
        return panelList_reviewer_inEdit_user;
      } else {
        return [];
      }
    }

    if (identity === 'reviewer') {
      if (!reportInEdit) {
        return panelList_reporter_notInEdit;
      } else {
        if (!reportInEdit?.employeeId || reportInEdit?.employeeId === userInfo?.employee?.id) {
          if (isReportEdit) {
            return panelList_reporter_inEdit02;
          }

          return panelList_reporter_inEdit01;
        } else if (reportInEdit.isAllowToReview) {
          return panelList_reviewer_inEdit_user;
        }

        return [];
      }
    }

    if (identity === 'reporter') {
      if (!reportInEdit) {
        return panelList_reporter_notInEdit;
      } else {
        if (isReportEdit) {
          return panelList_reporter_inEdit02;
        }

        return panelList_reporter_inEdit01;
      }
    }

    return [];
  })();

  return {
    panelList_manager_notInEdit,
    panelList_reporter_notInEdit,
    panelList_reviewer_inEdit_user,
    panelList_reporter_inEdit01,
    panelList_reporter_inEdit02,
    panelList_reporter_reviewed,
    panelList,
  };
};
