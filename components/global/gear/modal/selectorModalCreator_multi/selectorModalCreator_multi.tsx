import { useState, useRef, Fragment } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// antd
import { Modal } from 'antd';

// composition
import { Selector, TimperativeHandle, TselectorProps } from './selector/selector';

// gear
import TwoBtnFooter from '../footer/twoBtnFooter';

// css
import scss from './selectorModalCreator_multi.module.scss';

// api
import { useGetOutsourcing, ToutsourcingDto } from 'js/api/api_outsourcing';
import { useEmployee_infinite_2, TemployeeDto } from 'js/api/api_employee';

import { optionsCreator_county } from 'js/utils/options/countryAndDistrict';

// ======================================================================

type TselectorArrItem<Tkey extends keyof TtypeLookup> = {
  // key: keyof typeof propsLookup;
  key: Tkey;
  caption?: string | null;
  tip?: string | null;
  clearOther?: number[];
  limit?: number;
  forbiddenCheck_dataList?: TselectorProps<TtypeLookup[Tkey]>['forbiddenCheck_dataList'];
};

// type TselectorArr<TkeyArr extends (keyof TtypeLookup)[]> = {
//   [index in keyof TkeyArr]: TselectorArrItem<TkeyArr[index]>;
// };
type TselectorArr<TkeyArr extends (keyof TtypeLookup)[]> = {
  [index in keyof TkeyArr]: TselectorArrItem<TkeyArr[index]>;
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
  }: {
    showModal: boolean;
    onConfirm: (v: TdataArrArr) => void;
    onCancel: () => void;
    isCancelOnConfirm?: boolean;
    defaultSeletedDataArrArr?: Partial<TdataArrArr>;
    //
  }) => {
    // ------------------------------------------------------------------------

    const [dataArrArr, setDataArrArr] = useState<TdataArrArr>([] as unknown as TdataArrArr);

    // ------------------------------------------------------------------------

    const selectorRef = useRef<TimperativeHandle[]>([]);

    // ------------------------------------------------------------------------

    const theOnConfirm = () => {
      onConfirm(dataArrArr);
      isCancelOnConfirm && onCancel();
    };

    // ------------------------------------------------------------------------

    //
    //
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
      >
        <div className={classNames(scss.body)}>
          {/*  */}
          {selectorArr.map((item, index) => {
            const { key, clearOther, limit, forbiddenCheck_dataList } = item;
            const props = propsLookup[key]();

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

const props_employee: TselectorProps<TemployeeDto> = {
  useInfinit: useEmployee_infinite_2,
  selectedKey: 'chName',
  caption: '員工',
  params: {
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
      inputProps: {
        props: {
          placeholder: '完整編號、姓名...',
        },
      },
    },
  ],

  filter: (strArr) => {
    return {
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

// ---
// w   propsLookup 與 TtypeLookup的key必須一致
// w   propsLookup 與 TtypeLookup的key必須一致
// w   propsLookup 與 TtypeLookup的key必須一致
const propsLookup = {
  outsourcing: () => {
    return _.cloneDeep(props_outsourcing);
  },
  employee: () => {
    return _.cloneDeep(props_employee);
  },
  // test: () => {
  //   return _.cloneDeep(props_outsourcing);
  // },
  // foooo: () => {
  //   return _.cloneDeep(props_outsourcing);
  // },
} as const;

type TtypeLookup = {
  outsourcing: Exclude<(typeof props_outsourcing)['dataType'], undefined>;
  employee: Exclude<(typeof props_employee)['dataType'], undefined>;
  // test: Exclude<(typeof props_outsourcing)['dataType'], undefined>;
  // foooo: Exclude<(typeof props_outsourcing)['dataType'], undefined>;
};

type keyTuple_to_dataTuple<TkeyArr extends (keyof TtypeLookup)[]> = {
  [index in keyof TkeyArr]: TtypeLookup[TkeyArr[index]][];
};

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
