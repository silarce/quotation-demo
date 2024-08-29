// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

import type { TbankDto } from 'js/api/dtoTypes';

import { TemplateModelProps, InputSelItemDict } from 'components/editTemplate/modelType';
import { useInputSel } from 'components/editTemplate/useInputSelProps';

// =================================================================================

// MARK: START

export default function BankManagement(): React.ReactElement {
  const {
    Template,
    templateProps,

    disabled,
    switchDisabled,
  } = useInputSel({
    rawData: fakeData,
    templateModelProps: fakeTemplateModelProps,
  });

  // --------------------------------------------------------------------

  const panelList: TpanelList = [
    disabled
      ? {
          type: 'myButton',
          label: '編輯',
          onClick: () => {
            switchDisabled();
          },
        }
      : null,
    !disabled
      ? {
          type: 'myButton',
          label: '取消',
          onClick: () => {
            switchDisabled();
          },
        }
      : null,
  ];

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
    // key: 'accountName',
    valueType: 'string',
    caption: {
      'zh-TW': '帳號名稱',
      en: 'Account Name',
    },
    captionStyle: { width: '140px' },
    input: {},
  },
  account: {
    // key: 'account',
    valueType: 'string',
    caption: {
      'zh-TW': '帳號',
      en: 'Account',
    },
    captionStyle: { width: '140px' },
    input: {},
  },
  bankName: {
    // key: 'bankName',
    valueType: 'string',
    caption: {
      'zh-TW': '銀行',
      en: 'Bank',
    },
    captionStyle: { width: '140px' },

    select: {
      props: {
        options: [
          { value: '喵喵銀行', label: '喵喵銀行' },
          { value: '汪汪銀行', label: '汪汪銀行' },
          { value: '啾啾銀行', label: '啾啾銀行' },
        ],
      },
    },
  },
  bankCode: {
    // key: 'bankCode',
    valueType: 'string',
    caption: {
      'zh-TW': '銀行代號',
      en: 'Bank Code',
    },
    captionStyle: { width: '140px' },
    input: {},
  },
  //
  //
  note: {
    // key: 'note',
    valueType: 'string',
    caption: {
      'zh-TW': '備註',
      en: 'Note',
    },
    captionStyle: { width: '140px' },
    textarea: {
      allowNewLineByUser: true,
    },
  },

  theDate: {
    // key: 'theDate',
    valueType: 'dateString',
    caption: {
      'zh-TW': '日期',
      en: 'Date',
    },
    captionStyle: { width: '140px' },
    datePicker: {},
  },
};

const fakeTemplateModelProps: TemplateModelProps = {
  inputSelItemDict,

  getApi: '',
  postApi: '',
  patchApi: '',

  template: {
    // t01: {
    //   style: { width: '600px' },
    //   layout: {
    //     a: ['accountName', 'account', 'bankName', 'bankCode'],
    //   },
    // },
    t02: {
      title01: '帳號帳號帳號',
      layout: {
        a: ['accountName', 'account'],
        b: ['bankName', 'bankCode', 'note', 'theDate'],
      },
    },
  },
};

const fakeData = {
  id: '1',
  createAt: '',
  updateAt: '',
  createBy: '',
  updateBy: '',

  accountName: '這是銀行帳號',
  account: '05-78-65665',
  bankCode: '735-45863',
  bankName: '喵喵銀行',
  note: 'NOTE~~~~\nNOTE~~~~\nNOTE~~~~',
  theDate: '2022-11-11',
};
