import { useState } from 'react';
import _ from 'lodash';
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

import { apiPatchReviewerPresets, TcreateDailyReportReviewerPresetDto } from 'js/api/api_dailyReport';

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
  const [reviewerPresets, setReviewerPresets] = useState<TreviewerPresets>(creEmployeeReviewerPresets());

  const [showReporterSelector, setShowReportSelector] = useState(false); //回報人員
  const [showReviewerSelector, setShowReviewerSelector] = useState(false); // 審核人員
  const [showExaminerSelector, setShowExaminerSelector] = useState(false); // 檢視人員

  const clearReviewerPresets = () => {
    setReviewerPresets(creEmployeeReviewerPresets());
  };

  //
  const onReporterConfirm = (arr: TemployeeDto[]) => {
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

  const reqNewReporter = async () => {
    const body: TcreateDailyReportReviewerPresetDto = {
      reportEmployeeIds: [],
      reviewerEmployeeIds: [],
      examinerEmployeeIds: [],
    };

    body.reportEmployeeIds = reviewerPresets.report.map((emp) => emp.id);
    body.reviewerEmployeeIds = reviewerPresets.reviewer.map((emp) => emp.id);
    body.examinerEmployeeIds = reviewerPresets.examiner.map((emp) => emp.id);

    try {
      await apiPatchReviewerPresets(body);
    } catch (error) {}
  };

  // ----------------------------------------------------

  // const [target, setTarget] = useState();

  // const onSelTargetViewer = (target: any, type: 'reviewer' | 'examiner') => {};

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
                  placeholder: '搜尋內容',
                },
              },
            },
          ]}
          onClick={() => {}}
        />
      ),
    },
    {
      type: 'addButton',
      label: '新增回報人員',
      onClick: () => setShowReportSelector(true),
    },
  ];

  return (
    <SubLayer>
      <PageHeader02 tag="審核設定" panelList={panelList} />
      <div className={scss.main}>
        <Thead />
        <div>
          <Row showEmployeeSelector={() => {}} />
          <Row02 showEmployeeSelector={() => {}} />
          <Row02 showEmployeeSelector={() => {}} />
          <Row02 showEmployeeSelector={() => {}} />
          <Row02 showEmployeeSelector={() => {}} />
          <Row02 showEmployeeSelector={() => {}} />
          <Row02 showEmployeeSelector={() => {}} />
        </div>
      </div>
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
      <ReviewerSelector
        showModal={false}
        tip="請選擇審核人員，可複選。反灰者為已被選為回報人員或檢視人員者"
        onConfirm={() => {}}
        onCancel={() => {}}
        exceptEmpArr={undefined}
      />
      <ReviewerSelector
        showModal={false}
        tip="請選擇檢視人員，可複選。反灰者為已被選為回報人員或審核人員者"
        onConfirm={() => {}}
        onCancel={() => {}}
        exceptEmpArr={undefined}
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

const Row02 = ({ showEmployeeSelector }: { showEmployeeSelector: () => void }) => {
  return (
    <CellWithBar className={scss.row}>
      <div>
        <span>王小明</span>
      </div>
      {/*  */}
      <div>
        <div className={scss.nameListContainer}>
          <div className={scss.list}>
            {nameArr.map((name, index) => {
              return <span key={index}>{name}</span>;
            })}
          </div>

          <IconEdit onClick={showEmployeeSelector} className={scss.edit} />
        </div>
      </div>
      {/*  */}
      <div>
        <div className={scss.nameListContainer}>
          <div className={scss.list}>
            {nameArr.map((name, index) => {
              return <span key={index}>{name}</span>;
            })}
          </div>

          <IconEdit onClick={showEmployeeSelector} className={scss.edit} />
        </div>
      </div>
      {/*  */}
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

const nameArr = [
  '曾剛玉',
  '謝艾廷',
  '景雅冠',
  '吳羽燕',
  '左孟盈',
  '蔣位偲',
  '曆文欣',
  '曹毅怡',
  '龔詠',
  '簡娟容',
  '鍾珊春',
  '趙薇依',
  '吳廷嘉',
  '馬長人',
  '馬芳辰',
  '曾剛玉',
  '謝艾廷',
  '景雅冠',
  '吳羽燕',
  '左孟盈',
  '蔣位偲',
  '曆文欣',
  '曹毅怡',
  '龔詠',
  '簡娟容',
  '鍾珊春',
  '趙薇依',
  '吳廷嘉',
  '馬長人',
  '馬芳辰',
];
