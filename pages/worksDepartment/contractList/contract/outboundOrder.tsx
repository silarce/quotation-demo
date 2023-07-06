// 出庫單
// 出庫單
// 出庫單
import React, { useState } from 'react';

// component
import PageHeader from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import OrderTable from 'components/page/worksDepartment/contracList/contract/outboundOrder/orderTable';

// css
import style from './contract.module.scss';

// type
import { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

export default function OutboundOrder() {
  const [editable, setEditable] = useState(false);

  const panelList01: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => {
        setEditable(true);
      },
    },
  ];
  const panelList02: TpanelList = [
    {
      type: 'redButton',
      label: '儲存',
      onClick: () => {
        alert('儲存');
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setEditable(false);
      },
    },
  ];

  return (
    <div className={style.container}>
      <PageHeader panelList={editable ? panelList02 : panelList01} />

      <div className={style.mainContainer}>
        <div className={style.outboundOrder}>
          <div className={style.title}>
            <div>
              <span>工程編號</span>
              <span>{'M-1101201'}</span>
            </div>
            <div>
              <span>工程名稱</span>
              <span>{'台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程'}</span>
            </div>
          </div>

          <OrderTable editable={editable} />

          <div className={style.remark}>
            <div className={style.title}>
              <div>
                <span>備註</span>
              </div>
            </div>

            <div className={style.textarea}>
              <textarea name="" id="" placeholder="請輸入備註"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
