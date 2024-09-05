// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// import { useTemplateProps_primitive } from 'components/basicDataEditorTemplate/useTemplateProps_basic';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// hook
import { useTemplate } from 'components/basicDataEditorTemplate/useTemplate';

// type
import {
  TemplateModelProps,
  InputSelItemDict,
  WholeLocale,
  Option,
} from 'components/basicDataEditorTemplate/modelType';
import { TrawData } from 'components/basicDataEditorTemplate/types';

// fake i18n
import locale_tw from 'pages/accounting/bankManagement/locale_tw.json';
import locale_en from 'pages/accounting/bankManagement/locale_en.json';

import { optionsCreator_county } from 'js/utils/options/countryAndDistrict';

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
      <PageHeader02 tag="複合資料編輯模板-測試" panelList={panelList} />

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

// region FAKE

const basicCaptionWidth = '140px';

const basic: TemplateModelProps['basic'] = {
  companyName: {
    valueType: 'string',
    caption: '公司名稱',
    captionStyle: { width: basicCaptionWidth },
    span: {},
  },
  taxNumber: {
    valueType: 'string',
    caption: '統一編號',
    captionStyle: { width: basicCaptionWidth },
    span: {},
  },
  tel: {
    valueType: 'string',
    caption: '電話',
    captionStyle: { width: basicCaptionWidth },
    input: {},
  },
  fax: {
    valueType: 'string',
    caption: '傳真',
    captionStyle: { width: basicCaptionWidth },
    input: {},
  },
  creationDate: {
    valueType: 'dateString',
    caption: '創建日期',
    captionStyle: { width: basicCaptionWidth },
    datePicker: {},
  },

  openStatus: {
    valueType: 'string',
    caption: '開園狀態',
    captionStyle: { width: basicCaptionWidth },
    select: {
      props: {
        options: [
          {
            value: 'opened',
            label: '開放',
          },
          {
            value: 'closed',
            label: '閉園',
          },
          {
            value: 'renovation',
            label: '整修',
          },
        ],
      },
    },
  },

  note: {
    valueType: 'string',
    caption: '備註',
    captionStyle: { width: basicCaptionWidth },
    textarea: {},
  },
};

const tables: TemplateModelProps['tables'] = {
  dogArea: {
    title: '阿狗',
    inputSelItemDict: {
      name: {
        valueType: 'string',
        input: {},
      },
      age: {
        valueType: 'number',
        input: {},
      },
      color: {
        valueType: 'string',
        input: {},
      },
      birthday: {
        valueType: 'dateString',
        datePicker: {},
      },
      personality: {
        valueType: 'string',
        input: {},
      },
    },
    columns: {
      name: {
        label: '名稱',
        width: '200px',
      },
      age: {
        label: '年齡',
        width: '200px',
      },
      color: {
        label: '顏色',
        width: '200px',
      },
      birthday: {
        label: '生日',
        width: '200px',
      },
      personality: {
        label: '個性',
        width: '200px',
      },
    },
  },
  //
  catArea: {
    title: '阿貓',
    inputSelItemDict: {
      name: {
        valueType: 'string',
        input: {},
      },
      age: {
        valueType: 'number',
        input: {},
      },
      color: {
        valueType: 'string',
        input: {},
      },
      birthday: {
        valueType: 'dateString',
        datePicker: {},
      },
      killingCount: {
        valueType: 'string',
        input: {
          props: {
            type: 'number',
          },
        },
      },
      lifeCount: {
        valueType: 'string',
        input: {
          props: {
            type: 'number',
          },
        },
      },
    },
    columns: {
      name: {
        label: '名稱',
        width: '200px',
      },
      age: {
        label: '年齡',
        width: '200px',
      },
      color: {
        label: '顏色',
        width: '200px',
      },
      birthday: {
        label: '生日',
        width: '200px',
      },
      killingCount: {
        label: '擊殺數',
        width: '200px',
      },
      lifeCount: {
        label: '餘命',
        width: '200px',
      },
    },
  },
  //
  birdArea: {
    title: '阿鳥',
    inputSelItemDict: {
      name: {
        valueType: 'string',
        input: {},
      },
      age: {
        valueType: 'number',
        input: {},
      },
      color: {
        valueType: 'string',
        input: {},
      },
      birthday: {
        valueType: 'dateString',
        datePicker: {},
      },
      title: {
        valueType: 'string',
        input: {},
      },
    },
    columns: {
      name: {
        label: '名稱',
        width: '200px',
      },
      age: {
        label: '年齡',
        width: '200px',
      },
      color: {
        label: '顏色',
        width: '200px',
      },
      birthday: {
        label: '生日',
        width: '200px',
      },
      title: {
        label: '頭銜',
        width: '200px',
      },
    },
  },
  //
};

const t03: TemplateModelProps['template'][string] = {
  titles: {
    title01: '預設值-動物園',
  },
  sections: {
    a: ['companyName', 'taxNumber', 'tel', 'fax', 'creationDate', 'openStatus'],
    b: ['note'],
  },
  tables: {
    tableA: {
      targetTableKey: 'dogArea',
      keyArr: ['name', 'age', 'color', 'birthday', 'personality'],
    },
    tableB: {
      targetTableKey: 'catArea',
      keyArr: ['name', 'age', 'color', 'birthday', 'killingCount', 'lifeCount'],
    },
    tableC: {
      targetTableKey: 'birdArea',
      keyArr: ['name', 'age', 'color', 'birthday', 'title'],
    },
  },

  tabs_table: {
    a: ['tableA', 'tableB', 'tableC'],
  },
};

