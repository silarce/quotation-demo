// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

import type { TbankDto } from 'js/api/dtoTypes';

// import { TemplateModelProps, InputSelItemDict, WholeLocale } from 'components/basicDataEditorTemplate/modelType';
// import { useTemplateProps_primitive } from 'components/basicDataEditorTemplate/useTemplateProps_basic';
// import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// import locale_tw from 'pages/accounting/bankManagement/locale_tw.json';
// import locale_en from 'pages/accounting/bankManagement/locale_en.json';

import { useTemplate } from 'components/basicDataEditorTemplate/useTemplate';

// =================================================================================

// MARK: START

export default function BankManagement(): React.ReactElement {
  // const { Template, templateProps, disabled, switchDisabled } = useTemplate({
  //   rawData: fakeData,
  //   templateModelProps: fakeTemplateModelProps,
  // });

  // --------------------------------------------------------------------

  // const panelList_disabled: TpanelList = [
  //   {
  //     type: 'myButton',
  //     label: '編輯',
  //     onClick: () => {
  //       switchDisabled(false);
  //     },
  //   },
  // ];

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
        // switchDisabled(true);
      },
    },
  ];

  // const panelList = disabled ? panelList_disabled : panelList_abled;

  // --------------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02
        tag="銀行管理"
        // panelList={panelList}
      />

      {/* <div>{Template && <Template {...templateProps} />}</div> */}
    </SubLayer>
  );
}
// MARK: END

// =================================================================================
// =================================================================================
// =================================================================================
// =================================================================================
// =================================================================================

// const basic: TemplateModelProps['basic'] = {
//   accountName: {
//     valueType: 'string',
//     captionStyle: { width: '140px' },
//     input: {},
//   },
//   account: {
//     valueType: 'string',
//     captionStyle: { width: '140px' },
//     input: {},
//   },
//   bankName: {
//     valueType: 'string',
//     captionStyle: { width: '140px' },
//     select: {
//       props: {
//         options: [
//           { value: '喵喵銀行', label: '預設值-喵喵銀行', bankCode: 'cc-001' },
//           { value: '汪汪銀行', label: '預設值-汪汪銀行', bankCode: 'ww-002' },
//           { value: '咩咩銀行', label: '預設值-咩咩銀行', bankCode: 'bb-003' },
//           { value: '啾啾銀行_值', bankCode: 'tt-004' },
//         ],
//       },
//     },
//   },
//   bankCode: {
//     showBaseline: 'invisible',
//     valueType: 'string',
//     captionStyle: { width: '140px' },
//     span: {},
//   },

//   note: {
//     valueType: 'string',
//     captionStyle: { width: '140px' },
//     textarea: {
//       allowNewLineByUser: true,
//     },
//   },

//   agentName: {
//     valueType: 'string',
//     captionStyle: { width: '140px' },
//     textarea: {
//       allowNewLineByUser: true,
//     },
//   },

//   visiteDate: {
//     valueType: 'dateString',
//     captionStyle: { width: '140px' },
//     datePicker: {},
//   },
// };

// const tables: TemplateModelProps['tables'] = {
//   abcd: {
//     // targetProperty: 'abcd',
//     inputSelItemDict: {
//       a: {
//         valueType: 'string',
//         // captionStyle: { width: '140px' },
//         input: {},
//       },
//       b: {
//         valueType: 'string',
//         // captionStyle: { width: '140px' },
//         input: {},
//       },
//       c: {
//         valueType: 'string',
//         // captionStyle: { width: '140px' },
//         input: {},
//       },
//       d: {
//         valueType: 'dateString',
//         // captionStyle: { width: '140px' },
//         datePicker: {},
//       },
//     },
//     columns: {
//       a: {
//         label: 'a',
//         width: '200px',
//       },
//       b: {
//         label: 'b',
//         width: '200px',
//       },
//       c: {
//         label: 'c',
//         width: '200px',
//       },
//       d: {
//         label: 'd',
//         width: '200px',
//       },
//     },
//   },

//   efgh: {
//     // targetProperty: 'efgh',
//     inputSelItemDict: {
//       e: {
//         valueType: 'string',
//         // captionStyle: { width: '140px' },
//         input: {},
//       },
//       f: {
//         valueType: 'string',
//         // captionStyle: { width: '140px' },
//         input: {},
//       },
//       g: {
//         valueType: 'string',
//         // captionStyle: { width: '140px' },
//         input: {},
//       },
//       h: {
//         valueType: 'dateString',
//         // captionStyle: { width: '140px' },
//         datePicker: {},
//       },
//     },
//     columns: {
//       e: {
//         label: 'e',
//         width: '150px',
//       },
//       f: {
//         label: 'f',
//         width: '150px',
//       },
//       g: {
//         label: 'g',
//         width: '150px',
//       },
//       h: {
//         label: 'h',
//         width: '150px',
//       },
//     },
//   },
// };

// const t03: TemplateModelProps['template'][string] = {
//   titles: {
//     title01: '預設值-銀行管理',
//   },
//   sections: {
//     a: ['accountName', 'account'],
//     b: ['bankName', 'bankCode', 'note', 'visiteDate'],
//   },
//   tables: {
//     tableA: {
//       targetTableKey: 'abcd',
//       keyArr: ['a', 'b', 'd', 'c'],
//     },
//     tableB: {
//       targetTableKey: 'efgh',
//       keyArr: ['e', 'f', 'g', 'h'],
//     },
//   }, //tables
//   //
// };

// const fakeTemplateModelProps: TemplateModelProps = {
//   basic: basic,
//   tables: tables,

//   template: {
//     t03: t03,
//   },
//   localeSrc: 'bankManagement',
//   locale: locale_tw as WholeLocale,
//   // locale: locale_en as WholeLocale,
//   // locale: undefined,
// };

// const fakeData = {
//   id: '1',
//   createAt: '',
//   updateAt: '',
//   createBy: '',
//   updateBy: '',

//   accountName: '這是銀行帳號',
//   account: '05-78-65665',
//   bankCode: 'cc-001',
//   bankName: '喵喵銀行',
//   note: 'NOTE~~~~\nNOTE~~~~\nNOTE~~~~',
//   visiteDate: '2022-11-11',

//   abcd: [
//     {
//       a: 'a0',
//       b: 'b0',
//       c: 'c0',
//       d: '2022-11-11',
//     },
//     {
//       a: 'a1',
//       b: 'b1',
//       c: 'c1',
//       d: '2022-11-11',
//     },
//   ],
//   efgh: [
//     {
//       e: 'a0-2',
//       f: 'b0-2',
//       g: 'c0-2',
//       h: '2022-11-02',
//     },
//     {
//       e: 'a1-2',
//       f: 'b1-2',
//       g: 'c1-2',
//       h: '2022-11-02',
//     },
//   ],
// };
