import { useState, useEffect, useMemo, useContext, useRef } from 'react';
import classNames from 'classnames';

// antd
import { Modal } from 'antd';

// global gear
import SelectorShell, { TsearcbBarProps } from '../selectorShell';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';
import LoadingCoverWrapper01 from '../../loadingCover/loadingCoverWrapper01';

import { AppContext } from 'pages/_app';

// composition
import { Selector, TimperativeHandle, TsearchInputSelProps } from './selector/selector';

// css
import scss from './selectorModalCreator_multi.module.scss';

// api
import { useGetOutsourcing, ToutsourcingDto } from 'js/api/api_outsourcing';
import { useGetQuotation_infinite } from 'js/api/api_quotation';

// type
import { createUseInfinite, Tres, Tparams } from 'js/api/createUseInfinite';
// ======================================================================

// ======================================================================

type TuseInfinite = ReturnType<typeof createUseInfinite>;

type Tobject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  id: string;
};

type Tconfig = {
  key: string;
  label?: string;
  className?: string;
  width?: React.CSSProperties['width'];
  flex?: React.CSSProperties['flex'];
  style?: React.CSSProperties;
  className_span?: string;
  style_span?: React.CSSProperties;
};

export type { Tconfig };

// {
//   selectProps: {
//     props: {
//       //
//       menuPortalTarget: undefined,
//       ...rest
//     },
//   },
// }

// ======================================================================

