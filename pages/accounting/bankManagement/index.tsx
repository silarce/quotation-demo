// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

import type { TbankDto } from 'js/api/dtoTypes';

import { TemplateModelProps, InputSelItemDict } from 'components/basicDataEditorTemplate/modelType';
import { useTemplateProps_primitive } from 'components/basicDataEditorTemplate/useTemplateProps_primitive';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import locale_tw from 'pages/accounting/bankManagement/locale_tw.json';
import locale_en from 'pages/accounting/bankManagement/locale_en.json';

import { useTemplate } from 'components/basicDataEditorTemplate/useTemplate';

// =================================================================================

// MARK: START

export default function BankManagement(): React.ReactElement {
  const { Template, templateProps, disabled, switchDisabled } = useTemplate({
    rawData: fakeData,
    templateModelProps: fakeTemplateModelProps,
  });

  // --------------------------------------------------------------------

  const panelList_disabled: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => {
        switchDisabled(false);
      },
    },
  ];

  const panelList_abled: TpanelList = [
    // {
    //   type: 'redButton',
    //   label: reqPost ? '確定新增' : reqPatch ? '確定更新' : '後端設定錯誤',
    //   onClick: () => {
    //     if (reqPost) {
    //       reqPost();
    //     } else if (reqPatch) {
    //       reqPatch();
    //     } else {
    //       myAlert.err({ title: '後端設定錯誤' });
    //     }
    //   },
    // },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        switchDisabled(true);
      },
    },
  ];

  const panelList = disabled ? panelList_disabled : panelList_abled;

  // --------------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02 tag="銀行管理" panelList={panelList} />

      <div>{Template && <Template {...templateProps} />}</div>
    </SubLayer>
  );
}
// MARK: END

// =================================================================================
// =================================================================================
// =================================================================================
// =================================================================================
// =================================================================================

const inputSelItemDict: InputSelItemDict = {
  accountName: {
    valueType: 'string',
    captionStyle: { width: '140px' },
    input: {},
  },
  account: {
    valueType: 'string',
    captionStyle: { width: '140px' },
    input: {},
  },
  bankName: {
    valueType: 'string',
    captionStyle: { width: '140px' },
    select: {
      props: {
        options: [
          { value: '喵喵銀行', label: '預設值-喵喵銀行', bankCode: 'cc-001' },
          { value: '汪汪銀行', label: '預設值-汪汪銀行', bankCode: 'ww-002' },
          { value: '咩咩銀行', label: '預設值-咩咩銀行', bankCode: 'bb-003' },
          { value: '啾啾銀行_值', bankCode: 'tt-004' },
        ],
      },
    },
  },
  bankCode: {
    showBaseline: 'invisible',
    valueType: 'string',
    captionStyle: { width: '140px' },
    span: {},
  },

  note: {
    valueType: 'string',
    captionStyle: { width: '140px' },
    textarea: {
      allowNewLineByUser: true,
    },
  },

  agentName: {
    valueType: 'string',
    captionStyle: { width: '140px' },
    textarea: {
      allowNewLineByUser: true,
    },
  },

  visiteDate: {
    valueType: 'dateString',
    captionStyle: { width: '140px' },
    datePicker: {},
  },
};

const fakeTemplateModelProps: TemplateModelProps = {
  inputSelItemDict,

  tables: {
    testTable: {
      targetProperty: 'testTable',
      inputSelItemDict: {
        a: {
          valueType: 'string',
          // captionStyle: { width: '140px' },
          input: {},
        },
        b: {
          valueType: 'string',
          // captionStyle: { width: '140px' },
          input: {},
        },
        c: {
          valueType: 'string',
          // captionStyle: { width: '140px' },
          input: {},
        },
        d: {
          valueType: 'dateString',
          // captionStyle: { width: '140px' },
          datePicker: {},
        },
      },
    },

    testTable02: {
      targetProperty: 'testTable02',
      inputSelItemDict: {
        a: {
          valueType: 'string',
          // captionStyle: { width: '140px' },
          input: {},
        },
        b: {
          valueType: 'string',
          // captionStyle: { width: '140px' },
          input: {},
        },
        c: {
          valueType: 'string',
          // captionStyle: { width: '140px' },
          input: {},
        },
        d: {
          valueType: 'dateString',
          // captionStyle: { width: '140px' },
          datePicker: {},
        },
      },
    },
  },

  template: {
    t03: {
      titles: {
        title01: '預設值-銀行管理',
      },
      sections: {
        a: ['accountName', 'account'],
        b: ['bankName', 'bankCode', 'note', 'visiteDate'],
      },
      tables: {
        tableA: {
          targetKey: 'testTable',
          keyArr: ['a', 'b', 'd', 'c'],
          columns: {
            a: {
              label: 'A',
              width: '200px',
            },
            b: {
              label: 'B',
              width: '200px',
            },
            c: {
              label: 'C',
              width: '200px',
            },
            d: {
              label: 'D',
              width: '200px',
            },
          },
        },
        tableB: {
          targetKey: 'testTable02',
          columns: {
            a: {
              label: 'A',
              width: '150px',
            },
            b: {
              label: 'B',
              width: '150px',
            },
            c: {
              label: 'C',
              width: '150px',
            },
            d: {
              label: 'D',
              width: '150px',
            },
          },
          keyArr: ['a', 'b', 'c', 'd'],
        },
      }, //tables
      //
    },
  },

  locale: locale_tw,
  // locale: locale_en,
  // locale: undefined,
};

const fakeData = {
  id: '1',
  createAt: '',
  updateAt: '',
  createBy: '',
  updateBy: '',

  accountName: '這是銀行帳號',
  account: '05-78-65665',
  bankCode: 'cc-001',
  bankName: '喵喵銀行',
  note: 'NOTE~~~~\nNOTE~~~~\nNOTE~~~~',
  visiteDate: '2022-11-11',

  testTable: [
    {
      a: 'a0',
      b: 'b0',
      c: 'c0',
      d: '2022-11-11',
    },
    {
      a: 'a1',
      b: 'b1',
      c: 'c1',
      d: '2022-11-11',
    },
  ],
  testTable02: [
    {
      a: 'a0-2',
      b: 'b0-2',
      c: 'c0-2',
      d: '2022-11-02',
    },
    {
      a: 'a1-2',
      b: 'b1-2',
      c: 'c1-2',
      d: '2022-11-02',
    },
  ],
};
