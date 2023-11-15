import { useState } from 'react';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import Profile, {
  Tcontrol_profile,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/profile';
import Table_requestPayment, {
  Tcontrol_table_requestPayment,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/table_requestPayment';

// gear
import InputSel, { TinputSelProps, TcheckboxProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// css
import scss from './index.module.scss';

export default function AccountReceivable() {
  const [disabled, setDisabled] = useState(true);

  // --------------------------------------------------------------------------

  const [checkBar01, setCheckBar01] = useState<string[]>([]);
  const [checkBar02, setCheckBar02] = useState<string[]>([]);

  // --------------------------------------------------------------------------
  const control_profile: Tcontrol_profile = {
    // left
    projectName: {
      value: 'fooo',
    },
    contractor: {
      value: 'fooo',
    },
    companyName: {
      value: 'fooo',
    },
    contactPerson: {
      value: 'fooo',
    },
    businessIdNumber: {
      value: 'fooo',
    },
    companyAddress: {
      value: 'fooo',
    },
    companyPhoneNumber: {
      value: 'fooo',
    },
    projectAddress: {
      value: 'fooo',
    },
    projectPhoneNumber: {
      value: 'fooo',
    },
    // right
    warrantyPeriod: {
      value: 'fooo',
    },
    projectNumber: {
      value: 'fooo',
    },
    valuationDate: {
      value: 'fooo',
    },
    paymentDate: {
      value: 'fooo',
    },
  };

  // --------------------------------------------------------------------------

  const control_checkBar01: TcheckboxProps = {
    onChange: (arr) => {
      setCheckBar01(arr);
    },
    propsArr: [
      {
        key: 'performanceCheque',
        label: '履約保證票',
        value: checkBar01.includes('performanceCheque'),
        props: {
          className: classNames(checkBar01.includes('performanceCheque') && scss.checkActive),
        },
      },
      {
        key: 'depositGuaranteeCheque',
        label: '訂金款保證票',
        value: checkBar01.includes('depositGuaranteeCheque'),
        props: {
          className: classNames(checkBar01.includes('depositGuaranteeCheque') && scss.checkActive),
        },
      },
      {
        key: 'warrantyCheque',
        label: '保固票',
        value: checkBar01.includes('warrantyCheque'),
        props: {
          className: classNames(checkBar01.includes('warrantyCheque') && scss.checkActive),
        },
      },
    ],
  };

  // --------------------------------------------------------------------------

  const control_table_requestPayment: Tcontrol_table_requestPayment = {
    columnArr: [
      {
        caption: 'foo',
        paymentRatio: { value: 'foo' },
        loanPeriod: { value: 'foo' },
        remark: { value: 'foo' },
      },
      {
        caption: 'foo',
        paymentRatio: { value: 'foo' },
        loanPeriod: { value: 'foo' },
        remark: { value: 'foo' },
      },
      {
        caption: 'foo',
        paymentRatio: { value: 'foo' },
        loanPeriod: { value: 'foo' },
        remark: { value: 'foo' },
      },
    ],
  };

  // --------------------------------------------------------------------------

  const control_checkBar02: TcheckboxProps = {
    onChange: (arr) => {
      setCheckBar02(arr);
    },
    propsArr: [
      {
        key: 'abnormal',
        label: '異常燈號：工作表已開立，合約尚未簽回',
        value: checkBar02.includes('abnormal'),
        props: {
          className: classNames(checkBar02.includes('abnormal') && scss.checkActive),
        },
      },
      {
        key: 'remind',
        label: '提醒燈號：已出具說明，尚未收足款項 ',
        value: checkBar02.includes('remind'),
        props: {
          className: classNames(checkBar02.includes('remind') && scss.checkActive),
        },
      },
      {
        key: 'notInstalled',
        label: '已出貨因故尚未安裝',
        value: checkBar02.includes('notInstalled'),
        props: {
          className: classNames(checkBar02.includes('notInstalled') && scss.checkActive),
        },
      },
    ],
  };

  // --------------------------------------------------------------------------
  const panelList_01: TpanelList = [
    //
    { type: 'myButton', label: '編輯', onClick: () => setDisabled(false) },
  ];
  const panelList_02: TpanelList = [
    {
      type: 'redButton',
      label: '上傳',
      onClick: () => {
        alert('test');
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
      },
    },
  ];

  const panelList = disabled ? panelList_01 : panelList_02;
  // --------------------------------------------------------------------------

  return (
    <SubLayer>
      <PageHeader
        //
        panelList={panelList}
        // contractNumber={engineeringContact?.contractNumber ?? ''}
        contractNumber={'foo'}
      />
      <div className={scss.main}>
        <Profile control={control_profile} />

        <div className={scss.checkBar01}>
          <InputSel showBaseline="invisible" checkBoxProps={control_checkBar01} />
        </div>

        <Table_requestPayment disabled={disabled} control={control_table_requestPayment} />

        <div className={scss.checkBar02}>
          <InputSel showBaseline="invisible" checkBoxProps={control_checkBar02} />
        </div>
      </div>
    </SubLayer>
  );
}

// ========================================================================
