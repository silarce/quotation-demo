import { useState, useRef, Fragment, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// antd
import { Modal } from 'antd';

// composition
import { Selector, TimperativeHandle, TselectorProps, TselectorProps_simple } from './selector/selector';

// gear
import TwoBtnFooter from '../footer/twoBtnFooter';

// css
import scss from './selectorModalCreator_multi.module.scss';

// api
import { Tparams } from 'js/api/dtoTypes';
import { useGetOutsourcing, ToutsourcingDto } from 'js/api/api_outsourcing';
import { useEmployee_infinite_2, TemployeeDto } from 'js/api/api_employee';

import { useDepartments } from 'js/api/api_department';
import { useGetEngineeringContact_all, TengineeringContactDto } from 'js/api/api_engineering';

// api useNoMeta // useNoMeta為api回應沒有meta特性的api hook
import { TdailyReportItem_my, useGetDaily_worker_date } from 'js/api/api_dailyReport';

import {
  //
  useGetAnnotation_infinite,
  TannotationDto,
  useGetQuotationRanges_infinite,
  TquotationRangeDto,
} from 'js/api/api_workSheet';

import { useGetCustomers_infinite_2, TcustomerDto } from 'js/api/api_customer';

import { TsettleProductDto, useGetQuotationContentSettleProduct } from 'js/api/api_certificated-doc';

// lookup and options
import { optionsCreator_county } from 'js/utils/options/countryAndDistrict';
import { customerTypesLookup } from 'js/api/api_customer';
import { Toption } from 'js/utils/options/options';

// ======================================================================

type TtypeLookup = {
  outsourcing: Exclude<(typeof props_outsourcing)['dataType'], undefined>;
  employee: Exclude<(typeof props_employee)['dataType'], undefined>;
  employee_worksDepartment: Exclude<(typeof props_employee_worksDepartment)['dataType'], undefined>;
  dailyReport_workers_item: Exclude<(typeof props_dailyReport_workers_item)['dataType'], undefined>;
  engineeringContact: Exclude<(typeof props_engineeringContact)['dataType'], undefined>;
  annotation: Exclude<(typeof props_annotation)['dataType'], undefined>;
  quotationRange: Exclude<(typeof props_quotationRange)['dataType'], undefined>;
  customer: Exclude<(typeof props_customer)['dataType'], undefined>;
  settleProduct: Exclude<(typeof props_settleProduct)['dataType'], undefined>;
  // test: Exclude<(typeof props_outsourcing)['dataType'], undefined>;
  // foooo: Exclude<(typeof props_outsourcing)['dataType'], undefined>;
};

type keyTuple_to_dataTuple<TkeyArr extends (keyof TtypeLookup)[]> = {
  [index in keyof TkeyArr]: TtypeLookup[TkeyArr[index]][];
};

type TselectorArrItem<Tkey extends keyof TtypeLookup> = {
  // key: keyof typeof propsLookup;
  key: Tkey;
  caption?: string | null;
  tip?: string | null;
  clearOther?: number[];
  limit?: number;
  forbiddenCheck_dataList?: TselectorProps<TtypeLookup[Tkey]>['forbiddenCheck_dataList'];
  customParams?: Tparams;
};

// type TselectorArr<TkeyArr extends (keyof TtypeLookup)[]> = {
//   [index in keyof TkeyArr]: TselectorArrItem<TkeyArr[index]>;
// };
type TselectorArr<TkeyArr extends (keyof TtypeLookup)[]> = {
  [index in keyof TkeyArr]: TselectorArrItem<TkeyArr[index]>;
};

// type TselectorPropsArr<TkeyArr extends (keyof TtypeLookup)[]> = {
//   [index in keyof TkeyArr]: TselectorProps_dyna<TtypeLookup[TkeyArr[index]]> | undefined;
// };

// type TdynaSelectorPropsList<TkeyArr extends (keyof TtypeLookup)[]> = {
//   [index in keyof TkeyArr]: TkeyArr[index] extends 'dailyReport_workers_item'
//     ? TselectorProps_simple
//     : TselectorProps_simple | undefined;
// };

type TkeyofDailyReport_workers_item = keyof Omit<
  Exclude<Parameters<typeof useGetDaily_worker_date>[0], undefined>,
  'params'
>;

type TpropsKey_settleProduct = keyof Omit<
  Exclude<Parameters<typeof useGetQuotationContentSettleProduct>[0], undefined>,
  'params'
>;

type TuseNoMetaPropsInNeed = {
  dailyReport_workers_item: { [key in TkeyofDailyReport_workers_item]: true };
  settleProduct: { [key in TpropsKey_settleProduct]: true };
};

// 期望的型別 : 應為object而非array，index的型別為number所以被推斷為array，若為string就會是object了
// 另外若為string，TkeyArr[index]的型別就會錯誤。
type TdynaSelectorPropsList<TkeyArr extends (keyof TtypeLookup)[]> = {
  [index in keyof TkeyArr]: TkeyArr[index] extends keyof TuseNoMetaPropsInNeed
    ? TselectorProps_simple<TuseNoMetaPropsInNeed[TkeyArr[index]], TtypeLookup[TkeyArr[index]]>
    : TselectorProps_simple | undefined;
};

export type {
  TselectorProps_simple,
  //
  ToutsourcingDto,
  TemployeeDto,
  TdailyReportItem_my,
  TengineeringContactDto,
  TcustomerDto,
};

// ======================================================================

export function selectModalCreator_multi<TkeyArr extends (keyof TtypeLookup)[]>({
  modalWidth = 1300,
  selectorArr,
}: {
  modalWidth?: React.CSSProperties['width'];
  selectorArr: TselectorArr<TkeyArr>;
}) {
  type TdataArrArr = keyTuple_to_dataTuple<TkeyArr>;

  const SelectModal = ({
    showModal,
    onConfirm,
    onCancel,
    isCancelOnConfirm = true,
    defaultSeletedDataArrArr,
    caption,
    tip,
    //
    dynaSelectorPropsList,
  }: //
  {
    showModal: boolean;
    onConfirm: (v: TdataArrArr) => void;
    onCancel: () => void;
    isCancelOnConfirm?: boolean;
    defaultSeletedDataArrArr?: Partial<TdataArrArr>;
    caption?: string;
    tip?: string;
    //
    dynaSelectorPropsList?: TdynaSelectorPropsList<TkeyArr>;
    //
  }) => {
    // ------------------------------------------------------------------------

    const [dataArrArr, setDataArrArr] = useState<TdataArrArr>([] as unknown as TdataArrArr);

    // ------------------------------------------------------------------------

    const selectorRef = useRef<TimperativeHandle[]>([]);

    // ------------------------------------------------------------------------

    const { data: data_department, update: update_department, isLoading } = useDepartments();

    const options_department = useMemo(() => {
      if (!data_department) {
        return undefined;
      }

      const options = data_department?.data.map((item) => {
        return {
          label: item.name,
          value: item.name,
        };
      });

      options.unshift({
        label: '不拘',
        value: '',
      });

      return options;
    }, [data_department]);

    // ------------------------------------------------------------------------

    const theOnConfirm = () => {
      onConfirm(dataArrArr);
      isCancelOnConfirm && onCancel();
    };

    const updateDepartment = () => {
      if (isLoading || data_department) {
        return;
      }

      update_department();
    };

    // ------------------------------------------------------------------------

    // useEffect(() => {
    //   update_department();
    // }, []);

    useEffect(() => {
      const keyArr = selectorArr.map((item) => item.key);

      if (keyArr.includes('employee')) {
        updateDepartment();
      }
    }, [selectorArr]);

    // ------------------------------------------------------------------------

    return (
      <Modal
        visible={showModal}
        // width={rwd1023 ? '80vw' : modalWidth}
        width={modalWidth}
        className={scss.container}
        closable={false}
        centered={true}
        destroyOnClose={true}
        footer={null}
        onCancel={onCancel}
      >
        <div className={classNames(scss.body)}>
          {(caption || tip) && (
            <div>
              <span className={scss.caption}>{caption}</span>
              <span className={classNames(scss.tip, caption && 'ml-3')}>{tip}</span>
            </div>
          )}

          {/*  */}
          {selectorArr.map((item, index) => {
            // 建立時送進來的
            const { key, clearOther, limit, forbiddenCheck_dataList, customParams } = item;
            //在下面寫好的，props會送進Selector
            const props = propsLookup[key]();
            props.params = { ...props.params, ...customParams };

            // 動態的
            const dynaProps = dynaSelectorPropsList?.[index];

            if (item.caption === null) {
              props.caption = null;
            } else if (item.caption) {
              props.caption = item.caption;
            }

            if (item.tip === null) {
              props.tip = null;
            } else if (item.tip) {
              props.tip = item.tip;
            }

            dynaProps?.caption && (props.caption = dynaProps.caption);
            dynaProps?.tip && (props.tip = dynaProps.tip);
            dynaProps?.useNoMetaProps && (props.useNoMetaProps = dynaProps.useNoMetaProps);
            dynaProps?.filter_clientSide && (props.filter_clientSide = dynaProps.filter_clientSide);
            dynaProps?.isSkip && (props.isSkip = dynaProps.isSkip);

            //

            if (clearOther) {
              const theOnRowClick = props.onRowClick;

              // FIXME 型別錯誤
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              props.onRowClick = (props) => {
                theOnRowClick && theOnRowClick(props);

                clearOther.forEach((i) => {
                  if (selectorRef.current[i]) {
                    selectorRef.current[i].clearSelected();
                  }
                });
              };
            }

            if (forbiddenCheck_dataList) {
              props.forbiddenCheck_dataList = forbiddenCheck_dataList;
            }

            if (dynaProps?.forbiddenCheck_dataList) {
              props.forbiddenCheck_dataList = dynaProps.forbiddenCheck_dataList;
            }

            props.filter_extends = dynaProps?.filter_extends;

            if (dynaProps?.filter) {
              props.filter = dynaProps.filter;
            }

            if (key === 'employee' && props.searchInputSelPropsArr?.[0]) {
              const searchInputSelProps = props.searchInputSelPropsArr[0];

              if ('selectProps' in searchInputSelProps && searchInputSelProps.selectProps?.props) {
                searchInputSelProps.selectProps.props.options = options_department;
              }
            }

            if (dynaProps && 'searchInputSelPropsArr' in dynaProps) {
              props.searchInputSelPropsArr = dynaProps.searchInputSelPropsArr;
            }

            // dynaProps
            return (
              <Fragment key={index}>
                {/* // FIXME 型別錯誤 */}
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore*/}
                <Selector<TtypeLookup[typeof key]>
                  ref={(ref) => {
                    selectorRef.current[index] = ref!;
                  }}
                  {...props}
                  limit={limit}
                  onStateChange={(state) => {
                    const { dataArr } = state;
                    setDataArrArr((pArr) => {
                      const copy = [...pArr] as unknown as typeof pArr;
                      copy[index] = dataArr;

                      return copy;
                    });
                  }}
                  defaultSelectedArr={defaultSeletedDataArrArr?.[index]}
                />
                {index !== selectorArr.length - 1 && <hr />}
              </Fragment>
            );
          })}
          <br />
          <TwoBtnFooter onConfirm={theOnConfirm} onCancel={onCancel} />
        </div>
      </Modal>
    );
  };

  return SelectModal;
}

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================

