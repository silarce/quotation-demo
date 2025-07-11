import Image from 'next/image';
import classNames from 'classnames';

// gear
import MyButton from 'components/global/gear/button/myButton';

// css
import scss from './pageHeader_mobile_dailyReport.module.scss';

// icon
import iconSearch from 'public/image/icon/search.svg?url';
import iconSearch_hover from 'public/image/icon/search_hover.svg?url';
import iconArrow from 'public/image/icon/arrow03_left.svg?url';

// ====================================================================
export default function PageHeader_mobile_dailyReport({
  doShowDrawer,
  editRivewerPickArr,
  employeeChName,
  date,
  identity,
  editReport_today,
  cancelEditNewDailyReport,
  isSearch,
}: {
  doShowDrawer: () => void;
  editRivewerPickArr: () => void;
  employeeChName: string | undefined;
  date: string | undefined | null;
  identity: 'manager' | 'reviewer' | 'reporter' | undefined;
  editReport_today: () => void;
  cancelEditNewDailyReport: () => void;
  isSearch: boolean;
}) {
  const Bar = (() => {
    if (identity === 'manager') {
      return Bar_manager_notInEdit;
    }

    if (identity === 'reviewer') {
      return Bar_reporter_notInEdit;
    }

    return Bar_reporter_notInEdit;
  })();

  return (
    <div className={scss.container}>
      {employeeChName && (
        <div className={scss.title}>
          <Image src={iconArrow} alt="return" onClick={cancelEditNewDailyReport} />
          <span>
            {employeeChName} {date || ''}
          </span>
          <div />
        </div>
      )}

      <div className={scss.btnBar}>
        <div className={scss.right}>
          <Bar isSearch={isSearch} />
        </div>
      </div>
    </div>
  );
  // --------------------------------------------------------------

  function Bar_manager_notInEdit({ isSearch }: { isSearch: boolean }) {
    return (
      <>
        <MyButton
          className={classNames(scss.searchBtn, { [scss.active]: isSearch })}
          label="搜尋"
          img={isSearch ? iconSearch_hover.src : iconSearch.src}
          onClick={doShowDrawer}
        />
        <MyButton label="審核人員設定" onClick={editRivewerPickArr} />
      </>
    );
  }

  // -------------------------------------------
  function Bar_reporter_notInEdit({ isSearch }: { isSearch: boolean }) {
    return (
      <>
        <MyButton
          className={classNames(scss.searchBtn, { [scss.active]: isSearch })}
          label="搜尋"
          img={isSearch ? iconSearch_hover.src : iconSearch.src}
          onClick={doShowDrawer}
        />
        <MyButton label="新增回報" onClick={editReport_today} />
      </>
    );
  }
} // PageHeader_mobile_dailyReport
// ====================================================================
