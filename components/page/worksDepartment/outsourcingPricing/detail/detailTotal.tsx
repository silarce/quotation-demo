import classNames from 'classnames';
import Row, { Cell, Tprops_row } from 'components/global/gear/table/row';
import scss from './detailTotal.module.scss';

// ==========================================================================

const TheRow = (props: Tprops_row) => {
  return <Row gap={false} fullWidth={true} {...props} />;
};

// ==========================================================================

export default function DetailTotal({ className, detailTotal }: { className?: string; detailTotal: React.ReactNode }) {
  return (
    <div className={classNames('w-[1100px] bg-slate-500', scss.table, className)}>
      <TheRow thead={true}>
        <Cell className={classNames(scss.cell, scss.plus, scss.plus2, 'text-main text-base ')}>總計</Cell>
      </TheRow>

      <TheRow>
        <Cell className={classNames(scss.cell, scss.plus, scss.plus2, 'text-main text-base ')}>{detailTotal}</Cell>
      </TheRow>
    </div>
  );
}
