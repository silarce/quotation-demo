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
    isFetching: boolean | undefined;
  }[];
};

export type { Tcontrol as Tcontrol_queryQuotationList };

// =======================================================================

export default function QueryQuotationList({
  control,
  popFormList,
  onActiveChange,
}: {
  control: Tcontrol;
  popFormList: Thead_popFormList;
  onActiveChange: (panelIndex: string | string[]) => void;
}) {
  // panelHeader點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1);

  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string);
    setActiveIndex(activeIndex);
    onActiveChange(panelIndex);
  };

  return (
    <div className={style.container}>
      <Thead popFormList={popFormList} />

      <Collapse
        className={style.panel}
        expandIcon={() => null}
        accordion={true}
        destroyOnHidden={true}
        onChange={changeActive}
        items={control.panelArr.map((item, index) => {
          const { header, body, isFetching } = item;
          const isActive = activeIndex === index;

          return {
            key: `${index}`,
            label: <PanelHeader control={header} isActive={isActive} />,
            children: <PanelBody control={body} isFetching={isFetching} />,
          };
        })}
      />
    </div>
  );
}