const props_outsourcing: TselectorProps<ToutsourcingDto> = {
  useInfinit: useGetOutsourcing,
  selectedKey: 'name',
  caption: '外包廠商',
  configArr: [
    {
      key: 'name',
      width: 150,
      thead: {
        label: '名稱',
      },
      tbody: {},
    },
    {
      key: 'county',
      width: 100,
      thead: {
        label: '地區',
      },
      tbody: {},
    },
    {
      key: 'notes',
      flex: 'auto',
      thead: {
        label: '備註',
      },
      tbody: {},
    },
  ],
  searchInputSelPropsArr: [
    {
      wrapperStyle: { width: 100 },
      selectProps: {
        props: {
          menuPortalTarget: undefined, // select元件做壞了，這個必須要有
          options: optionsCreator_county({ emptyOption: true }),
          placeholder: '地區',
        },
      },
    },
    {
      wrapperStyle: { width: 150 },
      inputProps: {
        props: {
          placeholder: '名稱、備註...',
        },
      },
    },
  ],
  filter: (strArr) => {
    return {
      county: { $eq: strArr[0] },
      $or: [
        {
          name: { $contains: strArr[1] },
        },
        {
          notes: { $contains: strArr[1] },
        },
      ],
    };
  },
};

// -------------------------------------------------------------------------

