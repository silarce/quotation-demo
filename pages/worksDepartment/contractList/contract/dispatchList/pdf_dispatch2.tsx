import { useRef } from 'react';

import classNames from 'classnames';

import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import { dlPdf, getA4Rect } from 'js/utils/dlPdf';

import scss from './pdf_dispatch2.module.scss';

// =======================================================================

interface Tprops {
  data: {
    idNumber: string; // 派工單號，也就是序號
    customerName: string; // 其實是工地名稱
    phoneNumber: string; // 工地電話
    contactPerson: string; // 接洽人，自動帶工程聯絡單的聯絡人，但必須可以修改
    address: string; // 工地地址
    projectNumber: string; // 工程編號
    // warrantyPeriod: string; // 保固日期
    content: string; // 承辦情形
  };
}

// =======================================================================

const { width, height } = getA4Rect();

export default function Pdf_dispatch2({
  data: { idNumber, customerName, phoneNumber, contactPerson, address, projectNumber, content },
}: Tprops) {
  const ref_pdf = useRef<HTMLDivElement>(null);

  const handelExportPdf = () => {
    dlPdf({
      divElementArr: [ref_pdf.current],
      fileName: `派工單_${customerName}_${idNumber}`,
      ISO216: 'a4',
      horizontal: false,
    });
  };

  return (
    <div className={classNames('p-5')}>
      <div>
        <MyButton_v2 onClick={handelExportPdf}>匯出PDF</MyButton_v2>
      </div>
      <br />
      <div className={classNames('border border-border')}>
        <div
          ref={ref_pdf}
          className={classNames(scss.pdf, 'text-[30px] leading-[32px]')}
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          <h1 className={classNames('gap-1', scss.title)}>{strToSpan('三久建材工業股份有限公司')}</h1>
          <h2 className={classNames('gap-5', scss.title)}>{strToSpan('派工證明單')}</h2>

          <div className={classNames(scss.top)}>
            <span className={classNames('mr-3 translate-y-[5px]')}>序號</span>
            <div className={classNames('pb-[4px] w-full')}>
              <div className={classNames('border-b-2 border-border02 text-[20px]')}>{idNumber}</div>
            </div>
          </div>

          <div className={classNames(scss.table)}>
            {/* row1 */}
            <Cell className={classNames('col-span-2 row-span-2 ', cn1)}>{strToSpan('客戶')}</Cell>
            <Cell className={classNames('col-span-3 row-span-2', cn3)}>{customerName}</Cell>

            <Cell className={classNames('row-span-2', cn2)}>電話</Cell>
            <Cell className={classNames('col-span-2 row-span-2', cn3)}>{phoneNumber}</Cell>

            <Cell className={classNames('col-span-2', cn5)}>{strToSpan('工程編號')}</Cell>
            <Cell className={classNames(cn3, 'text-[25px]')}>{projectNumber}</Cell>

            {/* row2 */}
            <Cell className={classNames('col-span-2', cn5)}>{strToSpan('保固期限')}</Cell>
            <Cell></Cell>
            {/* row3 */}
            <Cell className={classNames('col-span-2 ', cn1)}>{strToSpan('接洽人')}</Cell>
            <Cell className={classNames('col-span-3')}>{contactPerson}</Cell>
            <Cell className={classNames(cn2)}>住址</Cell>
            <Cell className={classNames('col-span-5', cn3)}>{address}</Cell>
            {/* row4 */}
            <Cell className={classNames('col-span-2 row-span-2 ', cn1)}>{strToSpan('點交內容')}</Cell>
            <Cell className={classNames(cn4)}>捲門</Cell>
            <Cell className={classNames(cn2)}>遙控器</Cell>
            <Cell_unit></Cell_unit>
            <Cell className={classNames('col-span-2', cn2)}>{`鑰匙(${'null'})`}</Cell>
            <Cell_unit></Cell_unit>
            <Cell className={classNames('col-span-3', cn3)}>其他:</Cell>
            {/* row5 */}
            <Cell className={classNames(cn4)}>大門</Cell>
            <Cell className={classNames(cn2)}>遙控器</Cell>
            <Cell_unit></Cell_unit>
            <Cell className={classNames('col-span-2', cn2)}>控箱鑰匙</Cell>
            <Cell_unit></Cell_unit>
            <Cell className={classNames(cn2)}>馬達鑰匙</Cell>
            <Cell_unit></Cell_unit>
            <Cell className={classNames(cn3)}>其他:</Cell>
            {/* row6 */}

            <Cell className={classNames('row-span-8 grid justify-center')}>{strToSpan('承辦情形')}</Cell>
            <Cell className={classNames('col-span-8 row-span-8')}>{content}</Cell>

            <Cell className={classNames('col-span-2 gap-6', cn2, ch6)}>{strToSpan('派工批價')}</Cell>
            {/* row7 */}
            <Cell></Cell>
            <Cell className={ch6}>合約內</Cell>
            {/* row8 */}
            <Cell></Cell>
            <Cell className={ch6}>合約追加</Cell>
            {/* row9 */}
            <Cell></Cell>
            <Cell className={ch6}>修繕計價</Cell>
            {/* row10 */}
            <Cell></Cell>
            <Cell className={ch6}>贈送</Cell>
            {/* row11 */}
            <Cell></Cell>
            <Cell className={ch6}>保固內</Cell>
            {/* row12 */}
            <Cell></Cell>
            <Cell className={ch6}>其他</Cell>
            {/* row13 */}
            <Cell className={classNames(cn2, ch6, scss.noXPadding)}>金額</Cell>
            <Cell></Cell>
            {/* row14 */}
            <Cell className="grid grid-rows-2 grid-flow-col justify-center items-center gap-x-4">
              {strToSpan('往返時間')}
            </Cell>
            <Cell className={classNames('col-span-8 flex items-center justify-between')}>
              <div>
                <div>　　月　　日　　時　　　分</div>
                <div>　　月　　日　　時　　　分</div>
              </div>
              <div className="mr-2">{'(共計　　時　　分)'}</div>
            </Cell>
            <Cell className="grid justify-center leading-9">{strToSpan('客戶簽章')}</Cell>
            <Cell></Cell>
          </div>
          <div className={classNames(scss.signatureBar)}>
            <div>{strToSpan('歸檔')}</div>
            <div>{strToSpan('主管')}</div>
            <div>{strToSpan('財會')}</div>
            <div>{strToSpan('批價')}</div>
            <div>{strToSpan('工務承辦')}</div>
            <div>{strToSpan('交辦單位')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Cell = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={classNames(scss.cell, className)} {...props} />;
};

const Cell_unit = ({ className, children = '　', ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Cell className={classNames(className)} {...props}>
      <div className="text-center">{children}</div>
      <div className={'text-center text-[12px]'}>付</div>
    </Cell>
  );
};

const strToSpan = (str: string) => {
  return str.split('').map((char, index) => <span key={index}>{char}</span>);
};

const cn1 = classNames('flex justify-between items-center', scss.px12);
const cn2 = 'flex justify-center items-center';
const cn3 = 'flex items-center';
const cn4 = 'text-center leading-8';
const cn5 = 'flex justify-center items-center gap-2 leading-8';
const ch6 = 'py-2';
