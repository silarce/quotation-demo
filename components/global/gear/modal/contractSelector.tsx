import { useState, useEffect, useContext } from 'react';
import classNames from 'classnames';
import Image from 'next/image';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// global gear
import SelectorShell, { TsearcbBarProps } from './selectorShell';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';
import LoadingCoverWrapper01 from '../loadingCover/loadingCoverWrapper01';

// css
import scss from './contractSelector.module.scss';

import { Tparams, TquotationContractDto, useContract_infinite } from 'js/api/api_quotation';

import { AppContext } from 'pages/_app';

// icon
import iconPlace from 'public/image/icon/place.svg';

export type { TquotationContractDto };

export default function ContractSelector({
  showModal,
  onConfirm,
  onCancel,
  label,
  tip,
  selLimit = 1,
  customParams,
  customFilter,
  customPopulate,
  // defaultEmpArr,
  exceptEmpArr,
  isCancelOnConfirm = true,
  exceptEmpCheck,
}: {
  showModal: boolean;
  onConfirm: (v: TquotationContractDto[]) => void;
  onCancel: () => void;
  label?: string;
  tip?: React.ReactNode;
  selLimit?: 1;
  customParams?: Tparams;
  customFilter?: Tparams['filter'];
  customPopulate?: Tparams['populate'];
  // defaultEmpArr?: TemployeeDto[];
  exceptEmpArr?: { id: string }[];
  isCancelOnConfirm?: boolean;
  exceptEmpCheck?: (emp: TquotationContractDto) => boolean;
}) {
  const { rwd1023 } = useContext(AppContext);

  // 被選的資料
  const [selContractArr, setSelContractArr] = useState<TquotationContractDto[]>([]);

  const [searchValue, setSearchValue] = useState<string[]>([]);

  const params: Tparams = (() => {
    return {
      pageSize: 20,
      filter: {
        $or: {
          'content.customer.name': { $contains: searchValue[0] },
          'content.projectName': { $contains: searchValue[0] },
          'content.county': { $contains: searchValue[0] },
          'content.quotationNumber': { $eq: searchValue[0] },
        },

        ...customFilter,
      },
      ...customParams,
    };
  })();

  const { dataArr, viewRef_bottom, isLoadingPage1, reset } = useContract_infinite({ customParams: params });

  //

  useEffect(() => {
    if (!showModal) {
      return;
    }

    reset();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, showModal]);

  useEffect(() => {
    if (!showModal) {
      setSelContractArr([]);
      setSearchValue([]);

      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  // ==================================================

  const onClick = (newEmp: TquotationContractDto) => {
    const newArr = [...selContractArr];

    if (selLimit === 1) {
      newArr[0] = newEmp;
      setSelContractArr(newArr);

      return;
    }

    const theIndex = newArr.findIndex((emp) => emp.id === newEmp.id);

    if (theIndex > -1) {
      newArr.splice(theIndex, 1);
    } else {
      newArr.push(newEmp);
    }

    setSelContractArr(newArr);
  };

  const theOnConfirm = () => {
    if (!selContractArr) {
      return ModalInfo('請選擇合約');
    }

    onConfirm(selContractArr);

    if (isCancelOnConfirm) {
      theOnCancel();
    }
  };

  const theOnCancel = () => {
    onCancel();
    setSelContractArr([]);
  };

  const onSearch = (v: string[]) => {
    setSearchValue(v);
  };

  const inputSelPropsArr: TsearcbBarProps['inputSelPropsArr'] = [
    // {
    //   selectProps: {
    //     wrapperStyle: { width: '120px' },
    //     props: {
    //       options: optionArr,
    //       placeholder: '選擇部門',
    //       menuPortalTarget: undefined,
    //       isLoading: !departmentData,
    //     },
    //   },
    // },
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
      width={rwd1023 ? '80vw' : '800px'}
      className={scss.container}
      tip={tip}
      searcbBarProps={{
        inputSelPropsArr: inputSelPropsArr,
        onClick: onSearch,
      }}
    >
      <LoadingCoverWrapper01 isLoading={isLoadingPage1}>
        <div className={scss.listContainer}>
          {/* <RowArr
            empArr={selEmployeeArr ?? []}
            selEmployeeArr={selEmployeeArr}
            exceptEmpArr={exceptEmpArr}
            onClick={onClick}
            exceptEmpCheck={exceptEmpCheck}
          />

          {selEmployeeArr.length !== 0 && <div className={scss.divider} />} */}

          <RowArr
            contractArr={dataArr}
            selContractArr={selContractArr}
            viewRef_bottom={viewRef_bottom}
            exceptEmpArr={exceptEmpArr}
            onClick={onClick}
            // skipArr={defaultEmpArr}
            exceptEmpCheck={exceptEmpCheck}
          />
          {/*  */}
        </div>
      </LoadingCoverWrapper01>
    </SelectorShell>
  );
}

// =========================================================

const RowArr = ({
  contractArr,
  selContractArr,
  // skipArr,
  viewRef_bottom,
  exceptEmpArr,
  onClick,
  exceptEmpCheck,
}: {
  contractArr: TquotationContractDto[];
  selContractArr: TquotationContractDto[];
  // skipArr?: TemployeeDto[];
  onClick: (v: TquotationContractDto) => void;
  exceptEmpArr?: { id: string }[];
  viewRef_bottom?: (node?: Element | null | undefined) => void;
  exceptEmpCheck: ((emp: TquotationContractDto) => boolean) | undefined;
}) => {
  return (
    <>
      {contractArr.map((contract, index, arr) => {
        const { customer, quotationDate, quotationNumber, projectName, county } = contract.content;

        const theViewRef = (() => {
          if (arr.length - 11 === index) {
            return viewRef_bottom;
          }

          return undefined;
        })();

        const isActive = selContractArr.some((selEmp) => selEmp.id === contract.id);
        let isExcept = exceptEmpArr?.some((exceptEmp) => exceptEmp.id === contract.id);

        if (!isExcept && exceptEmpCheck) {
          isExcept = exceptEmpCheck(contract);
        }
        // const isSkinp = skipArr?.some((selEmp) => selEmp.id === emp.id);

        const theOnClick = isExcept ? undefined : () => onClick(contract);

        // if (isSkinp) {
        //   return <div key={index} className="skip" ref={theViewRef}></div>;
        // }

        let date = quotationDate ? getTaiwanDateStr(quotationDate) : '';

        if (date === 'Invalid date') {
          date = '';
        }

        return (
          <CellWithBar key={index} isActive={isActive}>
            <div className={classNames(scss.row, isExcept && scss.except)} onClick={theOnClick} ref={theViewRef}>
              <div className={scss.left}>
                <span>{quotationNumber}</span>
                <span>{date}</span>
              </div>
              <div className={scss.right}>
                <span>{customer?.name}</span>
                <div>
                  <Image src={iconPlace} alt="" className="mr-[5px]" />
                  <span>{county}</span>
                </div>
                <div>
                  <span>{projectName}</span>
                </div>
              </div>
            </div>
          </CellWithBar>
        );
      })}
    </>
  );
};
