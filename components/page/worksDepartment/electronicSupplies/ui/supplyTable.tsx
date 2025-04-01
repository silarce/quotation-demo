import { useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import classNames from 'classnames';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

// type
import { Tstate_electronicItem } from 'components/page/worksDepartment/electronicSupplies/hook/useElectronicSuppliesRequirement';

// icon
import { IconAddCircle } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './supplyTable.module.scss';

import { dlPdf, getA4Rect } from 'js/utils/dlPdf';

// ==================================================================

type Tgroup = {
  itemName: string; // 品名
  subItemName?: string | null;
  onAddClick?: (() => void) | undefined;
  rowArr: {
    category: React.ReactNode; // 種類
    valueArr: {
      value?: string;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      className?: string;
      readonly?: boolean;
      defaultValue?: string;
    }[];
  }[];
};

type Tprops_cell = {
  children: React.ReactNode;
  className?: string;
};

type Tprops_cell_input = {
  value?: React.InputHTMLAttributes<HTMLInputElement>['value'];
  onChange?: React.InputHTMLAttributes<HTMLInputElement>['onChange'];
  readOnly?: React.InputHTMLAttributes<HTMLInputElement>['readOnly'];
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  defaultValue?: React.InputHTMLAttributes<HTMLInputElement>['defaultValue'];
  inputAttr?: React.InputHTMLAttributes<HTMLInputElement>;
} & Omit<Tprops_cell, 'children'>;

type Tinfo = {
  // pdfFileName: string;
  contractNumber: string;
  projectName: string;
  date: string;
  takeOffEmployeeName: string; // 領料人員
  preparationEmployeeName: string; // 備料人員
};

type TimperativeHandle = {
  openPdf: () => void;
};

// ==================================================================

const pdfRect = getA4Rect();

// ==================================================================

// MARK:START

function SupplyTable(
  {
    className,
    valueLabelArr,
    groupArr,
    disabled,
    //
    // pdfFileName,
    pdfFileName,
    ...info
  }: {
    className?: string;
    valueLabelArr: string[];
    groupArr: Tgroup[];
    disabled?: boolean;

    pdfFileName: string;
    // contractNumber: string;
    // projectName: string;
    // date: string;
  } & Tinfo,
  ref: React.Ref<TimperativeHandle>
) {
  const openPdf = () => {
    myAlert.clear({
      content: <PdfModal {...info} valueLabelArr={valueLabelArr} groupArr={groupArr} pdfFileName={pdfFileName} />,
    });
  };

  useImperativeHandle(ref, () => ({
    openPdf,
  }));

  return (
    <div className={classNames(scss.container, className)}>
      <Thead valueLabelArr={valueLabelArr} />

      {groupArr.map((props, index) => {
        return <Group key={index} disabled={disabled} {...props} />;
      })}
    </div>
  );
}

// MARK:END
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

// region COMPONENTS

const Thead = ({ valueLabelArr }: { valueLabelArr: string[] }) => {
  return (
    <div className={classNames(scss.group, scss.thead)}>
      <Cell_itemName>品名</Cell_itemName>
      <Cell_category>種類</Cell_category>

      {valueLabelArr.map((label, index) => {
        return <Cell_inputLabel key={index}>{label}</Cell_inputLabel>;
      })}
    </div>
  );
};

const Group = ({
  //
  disabled,
  itemName,
  subItemName,
  rowArr,
  onAddClick,
}: Tgroup & { disabled?: boolean }) => {
  return (
    <div className={scss.group}>
      <Cell_itemName>
        <div className={scss.itemNameWrapper}>
          {itemName}
          {!disabled && onAddClick && <IconAddCircle className={scss.addIcon} onClick={onAddClick} />}
        </div>
      </Cell_itemName>

      {subItemName && <Cell_subItemName>{subItemName}</Cell_subItemName>}

      <div className={scss.rowWrapper}>
        {rowArr.map((row, index) => {
          const { category, valueArr } = row;

          return (
            <Row key={index}>
              <Cell_category>{category}</Cell_category>
              {valueArr.map((props, index) => {
                return <Cell_input key={index} readOnly={disabled} {...props} />;
              })}
            </Row>
          );
        })}
      </div>
    </div>
  );
};

const Row = (props: Tprops_cell) => {
  return (
    <div className={scss.row} {...props}>
      {props.children}
    </div>
  );
};

const Cell = ({ children, className }: Tprops_cell) => {
  return <div className={classNames(scss.cell, className)}>{children}</div>;
};

const Cell_itemName = (props: Tprops_cell) => {
  return <Cell className={scss.itemName} {...props} />;
};

const Cell_subItemName = (props: Tprops_cell) => {
  return <Cell className={scss.subItemName} {...props} />;
};

const Cell_category = (props: Tprops_cell) => {
  return <Cell className={scss.category} {...props} />;
};

const Cell_inputLabel = (props: Tprops_cell) => {
  return <Cell className={scss.inputLabel} {...props} />;
};

const Cell_input = (props: Tprops_cell_input = {}) => {
  const {
    //
    className,
    value,
    onChange,
    readOnly,
    inputAttr,
    defaultValue,
    ...cellProps
  } = props;

  const isOk = value === 'OK' || defaultValue === 'OK';
  const type = isOk ? 'text' : 'number';

  return (
    <Cell {...cellProps} className={classNames(scss.input, !readOnly && scss.abled, className)}>
      <input
        type={type}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        {...inputAttr}
        className={classNames(isOk && scss.Ok, inputAttr?.className)}
      />
    </Cell>
  );
};

// ============================================================================
// ============================================================================

// MARK: PDF COMPONENTS

const PdfModal = ({
  valueLabelArr,
  groupArr,
  pdfFileName,
  ...info
}: {
  valueLabelArr: string[];
  groupArr: Tgroup[];
  pdfFileName: string;
} & Tinfo) => {
  const ref_pdf = useRef(null);

  const handle_dlPdf = () => {
    dlPdf({
      divElementArr: [ref_pdf.current!],
      fileName: pdfFileName,
    });
  };

  return (
    <div>
      <div className={scss.pdfPanel}>
        <SquareBtn
          sharp="long"
          onClick={() => {
            handle_dlPdf();
          }}
        >
          下載PDF
        </SquareBtn>
      </div>
      {/*  */}
      <Page ref={ref_pdf} valueLabelArr={valueLabelArr} groupArr={groupArr} {...info} />
    </div>
  );
};

const Page_ = (
  {
    valueLabelArr,
    groupArr,

    contractNumber,
    projectName,
    date,
    ...takeAndPreparation
  }: {
    valueLabelArr: string[];
    groupArr: Tgroup[];
  } & Tinfo,
  ref: React.Ref<HTMLDivElement>
) => {
  const { takeOffEmployeeName, preparationEmployeeName } = takeAndPreparation;

  return (
    <div className={scss.pdfPageWrapper}>
      <div ref={ref} style={pdfRect} className={scss.pdfPage}>
        {/*  */}
        <div className={'flex gap-3 text-lg'}>
          <Caption className="" label="編號" value={<span className="inline-block w-32">{contractNumber}</span>} />
          <Caption label="工程名稱" value={projectName} />
          <Caption className="m-auto mr-0" label="日期" value={<span className="inline-block w-24">{date}</span>} />
        </div>
        {/*  */}
        <div className={scss.table}>
          <Thead valueLabelArr={valueLabelArr} />

          {groupArr.map((props, index) => {
            return <Group key={index} disabled={true} {...props} />;
          })}
        </div>
        <div className={'flex gap-3 justify-end text-lg'}>
          {'takeOffEmployeeName' in takeAndPreparation && (
            <Caption label="領料" value={<span className="inline-block w-24">{takeOffEmployeeName}</span>} />
          )}

          {'preparationEmployeeName' in takeAndPreparation && (
            <Caption label="填表" value={<span className="inline-block w-24">{preparationEmployeeName}</span>} />
          )}
        </div>
        {/*  */}
      </div>
    </div>
  );
};

const Caption = ({
  className,
  label,
  value,
}: {
  className?: string;
  label: React.ReactNode;
  value: React.ReactNode;
}) => {
  return (
    <div className={classNames(className)}>
      <span>{label}</span>: <span>{value}</span>
    </div>
  );
};

const Page = forwardRef(Page_);

// ============================================================================
// ============================================================================

// region HOOK

const useStateToGroup = ({
  stateArr,
  handler_editItemQty,
  createAddCategory,
}: {
  stateArr: Tstate_electronicItem[];
  handler_editItemQty: (key: string, qty: number) => void;
  createAddCategory?: (itemName: Tstate_electronicItem['itemName']) => (() => void) | undefined;
}) => {
  return useMemo(() => {
    const list: {
      [key: string]: Tgroup;
    } = {};

    stateArr.forEach((item) => {
      const { itemName, category, quantity, subItemName } = item;

      if (!list[itemName]) {
        list[itemName] = {
          itemName,
          subItemName,
          onAddClick: createAddCategory?.(itemName),
          rowArr: [],
        };
      }

      list[itemName].rowArr.push({
        category,
        valueArr: [
          {
            value: String(quantity || '0'),
            onChange: (e) => {
              handler_editItemQty(category, Number(e.target.value));
            },
          },
        ],
      });
    });

    return Object.values(list);
  }, [stateArr]);
};

// ===========================================================================
export default forwardRef(SupplyTable);
export { useStateToGroup };
export type { Tgroup, Tprops_cell, Tprops_cell_input, TimperativeHandle };