const props_employee: TselectorProps<TemployeeDto> = {
  useInfinit: useEmployee_infinite_2,
  selectedKey: 'chName',
  caption: '員工',
  params: {
    sort: 'createdAt',
    order: 'ASC',
    populate: ['jobs.department'],
  },
  configArr: [
    {
      key: 'idNumber',
      width: 100,
      thead: {
        label: '員工編號',
      },
      tbody: {},
    },
    {
      key: 'chName',
      width: 100,
      thead: {
        label: '姓名',
      },
      tbody: {},
    },
    {
      key: 'jobs',
      width: 250,
      // flex: 'auto',
      thead: {
        label: '部門',
      },
      tbody: {
        reducer: (value) => {
          let jobs = value as TemployeeDto['jobs'];
          jobs = _.sortBy(jobs, 'grade');

          const job = jobs[0];

          if (!job) {
            return '';
          }

          const departmentName = job.department?.name;
          const jobName = job.name;

          return `${departmentName} / ${jobName}`;
        },
      },
    },
    {
      key: 'jobs',
      width: 100,
      thead: {
        label: '職等',
      },
      tbody: {
        reducer: (value) => {
          let jobs = value as TemployeeDto['jobs'];
          jobs = _.sortBy(jobs, 'grade');

          if (jobs[0]?.grade) {
            return `Level ${jobs[0]?.grade}`;
          } else {
            return '';
          }
        },
      },
    },
  ],

  searchInputSelPropsArr: [
    {
      wrapperStyle: { width: 150 },
      selectProps: {
        props: {
          menuPortalTarget: undefined, // select元件做壞了，這個必須要有
          options: undefined,
          placeholder: '部門',
        },
      },
    },
    {
      pilarAttr: {},
    },
    {
      wrapperStyle: { width: 150 },
      inputProps: {
        props: {
          placeholder: '完整編號、姓名...',
        },
      },
    },
  ],

  filter: (strArr) => {
    return {
      'jobs.department.name': { $eq: strArr[0] },
      $or: [
        {
          idNumber: { $eq: strArr[1] },
        },
        {
          chName: { $contains: strArr[1] },
        },
      ],
    };
  },
};

