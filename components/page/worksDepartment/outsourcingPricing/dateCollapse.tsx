import classNames from 'classnames';

import { Collapse } from 'antd';

const { Panel } = Collapse;

import scss from './dateCollapse.module.scss';

// ====================================================================

type Tcard = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  forbidden?: boolean;
};

type Tpanel = {
  label: string;
  cardArr: Tcard[];
};

type Tcontrol = {
  panelArr: Tpanel[];
};

export type { Tcontrol as Tcontrol_dateCollapse };

// ====================================================================
export default function DateCollapse({
  //
  className,
  control,
}: {
  className?: string;
  control: Tcontrol;
}) {
  return (
    <div className={classNames(scss.container, className)}>
      <Collapse defaultActiveKey={['0']}>
        {control.panelArr.map((panel, pIndex) => {
          return (
            <Panel key={pIndex} header={panel.label}>
              <div className={scss.panel}>
                {panel.cardArr.map((card, cIndex) => {
                  const { label, onClick, forbidden, disabled } = card;

                  return (
                    <Card key={cIndex} label={label} onClick={onClick} forbidden={forbidden} disabled={disabled} />
                  );
                })}
              </div>
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}

// ====================================================================

const Card = ({ label, onClick, forbidden, disabled }: Tcard) => {
  return (
    <div className={classNames(scss.card, disabled && scss.disabled, forbidden && scss.forbidden)} onClick={onClick}>
      <span>{label}</span>
    </div>
  );
};
