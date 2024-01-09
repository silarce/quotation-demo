import { useState, MouseEvent, createContext } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

// components
import Thead01 from '../ui/table01/Thead01';
import TbodyItem01, { TBodyItemContent } from '../ui/table01/TbodyItem01';
import ReviewChain from '../ui/table01/reviewChain';
import PanelBody from './budgetList/tableBody';
// antd
import { Collapse } from 'antd';
// css
import scss from './budgetList.module.scss';

import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

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

          const openQuotation = (e: MouseEvent) => {
            e.stopPropagation();

            if (attachedToContract) {
              router.push({
                pathname: `/domestic/quotationList/attachQuotation`,
                query: { id },
              });
            } else {
              router.push({
                pathname: `/domestic/quotationList/quotation`,
                query: { id, status },
              });
            }
          };

          const quotationContent: TBodyItemContent = {
            ...latestContent,
            customerName: latestContent.customer?.name ?? '',
            agentEmployeeName: latestContent.agentEmployee.chName || latestContent.agentEmployee.enName,
            totalPrice: latestContent.total,
            // viewRef_bottom: viewRef_bottom,
            viewRef_bottom: index === quotationArr.length - 5 ? viewRef_bottom : undefined,
          };

          const {
            reviewSalesEmployee,
            salesReviewedAt,
            reviewSupervisorEmployee,
            supervisorReviewedAt,
            reviewWorkDirectorEmployee,
            workDirectorReviewedAt,
            reviewManagerEmployee,
            managerReviewedAt,
          } = latestContent;
          const reviewStatuArr = [
            {
              jobName: '經辦',
              name: latestContent.agentEmployee.chName || latestContent.agentEmployee.enName,
              isReviewed: true,
            },
            {
              jobName: '業務',
              name: reviewSalesEmployee?.chName ?? '',
              isReviewed: reviewSalesEmployee ? !!salesReviewedAt : undefined,
            },
            {
              jobName: '業務主管',
              name: reviewSupervisorEmployee?.chName ?? '',
              isReviewed: reviewSupervisorEmployee ? !!supervisorReviewedAt : undefined,
            },
            {
              jobName: '應收帳款',
              name: reviewWorkDirectorEmployee?.chName ?? '',
              isReviewed: reviewWorkDirectorEmployee ? !!workDirectorReviewedAt : undefined,
            },
            {
              jobName: '總經理',
              name: reviewManagerEmployee?.chName ?? '',
              isReviewed: reviewManagerEmployee ? !!managerReviewedAt : undefined,
            },
          ];

          // 在預算與投標階段，不顯示應收帳款
          if (status === 'Budget' || status === 'Bidding' || status === 'Contracting') {
            reviewStatuArr.splice(3, 1);
          }

          // 在準合約階段，不顯示經辦
          if (status === 'Pending') {
            reviewStatuArr.shift();
          }

          const sortedContent = _.sortBy(contents, (content) => content.updatedAt).reverse();
          // sortedContent.shift(); // 不顯示第一筆

          const recordArr = sortedContent.map((content) => {
            const { updatedAt, editNotes, discount, quantity, total } = content;

            const href_body = {
              pathname: '/domestic/quotationList/quotation',
              query: {
                id: id,
                status: content.status,
                contentId: content.id,
              },
            };

            return {
              date: moment(convertDate_reduce1911(updatedAt)).format('yy-MM-DD'),
              editNotes,
              discount,
              doorQty: String(quantity),
              total: total.toLocaleString(),
              href: href_body,
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
                  openQuotation={openQuotation}
                >
                  <ReviewChain reviewStatuArr={reviewStatuArr} />
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