const props_employee_worksDepartment: TselectorProps<TemployeeDto> = {
  ...props_employee,

  searchInputSelPropsArr: [
    {
      wrapperStyle: { width: 150 },
      inputProps: {
        props: {
          placeholder: '完整編號、姓名...',
        },
      },
    },
  ],
  filter: (strArr) => {
    return {
      'jobs.department.name': { $eq: '工務部' },
      $or: [
        {
          idNumber: { $eq: strArr[0] },
        },
        {
          chName: { $contains: strArr[0] },
        },
      ],
    };
  },
};

// -------------------------------------------------------------------------

const props_dailyReport_workers_item: TselectorProps<
  TdailyReportItem_my,
  TuseNoMetaPropsInNeed['dailyReport_workers_item']
> = {
  useNoMeta: useGetDaily_worker_date,
  selectedKey: 'description',
  caption: '日報表回報',
  configArr: [
    {
      key: 'employeeChName',
      width: 100,
      thead: {
        label: '員工姓名',
      },
    },
    {
      key: 'customerName',
      width: 100,
      thead: {
        label: '客戶/工程',
      },
    },
    {
      key: 'contactName',
      width: 100,
      thead: {
        label: '接洽人',
      },
    },
    {
      key: 'description',
      flex: 'auto',
      thead: {
        label: '內容',
      },
    },
  ],

  searchInputSelPropsArr: [
    {
      wrapperStyle: { width: 150 },
      inputProps: {
        props: {
          placeholder: '姓名...',
        },
      },
    },
  ],

  filter_clientSide: (data, searchStrArr) => {
    const name = searchStrArr[0]?.trim();

    const { chName, enName } = data.employee;

    if (!name || chName.includes(name) || enName.includes(name)) {
      return true;
    }

    return false;
  },
};

// -------------------------------------------------------------------------

