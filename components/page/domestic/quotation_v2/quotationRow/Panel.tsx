import Image from 'next/image';

// antd
import { Popover } from 'antd';

import { InputSel_prod } from '../hook/quotationProduct/ui/InputSel_prod';

// import { Cell, Tprops_cell } from './index';
import { Cell, Cell_dnd, Tprops_cell } from './Cell';
import {
  Cell_indexNumber,
  Cell_delete,
  Cell_copy,
  Cell_reset,
  Cell_copy2,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/cell';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';
import iconMove from 'public/image/icon/move.svg';
import iconReset from 'public/image/icon/reset.svg';
import iconChange from 'public/image/icon/change.svg';

// =====================================================================

type TcustomCell = Tprops_cell & {
  key?: string | number;
};

// =====================================================================
const Panel_basic = ({
  //
  indexNumber,
  invisible,
  // customCellArr,
  children,
}: {
  indexNumber?: React.ReactNode;
  invisible?: boolean;
  children?: React.ReactNode;
  // customCellArr?: TcustomCell[];
}) => {
  return (
    <>
      <Cell invisible={invisible}>
        <IconDelete01 />
      </Cell>
      <Cell invisible={invisible}>
        <IconCopy />
      </Cell>
      <Cell invisible={invisible} className="w-4">
        {indexNumber}
      </Cell>
      {children}
    </>
  );
};

const AttachPanel = () => {
  return (
    <>
      <Cell>aaaa</Cell>
      <Cell>aaaa</Cell>
      <Cell>aaaa</Cell>
      <Cell>aaaa</Cell>
    </>
  );
};

const Panel_iterativeProd_right_thead = () => {
  const config = config_wholeProd_right;

  return (
    <>
      <Cell style={config.qty.style}>{config.qty.label}</Cell>
      <Cell style={config.reduce.style}>{config.reduce.label}</Cell>
      <Cell style={config.modify.style}>{config.modify.label}</Cell>
      <Cell style={config.price.style}>{config.price.label}</Cell>
    </>
  );
};

const Panel_iterativeProd_right = ({
  qty,
  price,
  reduceValue,
  onReduceChange,
  modifyValue,
}: // onModifyChange,
{
  qty: React.ReactNode;
  price: React.ReactNode;
  reduceValue: string;
  modifyValue: React.ReactNode;
  onReduceChange: (value: `${number}` | '') => void;
  // onModifyChange: (value: `${number}` | '') => void;
}) => {
  const config = config_wholeProd_right;

  return (
    <>
      <Cell style={config.qty.style}>
        <InputSel_prod node={qty} showBaseline="invisible" />
      </Cell>
      <Cell style={config.reduce.style}>
        <InputSel_prod
          inputProps={{
            props: {
              type: 'number',
              value: reduceValue,
              onChange: (e) => {
                onReduceChange(e.target.value as `${number}` | '');
              },
            },
          }}
        />
      </Cell>
      <Cell style={config.modify.style}>
        <InputSel_prod node={modifyValue} showBaseline="invisible" />
        {/* <InputSel_prod
          inputProps={{
            props: {
              type: 'number',
              value: modifyValue,
              onChange: (e) => {
                onModifyChange(e.target.value as `${number}` | '');
              },
            },
          }}
        /> */}
      </Cell>
      <Cell style={config.price.style}>
        <InputSel_prod node={price} showBaseline="invisible" />
      </Cell>
    </>
  );
};

const Panel_prod = ({
  className_delete,
  onDeleteClick,
  className_copy,
  onCopyClick,
  indexNumber,
  children,
}: {
  className_delete?: string;
  className_copy?: string;
  onDeleteClick?: () => void;
  onCopyClick?: () => void;
  indexNumber?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <>
      <Cell_delete className={className_delete} onClick={onDeleteClick} />
      <Cell_copy className={className_copy} onClick={onCopyClick} />
      <Cell_indexNumber>{indexNumber}</Cell_indexNumber>
      {children}
    </>
  );
};

const Panel_iterativeProd = ({
  indexNumber,
  className_reset,
  className_copy,
  className_copy2,
  onResetClick,
  onCopyClick,
  onCopy2Click,
  children,
  renderProps_copy = (cellCopy) => cellCopy,
}: {
  indexNumber?: React.ReactNode;
  className_reset?: string;
  className_copy?: string;
  className_copy2?: string;
  onResetClick?: () => void; //
  onCopyClick?: () => void; //
  onCopy2Click?: () => void; //
  children?: React.ReactNode;
  renderProps_copy?: (cellCopy: React.ReactNode) => React.ReactNode;
}) => {
  return (
    <>
      <Cell_reset className={className_reset} onClick={onResetClick} />
      {renderProps_copy(<Cell_copy className={className_copy} onClick={onCopyClick} />)}
      <Cell_copy2 className={className_copy2} onClick={onCopy2Click} />
      <Cell_indexNumber>{indexNumber}</Cell_indexNumber>
      {children}
    </>
  );
};

const Panel_accessory = ({
  //
  children,
  indexNumber,
  onDeleteClick,

  className_delete,
}: {
  children?: React.ReactNode;
  indexNumber?: React.ReactNode;
  onDeleteClick?: () => void;

  className_delete?: string;
}) => {
  return (
    <>
      <Cell_delete className={className_delete} onClick={onDeleteClick} />
      <Cell_indexNumber>{indexNumber}</Cell_indexNumber>
      {children}
    </>
  );
};

// =====================================================================

type TconfigItem = {
  label?: string;
  className?: string;
  style?: React.CSSProperties;
};

const config_wholeProd_right: Record<'qty' | 'reduce' | 'modify' | 'price', TconfigItem> = {
  qty: {
    label: '數量',
    style: { width: '60px' },
  },
  reduce: {
    label: '追減',
    style: { width: '60px' },
  },
  modify: {
    label: '變更',
    style: { width: '60px' },
  },
  price: {
    label: '追減變更金額',
    style: { width: '120px' },
  },
};

// =====================================================================
export {
  Panel_basic,
  AttachPanel,
  Panel_iterativeProd_right_thead,
  Panel_iterativeProd_right,
  Panel_prod,
  Panel_iterativeProd,
  Panel_accessory,
};
