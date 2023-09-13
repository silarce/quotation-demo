import { useState, useEffect } from 'react';

import classNames from 'classnames';

// layer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// gear
import SearchBar from 'components/global/gear/inputAndSel_v2/searchBar/searchBar';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import EmployeeSelector, { TemployeeDto } from 'components/global/gear/modal/employeeSelector';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import ReviewerSelector from 'components/global/gear/modal/reviewerSelector';

// icon
import { IconDelete01, IconEdit } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './index.module.scss';

// api

import {
  TcreateDailyReportReviewerPresetDto,
  TreporterPreset,
  apiPatchReviewerPresets,
  useApiGetReviewerPresets,
} from 'js/api/api_dailyReport';
import { fi } from 'date-fns/locale';

// ===================================================================

type TreviewerPresets = {
  report: TemployeeDto[];
  reviewer: TemployeeDto[];
  examiner: TemployeeDto[];
};

const creEmployeeReviewerPresets = () => ({
  report: [],
  reviewer: [],
  examiner: [],
});

// ===================================================================

export default function SetReviewer() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState<string>();

  // ---------------------------------------------------------------

  const params = {
    filter: {
      $or: {
        'reportEmployee.idNumber': { $eq: searchValue },
        'reportEmployee.chName': { $contains: searchValue },
        'reportEmployee.enName': { $contains: searchValue },
        'reportEmployee.jobs.name': { $eq: searchValue },
        'reportEmployee.jobs.department.name': { $eq: searchValue },
      },
    },
  };

  const { reporterArr, isLoading: dataIsLoading, reset } = useApiGetReviewerPresets({ customParams: params });

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  // ---------------------------------------------------------------
  const [reviewerPresets, setReviewerPresets] = useState<TreviewerPresets>(creEmployeeReviewerPresets());

  const [showReporterSelector, setShowReportSelector] = useState(false); //回報人員
  const [showReviewerSelector, setShowReviewerSelector] = useState(false); // 審核人員
  const [showExaminerSelector, setShowExaminerSelector] = useState(false); // 檢視人員

  const clearReviewerPresets = () => {
    setReviewerPresets(creEmployeeReviewerPresets());
  };

  //
  const onReporterConfirm = (arr: TemployeeDto[]) => {
    if (arr.length === 0) {
      myAlert.info({ title: '沒有選擇回報人員' });

      return;
    }

    setReviewerPresets((state) => {
      state.report = arr;

      return { ...state };
    });
    setShowReviewerSelector(true);
    setShowReportSelector(false);
  };

  const onReporterCancel = () => {
    setShowReportSelector(false);
    clearReviewerPresets();
  };

  //
  const onReviewerConfirm = (arr: TemployeeDto[]) => {
    setReviewerPresets((state) => {
      state.reviewer = arr;

      return { ...state };
    });
    setShowReviewerSelector(false);
    setShowExaminerSelector(true);
  };

  const onReviewerCancel = () => {
    setShowReviewerSelector(false);
    clearReviewerPresets();
  };

  //
  const onExaminerConfirm = (arr: TemployeeDto[]) => {
    setReviewerPresets((state) => {
      state.examiner = arr;

      return { ...state };
    });
    setTimeout(() => {
      reqNewReporter();
      clearReviewerPresets();
    }, 100);
  };

  const onExaminerCancel = () => {
    setShowExaminerSelector(false);
    clearReviewerPresets();
  };

  // ----------------------------------------------------

  /**新增回報人員 */
  const reqNewReporter = async () => {
    const body: TcreateDailyReportReviewerPresetDto = {
      reportEmployeeIds: [],
      reviewerEmployeeIds: [],
      examinerEmployeeIds: [],
    };

    body.reportEmployeeIds = reviewerPresets.report.map((emp) => emp.id);
    body.reviewerEmployeeIds = reviewerPresets.reviewer.map((emp) => emp.id);
    body.examinerEmployeeIds = reviewerPresets.examiner.map((emp) => emp.id);

    if (
      //
      body.reviewerEmployeeIds.length === 0 &&
      body.examinerEmployeeIds.length === 0
    ) {
      return myAlert.info({ title: '沒有選擇審核人員或檢視人員' });
    }

    try {
      setIsLoading(true);
      await apiPatchReviewerPresets(body);
      reset();
    } catch (error) {
      myAlert.err({ title: '新增回報人員失敗' });
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // ----------------------------------------------------
  // ----------------------------------------------------

  const [targetPreset, setTargetPreset] = useState<TreporterPreset>();
  const [showPresetReviewersSelector, setShowPresetReviewersSelector] = useState(false); // 審核人員
  const [showPresetExaminersSelector, setShowPresetExaminersSelector] = useState(false); // 檢視人員

  //_________________________________________________
  const openPresetReviewersSelector = (preset: TreporterPreset) => {
    setTargetPreset(preset);
    setShowPresetReviewersSelector(true);
  };

  const onPresetReviewersConfirm = (arr: TemployeeDto[]) => {
    if (!targetPreset) {
      return;
    }

    const copy = { ...targetPreset };
    copy.reviewer = arr;
    setTargetPreset(copy);

    reqEditReporter(copy);
  };

  const onPresetReviewersCancel = () => {
    setShowPresetReviewersSelector(false);
    setTargetPreset(undefined);
  };
  //_________________________________________________

  const openPresetExaminersSelector = (preset: TreporterPreset) => {
    setTargetPreset(preset);
    setShowPresetExaminersSelector(true);
  };

  const onPresetExaminersConfirm = (arr: TemployeeDto[]) => {
    if (!targetPreset) {
      return;
    }

    const copy = { ...targetPreset };
    copy.examiner = arr;
    setTargetPreset(copy);

    reqEditReporter(copy);
  };

  const onPresetExaminersCancel = () => {
    setShowPresetExaminersSelector(false);
    setTargetPreset(undefined);
  };

  // ----------------------------------------------------

  const reqEditReporter = async (targetPreset: TreporterPreset, confirmToDelete?: boolean) => {
    const body: TcreateDailyReportReviewerPresetDto = {
      reportEmployeeIds: [],
      reviewerEmployeeIds: [],
      examinerEmployeeIds: [],
    };

    body.reportEmployeeIds = [targetPreset.reporter.id];
    body.reviewerEmployeeIds = targetPreset.reviewer.map((emp) => emp.id) ?? [];
    body.examinerEmployeeIds = targetPreset.examiner.map((emp) => emp.id) ?? [];

    if (
      //
      body.reviewerEmployeeIds.length === 0 &&
      body.examinerEmployeeIds.length === 0 &&
      !confirmToDelete
    ) {
      return myAlert.confirm({
        title: '同時清空審核人員與檢視人員將會該回報人員刪除',
        props: {
          onOk: () => {
            reqEditReporter(targetPreset, true);
          },
        },
      });
    }

    try {
      setIsLoading(true);
      await apiPatchReviewerPresets(body);
      reset();
    } catch (error) {
      myAlert.err({ title: '編輯回報人員失敗' });
    } finally {
      onPresetReviewersCancel();
      onPresetExaminersCancel();
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // ----------------------------------------------------
  // ----------------------------------------------------

  const deleteReporter = async (id: string) => {
    const body = {
      reportEmployeeIds: [id],
      reviewerEmployeeIds: [],
      examinerEmployeeIds: [],
    };

    try {
      setIsLoading(true);
      await apiPatchReviewerPresets(body);
      reset();
    } catch (error) {
      myAlert.err({ title: '刪除回報人員失敗' });
    } finally {
      onPresetReviewersCancel();
      onPresetExaminersCancel();
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // ----------------------------------------------------
  // ----------------------------------------------------
  const panelList: TpanelList = [
    {
      custom: (
        <SearchBar
          inputSelPropsArr={[
            {
              wrapperStyle: { width: '100px' },
              inputProps: {
                props: {
                  placeholder: '搜尋回報人員',
                },
              },
            },
          ]}
          onClick={(arr) => {
            setSearchValue(arr[0]);
          }}
        />
      ),
    },
    {
      type: 'addButton',
      label: '新增回報人員',
      onClick: () => {
        !(dataIsLoading || isLoading) && setShowReportSelector(true);
      },
    },
  ];

  return (
    <SubLayer isLoading_subLayer={dataIsLoading || isLoading}>
      <PageHeader02 tag="審核設定" panelList={panelList} />
      <div className={scss.main}>
        <Thead />
        <div>
          {reporterArr.map((reporterPreset, index) => {
            // const key = reporterPreset.reporter.id;

            return (
              <Row02
                key={index}
                reporterPreset={reporterPreset}
                openPresetReviewersSelector={() => openPresetReviewersSelector(reporterPreset)}
                openPresetExaminersSelector={() => openPresetExaminersSelector(reporterPreset)}
                deleteReporter={() => deleteReporter(reporterPreset.reporter.id)}
              />
            );
          })}

          {/* <Row showEmployeeSelector={() => {}} /> */}
        </div>
      </div>

      {/* 檢視人員設定 */}
      {/* <EmployeeSelector
        showModal={showReporterSelector}
        tip="請選擇檢視人員，可複選"
        onConfirm={() => {}}
        onCancel={() => {}}
        // isCancelOnConfirm={false}
      /> */}
      {/* 新增回報人員 */}
      <EmployeeSelector
        showModal={showReporterSelector}
        tip="請選擇回報人員，可複選"
        onConfirm={onReporterConfirm}
        onCancel={onReporterCancel}
        isCancelOnConfirm={false}
      />
      <ReviewerSelector
        showModal={showReviewerSelector}
        tip="請選擇審核人員，可複選。反灰者為已被選為回報人員或檢視人員者"
        onConfirm={onReviewerConfirm}
        onCancel={onReviewerCancel}
        exceptEmpArr={[...reviewerPresets.report, ...reviewerPresets.examiner]}
        isCancelOnConfirm={false}
      />
      <ReviewerSelector
        showModal={showExaminerSelector}
        tip="請選擇檢視人員，可複選。反灰者為已被選為回報人員或審核人員者"
        onConfirm={onExaminerConfirm}
        onCancel={onExaminerCancel}
        exceptEmpArr={[...reviewerPresets.report, ...reviewerPresets.reviewer]}
      />
      {/*  */}
      {/* 審核人員 */}
      <ReviewerSelector
        showModal={showPresetReviewersSelector}
        label="請選擇審核人員"
        tip="可複選，反灰者為已被選為檢視人員者"
        onConfirm={onPresetReviewersConfirm}
        onCancel={onPresetReviewersCancel}
        defaultEmpArr={targetPreset?.reviewer}
        exceptEmpArr={targetPreset?.examiner}
        isCancelOnConfirm={false}
        // 要記得做defaultEmpArr置頂與隱藏
        // 要記得做defaultEmpArr置頂與隱藏
        // 要記得做defaultEmpArr置頂與隱藏
        // 要記得做defaultEmpArr置頂與隱藏
      />
      {/* 檢視人員 */}
      <ReviewerSelector
        showModal={showPresetExaminersSelector}
        label="請選擇檢視人員"
        tip="可複選，反灰者為已被選為審核人員者"
        onConfirm={onPresetExaminersConfirm}
        onCancel={onPresetExaminersCancel}
        defaultEmpArr={targetPreset?.examiner}
        exceptEmpArr={targetPreset?.reviewer}
        isCancelOnConfirm={false}
      />
    </SubLayer>
  );
}

// ==========================================================

const Thead = () => {
  return (
    <div className={scss.thead}>
      <div>
        <span>回報人員</span>
      </div>
      <div>
        <span>審核人員</span>
      </div>
      <div>
        <span>檢視人員</span>
      </div>
      <div></div>
    </div>
  );
};

const Row = ({ showEmployeeSelector }: { showEmployeeSelector: () => void }) => {
  return (
    <CellWithBar className={scss.row}>
      <div>
        <span>王小明</span>
      </div>
      <div>
        <MyButton_v2 onClick={showEmployeeSelector} preImg="add" label="新增審核人員" />
      </div>
      <div>
        <MyButton_v2 onClick={showEmployeeSelector} preImg="add" label="新增檢視人員" />
      </div>
      <div>
        <IconDelete01
          onClick={() => {
            myAlert.confirm({ title: '確定刪除?' });
          }}
        />
      </div>
    </CellWithBar>
  );
};

const Row02 = ({
  reporterPreset,
  openPresetReviewersSelector,
  openPresetExaminersSelector,
  deleteReporter,
}: {
  reporterPreset: TreporterPreset;
  openPresetReviewersSelector: () => void;
  openPresetExaminersSelector: () => void;
  deleteReporter: () => void;
}) => {
  const { reporter, reviewer, examiner } = reporterPreset;

  return (
    <CellWithBar className={scss.row}>
      <div>
        <span>{reporter.chName || reporter.enName}</span>
      </div>
      {/*  */}
      <div>
        {reviewer.length !== 0 && (
          <div className={scss.nameListContainer}>
            <div className={scss.list}>
              {reviewer.map((emp, index) => {
                return <span key={index}>{emp.chName || emp.chName}</span>;
              })}
            </div>
            <IconEdit onClick={openPresetReviewersSelector} className={scss.edit} />
          </div>
        )}

        {reviewer.length === 0 && (
          <MyButton_v2 onClick={openPresetReviewersSelector} preImg="add" label="新增審核人員" />
        )}
      </div>

      {/*  */}
      <div>
        {examiner.length !== 0 && (
          <div className={scss.nameListContainer}>
            <div className={scss.list}>
              {examiner.map((emp, index) => {
                return <span key={index}>{emp.chName || emp.chName}</span>;
              })}
            </div>

            <IconEdit onClick={openPresetExaminersSelector} className={scss.edit} />
          </div>
        )}

        {examiner.length === 0 && (
          <MyButton_v2 onClick={openPresetExaminersSelector} preImg="add" label="新增檢視人員" />
        )}
      </div>
      {/*  */}
      <div>
        <IconDelete01
          onClick={() => {
            myAlert.confirm({
              title: '確定刪除?',
              props: {
                onOk: deleteReporter,
              },
            });
          }}
        />
      </div>
    </CellWithBar>
  );
};
