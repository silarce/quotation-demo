import { useState, useEffect } from 'react';
import classNames from 'classnames';
import moment from 'moment';

// global gear
import SelectorShell, { TsearcbBarProps } from './selectorShell';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';
import LoadingCoverWrapper01 from '../loadingCover/loadingCoverWrapper01';
import SelectBar from 'components/global/gear/select/selectBar/selectBar';

// css
import scss from './paymentRecordSelector.module.scss';

// api
import {
  Tparams,
  TaccountantDto,
  //
  useGetAccountant_infinite,
} from 'js/api/api_accountant';

// utils
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// option
import { optionsCreator_month, optionsCreator_year } from 'js/utils/options/options';
const monthOptionArr = optionsCreator_month({ emptyOption: true });
const yearOptionArr = optionsCreator_year();

// import { AppContext } from 'pages/_app';

// ==========================================================================
type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

export type { TaccountantDto };

// ==========================================================================
export default function PaymentRecordSelector({
  showModal,
  onConfirm,
  onCancel,
  label,
  tip,
  selLimit,
  customParams,
  customFilter,
  customPopulate,
  defaultAccountantArr,
  exceptAccountantArr,
  isCancelOnConfirm = true,
  exceptAccountantCheck,
}: {
  showModal: boolean;
  onConfirm: (v: TaccountantDto[]) => void;
  onCancel: () => void;
  label?: string;
  tip?: React.ReactNode;
  selLimit?: 1;
  customParams?: Tparams;
  customFilter?: Tparams['filter'];
  customPopulate?: Tparams['populate'];
  defaultAccountantArr?: TaccountantDto[];
  exceptAccountantArr?: { id: string }[];
  isCancelOnConfirm?: boolean;
  // exceptAccountantCheck?: (data: TaccountantDto) => boolean;
  exceptAccountantCheck?: (data: TaccountantDto) => boolean;
}) {
  // const { rwd1023 } = useContext(AppContext);

  const [paymentType, setPaymentType] = useState<string | undefined>();
  const [year, setYear] = useState<string | undefined>(undefined);
  const [month, setMonth] = useState<string | undefined>(undefined);
  // ------------------------------------------------------------------

  const params: Tparams = {
    filter: {
      paymentType: { $eq: paymentType || undefined },
    },
  };

  const { dataArr, viewRef_bottom, isLoadingPage1, reset } = useGetAccountant_infinite({ customParams: params });

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  const paymentOptions: (
    | {
        value: TaccountantDto['paymentType'];
        label: TaccountantDto['paymentType'];
      }
    | {
        value: '';
        label: '不拘';
      }
  )[] = [
    {
      value: '',
      label: '不拘',
    },
    {
      value: '匯款',
      label: '匯款',
    },
    {
      value: '票據',
      label: '票據',
    },
    {
      value: '現金',
      label: '現金',
    },
  ];

  const selectPropsArr: TselectPropsArr = [
    {
      selectProps: {
        value: paymentType,
        options: paymentOptions,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            setPaymentType(option.value);
          }
        },
      },
      placeholder: '類型',
      boxStyle: { width: '100px' },
    },
    {
      selectProps: {
        value: year,
        options: yearOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            setYear(option.value);
          }
        },
      },
      placeholder: '年',
      boxStyle: { width: '100px' },
    },
    {
      selectProps: {
        value: month,
        options: monthOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            setMonth(option.value);
          }
        },
      },
      placeholder: '月',
      boxStyle: { width: '100px' },
    },
  ];

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  // 被選的資料
  const [selDataArr, setSelDataArr] = useState<TaccountantDto[]>([]);

  const [searchValue, setSearchValue] = useState<string[]>([]);

  // const { dataArr, viewRef_bottom, isLoadingPage1, reset } = useEmployee_infinite({ customParams: params });

  //

  useEffect(() => {
    if (!showModal) {
      return;
    }

    reset();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, paymentType, year, month, showModal]);

  useEffect(() => {
    if (!showModal) {
      // setSelEmployeeArr([]);
      setSearchValue([]);

      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  // ==================================================

  const onClick = (newData: TaccountantDto) => {
    const newArr = [...selDataArr];

    if (selLimit === 1) {
      newArr[0] = newData;
      setSelDataArr(newArr);

      return;
    }

    const theIndex = newArr.findIndex((data) => data.id === newData.id);

    if (theIndex > -1) {
      newArr.splice(theIndex, 1);
    } else {
      newArr.push(newData);
    }

    setSelDataArr(newArr);
  };

  const theOnConfirm = () => {
    if (!selDataArr) {
      return ModalInfo('請選擇收款紀錄');
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

  const otherLeft = (
    <SelectBar className={scss.selectBar} selectPropsArr={selectPropsArr} menuPortalTarget="undefined" />
  );

  return (
    <SelectorShell
      label={label ?? ''}
      visible={showModal}
      onConfirm={theOnConfirm}
      onCancel={theOnCancel}
      width={'619px'}
      className={scss.container}
      tip={tip}
      searcbBarProps={{
        inputSelPropsArr: inputSelPropsArr,
        onClick: onSearch,
      }}
      otherLeft={otherLeft}
    >
      <LoadingCoverWrapper01 isLoading={isLoadingPage1}>
        <div className={scss.listContainer}>
          <div className={classNames(scss.thead, scss.row)}>
            <div>
              <span>收票日期</span>
            </div>
            <div>
              <span>編號</span>
            </div>
            <div>
              <span>到期日</span>
            </div>
            <div>
              <span>金額</span>
            </div>
            <div>
              <span>備註</span>
            </div>
          </div>
          {/*  */}

          <RowArr
            dataArr={selDataArr}
            selDataArr={selDataArr}
            onClick={onClick}
            // exceptDataArr={exceptAccountantArr}
            // exceptDataCheck={exceptAccountantCheck}
          />

          {selDataArr.length !== 0 && <div className={scss.divider} />}

          <RowArr
            dataArr={dataArr}
            selDataArr={selDataArr}
            onClick={onClick}
            viewRef_bottom={viewRef_bottom}
            exceptDataArr={exceptAccountantArr}
            exceptDataCheck={exceptAccountantCheck}
          />
        </div>
      </LoadingCoverWrapper01>
    </SelectorShell>
  );
}
// =========================================================

// =========================================================

const RowArr = ({
  dataArr: dataArr,
  selDataArr,
  // skipArr,
  viewRef_bottom,
  exceptDataArr,
  onClick,
  exceptDataCheck,
}: {
  dataArr: TaccountantDto[];
  selDataArr: TaccountantDto[];
  // skipArr?: TemployeeDto[];
  onClick: (v: TaccountantDto) => void;
  exceptDataArr?: { id: string }[];
  viewRef_bottom?: (node?: Element | null | undefined) => void;
  exceptDataCheck?: ((data: TaccountantDto) => boolean) | undefined;
}) => {
  return (
    <>
      {dataArr.map((data, index, arr) => {
        const { paymentType, accountingNumber, price, notes, noteMaturityDate } = data;

        const theNoteMaturityDate = !noteMaturityDate
          ? ''
          : moment(convertDate_reduce1911(noteMaturityDate)).format('yy-MM-DD');

        const ref = index === dataArr.length - 3 ? viewRef_bottom : undefined;

        const isActive = selDataArr.some((selData) => selData.id === data.id);

        let isExcept = exceptDataArr?.some((exceptEmp) => exceptEmp.id === data.id);

        if (!isExcept && exceptDataCheck) {
          isExcept = exceptDataCheck(data);
        }
        // const isSkinp = skipArr?.some((selEmp) => selEmp.id === emp.id);

        const theOnClick = isExcept ? undefined : () => onClick(data);

        // if (isSkinp) {
        //   return <div key={index} className="skip" ref={theViewRef}></div>;
        // }

        return (
          <CellWithBar key={index} isActive={isActive}>
            <div className={classNames(scss.row, isExcept && scss.except)} onClick={theOnClick} ref={ref}>
              <div>
                <span>{'999-99-99'}</span>
              </div>
              <div>
                <span>{accountingNumber}</span>
              </div>
              <div>
                <span>{theNoteMaturityDate}</span>
              </div>
              <div>
                <span>{price}</span>
              </div>
              <div>
                <span>{notes}</span>
              </div>
            </div>
          </CellWithBar>
        );
      })}
    </>
  );
};
