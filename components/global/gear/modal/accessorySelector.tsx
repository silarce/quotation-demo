import { useState, useEffect } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// global gear
import SelectorShell, { TsearcbBarProps } from './selectorShell';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import LoadingCoverWrapper01 from '../loadingCover/loadingCoverWrapper01';

// css
import scss from './accessorySelector.module.scss';

// type

// api
import { apiGetProdAccessories, TdoorAccessoryDto } from 'js/api/api_product';

// ===========================================================================

type Tprops = {
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
  defaultIdArr?: string[];
  exceptAcceArr?: { id: string }[];
  isCancelOnConfirm?: boolean;
  exceptAcceCheck?: (acce: TdoorAccessoryDto) => boolean;
};

export type { TdoorAccessoryDto, Tprops as Tprops_accessorySelector };
// ===========================================================================

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
  defaultIdArr,
  exceptAcceArr,
  isCancelOnConfirm = true,
  exceptAcceCheck: exceptEmpCheck,
}: Tprops) {
  const [acceArr, setAcceArr] = useState<TdoorAccessoryDto[]>([]);
  const [searchValue, setSearchValue] = useState<string[]>([]);

  // 被選的資料
  const [selAcceArr, setSelAcceArr] = useState<TdoorAccessoryDto[]>([]);

  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!showModal) {
      setSearchValue([]);
      setSelAcceArr([]);
      setAcceArr([]);

      return;
    }

    const updateAcceArr = async () => {
      if (modelName) {
        try {
          const res = await apiGetProdAccessories({ modelName });
          const arr = _.sortBy(res, 'name');
          setAcceArr(arr);
        } catch (error) {}
      }
    };

    updateAcceArr();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, modelName]);

  useEffect(() => {
    if (!showModal) {
      return;
    }

    setSelAcceArr([]);

    if (defaultAcceArr) {
      setSelAcceArr(() => _.cloneDeep(defaultAcceArr));
    }

    if (defaultIdArr) {
      let defaultArr = acceArr.filter((acce) => defaultIdArr?.includes(acce.id));
      defaultArr = _.cloneDeep(defaultArr);
      setSelAcceArr((arr) => [...arr, ...defaultArr]);
    }
  }, [
    //
    showModal,
    acceArr,
    defaultAcceArr,
    defaultIdArr,
  ]);

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
    onConfirm(_.cloneDeep(selAcceArr));

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

  const inputSelPropsArr: TsearcbBarProps['inputSelPropsArr'] = [
    {
      inputProps: {
        wrapperStyle: { width: '160px' },
        props: {
          placeholder: '搜尋關鍵字',
        },
      },
    },
  ];

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
      searcbBarProps={{
        inputSelPropsArr: inputSelPropsArr,
        onClick: onSearch,
      }}
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
            filterKeyWord={searchValue[0]}
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
  filterKeyWord,
}: {
  acceArr: TdoorAccessoryDto[];
  selAcceArr: TdoorAccessoryDto[];

  onClick: (v: TdoorAccessoryDto) => void;
  exceptAcceArr?: { id: string }[];
  viewRef_bottom?: (node?: Element | null | undefined) => void;
  exceptAcceCheck: ((emp: TdoorAccessoryDto) => boolean) | undefined;
  filterKeyWord?: string;
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

        let isPass = true;

        if (filterKeyWord) {
          let pass = false;

          // name.includes(filterKeyWord) ? (isPass = true) : (isPass = false);
          if (name.includes(filterKeyWord)) {
            pass = true;
          }

          if (doorModelName === filterKeyWord) {
            pass = true;
          }

          if (String(price) === filterKeyWord) {
            pass = true;
          }

          isPass = pass;
        }

        if (!isPass) {
          return null;
        }

        const isActive = selAcceArr.some((selAcce) => selAcce.id === acce.id);
        let isExcept = exceptAcceArr?.some((exceptAcce) => exceptAcce.id === acce.id);

        if (!isExcept && exceptAcceCheck) {
          isExcept = exceptAcceCheck(acce);
        }

        const theOnClick = isExcept ? undefined : () => onClick(acce);

        const price_str = price !== null ? price.toLocaleString() : '';

        return (
          <CellWithBar key={index} isActive={isActive}>
            <div
              className={classNames(scss.row, isExcept && scss.except)}
              onClick={theOnClick}
              //  ref={theViewRef}
            >
              <span className={scss.idNumber}>{doorModelName}</span>
              <span>{name}</span>
              <span>{price_str}</span>
            </div>
          </CellWithBar>
        );
      })}
    </>
  );
};