const props_engineeringContact: TselectorProps<TengineeringContactDto> = {
  useInfinit: useGetEngineeringContact_all,
  selectedKey: 'projectName',
  params: {
    sort: 'createdAt',
    order: 'ASC',
    // populate: ['jobs.department'],
  },
  configArr: [
    {
      key: 'projectNumber',
      width: 150,
      thead: {
        label: '工程編號',
      },
    },
    {
      key: 'projectName',
      // width: 200,
      flex: 'auto',
      thead: {
        label: '工程名稱',
      },
    },
    {
      key: 'projectPrincipal',
      width: 150,
      thead: {
        label: '工程負責人',
      },
    },
    {
      key: 'contractor',
      width: 250,
      thead: {
        label: '承包商',
      },
    },
  ],
  searchInputSelPropsArr: [
    {
      inputProps: {
        wrapperStyle: { width: 150 },
        props: {
          placeholder: '完整工程編號',
        },
      },
    },
    {
      pilarAttr: {},
    },
    {
      inputProps: {
        wrapperStyle: { width: 230 },
        props: {
          placeholder: '工程名稱、工程負責人、承包商',
        },
      },
    },
  ],
  filter: ([projectNumber, keyword]) => {
    return {
      projectNumber: { $eq: projectNumber },
      projectName: { $contains: keyword },
      projectPrincipal: { $contains: keyword },
      contractor: { $contains: keyword },
    };
  },
};

// -------------------------------------------------------------------------

const props_annotation: TselectorProps<TannotationDto> = {
  useInfinit: useGetAnnotation_infinite,
  selectedKey: 'description',
  caption: '報價單備註',
  configArr: [
    {
      key: 'category',
      width: 150,
      thead: {
        label: '類別',
      },
    },
    {
      key: 'doorModelName',
      width: 150,
      thead: {
        label: '門型',
      },
    },
    // {
    //   key: 'type',
    //   width: 150,
    //   thead: {
    //     label: '型式',
    //   },
    // },
    {
      key: 'description',
      flex: 'auto',
      thead: {
        label: '內容',
      },
    },
  ],
  searchInputSelPropsArr: [
    {
      inputProps: {
        props: {
          placeholder: '門型',
        },
      },
    },
    {
      inputProps: {
        props: {
          placeholder: '內容',
        },
      },
    },
  ],
  filter: (strArr) => {
    return {
      doorModelName: { $contains: strArr[0] },
      description: { $contains: strArr[1] },
    };
  },
};

// -------------------------------------------------------------------------

const props_quotationRange: TselectorProps<TquotationRangeDto> = {
  useInfinit: useGetQuotationRanges_infinite,
  selectedKey: 'description',
  caption: '報價單報價範圍',
  configArr: [
    {
      key: 'category',
      width: 150,
      thead: {
        label: '類別',
      },
    },
    {
      key: 'doorModelName',
      width: 150,
      thead: {
        label: '門型',
      },
    },
    // {
    //   key: 'type',
    //   width: 150,
    //   thead: {
    //     label: '型式',
    //   },
    // },
    {
      key: 'description',
      flex: 'auto',
      thead: {
        label: '內容',
      },
    },
  ],
  searchInputSelPropsArr: [
    {
      inputProps: {
        props: {
          placeholder: '門型',
        },
      },
    },
    {
      inputProps: {
        props: {
          placeholder: '內容',
        },
      },
    },
  ],
  filter: (strArr) => {
    return {
      doorModelName: { $contains: strArr[0] },
      description: { $contains: strArr[1] },
    };
  },
};

// -------------------------------------------------------------------------

