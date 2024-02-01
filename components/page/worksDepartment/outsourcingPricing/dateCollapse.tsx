import classNames from 'classnames';

import { Collapse } from 'antd';

const { Panel } = Collapse;

import scss from './dateCollapse.module.scss';

// ====================================================================

type Tcard = {
  label: string;
  onClick: () => void;
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
                  const { label, onClick } = card;

                  return <Card key={cIndex} label={label} onClick={onClick} />;
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

const Card = ({ label, onClick }: { label: string; onClick: () => void }) => {
  return (
    <div className={scss.card} onClick={onClick}>
      <span>{label}</span>
    </div>
  );
};
