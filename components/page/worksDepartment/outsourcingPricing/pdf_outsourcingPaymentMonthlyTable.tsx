import { Modal, ModalProps } from 'antd';

import { calcHeight_a4 } from 'js/utils/dlPdf';

import scss from './pdf_outsourcingPaymentMonthlyTable.module.scss';

// ======================================================================
const width = 1000;
const height = calcHeight_a4(width);

const style = {
  width: `${width}px`,
  height: `${height}px`,
};
// ======================================================================

// 外包商當月計價總表
export default function Pdf_outsourcingPaymentMonthlyTable({ ...modalProps }: ModalProps) {
  return (
    <Modal {...modalProps} width="fit-content" footer={null}>
      <Table />
    </Modal>
  );
}

// ======================================================================

const Table = () => {
  return (
    <div style={style}>
      {/*  */}
      <div className={scss.top}>
        <div className={scss.left}>
          <span>{111}</span>年<span>{11}</span>月
        </div>
        <div className={scss.right}>
          <span>{111}</span>按裝明細
        </div>
      </div>
      {/*  */}
      <div>
        <Row_thead />
        {Array.from({ length: 12 }).map((_, i) => (
          <Row
            key={i}
            indexNumber="meow"
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
      <div></div>
      {/*  */}
      <div></div>
      {/*  */}
      <div></div>
      {/*  */}
      <div></div>
      {/*  */}
    </div>
  );
};

const Row = ({
  indexNumber,
  idNumber,
  projectName,
  installPrice,
  supplyPrice,
  subTotal,
  priceCheck,
}: {
  indexNumber: React.ReactNode;
  idNumber: React.ReactNode;
  projectName: React.ReactNode;
  installPrice: React.ReactNode;
  supplyPrice: React.ReactNode;
  subTotal: React.ReactNode;
  priceCheck: React.ReactNode;
}) => {
  return (
    <div className={scss.row}>
      <div>{indexNumber}</div>
      <div>{idNumber}</div>
      <div>{projectName}</div>
      <div>{installPrice}</div>
      <div>{supplyPrice}</div>
      <div>{subTotal}</div>
      <div>{priceCheck}</div>
    </div>
  );
};

const Row_thead = () => {
  return (
    <Row
      indexNumber="序號"
      idNumber="工程編號"
      projectName="工程名稱"
      installPrice="按裝費"
      supplyPrice="補貼"
      subTotal="請款小計"
      priceCheck="核對金額"
    />
  );
};
