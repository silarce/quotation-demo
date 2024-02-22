import { useState, useEffect, useMemo, useContext, useRef, Fragment } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// antd
import { Modal } from 'antd';

// global gear
import SelectorShell, { TsearcbBarProps } from '../selectorShell';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';
import LoadingCoverWrapper01 from '../../loadingCover/loadingCoverWrapper01';

// composition
import { Selector, TimperativeHandle, TselectorProps } from './selector/selector';

// gear
import TwoBtnFooter from '../footer/twoBtnFooter';

// css
import scss from './selectorModalCreator_multi.module.scss';

// api
import { useGetOutsourcing, ToutsourcingDto } from 'js/api/api_outsourcing';

// type
import { Tparams } from 'js/api/createUseInfinite';

import { optionsCreator_county } from 'js/utils/options/countryAndDistrict';

// ======================================================================

// ======================================================================

// type TuseInfinite = ReturnType<typeof createUseInfinite>;

// type Tobject = {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [key: string]: any;
//   id: string;
// };

// type Tconfig = {
//   key: string;
//   label?: string;
//   className?: string;
//   width?: React.CSSProperties['width'];
//   flex?: React.CSSProperties['flex'];
//   style?: React.CSSProperties;
//   className_span?: string;
//   style_span?: React.CSSProperties;
// };

// export type { Tconfig };

// {
//   selectProps: {
//     props: {
//       //
//       menuPortalTarget: undefined,
//       ...rest
//     },
//   },
// }

type TselectorArrItem<Tkey extends keyof TtypeLookup> = {
  // key: keyof typeof propsLookup;
  key: Tkey;
  caption?: string | null;
  tip?: string | null;
  clearOther?: number[];
  limit?: number;
};

// type TselectorArr<TkeyArr extends (keyof TtypeLookup)[]> = {
//   [index in keyof TkeyArr]: TselectorArrItem<TkeyArr[index]>;
// };
type TselectorArr<TkeyArr extends (keyof TtypeLookup)[]> = {
  [index in keyof TkeyArr]: TselectorArrItem<TkeyArr[index]>;
};

// ======================================================================

export function selectModalCreator_multi<TkeyArr extends (keyof TtypeLookup)[]>({
  // useInfinit,
  // configArr,
  // params,
  // searchInputSelPropsArr,
  modalWidth = 1300,
  selectorArr,
}: {
  // useInfinit: TuseInfinite;
  // configArr: readonly Tconfig[];
  // params?: Tparams;
  // searchInputSelPropsArr?: TsearcbBarProps['inputSelPropsArr'];
  modalWidth?: React.CSSProperties['width'];
  // selectorNameArr: (keyof typeof propsLookup)[];
  selectorArr: TselectorArr<TkeyArr>;
}) {
  //
  //
  //
  //

  type TdataArrArr = keyTuple_to_dataTuple<TkeyArr>;

  const SelectModal = ({
    showModal,
    onConfirm,
    onCancel,
  }: // selLimit,

  // isCancelOnConfirm = true,

  {
    showModal: boolean;

    onConfirm: (v: TdataArrArr) => void;
    onCancel: () => void;

    // selLimit?: 1;

    // isCancelOnConfirm?: boolean;

    //
  }) => {
    // ------------------------------------------------------------------------

    const [dataArrArr, setDataArrArr] = useState<TdataArrArr>([] as TdataArrArr);

    // ------------------------------------------------------------------------

    const selectorRef = useRef<TimperativeHandle[]>([]);

    // ------------------------------------------------------------------------

    const theOnConfirm = () => {
      onConfirm(dataArrArr);
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
            const { key, clearOther, limit } = item;
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

              props.onRowClick = (props) => {
                theOnRowClick && theOnRowClick(props);

                clearOther.forEach((i) => {
                  if (selectorRef.current[i]) {
                    selectorRef.current[i].clearSelected();
                  }
                });
              };
            }

            return (
              <Fragment key={index}>
                <Selector<TtypeLookup[typeof key]> // 搞這個泛型好像沒有意義...
                  ref={(ref) => {
                    selectorRef.current[index] = ref!;
                  }}
                  {...props}
                  limit={limit}
                  onStateChange={(state) => {
                    const { dataArr } = state;
                    setDataArrArr((pArr) => {
                      const copy = [...pArr] as typeof pArr;
                      copy[index] = dataArr;

                      return copy;
                    });
                  }}
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
      wrapperStyle: { width: 100 },
      inputProps: {
        props: {
          placeholder: '關鍵字...',
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

// w   propsLookup 與 TtypeLookup的key必須一致
// w   propsLookup 與 TtypeLookup的key必須一致
// w   propsLookup 與 TtypeLookup的key必須一致
const propsLookup = {
  outsourcing: () => {
    return _.cloneDeep(props_outsourcing);
  },
  test: () => {
    return _.cloneDeep(props_outsourcing);
  },
} as const;

type TtypeLookup = {
  outsourcing: Exclude<(typeof props_outsourcing)['dataType'], undefined>;
  test: Exclude<(typeof props_outsourcing)['dataType'], undefined>;
};

type keyTuple_to_dataTuple<TkeyArr extends (keyof TtypeLookup)[]> = {
  [index in keyof TkeyArr]: TtypeLookup[TkeyArr[index]][];
};

// ======================================================================

// 留做泛型參考

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
