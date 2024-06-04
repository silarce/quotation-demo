import classNames from 'classnames';

// gear
import TopBar from 'components/page/worksDepartment/contracList/contract/accountReceivable/ui/topBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import scss from './deductionDetail.module.scss';

// =================================================================================

// region START

export default function DeductionDetail() {
  return (
    <div>
      <TopBar caption="扣款明細" />

      <div className={scss.table}>
        <Thead />
      </div>
    </div>
  );
}

// region EDN
// =================================================================================
// =================================================================================
// =================================================================================
// =================================================================================
// region COMPONENT

const Row = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={classNames(scss.row, className)}>{children}</div>;
};

const Thead = () => {
  return (
    <Row className={scss.thead}>
      <div>期數</div>
      <div>合計</div>
    </Row>
  );
};
