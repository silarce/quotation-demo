import { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

// global gear
import SelectorShell, { TsearcbBarProps } from './selectorShell';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import myAlert, { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';
import LoadingCoverWrapper01 from '../loadingCover/loadingCoverWrapper01';

// css
import style from './employeeSelector.module.scss';

// api
import { TemployeeDto, useApiDailyReports_reviewers } from 'js/api/api_dailyReport';

import { AppContext } from 'pages/_app';

export type { TemployeeDto };

export default function ReviewerSelector({
  showModal = false,
  onConfirm,
  onCancel,
  label,
  tip,
  selLimit,
  cancelOnConfirm = true,
  exceptIdArr,
}: {
  showModal?: boolean;
  onConfirm?: (v: TemployeeDto[]) => void;
  onCancel?: () => void;
  label?: string;
  tip?: React.ReactNode;
  selLimit?: 1;
  cancelOnConfirm?: boolean;
  exceptIdArr?: string[];
}) {
  const { rwd1023 } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  // 取得所有檢視人員
  const { reviewersArr, updateReviewersArr } = useApiDailyReports_reviewers();

  // -----------------------------------------------------
  // 被選的資料
  const [selEmployeeArr, setSelEmployeeArr] = useState<TemployeeDto[]>([]);

  const [searchValue, setSearchValue] = useState<string>();

  // ==================================================
  useEffect(() => {
    if (showModal) {
      (async () => {
        setIsLoading(true);

        try {
          await updateReviewersArr();
        } catch (error) {
          myAlert.err({ title: '取得檢視人員失敗' });
        }

        setIsLoading(false);
      })();
    }
  }, [showModal]);
  // ==================================================

  const onClick = (newEmp: TemployeeDto) => {
    const newArr = [...selEmployeeArr];

    if (selLimit === 1) {
      newArr[0] = newEmp;
      setSelEmployeeArr(newArr);

      return;
    }

    const theIndex = newArr.findIndex((emp) => emp.id === newEmp.id);

    if (theIndex > -1) {
      newArr.splice(theIndex, 1);
    } else {
      newArr.push(newEmp);
    }

    setSelEmployeeArr(newArr);
  };

  const theOnConfirm = () => {
    if (!selEmployeeArr) {
      return ModalInfo('請選擇公司');
    }

    onConfirm?.(selEmployeeArr);
    cancelOnConfirm && theOnCancel();
  };

  const theOnCancel = () => {
    onCancel?.();
    setSelEmployeeArr([]);
  };

  const onSearch = (v: string[]) => {
    setSearchValue(v[0]);
  };

  const inputSelPropsArr: TsearcbBarProps['inputSelPropsArr'] = [
    {
      inputProps: {
        wrapperStyle: { width: '160px' },
        props: {
          placeholder: '搜尋關鍵字',
        },
      },
    },
  ];

  // ==================================================

  return (
    <SelectorShell
      label={label ?? ''}
      visible={showModal}
      onConfirm={theOnConfirm}
      onCancel={theOnCancel}
      // onSearch={onSearch}
      width={rwd1023 ? '80vw' : '800px'}
      className={style.container}
      tip={tip}
      searcbBarProps={{
        inputSelPropsArr: inputSelPropsArr,
        onClick: onSearch,
      }}
    >
      <LoadingCoverWrapper01 isLoading={isLoading}>
        <div className={style.listContainer}>
          {reviewersArr.map((emp, index) => {
            const { id, idNumber, chName, jobs } = emp;

            if (exceptIdArr) {
              if (exceptIdArr.includes(id)) {
                return null;
              }
            }

            const jobNameArr = jobs?.map((job) => job.name);
            const job = _.maxBy(jobs, 'grade');
            const { name, grade, department } = job ?? {};

            if (searchValue) {
              const regex = new RegExp(searchValue, 'i');
              const jobNameMatch = jobNameArr?.some((jobName) => jobName?.match(regex));

              if (
                !idNumber.match(regex) &&
                !chName.match(regex) &&
                !`${grade}`.match(regex) &&
                !department?.name.match(regex) &&
                !jobNameMatch
              ) {
                return null;
              }
            }

            const isActive = selEmployeeArr.some((selEmp) => selEmp.id === emp.id);

            return (
              <CellWithBar key={index} isActive={isActive}>
                <div className={style.row} onClick={() => onClick(emp)}>
                  <span className={style.idNumber}>{idNumber}</span>
                  <span>{chName}</span>
                  <span>{name ? `${department?.name} / ${name}` : ''}</span>
                  <span>{grade && `Level ${grade}`}</span>
                </div>
              </CellWithBar>
            );
          })}
        </div>
      </LoadingCoverWrapper01>
    </SelectorShell>
  );
}
