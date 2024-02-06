import { useState, useEffect, useMemo, useContext } from 'react';
import classNames from 'classnames';

// global gear
import SelectorShell, { TsearcbBarProps } from './selectorShell';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';
import LoadingCoverWrapper01 from '../loadingCover/loadingCoverWrapper01';

import { AppContext } from 'pages/_app';

// css
import scss from './selectorModalCreator.module.scss';

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

// ======================================================================

export function selectModalCreator<Tdata extends Tobject>({
  useInfinit,
  configArr,
  params,
  searchInputSelPropsArr = [],
  modalWidth = 800,
}: {
  useInfinit: TuseInfinite;
  configArr: readonly Tconfig[];
  params?: Tparams;
  searchInputSelPropsArr?: TsearcbBarProps['inputSelPropsArr'];
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
    onConfirm: (v: Tdata[]) => void;
    onCancel: () => void;
    label?: string;
    tip?: React.ReactNode;
    selLimit?: 1;
    customParams?: Tparams;
    customFilter?: Tparams['filter'];
    customPopulate?: Tparams['populate'];
    defaultDataArr?: Tdata[];
    exceptDataArr?: { id: string }[];
    isCancelOnConfirm?: boolean;
    exceptDataCheck?: (data: Tdata) => boolean;
  }) => {
    //
    //

    const { rwd1023 } = useContext(AppContext);

    const [selDataArr, setSelDataArr] = useState<Tdata[]>([]);
    const [searchValue, setSearchValue] = useState<string[]>([]);

    // ------------------------------------------------------------------------

    params = {
      filter: {},
      pageSize: 20,
      ...params,
    };

    const { dataArr, viewRef_bottom, isLoadingPage1, reset } = useInfinit({ customParams: params });
    // ------------------------------------------------------------------------

    useEffect(() => {
      if (showModal) {
        reset();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue, showModal]);

    useEffect(() => {
      if (!showModal) {
        setSelDataArr([]);
        setSearchValue([]);

        return;
      }

      if (defaultDataArr) {
        setSelDataArr(defaultDataArr);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal]);

    // ------------------------------------------------------------------------

    const onClick = (newSelect: Tdata) => {
      let newArr = [...selDataArr];

      if (selLimit === 1) {
        if (newArr[0]?.id === newSelect.id) {
          newArr = [];
        } else {
          newArr[0] = newSelect;
        }

        setSelDataArr(newArr);

        return;
      }

      const theIndex = newArr.findIndex((data) => data.id === newSelect.id);

      if (theIndex > -1) {
        newArr.splice(theIndex, 1);
      } else {
        newArr.push(newSelect);
      }

      setSelDataArr(newArr);
    };

    const theOnConfirm = () => {
      if (!selDataArr) {
        return ModalInfo('請選擇資料');
      }

      onConfirm(selDataArr);

      if (isCancelOnConfirm) {
        theOnCancel();
      }
    };

    const theOnCancel = () => {
      onCancel();
      setSelDataArr([]);
    };

    const onSearch = (v: string[]) => {
      setSearchValue(v);
    };

    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------

    //
    //
    return (
      <SelectorShell
        label={label ?? ''}
        visible={showModal}
        onConfirm={theOnConfirm}
        onCancel={theOnCancel}
        width={rwd1023 ? '80vw' : modalWidth}
        className={scss.container}
        tip={tip}
        searcbBarProps={{
          inputSelPropsArr: searchInputSelPropsArr,
          onClick: onSearch,
        }}
      >
        <LoadingCoverWrapper01 isLoading={isLoadingPage1}>
          <div className={scss.listContainer}>
            <RowArr
              dataArr={selDataArr ?? []}
              selDataArr={selDataArr}
              exceptDataArr={exceptDataArr}
              onClick={onClick}
              exceptDataCheck={exceptDataCheck}
              configArr={configArr}
            />

            {selDataArr.length !== 0 && <div className={scss.divider} />}

            <RowArr
              dataArr={dataArr}
              selDataArr={selDataArr}
              viewRef_bottom={viewRef_bottom}
              exceptDataArr={exceptDataArr}
              onClick={onClick}
              // skipArr={defaultEmpArr}
              exceptDataCheck={exceptDataCheck}
              configArr={configArr}
            />
            {/*  */}
          </div>
        </LoadingCoverWrapper01>
      </SelectorShell>
    );
  };

  return SelectModal;
}

// ======================================================================
function RowArr<Tdata extends Tobject>({
  dataArr,
  selDataArr: selEmployeeArr,
  // skipArr,
  viewRef_bottom,
  exceptDataArr: exceptEmpArr,
  onClick,
  exceptDataCheck: exceptEmpCheck,
  configArr,
}: {
  dataArr: Tdata[];
  selDataArr: Tdata[];
  // skipArr?: Tdata[];
  onClick: (v: Tdata) => void;
  exceptDataArr?: { id: string }[];
  viewRef_bottom?: (node?: Element | null | undefined) => void;
  exceptDataCheck: ((data: Tdata) => boolean) | undefined;
  configArr: readonly Tconfig[];
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
