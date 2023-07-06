import { useState, MouseEvent, createContext } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// components
import Thead01 from '../ui/table01/Thead01';
import TbodyItem01 from '../ui/table01/TbodyItem01';
import PanelBody from './budgetList/tableBody';
// antd
import { Collapse } from 'antd';
// css
import style from './budgetList.module.scss';
// fake
import { fakeApi_projectSimple } from 'fakeDatabase/fakeAPI/fakeQuotationSimpleArrApi';

type TbudgetList = ReturnType<(typeof fakeApi_projectSimple)['get']>;

const { Panel } = Collapse;
// ========================
type TbudgetListContext = {
  approvalsStatus: TbudgetList[number]['basicInfo']['approvalStatus'];
};
export const budgetListContext = createContext<TbudgetListContext>(null!);
// ========================

export default function BudgetList({ budgetList, className }: { budgetList: TbudgetList; className?: string }) {
  const router = useRouter();
  const approvalsStatus = (router.query.approvalsStatus ?? '待審核') as TbudgetListContext['approvalsStatus'];
  // ----------------------------------------------------------------

  // panelHeader點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1);

  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string);
    setActiveIndex(activeIndex);
  };

  return (
    // <div className={style.container}>
    <div className={classNames(style.container, className)}>
      <Thead01 />

      <Collapse expandIcon={() => <></>} accordion={true} destroyInactivePanel={true} onChange={changeActive}>
        <budgetListContext.Provider value={{ approvalsStatus: approvalsStatus }}>
          {budgetList.map((item, index) => {
            const { tempRecord } = item;
            const { quotationId } = item.basicInfo;
            const isActive = activeIndex === index;

            const openQuotation = (e: MouseEvent) => {
              e.stopPropagation();
              router.push({
                pathname: '/domestic/budget/quotation',
                query: { quotationId },
              });
            };

            return (
              <Panel
                key={index}
                className={style.panel}
                header={
                  <TbodyItem01
                    projectData={item}
                    isActive={isActive}
                    openQuotation={openQuotation}
                    approvalsStatus={approvalsStatus}
                  />
                }
              >
                <PanelBody projectSimpleRecord={tempRecord} openQuotation={openQuotation} />
              </Panel>
            );
          })}
        </budgetListContext.Provider>
      </Collapse>
    </div>
  );
}
