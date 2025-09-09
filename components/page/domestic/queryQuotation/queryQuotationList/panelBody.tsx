import Link from 'next/link';
import classNames from 'classnames';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
import style from '../queryQuotationList.module.scss';
import { Spin } from 'antd';

// =======================================================================

type Tcontrol_panelBody = {
  status: React.ReactNode;
  quoteDate: string;
  county: string;
  projectName: string;
  customerName: string;
  href: Parameters<typeof Link>[0]['href'];
};

export type { Tcontrol_panelBody };

// =======================================================================
export default function PanelBody({
  isFetching,
  control,
}: {
  isFetching: boolean | undefined;
  control: Tcontrol_panelBody[];
}) {
  return (
    <Spin spinning={isFetching} delay={300}>
      <div className={classNames(style.panelBody, 'min-h-24')}>
        {control.length === 0 && !isFetching && (
          <div className="flex justify-center items-center min-h-24 text-gray06 text-xl">無多次編輯紀錄</div>
        )}

        {control.map((item, index) => {
          const { status, quoteDate: updatedAt, county, projectName, customerName, href } = item;

          return (
            <CellWithBar className={style.row} key={index}>
              <span></span>
              <span className={style.step}>{status}</span>
              <span>{updatedAt}</span>
              <span>{county}</span>
              <span className={style.clientName}>{projectName}</span>
              <span className={style.clientName}>{customerName}</span>
              <span></span>
              <span></span>
              <div>
                <Link href={href}>
                  <IconDetail />
                </Link>
              </div>
            </CellWithBar>
          );
        })}
      </div>
    </Spin>
  );
}
