import { useState, MouseEvent, createContext } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// components
import Thead01 from '../ui/table01/Thead01';
import TbodyItem01, { TBodyItemContent } from '../ui/table01/TbodyItem01';
import PanelBody from './budgetList/tableBody';
// antd
import { Collapse } from 'antd';
// css
import style from './budgetList.module.scss';

// ===========================================
import { TquotationDto } from 'js/api/api_quotation';

// ===========================================

const { Panel } = Collapse;
// ========================
type TbudgetListContext = {
  status: 'Budget' | 'Tender' | 'Contract';
};
export const budgetListContext = createContext<TbudgetListContext>(null!);
// ========================

export default function BudgetList({
  quotationArr,
  className,
}: {
  quotationArr: TquotationDto[] | undefined;
  className?: string;
}) {
  const router = useRouter();

  // panelHeader點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1);

  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string);
    setActiveIndex(activeIndex);
  };

  return (
    <div className={classNames(style.container, className)}>
      <Thead01 />

      <Collapse expandIcon={() => <></>} accordion={true} destroyInactivePanel={true} onChange={changeActive}>
        <budgetListContext.Provider value={{ status: 'Budget' }}>
          {quotationArr?.map((quotation, index) => {
            const { id, latestContent } = quotation;

            const isActive = activeIndex === index;

            const openQuotation = (e: MouseEvent) => {
              e.stopPropagation();
              router.push({
                pathname: `/domestic/quotationList/quotation`,
                query: { id },
              });
            };

            const quotationContent: TBodyItemContent = {
              ...quotation.latestContent,
              customerName: quotation.latestContent.customer.name,
              agentEmployeeName:
                quotation.latestContent.agentEmployee.chName || quotation.latestContent.agentEmployee.enName,
            };

            return (
              <Panel
                key={index}
                className={style.panel}
                header={
                  <TbodyItem01
                    quotationContent={quotationContent}
                    isActive={isActive}
                    openQuotation={openQuotation}
                    approvalsStatus="待審核"
                  />
                }
              >
                {/* 等api補資料再作 */}
                {/* <PanelBody projectSimpleRecord={tempRecord} openQuotation={openQuotation} /> */}
              </Panel>
            );
          })}
        </budgetListContext.Provider>
      </Collapse>
    </div>
  );
}
