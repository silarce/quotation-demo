import { useState, useEffect, useMemo, useContext } from 'react';
import classNames from 'classnames';

// global gear
import SelectorShell, { TsearcbBarProps } from './selectorShell';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';
import LoadingCoverWrapper01 from '../loadingCover/loadingCoverWrapper01';

// css
import scss from './accessorySelector.module.scss';

// type

// api
import { apiGetProdAccessories, TdoorAccessoryDto } from 'js/api/api_product';

// import { AppContext } from 'pages/_app';

export type { TdoorAccessoryDto };

export default function AccessorySelector({
  showModal,
  onConfirm,
  onCancel,
  label,
  tip,
  selLimit,
  // customParams,
  // customFilter,
  // customPopulate,
  modelName,
  defaultAcceArr,
  exceptAcceArr,
  isCancelOnConfirm = true,
  exceptAcceCheck: exceptEmpCheck,
}: {
  showModal: boolean;
  onConfirm: (v: TdoorAccessoryDto[]) => void;
  onCancel: () => void;
  label?: string;
  tip?: React.ReactNode;
  selLimit?: 1;
  // customParams: { modelName: string | undefined };
  // customFilter?: Tparams['filter'];
  // customPopulate?: Tparams['populate'];
  modelName: string | undefined;
  defaultAcceArr?: TdoorAccessoryDto[];
  exceptAcceArr?: { id: string }[];
  isCancelOnConfirm?: boolean;
  exceptAcceCheck?: (acce: TdoorAccessoryDto) => boolean;
}) {
  // const { rwd1023 } = useContext(AppContext);

  const [acceArr, setAcceArr] = useState<TdoorAccessoryDto[]>([]);

  const getReq = async () => {
    if (modelName) {
      const res = await apiGetProdAccessories({ modelName });
      setAcceArr(res);
    }
  };

  // 被選的資料
  const [selAcceArr, setSelAcceArr] = useState<TdoorAccessoryDto[]>([]);

  const [searchValue, setSearchValue] = useState<string[]>([]);

  //

  useEffect(() => {
    if (!showModal) {
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showModal) {
      return;
    }

    if (defaultAcceArr) {
      setSelAcceArr(defaultAcceArr);
    }

    getReq();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, modelName]);

  // ==================================================

  const onClick = (newEmp: TdoorAccessoryDto) => {
    const newArr = [...selAcceArr];

    if (selLimit === 1) {
      newArr[0] = newEmp;
      setSelAcceArr(newArr);

      return;
    }

    const theIndex = newArr.findIndex((emp) => emp.id === newEmp.id);

    if (theIndex > -1) {
      newArr.splice(theIndex, 1);
    } else {
      newArr.push(newEmp);
    }

    setSelAcceArr(newArr);
  };

  const theOnConfirm = () => {
    // if (!selAcceArr) {
    //   return ModalInfo('請選擇人員');
    // }

    onConfirm(selAcceArr);

    if (isCancelOnConfirm) {
      theOnCancel();
    }
  };

  const theOnCancel = () => {
    onCancel();
    setSelAcceArr([]);
  };

  const onSearch = (v: string[]) => {
    setSearchValue(v);
  };

  // const inputSelPropsArr: TsearcbBarProps['inputSelPropsArr'] = [
  //   {
  //     selectProps: {
  //       wrapperStyle: { width: '120px' },
  //       props: {
  //         options: optionArr,
  //         placeholder: '選擇部門',
  //         menuPortalTarget: undefined,
  //         isLoading: !departmentData,
  //       },
  //     },
  //   },
  //   {
  //     inputProps: {
  //       wrapperStyle: { width: '160px' },
  //       props: {
  //         placeholder: '搜尋關鍵字',
  //       },
  //     },
  //   },
  // ];

  // ==================================================

  return (
    <SelectorShell
      label={label ?? ''}
      visible={showModal}
      onConfirm={theOnConfirm}
      onCancel={theOnCancel}
      // onSearch={onSearch}
      // width={rwd1023 ? '80vw' : '1200px'}
      width={'950px'}
      className={classNames(scss.container)}
      tip={tip}
      // searcbBarProps={{
      //   inputSelPropsArr: inputSelPropsArr,
      //   onClick: onSearch,
      // }}
    >
      <LoadingCoverWrapper01 isLoading={false}>
        <div className={classNames(scss.listContainer)}>
          <RowArr
            acceArr={selAcceArr ?? []}
            selAcceArr={selAcceArr}
            exceptAcceArr={exceptAcceArr}
            onClick={onClick}
            exceptAcceCheck={exceptEmpCheck}
          />

          {selAcceArr.length !== 0 && <div className={scss.divider} />}

          <RowArr
            acceArr={acceArr}
            selAcceArr={selAcceArr}
            viewRef_bottom={undefined}
            exceptAcceArr={exceptAcceArr}
            onClick={onClick}
            exceptAcceCheck={exceptEmpCheck}
          />
          {/*  */}
        </div>
      </LoadingCoverWrapper01>
    </SelectorShell>
  );
}

// =========================================================

const RowArr = ({
  acceArr,
  selAcceArr,
  viewRef_bottom,
  exceptAcceArr,
  onClick,
  exceptAcceCheck,
}: {
  acceArr: TdoorAccessoryDto[];
  selAcceArr: TdoorAccessoryDto[];

  onClick: (v: TdoorAccessoryDto) => void;
  exceptAcceArr?: { id: string }[];
  viewRef_bottom?: (node?: Element | null | undefined) => void;
  exceptAcceCheck: ((emp: TdoorAccessoryDto) => boolean) | undefined;
}) => {
  return (
    <>
      {acceArr.map((acce, index, arr) => {
        const { doorModelName, name, unit, referenceSpec, cost, price } = acce;

        // const theViewRef = (() => {
        //   if (arr.length - 11 === index) {
        //     return viewRef_bottom;
        //   }

        //   return undefined;
        // })();

        const isActive = selAcceArr.some((selAcce) => selAcce.id === acce.id);
        let isExcept = exceptAcceArr?.some((exceptAcce) => exceptAcce.id === acce.id);

        if (!isExcept && exceptAcceCheck) {
          isExcept = exceptAcceCheck(acce);
        }

        const theOnClick = isExcept ? undefined : () => onClick(acce);

        return (
          <CellWithBar key={index} isActive={isActive}>
            <div
              className={classNames(scss.row, isExcept && scss.except)}
              onClick={theOnClick}
              //  ref={theViewRef}
            >
              <span className={scss.idNumber}>{doorModelName}</span>
              <span>{name}</span>
              {/* <span>{cost}</span> */}
              <span>{price}</span>
            </div>
          </CellWithBar>
        );
      })}
    </>
  );
};
