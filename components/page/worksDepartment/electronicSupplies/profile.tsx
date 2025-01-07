import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import classNames from 'classnames';

// antd
import { Popover } from 'antd';

import { Icon_info } from 'public/image/icon/svgComponent/svgIcons';

import scss from './profile.module.scss';

// ==============================================================================

type TdoorQtySubTotalList = {
  [doorModelName: string]: number;
};

// ==============================================================================

export default function Profile({
  projectNumber,
  projectName,
  doorQtyTotal,
  doorModalQtyList,
  hasFinishPickUp,
}: {
  projectNumber: string;
  projectName: string;
  doorQtyTotal: number;
  doorModalQtyList: TdoorQtySubTotalList;
  hasFinishPickUp: boolean | undefined;
}) {
  return (
    <div className={scss.info}>
      <InputSel
        caption="工程編號"
        showBaseline="invisible"
        captionStyle={{ width: '80px' }}
        wrapperStyle={{ gap: '25px' }}
        inputProps={{
          props: {
            value: projectNumber,
            readOnly: true,
          },
        }}
      />
      <InputSel
        caption="工程名稱"
        showBaseline="invisible"
        captionStyle={{ width: '80px' }}
        wrapperStyle={{ gap: '25px' }}
        inputProps={{
          props: {
            value: projectName,
            readOnly: true,
          },
        }}
      />

      <InputSel
        caption="門型數量"
        showBaseline="invisible"
        captionStyle={{ width: '80px' }}
        wrapperStyle={{ gap: '25px' }}
        inputProps={{
          props: {
            value: doorQtyTotal,
            readOnly: true,
          },
        }}
        suffix={<Info doorModalQtyList={doorModalQtyList} />}
      />
      <InputSel
        caption="領料狀態"
        showBaseline="invisible"
        captionStyle={{ width: '80px' }}
        wrapperStyle={{ gap: '25px' }}
        inputProps={{
          props: {
            value: hasFinishPickUp ? '送電材料皆領料完成' : '尚未領料完成',
            readOnly: true,
            className: classNames(scss.supplyStatus, hasFinishPickUp && scss.isDone),
          },
        }}
      />
    </div>
  );
}

const Info = ({ doorModalQtyList }: { doorModalQtyList: TdoorQtySubTotalList }) => {
  const Content = (
    <ul>
      {Object.entries(doorModalQtyList).map(([key, qty]) => {
        return (
          <li key={key} className="flex gap-3">
            <span>{key}</span>
            <span>{qty}樘</span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <Popover content={Content} trigger={'hover'} placement="right">
      <div>
        <Icon_info />
      </div>
    </Popover>
  );
};

export type { TdoorQtySubTotalList };
