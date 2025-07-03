import { useState } from 'react';

// components
import Thead, { Thead_popFormList } from './queryQuotationList/thead';
import PanelHeader, { Tcontrol_panelHeader } from './queryQuotationList/panelHeader';
import PanelBody, { Tcontrol_panelBody } from './queryQuotationList/panelBody';

// antd
import { Collapse } from 'antd';

// css
import style from './queryQuotationList.module.scss';

// =======================================================================

type Tcontrol = {
  panelArr: {
    header: Tcontrol_panelHeader;
    body: Tcontrol_panelBody[];
  }[];
};

export type { Tcontrol as Tcontrol_queryQuotationList };

// =======================================================================
const { Panel } = Collapse;
// =======================================================================

export default function QueryQuotationList({
  //
  control,
  popFormList,
}: {
  control: Tcontrol;
  popFormList: Thead_popFormList;
}) {
  // panelHeader點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1);

  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string);
    setActiveIndex(activeIndex);
  };

  return (
    <div className={style.container}>
      <Thead popFormList={popFormList} />

      <Collapse expandIcon={() => null} accordion={true} destroyOnHidden={true} onChange={changeActive}>
        {control.panelArr.map((item, index) => {
          const { header, body } = item;
          const isActive = activeIndex === index;

          // ===========================

          return (
            <Panel key={index} className={style.panel} header={<PanelHeader control={header} isActive={isActive} />}>
              <PanelBody control={body} />
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}