const props_customer: TselectorProps<TcustomerDto> = {
  useInfinit: useGetCustomers_infinite_2,
  params: {
    populate: ['types'],
    sort: 'customerNumber',
    order: 'ASC',
  },
  selectedKey: 'name',
  caption: '客戶',
  configArr: [
    {
      key: 'customerNumber',
      width: 150,
      thead: {
        label: '客戶編號',
      },
      tbody: {},
    },
    {
      key: 'name',
      flex: 'auto',
      thead: {
        label: '全稱',
      },
      tbody: {},
    },
    {
      key: 'types',
      width: 200,
      thead: {
        label: '類型',
      },
      tbody: {
        reducer: (value) => {
          const types = value as TcustomerDto['types'];
          const typeStr = types.map((type) => customerTypesLookup[type.name]).join(' / ');

          return typeStr;
        },
      },
    },
    {
      key: 'county',
      width: 150,
      thead: {
        label: '地區',
      },
      tbody: {},
    },
  ],
  searchInputSelPropsArr: [
    {
      wrapperStyle: { width: 100 },
      selectProps: {
        props: {
          menuPortalTarget: undefined, // select元件做壞了，這個必須要有
          options: (() => {
            const options: Toption[] = Object.entries(customerTypesLookup).map(([key, value]) => {
              return {
                label: value,
                value: key,
              };
            });

            options.unshift({
              label: '不拘',
              value: '',
            });

            return options;
          })(),
          placeholder: '類型',
        },
      },
    },
    {
      wrapperStyle: { width: 100 },
      selectProps: {
        props: {
          menuPortalTarget: undefined, // select元件做壞了，這個必須要有
          options: optionsCreator_county({ emptyOption: true }),
          placeholder: '地區',
        },
      },
    },
    {
      pilarAttr: {},
    },
    {
      wrapperStyle: { width: 100 },
      inputProps: {
        props: {
          placeholder: '完整客戶編號',
        },
      },
    },
    {
      pilarAttr: {},
    },
    {
      wrapperStyle: { width: 150 },
      inputProps: {
        props: {
          placeholder: '全稱',
        },
      },
    },
  ],
  filter: (strArr) => {
    return {
      'types.name': { $eq: strArr[0] },
      county: { $eq: strArr[1] },
      customerNumber: { $eq: strArr[2] },
      name: { $contains: strArr[3] },
    };
  },
};

const props_settleProduct: TselectorProps<TsettleProductDto, TuseNoMetaPropsInNeed['settleProduct']> = {
  useNoMeta: useGetQuotationContentSettleProduct,
  selectedKey: 'itemName',
  caption: '主產品',
  configArr: [
    {
      key: 'itemName',
      width: 100,
      // flex: 'auto',
      thead: {
        label: '項目名',
      },
    },
    {
      key: 'doorModelName',
      width: 100,
      thead: {
        label: '門型',
      },
    },
    {
      key: 'fullWidth',
      width: 100,
      thead: {
        label: '全寬',
      },
    },
    {
      key: 'height',
      width: 100,
      thead: {
        label: '高',
      },
    },
    {
      key: 'boxB',
      width: 100,
      thead: {
        label: 'B',
      },
      tbody: {
        reducer: (value) => {
          const boxB = value as TsettleProductDto['boxB'];

          if (typeof boxB === 'number') {
            return '';
          }

          return boxB;
        },
      },
    },
    {
      key: 'quantity',
      width: 100,
      thead: {
        label: '數量',
      },
    },
  ],
};

// -------------------------------------------------------------------------

// ---
// w   記得要上去修改TtypeLookup
// w   propsLookup 與 TtypeLookup的key必須一致
// w   propsLookup 與 TtypeLookup的key必須一致
// w   propsLookup 與 TtypeLookup的key必須一致
const propsLookup = {
  outsourcing: () => _.cloneDeep(props_outsourcing),
  employee: () => _.cloneDeep(props_employee),
  employee_worksDepartment: () => _.cloneDeep(props_employee_worksDepartment),
  dailyReport_workers_item: () => _.cloneDeep(props_dailyReport_workers_item),
  engineeringContact: () => _.cloneDeep(props_engineeringContact),
  annotation: () => _.cloneDeep(props_annotation),
  quotationRange: () => _.cloneDeep(props_quotationRange),
  customer: () => _.cloneDeep(props_customer),
  settleProduct: () => _.cloneDeep(props_settleProduct),

  // test: () => {
  //   return _.cloneDeep(props_outsourcing);
  // },
  // foooo: () => {
  //   return _.cloneDeep(props_outsourcing);
  // },
} as const;

// ======================================================================

// 留做泛型參考
// 元祖產生元祖

// type TkeyArr = ['a', 'b', 'c'];

// type Tconfig = {
//   a: string;
//   b: number;
//   c: boolean;
// };

// type TupleToObject<T extends (keyof Tconfig)[]> = {
//   [K in keyof T]: Tconfig[T[K]];
// };

// type Tresult = TupleToObject<TkeyArr>; // ['string', 'number', 'boolean']

// ======================================================================