const fakeTemplateModelProps: TemplateModelProps = {
  basic: basic,
  tables: tables,
  template: {
    t03: t03,
  },
  localeSrc: 'zoo',
  locale: locale_tw as WholeLocale,
  // locale: locale_en as WholeLocale,
};
// ------------------------------------------------------------------------

const fakeData: TrawData = {
  id: 'uu-dfdas-f11212-ss12w1',
  createdAt: '2022-11-11',
  updatedAt: '2022-11-11',
  companyName: '阿貓阿狗動物園',
  taxNumber: 'TA-11223344',
  tel: '02-12345678',
  fax: '02-87654321',
  creationDate: '2022-11-11',
  openStatus: 'renovation',
  note: '備註~~~~\n備註~~~~\n備註~~~~',
  dogArea: [
    {
      name: '汪汪',
      age: 1,
      color: '白色',
      birthday: '2019-11-11',
      personality: '呆',
    },
    {
      name: '月月',
      age: 4,
      color: '黑色',
      birthday: '2018-11-11',
      personality: '二哈',
    },
    {
      name: '邊邊',
      age: 13,
      color: '黑白',
      birthday: '2018-11-11',
      personality: '邊牧是邊牧，狗是狗',
    },
  ],
  catArea: [
    {
      name: '咪咪',
      age: 3,
      color: '灰色',
      birthday: '2019-11-11',
      killingCount: 12,
      lifeCount: 9,
    },
    {
      name: '花花',
      age: 12,
      color: '黃',
      birthday: '2018-12-17',
      killingCount: 666,
      lifeCount: 9,
    },
  ],
  birdArea: [
    {
      name: '啾啾',
      age: 2,
      color: '綠色',
      birthday: '2019-11-11',
      title: '海盜',
    },
    {
      name: '咕咕',
      age: 8,
      color: '黃色',
      birthday: '2008-05-17',
      title: '賽鴿冠軍',
    },
    {
      name: '飛飛',
      age: 50,
      color: '黃色',
      birthday: '2016-01-08',
      title: '飛天老鼠',
    },
    {
      name: '小雞',
      age: 9999,
      color: '朱色',
      birthday: null,
      title: '神鳥鳳凰',
    },
  ],
};

// =================================================================================
// =================================================================================
// =================================================================================
// =================================================================================
// =================================================================================
// 留作參考
{
  const basic: TemplateModelProps['basic'] = {
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

  const tables: TemplateModelProps['tables'] = {
    abcd: {
      // targetProperty: 'abcd',
      title: 'ABCD',
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
      columns: {
        a: {
          label: 'a',
          width: '200px',
        },
        b: {
          label: 'b',
          width: '200px',
        },
        c: {
          label: 'c',
          width: '200px',
        },
        d: {
          label: 'd',
          width: '200px',
        },
      },
    },

    efgh: {
      // targetProperty: 'efgh',
      // title: null,
      inputSelItemDict: {
        e: {
          valueType: 'string',
          // captionStyle: { width: '140px' },
          input: {},
        },
        f: {
          valueType: 'string',
          // captionStyle: { width: '140px' },
          input: {},
        },
        g: {
          valueType: 'string',
          // captionStyle: { width: '140px' },
          input: {},
        },
        h: {
          valueType: 'dateString',
          // captionStyle: { width: '140px' },
          datePicker: {},
        },
      },
      columns: {
        e: {
          label: 'e',
          width: '150px',
        },
        f: {
          label: 'f',
          width: '150px',
        },
        g: {
          label: 'g',
          width: '150px',
        },
        h: {
          label: 'h',
          width: '150px',
        },
      },
    },
  };

  const t03: TemplateModelProps['template'][string] = {
    titles: {
      title01: '預設值-銀行管理',
    },
    sections: {
      a: ['accountName', 'account'],
      b: ['bankName', 'bankCode', 'note', 'visiteDate'],
    },
    tables: {
      tableA: {
        targetTableKey: 'abcd',
        keyArr: ['a', 'b', 'd', 'c'],
      },
      tableB: {
        targetTableKey: 'efgh',
        keyArr: ['e', 'f', 'g', 'h'],
      },
    },
    tabs_table: {
      a: ['tableB', 'tableA'],
    },
    //
  };

  const fakeTemplateModelProps: TemplateModelProps = {
    basic: basic,
    tables: tables,

    template: {
      t03: t03,
    },
    localeSrc: 'bankManagement',
    locale: locale_tw as WholeLocale,
    // locale: locale_en as WholeLocale,
    // locale: undefined,
  };

  const fakeData: TrawData = {
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

    abcd: [
      {
        id: 'fooooo',
        a: 'a0',
        b: 'b0',
        c: 'c0',
        d: '2022-11-11',

        nouse01: 'nouse',
        // meow: {
        //   foo: 'ff',
        //   bar: 'bbbb',
        // },
      },
      {
        a: 'a1',
        b: 'b1',
        c: 'c1',
        d: '2022-11-11',
      },
    ],
    efgh: [
      {
        e: 'a0-2',
        f: 'b0-2',
        g: 'c0-2',
        h: '2022-11-02',
      },
      {
        e: 'a1-2',
        f: 'b1-2',
        g: 'c1-2',
        h: '2022-11-02',
        //
        nouse02: 'nouse',
      },
    ],
  };
}