export function selectModalCreator_multi({
  // useInfinit,
  // configArr,
  // params,
  // searchInputSelPropsArr,
  modalWidth = 1300,
}: {
  // useInfinit: TuseInfinite;
  // configArr: readonly Tconfig[];
  // params?: Tparams;
  // searchInputSelPropsArr?: TsearcbBarProps['inputSelPropsArr'];
  modalWidth?: React.CSSProperties['width'];
}) {
  //
  //
  //
  //
  const SelectModal = ({
    showModal,
    onConfirm,
    onCancel,
    label,
    tip,
    selLimit,
    customParams,
    customFilter,
    customPopulate,
    defaultDataArr,
    exceptDataArr,
    isCancelOnConfirm = true,
    exceptDataCheck,
  }: {
    showModal: boolean;
    // !!!! any
    onConfirm: (v: any[]) => void;
    onCancel: () => void;
    label?: string;
    tip?: React.ReactNode;
    selLimit?: 1;
    customParams?: Tparams;
    customFilter?: Tparams['filter'];
    customPopulate?: Tparams['populate'];
    // !!!! any
    defaultDataArr?: any[];
    exceptDataArr?: { id: string }[];
    isCancelOnConfirm?: boolean;
    // !!!! any
    exceptDataCheck?: (data: any) => boolean;
  }) => {
    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------

    const selectorRef = useRef<TimperativeHandle[]>([]);

    // ------------------------------------------------------------------------

    const configArr_outsourcing = [
      {
        key: 'name',
        width: 200,
        // flex: '',
        thead: {
          label: '名稱',
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
    ];

    const searchInputSelPropsArr: TsearchInputSelProps[] = [
      {
        wrapperStyle: { width: 100 },
        inputProps: {
          props: {
            placeholder: '關鍵字...',
          },
        },
      },
    ];

    const configArr_quotaion = [
      {
        key: 'quotationNumber',
        width: 200,
        // flex: '',
        thead: {
          label: 'foo',
        },
      },
    ];

    //
    //
    return (
      <Modal
        // label={label ?? ''}
        visible={showModal}
        // onConfirm={theOnConfirm}
        // onCancel={theOnCancel}
        // width={rwd1023 ? '80vw' : modalWidth}
        width={modalWidth}
        className={scss.container}
        // tip={tip}
        // searcbBarProps={searcbBarProps}

        closable={false}
        centered={true}
        destroyOnClose={true}
        footer={null}
      >
        <div className={classNames(scss.body)}>
          {/*  */}

          <Selector<ToutsourcingDto>
            ref={(ref) => {
              selectorRef.current[0] = ref!;
            }}
            useInfinit={useGetOutsourcing}
            configArr={configArr_outsourcing}
            onRowClick={() => {
              // selectorRef.current[1].clearSelected();
            }}
            selectedKey="name"
            searchInputSelPropsArr={searchInputSelPropsArr}
            filter={(arr) => {
              return {
                name: { $contains: arr[0] },
              };
            }}
          />
          <hr />
          <Selector<ToutsourcingDto>
            ref={(ref) => {
              selectorRef.current[1] = ref!;
            }}
            useInfinit={useGetOutsourcing}
            configArr={configArr_outsourcing}
            onRowClick={(props) => {
              console.log(props.data);
              // selectorRef.current[0].clearSelected();
            }}
            selectedKey="name"
          />
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          <hr />
          <Selector<ToutsourcingDto>
            ref={(ref) => {
              selectorRef.current[1] = ref!;
            }}
            useInfinit={useGetOutsourcing}
            configArr={configArr_outsourcing}
            onRowClick={(props) => {
              console.log(props.data);
              // selectorRef.current[0].clearSelected();
            }}
            selectedKey="name"
            // filter
          />
          <hr />
          <Selector<ToutsourcingDto>
            ref={(ref) => {
              selectorRef.current[1] = ref!;
            }}
            useInfinit={useGetOutsourcing}
            configArr={configArr_outsourcing}
            onRowClick={(props) => {
              console.log(props.data);
              // selectorRef.current[0].clearSelected();
            }}
            selectedKey="name"
          />
          <hr />
          {/* <Selector useInfinit={useGetOutsourcing} configArr={configArr_outsourcing} />
          <hr />
          <Selector useInfinit={useGetOutsourcing} configArr={configArr_outsourcing} />
          <hr />
          <Selector useInfinit={useGetQuotation_infinite} configArr={configArr_quotaion} /> */}

          {/* <hr />
          <hr />
          <hr />
          <hr />
          <hr /> */}
        </div>
      </Modal>
    );
  };

  return SelectModal;
}

// ======================================================================
function RowArr<Tdata extends Tobject>({
  dataArr,
  selDataArr: selEmployeeArr,
  viewRef_bottom,
  exceptDataArr: exceptEmpArr,
  onClick,
  exceptDataCheck: exceptEmpCheck,
  configArr,
}: {
  dataArr: Tdata[];
  selDataArr: Tdata[];
  configArr: readonly Tconfig[];

  onClick: (v: Tdata) => void;

  exceptDataArr?: { id: string }[];
  viewRef_bottom?: (node?: Element | null | undefined) => void;
  exceptDataCheck: ((data: Tdata) => boolean) | undefined;
}) {
  return (
    <>
      {dataArr.map((data, index, arr) => {
        const theViewRef = arr.length - 11 === index ? viewRef_bottom : undefined;

        const isActive = selEmployeeArr.some((selEmp) => selEmp.id === data.id);
        let isExcept = exceptEmpArr?.some((exceptEmp) => exceptEmp.id === data.id);

        if (!isExcept && exceptEmpCheck) {
          isExcept = exceptEmpCheck(data);
        }
        // const isSkinp = skipArr?.some((selEmp) => selEmp.id === emp.id);

        const theOnClick = isExcept ? undefined : () => onClick(data);

        // if (isSkinp) {
        //   return <div key={index} className="skip" ref={theViewRef}></div>;
        // }

        return (
          <CellWithBar key={index} isActive={isActive}>
            <div
              //
              className={classNames(scss.row, isExcept && scss.except)}
              onClick={theOnClick}
              ref={theViewRef}
            >
              {configArr.map((config, index) => {
                const { key, label, className, width, flex, style, className_span, style_span } = config;

                return (
                  <div key={index} className={classNames(className)} style={{ width, flex, ...style }}>
                    <span
                      className={classNames(className_span)}
                      style={{
                        ...style_span,
                      }}
                    >
                      {data[key]}
                    </span>
                  </div>
                );
              })}
            </div>
          </CellWithBar>
        );
      })}
    </>
  );
}

// ===========================================================
