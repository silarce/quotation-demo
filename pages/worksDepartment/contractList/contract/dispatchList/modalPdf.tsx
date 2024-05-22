import classNames from 'classnames';

// antd
import { Modal, ModalProps } from 'antd';

// css
import scss from './modalPdf.module.scss';

export default function ModalPdf({ visible, onCancel }: ModalProps & { foo?: unknown }) {
  // region RENDER
  return (
    <Modal
      //
      visible={visible}
      onCancel={onCancel}
      width={'fit-content'}
      footer={null}
    >
      <div className={classNames(scss.body)}>
        <div className={scss.title}>
          <p>三久建材工業股份有限公司</p>
          <p>派工證明單</p>
        </div>
        <div className={scss.dateAndIndex}>
          <div>{`通知　　年　　月　　日　　時　　分`}</div>
          <div>序號 ＿＿＿＿＿＿</div>
        </div>
        {/*  */}

        <form className={scss.form}>
          <Row>
            <Cell01 />
            <Cell05 />
            <Cell03 />
            <Cell06 />
            <div className={scss['cell_09-10']}>
              <Cell10 />
              <Cell09 />
              <Cell10 />
              <Cell09 />
            </div>
          </Row>

          <Row>
            <Cell01 />
            <Cell05 />
            <Cell03 />
            <Cell07 />
          </Row>

          <Row>
            <Cell01 />
            <Cell02 />
            <Cell04 />
            <Cell02 />
            <Cell04 />
            <Cell02 />
            <Cell04 />
            <Cell08 />
            <Cell09 />
          </Row>

          <Row>
            <Cell00 />
            <Cell11 />
            <div className={scss['cell_12-8-9']}>
              <Cell12 />
              <Cell08 />
              <Cell09 />
              <Cell08 />
              <Cell09 />
              <Cell08 />
              <Cell09 />
              <Cell08 />
              <Cell09 />
              <Cell08 />
              <Cell09 />
              <Cell08 />
              <Cell09 />
              <Cell08 />
              <Cell09 />
            </div>
          </Row>

          <Row>
            <Cell00 />
            <Cell11 />
            <Cell08 />
            <Cell09 />
          </Row>
        </form>
      </div>
    </Modal>
  );
}

// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================

// region COMPONENT

const Row = ({ children }: { children?: React.ReactNode }) => {
  return <div className={classNames(scss.row)}>{children}</div>;
};

const c0 = 50;
const c00 = 50;
const c01 = c00 + c0;
const c02 = 20;
const c03 = 40;
const c04 = c03 + 50;
const c05 = c02 + c02 + c04;
const c06 = c04 + c02 - c03;
const c07 = 'auto';
const c08 = 30;
const c09 = 110;
const c10 = c04 + c08;
const c11 = c0 + c02 + c04 + c02 + c04 + c02 + c04;
const c12 = c08 + c09;

const Cell00 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell)} style={{ width: c00 }}>
      cell00{children}
    </div>
  );
};

const Cell01 = ({ strArr }: { strArr?: string[] }) => {
  return (
    <div className={classNames(scss.cell)} style={{ width: c01 }}>
      {/* {strArr.map((str, index) => {
        return <span key={index}>{str}</span>;
      })} */}
      cell01
    </div>
  );
};

const Cell02 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell)} style={{ width: c02 }}>
      cell02{children}
    </div>
  );
};

const Cell03 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell)} style={{ width: c03 }}>
      cell03{children}
    </div>
  );
};

const Cell04 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell)} style={{ width: c04 }}>
      cell04{children}
    </div>
  );
};

const Cell05 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell)} style={{ width: c05 }}>
      cell05{children}
    </div>
  );
};

const Cell06 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell)} style={{ width: c06 }}>
      cell06{children}
    </div>
  );
};

const Cell07 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell)} style={{ width: c07, flex: 'auto' }}>
      cell07{children}
    </div>
  );
};

const Cell08 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell)} style={{ width: c08 }}>
      cell08{children}
    </div>
  );
};

const Cell09 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell)} style={{ width: c09 }}>
      cell09{children}
    </div>
  );
};

const Cell10 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell)} style={{ width: c10 }}>
      cell10{children}
    </div>
  );
};

const Cell11 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell)} style={{ width: c11 }}>
      cell11{children}
    </div>
  );
};

const Cell12 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell)} style={{ width: c12 }}>
      cell12{children}
    </div>
  );
};
