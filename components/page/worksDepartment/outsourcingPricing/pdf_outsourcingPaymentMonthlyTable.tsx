import classNames from 'classnames';
import { Modal, ModalProps } from 'antd';

import { calcHeight_a4 } from 'js/utils/dlPdf';

import scss from './pdf_outsourcingPaymentMonthlyTable.module.scss';

// ======================================================================
const width = 20;
const height = calcHeight_a4(width, { round: false });

const style = {
  width: `${width}cm`,
  height: `${height}cm`,
};
// ======================================================================

// 外包商當月計價總表
export default function Pdf_outsourcingPaymentMonthlyTable({ ...modalProps }: ModalProps) {
  return (
    <Modal {...modalProps} width="fit-content" footer={null} style={{ marginLeft: '20px' }}>
      <Page />
    </Modal>
  );
}

// ======================================================================

const Page = () => {
  return (
    <div className={scss.page} style={style}>
      <div className={classNames(scss.top, 'mb-3')}>
        <div className={scss.left}>
          <span>{111}</span>年<span>{11}</span>月
        </div>
        <div className={scss.right}>
          <span>{'王汪汪'}</span>按裝明細
        </div>
      </div>

      <Table />
    </div>
  );
};

const Table = () => {
  return (
    <div className={scss.table}>
      {/*  */}

      <div className={scss.rowWrapper}>
        <Row_thead />
        {Array.from({ length: 12 }).map((_, i) => (
          <Row
            key={i}
            indexNumber="121"
            idNumber="meow"
            projectName="meow"
            installPrice="meow"
            supplyPrice="meow"
            subTotal="meow"
            priceCheck="meow"
          />
        ))}
      </div>
      {/*  */}
      <div className={scss.total}>
        <span className="">請款合計:</span>
        <span className="border-b border-black w-[120px] text-center">{9999}</span>
        <span className="mx-2">＋</span>
        <span className="">上期保留:</span>
        <span className="border-b border-black w-[120px] text-center">{9999}</span>
        <span className="mx-4">＝</span>
        <span className="border-b border-black w-[160px] text-center">9999</span>
      </div>
      {/*  */}
      <div className={scss.deductionTotal}>
        <Cell className={classNames('a')}>減</Cell>
        <Cell className={classNames('b')}>應扣明細</Cell>
        <Cell className={classNames('c')}>5%</Cell>
        <Cell className={classNames('d')}>保留　10%</Cell>
        <Cell className={classNames('e')}>按裝物料</Cell>
        <Cell className={classNames('f')}>借支勞保</Cell>
        <Cell className={classNames('g')}>應扣明細</Cell>
        <Cell className={classNames('h')}>核扣金額</Cell>
        <Cell className={classNames('i')}>金額</Cell>
        <Cell className={classNames('j')}>j</Cell>
        <Cell className={classNames('k')}>k</Cell>
        <Cell className={classNames('l')}>l</Cell>
        <Cell className={classNames('m')}>m</Cell>
        <Cell className={classNames('n')}>n</Cell>
        <Cell className={classNames('o')}>o</Cell>
      </div>
      {/*  */}
      <div className={scss.actualAmountReceived}>實　領　金　額</div>
      {/*  */}
      <div className={scss.review}>
        <Cell className={scss.title}>核　准</Cell>
        <Cell>2</Cell>
        <Cell className={scss.title}>主　管</Cell>
        <Cell>4</Cell>
        <Cell className={scss.title}>核　對</Cell>
        <Cell>6</Cell>
        <Cell className={scss.title}>經　辦</Cell>
        <Cell>8</Cell>
      </div>
      {/*  */}
    </div>
  );
};

const Row = ({
  className,

  indexNumber,
  idNumber,
  projectName,
  installPrice,
  supplyPrice,
  subTotal,
  priceCheck,
}: {
  className?: string;

  indexNumber: React.ReactNode;
  idNumber: React.ReactNode;
  projectName: React.ReactNode;
  installPrice: React.ReactNode;
  supplyPrice: React.ReactNode;
  subTotal: React.ReactNode;
  priceCheck: React.ReactNode;
}) => {
  return (
    <div className={classNames(scss.row, className)}>
      <Cell className={classNames(scss.indexNumber)}>{indexNumber}</Cell>
      <Cell>{idNumber}</Cell>
      <Cell>{projectName}</Cell>
      <Cell>{installPrice}</Cell>
      <Cell>{supplyPrice}</Cell>
      <Cell>{subTotal}</Cell>
      <Cell>{priceCheck}</Cell>
    </div>
  );
};

const Row_thead = () => {
  return (
    <Row
      className={scss.thead}
      indexNumber="序號"
      idNumber="工程編號"
      projectName="工程名稱"
      installPrice="按　裝　費"
      supplyPrice="補　　貼"
      subTotal="請款小計"
      priceCheck="核對金額"
    />
  );
};

const Cell = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, children, ...rest } = props;

  return (
    <div className={classNames(scss.cell, className)} {...rest}>
      {children}
    </div>
  );
};
