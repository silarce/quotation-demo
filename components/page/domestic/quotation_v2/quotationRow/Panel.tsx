import Image from 'next/image';

// import { Cell, Tprops_cell } from './index';
import { Cell, Cell_dnd, Tprops_cell } from './Cell';

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
      {/* {customCellArr?.map((props, index) => {
        const { children, key, ...rest } = props;

        return (
          <Cell key={key || index} invisible={invisible} {...rest}>
            {children}
          </Cell>
        );
      })} */}
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

export { Panel_basic, AttachPanel };
