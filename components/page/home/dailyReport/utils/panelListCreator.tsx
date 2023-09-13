import { NextRouter } from 'next/router';

// antd
import { Badge } from 'antd';

// gear
import CheckButton from 'components/global/gear/button/checkButton';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// hook
import { ThookEmptyReport } from 'hooks/home/useDailyReport';

// icon
import iconFourCube from 'public/image/icon/fourCube.svg';
import iconMenu from 'public/image/icon/menu.svg';

// type
import { TdailyReportDto } from 'js/api/api_dailyReport';
import { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { TuserDto } from 'js/api/dtoTypes';
import { Tidentity } from 'pages/home/dailyReport';

// css
import scss from './panelListCreator.module.scss';

// ========================================================================================
// ========================================================================================
// ========================================================================================
// ========================================================================================

const panelListCreator = ({
  reportInEdit,
  doCheck,
  switchIsEdit,
  // setShowReviewerForReportModal,
  reqApiPatchDailyReports_my,
  dailyReportArr,
  isCalendar,
  router,
  editRivewerPickArr,
  editReport_today,
  identity,
  isReportEdit,
  userInfo,
  dailyReport_calendar,
  //
  customSearchBar,
  saveTempReport,
  getTempReport,
}: {
  reportInEdit: ThookEmptyReport | undefined;
  doCheck: () => void;
  switchIsEdit: () => void;
  // setShowReviewerForReportModal: (v: boolean) => void;
  reqApiPatchDailyReports_my: () => void;
  dailyReportArr: TdailyReportDto[] | undefined;
  isCalendar: boolean;
  router: NextRouter;
  editRivewerPickArr: () => void;
  editReport_today: (prevDate: string) => void;
  identity: Tidentity;
  isReportEdit: boolean;
  userInfo: TuserDto;
  dailyReport_calendar: TdailyReportDto[] | undefined;
  //
  customSearchBar: JSX.Element;
  saveTempReport: () => void;
  getTempReport: () => void;
}) => {
  const isReviewCompleted = reportInEdit?.isReviewCompleted;

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
    {
      custom: customSearchBar,
    },
    {
      type: 'myButton',
      label: '檢視人員設定',
      onClick: editRivewerPickArr,
    },
    listSwitchButton,
  ];

  /**reporter 新增回報 */
  const panelList_reporter_notInEdit: TpanelList = [
    {
      custom: customSearchBar,
    },
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
  const editBtn: TpanelList[number] = {
    type: 'myButton',
    label: '編輯',
    onClick: switchIsEdit,
  };

  const panelList_reporter_inEdit01: TpanelList = [
    //
    isReviewCompleted ? undefined : editBtn,
  ];

  /**reporter 上傳 取消 */
  const panelList_reporter_inEdit02: TpanelList = [
    {
      type: 'myButton',
      label: '儲存草稿',
      onClick: saveTempReport,
    },
    {
      type: 'myButton',
      label: '取得草稿',
      onClick: getTempReport,
    },
    {
      type: 'redButton',
      label: '上傳',
      onClick: () => {
        if (!reportInEdit?.date) {
          return myAlert.warning({ title: '請選擇日期' });
        }

        reqApiPatchDailyReports_my();
        // setShowReviewerForReportModal(true);
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

export { panelListCreator };
