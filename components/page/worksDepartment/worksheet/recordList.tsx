import classNames from 'classnames';
import scss from './recordList.module.scss';

// gear
import ProcessChain, { Tcontrol_processChain, TstatusLabelProps } from 'components/global/gear/processChain';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// icon
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// ===========================================================================

type Trecord = {
  itemName: string;
  doorModel: string;
  fullWidth: string;
  height: string;
  qty: string;
  material: string;
  isAntiTyphoon: boolean;

  reviewSalesName: string;
  reviewSalesStatus: TstatusLabelProps['dotColor'];

  reviewManagerName: string;
  reveiwManagerStatus: TstatusLabelProps['dotColor'];

  agent: string;

  onDetailClick?: (e: React.MouseEvent) => void;
};

type Tcontrol = {
  recordArr: Trecord[];
};

export type { Tcontrol as Tcontrol_recordList, Trecord };

// ===========================================================================
export default function RecordList({ control }: { control: Tcontrol }) {
  const { recordArr } = control;

  // ------------------------------------------------------

  // ------------------------------------------------------

  return (
    <div className={scss.recordList}>
      <div className={classNames(scss.row, scss.thead)}>
        <div className={scss.cell} style={config.itemName.style}>
          <span>{'項目'}</span>
        </div>
        <div className={scss.cell} style={config.doorModel.style}>
          <span>{'門型'}</span>
        </div>
        <div className={scss.cell} style={config.fullWidth.style}>
          <span>{'全寬(L)'}</span>
        </div>
        <div className={scss.cell} style={config.height.style}>
          <span>{'淨高(h)'}</span>
        </div>
        <div className={scss.cell} style={config.qty.style}>
          <span>{'數量'}</span>
        </div>
        <div className={scss.cell} style={config.material.style}>
          <span>{'材質'}</span>
        </div>
        <div className={scss.cell} style={config.isAntyTyphoon.style}>
          <span>{'防颱'}</span>
        </div>
        <div className={scss.cell} style={config.agent.style}>
          <span>{'經辦'}</span>
        </div>
        <div className={scss.cell} style={config.btn.style}></div>
      </div>

      {recordArr.map((record, index) => {
        const {
          itemName,
          doorModel,
          fullWidth,
          height,
          qty,
          material,
          isAntiTyphoon: isAntyTyphoon,
          reviewSalesName,
          reviewSalesStatus,
          reviewManagerName,
          reveiwManagerStatus,
          agent,
          onDetailClick,
        } = record;

        const control_processChain: Tcontrol_processChain['statusArr'] = [
          {
            label: `業務 ${reviewSalesName}`,
            dotColor: reviewSalesStatus,
          },
          {
            label: `總經理 ${reviewManagerName}`,
            dotColor: reveiwManagerStatus,
          },
        ];

        return (
          <CellWithBar key={index} className={scss.group}>
            <div className={scss.row}>
              <div className={scss.cell} style={config.itemName.style}>
                <span>{itemName}</span>
              </div>
              <div className={scss.cell} style={config.doorModel.style}>
                <span>{doorModel}</span>
              </div>
              <div className={scss.cell} style={config.fullWidth.style}>
                <span>{fullWidth}</span>
              </div>
              <div className={scss.cell} style={config.height.style}>
                <span>{height}</span>
              </div>
              <div className={scss.cell} style={config.qty.style}>
                <span>{qty}</span>
              </div>
              <div className={scss.cell} style={config.material.style}>
                <span>{material}</span>
              </div>

              <div className={scss.cell} style={config.isAntyTyphoon.style}>
                <InputSel
                  showBaseline="invisible"
                  checkBoxProps_v2={{
                    props: {
                      disabled: true,
                      defaultValue: isAntyTyphoon ? ['isAntyTyphoon'] : [],
                      options: [{ value: 'isAntyTyphoon', label: '' }],
                    },
                  }}
                />
              </div>
              <div className={scss.cell} style={config.agent.style}>
                <span>{agent}</span>
              </div>
              <div className={scss.cell} style={config.btn.style}>
                <IconDetail onClick={onDetailClick} />
              </div>
            </div>
            <ProcessChain className={scss.processChain} control={{ statusArr: control_processChain }} />
          </CellWithBar>
        );
      })}
    </div>
  );
}

// ===========================================================================

type TconfigItem = {
  style: React.CSSProperties;
};

type Tconfig = {
  [key: string]: TconfigItem;
};

const config: Tconfig = {
  itemName: {
    style: {
      width: 'auto',
      flex: 'auto',
    },
  },
  doorModel: {
    style: {
      width: '140px',
    },
  },
  fullWidth: {
    style: {
      width: '100px',
    },
  },
  height: {
    style: {
      width: '100px',
    },
  },
  qty: {
    style: {
      width: '100px',
    },
  },
  material: {
    style: {
      width: '140px',
    },
  },
  isAntyTyphoon: {
    style: {
      width: '100px',
    },
  },
  agent: {
    style: {
      width: '140px',
    },
  },
  btn: {
    style: {
      width: '50px',
    },
  },
};
