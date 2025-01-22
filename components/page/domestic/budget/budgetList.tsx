import { useState, MouseEvent, createContext } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

// antd
import { Collapse } from 'antd';

// components
import Thead01 from '../ui/table01/Thead01';
import TbodyItem01, { TBodyItemContent } from '../ui/table01/TbodyItem01';
import PanelBody from './budgetList/tableBody';

import { Tcontrol_queryQuotationList } from 'components/page/domestic/queryQuotation/queryQuotationList';

// css
import scss from './budgetList.module.scss';

// utils
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';
import { quotationToReiviewChain } from 'js/utils/quotation/quotationToReiviewChain';

// ===========================================
import { TquotationDto } from 'js/api/api_quotation';
import ProcessChain from 'components/global/gear/processChain';

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
  viewRef_bottom,
}: {
  quotationArr: TquotationDto[] | undefined;
  className?: string;
  viewRef_bottom?: (node?: Element | null | undefined) => void;
}) {
  const router = useRouter();

  // panelHeader點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1);

  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string);
    setActiveIndex(activeIndex);
  };

  return (
    <div className={classNames(scss.container, className)}>
      <Thead01 />

      {/* <budgetListContext.Provider value={{ status: 'Budget' }}> */}
      <Collapse expandIcon={() => <></>} accordion={true} destroyInactivePanel={true} onChange={changeActive}>
        {quotationArr?.map((quotation, index) => {
          const { id, latestContent, contents, attachedToContract } = quotation;

          const isActive = activeIndex === index;
          const status = latestContent.status;

          const linkProps = attachedToContract
            ? {
                href: {
                  pathname: `/domestic/quotationList/attachQuotation`,
                  // pathname: `/domestic/quotationList/quotation`,
                  query: { id },
                },
              }
            : {
                href: {
                  pathname: `/domestic/quotationList/quotation`,
                  query: { id, status },
                },
              };

          const quotationContent: TBodyItemContent = {
            ...latestContent,
            customerName: latestContent.customer?.name ?? '',
            agentEmployeeName: (latestContent.agentEmployee?.chName || latestContent.agentEmployee?.enName) ?? '',
            totalPrice: latestContent.total,
            // viewRef_bottom: viewRef_bottom,
            viewRef_bottom: index === quotationArr.length - 5 ? viewRef_bottom : undefined,
            isAttachQuotation: !!attachedToContract,
            discount: latestContent.averageDiscount ?? '',
          };

          const processChain = quotationToReiviewChain(latestContent);

          const sortedContent = _.sortBy(contents, (content) => content.version).reverse();

          const recordArr = sortedContent.map((content) => {
            const { quotationDate, editNotes, averageDiscount, quantity, total } = content;

            const href_body = {
              pathname: '/domestic/quotationList/quotation',
              query: {
                id: id,
                status: content.status,
                contentId: content.id,
              },
            };

            const processChain = quotationToReiviewChain(content);

            return {
              date: moment(convertDate_reduce1911(quotationDate)).format('yy-MM-DD'),
              editNotes,
              discount: averageDiscount ?? '',
              doorQty: String(quantity),
              total: total.toLocaleString(),
              href: href_body,
              processChain,
            };
          });

          return (
            <Panel
              key={index}
              className={scss.panel}
              header={
                <TbodyItem01
                  //
                  quotationContent={quotationContent}
                  isActive={isActive}
                  // openQuotation={openQuotation}
                  linkProps={linkProps}
                >
                  {/* <ReviewChain reviewStatuArr={reviewStatuArr} /> */}

                  <ProcessChain
                    className="mt-3"
                    control={{
                      statusArr: processChain,
                    }}
                  />
                  <span></span>
                </TbodyItem01>
              }
            >
              <PanelBody recordArr={recordArr} />
            </Panel>
          );
        })}
      </Collapse>
      {/* </budgetListContext.Provider> */}
    </div>
  );
}

// ===================================================================
