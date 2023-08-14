// 報價單
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useRouter, NextRouter } from 'next/router';
import moment from 'moment';
import { useForm, Controller, useFormState } from 'react-hook-form';
import classNames from 'classnames';

// components
import QuotationProfile, { TprofileReturnBody } from 'components/page/domestic/quotation/quotationProfile';
import QuotationProduction from 'components/page/domestic/quotation/quotationProduct';
import QuotationComponent from 'components/page/domestic/quotation/quotationComponent';
import QuotationAccessory from 'components/page/domestic/quotation/quotationAccessory';
import QuotationTotal from 'components/page/domestic/quotation/quotationTotal';
import QuotationSinature, { TsignatureProps } from 'components/page/domestic/quotation/quotationSinature';
// import QuotationProdChangingRecord from "components/page/domestic/quotation/quotationProdChangingRecord"
// import QuotationRecord from "components/page/domestic/quotation/quotationRecord"
import QuotationPdf from 'components/page/domestic/pdf/quotationPdf/quotationPdf';
import QuotationPdf_part from 'components/page/domestic/pdf/quotationPdf_part/quotationPdf_part';
import QuotationStateSel from 'components/page/domestic/budget/quotationStateSel';
import QuotationAdditions from 'components/page/domestic/quotation/quotationAdditions';

// global gear
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import TextareaModal from 'components/global/gear/modal/simpleModal/textareaModal';
import EmployeeSelector, { TemployeeDto } from 'components/global/gear/modal/employeeSelector';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';

// icon
import iconUpload from 'public/image/icon/upload.svg';

// option
import { optionsCreator_quotationState, Toption } from 'js/utils/options/options';
const optionQuotationState = optionsCreator_quotationState();

// css
import style from './quotation.module.scss';

import { AppContext } from 'pages/_app';

// ------------------------------------------------------------------

// 假資料與fake api
import { fakeApi_quotation_creator } from 'fakeDatabase/fakeAPI/fakeQuotationApi';
import { useQuotation } from 'hooks/quotation/useQuotation';
import { fakeApi_client } from 'fakeDatabase/fakeAPI/fakeClientApi';
import { fakeApi_memo } from 'fakeDatabase/fakeAPI/fakeMemoApi';
import { fakeApi_quoteRange } from 'fakeDatabase/fakeAPI/fakeQuoteRangeApi';

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------

// config
import { quotationStatusLookup } from 'config/lookupTable';

import {
  TquotationDto,
  TquotationContentDto,
  TcreateQuotationContentDto,
  useGetQuotation_id,
  apiPostQuotation,
  apiPatchQuotation,
} from 'js/api/api_quotation';
import { set } from 'lodash';

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------
export default function Quotation() {
  const router = useRouter();
  const isReady = router.isReady;

  if (!isReady) {
    return null;
  }

  return <TheQuotation router={router} />;
}

// =================================================================
// =================================================================
// =================================================================

function TheQuotation({ router }: { router: NextRouter }) {
  const {
    id, //報價單id //若為新增報價單則為newQuotation
    // isNewQuotationId, // 新增報價單的id // 若不是新增報價單則為undefined
  } = router.query as { id: string | undefined };
  // ----------------------------------------------------------------
  const { userInfo } = useContext(AppContext);

  // ----------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);
  const [employeeSelectorShow, setEmployeeSelectorShow] = useState(false);

  // ---------------------------------------------------------
  // const { register, control, reset, watch, setValue } = useForm<TcreateQuotationContentDto>();
  // const { register, control, reset, watch, setValue } = useForm<TquotationContentDto>();
  const { register, control, reset, watch, setValue } = useForm<Partial<TquotationContentDto>>();
  const { data, update } = useGetQuotation_id(id as string);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await update();
      setIsLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    const latestContent = data?.latestContent;

    let agentEmployee;

    if (!id) {
      agentEmployee = userInfo?.employee;
    } else {
      agentEmployee = latestContent?.agentEmployee;
    }

    const quotationDate = latestContent?.quotationDate
      ? latestContent?.quotationDate
      : moment(latestContent?.quotationDate).toISOString();

    reset({
      quotationDate: quotationDate,
      validityPeriod: latestContent?.validityPeriod,
      // customerId: lContent.customer.id,
      customer: latestContent?.customer,
      projectName: latestContent?.projectName,
      county: latestContent?.county,
      district: latestContent?.district,
      address: latestContent?.address,
      contactPerson: latestContent?.contactPerson,
      contactNumber: latestContent?.contactNumber,
      discount: latestContent?.discount,
      quantity: latestContent?.quantity,
      editNotes: latestContent?.editNotes,
      totalPrice: latestContent?.totalPrice,
      status: latestContent?.status ?? 'Budget',
      // managerId: lContent.managerEmployee?.id,
      // supervisorId: lContent.suervisorEmployee?.id,
      // agentId: lContent.agentEmployee?.id,
      managerEmployee: latestContent?.managerEmployee,
      supervisorEmployee: latestContent?.supervisorEmployee,
      // agentEmployee: lContent.agentEmployee,
      agentEmployee: agentEmployee,
    });
  }, [data]);

  const onProfileChange = (v: Partial<TprofileReturnBody>) => {
    setValue('validityPeriod', v.validityPeriod ?? '');
    setValue('customer', v.customer);
    setValue('projectName', v.projectName ?? '');
    setValue('county', v.county ?? '');
    setValue('district', v.district ?? '');
    setValue('address', v.address ?? '');
    setValue('contactPerson', v.contactPerson ?? '');
    setValue('contactNumber', v.contactNumber ?? '');
  };

  // ---------------------------------------------------------

  const [empSelConfirmKey, setEmpSelConfirmKey] = useState<'manager' | 'supervisor' | 'inspector'>();

  const openEmpSel = (v: 'manager' | 'supervisor' | 'inspector') => {
    setEmpSelConfirmKey(v);
    setEmployeeSelectorShow(true);
  };

  const onEmpSelCancel = () => {
    setEmployeeSelectorShow(false);
    setEmpSelConfirmKey(undefined);
  };

  const changeManager = (v: TemployeeDto[]) => {
    setValue('managerEmployee', v[0]);
    onEmpSelCancel();
  };

  const changeSupervisor = (v: TemployeeDto[]) => {
    setValue('supervisorEmployee', v[0]);
    onEmpSelCancel();
  };

  const changeinspector = (v: TemployeeDto[]) => {
    console.log(v);
    onEmpSelCancel();
  };

  const empSelProps = (() => {
    if (empSelConfirmKey === 'manager') {
      return {
        label: '請選擇經理',
        onConfirm: changeManager,
        onCancel: onEmpSelCancel,
      };
    }

    if (empSelConfirmKey === 'supervisor') {
      return {
        label: '請選擇主管',
        onConfirm: changeSupervisor,
        onCancel: onEmpSelCancel,
      };
    }

    if (empSelConfirmKey === 'inspector') {
      return {
        label: '請選擇審核者',
        onConfirm: changeinspector,
        onCancel: onEmpSelCancel,
      };
    }
  })();

  // ---------------------------------------------------------
  // ---------------------------------------------------------

  // 正式接上api前先這樣處理，但是我已經忘記這是在處理什麼了.....
  // let quotationData: Tquotation | undefined;
  // if (typeof quotationId === "string" && quotationId !== "newQuotation") {
  //   quotationData = fakeQuotationObjList[quotationId]
  //   if (!quotationData) quotationData = undefined
  // }
  // --------------------------------------------------------------------------
  // 是否可編輯
  const [allowEdit, setAllowEdit] = useState(false);
  // ---------------------------------------------------------
  const fakeApiQuotaion = fakeApi_quotation_creator(router.query.quotationId as string);

  const { classQuotation, reNew: reNewClassQuotation } = useQuotation(fakeApiQuotaion?.get());
  const signatureArr: TsignatureProps[] = [
    {
      label: '經理',
      inputProps: {
        props: {
          value: watch('managerEmployee')?.chName ?? '',
          onClick: () => {
            openEmpSel('manager');
          },
        },
      },
    },
    {
      label: '主管',
      inputProps: {
        props: {
          value: watch('supervisorEmployee')?.chName ?? '',
          onClick: () => {
            openEmpSel('supervisor');
          },
        },
      },
    },
    {
      label: '經辦',
      inputProps: {
        props: {
          value: watch('agentEmployee')?.chName ?? '',
          onChange: () => {},
        },
      },
    },
  ];

  const getFakeMemo = fakeApi_memo.get;
  const getFakeQuotaRange = fakeApi_quoteRange.get;

  useEffect(() => {
    reNewClassQuotation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowEdit]);

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------

  // --------------------------------------------------------------------------

  const [showPdf, setShowPdf] = useState(false);
  const [showPdf_part, setShowPdf_part] = useState(false);

  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  const [quotationState, setQuotationState] = useState<Toption>({ value: '預算', label: '預算' });

  const [showMemoModal, setShowMemoModal] = useState(false);

  const inputModalOnConfirm = (v: string) => {
    if (!v) {
      return myAlert.warning({ title: '請輸入註解' });
    }

    setValue('editNotes', v);

    setShowMemoModal(false);

    setTimeout(() => {
      reqPost();
    }, 10);
  };

  const tagList: TtagList = [
    {
      label: id ? `報價編號 ${data?.latestContent.quotationNumber || ''}` : '新報價單',
      onClick: () => {},
    },
  ];

  const history = useMemo(() => {
    const content = data?.contents ?? [];

    return content.map((item, index, arr) => {
      const { status, quotationDate } = item;
      const preStatus = arr[index - 1]?.status;

      return {
        state_from: quotationStatusLookup[preStatus] ?? '建立',
        state_to: quotationStatusLookup[status] ?? '',
        isoString: moment(quotationDate).toISOString(),
      };
    });
  }, [data]);

  // optionQuotationState
  const panel_editable: TpanelList = [
    {
      // 報價/歷史狀態狀態
      custom: (
        <QuotationStateSel
          quotationState={{ value: watch('status')!, label: quotationStatusLookup[watch('status')!] }}
          setQuotationState={(option) => {
            setValue('status', option.value as TquotationContentDto['status']);
          }}
          // history={fakeQuotationStateHistory}
          history={history}
        />
      ),
    },
    { type: 'redButton', label: '上傳', onClick: () => setShowMemoModal(true) },
    { type: 'myButton', label: '取消', onClick: () => setAllowEdit(false) },
  ];
  const panel_noEditable: TpanelList = [
    {
      type: 'myButton',
      label: '匯出報價單',
      img: iconUpload.src,
      onClick: () => setShowPdf(true),
    },
    {
      type: 'myButton',
      label: '匯出材料/配件',
      img: iconUpload.src,
      onClick: () => setShowPdf_part(true),
    },
    { type: 'myButton', label: '編輯', onClick: () => setAllowEdit(true) },
    { type: 'myButton', label: '送審', onClick: () => openEmpSel('inspector') },
    { type: 'myButton', label: '返回', onClick: () => router.back() },
  ];

  // --------------------------------------------------------------------------
  // 如果報價單編號錯誤(找不到這筆報價單)，就return NoQuotation
  // if (quotationId !== "newQuotation" && !quotationData)
  //   return <NoQuotation quotationId={quotationId as string} />
  // if (quotationId !== "newQuotation")
  //   return <NoQuotation quotationId={quotationId as string} />
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  if (!classQuotation) {
    return null;
  }

  // --------------------------------------------------------------------------
  const quotationPdf_part_mainProductArr = (() => {
    const theArr = classQuotation.mainProductArr.map((mp) => {
      return {
        ...mp.allData,
        part: mp.partArr.map((part) => part.allData),
      };
    });

    return theArr;
  })();

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  const reqPost = async () => {
    const data = watch();

    const body: TcreateQuotationContentDto = {
      quotationDate: data.quotationDate ?? '',
      validityPeriod: data.validityPeriod ?? '',
      //
      customerId: data.customer?.id ?? '',
      //
      projectName: data.projectName ?? '',
      county: data.county ?? '',
      district: data.district ?? '',
      address: data.address ?? '',
      contactPerson: data.contactPerson ?? '',
      contactNumber: data.contactNumber ?? '',
      discount: Number(data.discount ?? 0) ?? 100,
      quantity: data.quantity ?? 0,
      editNotes: data.editNotes ?? '',
      totalPrice: data.totalPrice ?? 0,
      status: data.status ?? 'Budget',
      managerId: data.managerEmployee?.id ?? null,
      supervisorId: data.supervisorEmployee?.id ?? null,
      //
      // 目前只有admin可以呼叫這系列的api，但是agentId必須送，暫時先這樣處理
      agentId: data.agentEmployee?.id ?? '16f60f1c-8005-4c59-81ac-f3006bc2fc2a',
      //
    };

    try {
      setIsLoading(true);

      if (id) {
        await apiPatchQuotation(body, id);
        await update();
      } else {
        const res = await apiPostQuotation(body);
        router.push({
          query: {
            id: res.id,
          },
        });
      }

      setAllowEdit(false);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  return (
    <div className={classNames(style.container, 'relative')}>
      <PageHeader02 tagList={tagList} panelList={allowEdit ? panel_editable : panel_noEditable} />

      <div className={style.mainContainer}>
        <div className={style.quotation}>
          {/* 基本資料 */}
          <QuotationProfile //
            profile={data?.latestContent}
            disabled={!allowEdit}
            onProfileChange={onProfileChange}
          />

          <div className={style.switchBar}>
            <div className={style.active}>報價項目</div>
          </div>

          {/* 主產品設定 */}
          {/* <QuotationProduction classQuotation={classQuotation} disabled={!allowEdit} /> */}

          <div className={style.redWrapper}>
            {/* 材料配件設定 */}
            {/* <QuotationComponent classQuotation={classQuotation} disabled={!allowEdit} /> */}
            <hr />
            {/* 選配設定 */}
            {/* <QuotationAccessory activeRow={classQuotation.activeMainProd} disabled={!allowEdit} /> */}
          </div>
          {/* 其他設定 */}
          {/* <QuotationAdditions disabled={!allowEdit} /> */}

          {/* 備註/報價範圍/付款資訊 */}
          {/* <QuotationTotal
            classQuotation={classQuotation}
            getFakeMemo={getFakeMemo}
            getFakeQuotaRange={getFakeQuotaRange}
            disabled={!allowEdit}
          /> */}
          {/* 簽名 */}
          <QuotationSinature signatureArr={signatureArr} disabled={!allowEdit} />
        </div>
      </div>
      <LoadingCover01 isLoading={isLoading} />
      <TextareaModal
        visible={showMemoModal}
        setVisible={setShowMemoModal}
        title={'追加追減備註'}
        placeholder={'請輸入備註'}
        tip="最多25字"
        textLength={25}
        onConfirm={inputModalOnConfirm}
        autoCloseOnConfirm={false}
      />
      {/* <QuotationPdf
        isVisable={showPdf}
        onCancel={() => {
          setShowPdf(false);
        }}
        classQuotation={classQuotation}
      /> */}

      {/*  */}
      {/* <QuotationPdf_part
        isVisable={showPdf_part}
        onCancel={() => {
          setShowPdf_part(false);
        }}
        mainProductArr={quotationPdf_part_mainProductArr}
        quotationId={classQuotation.quotationId}
      /> */}
      {/*  */}
      <EmployeeSelector
        showModal={employeeSelectorShow}
        label={empSelProps?.label}
        onConfirm={(v) => {
          empSelProps?.onConfirm(v);
        }}
        onCancel={onEmpSelCancel}
        selLimit={1}
      />
      {/* <EmployeeSelector
        showModal={employeeSelectorShow}
        label="請選擇審核人員"
        onConfirm={(arr) => {
          setEmployeeSelectorShow(false);
        }}
        onCancel={() => {
          setEmployeeSelectorShow(false);
        }}
      /> */}
    </div>
  );
}

// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
const NoQuotation = ({ quotationId }: { quotationId: string }) => {
  const router = useRouter();

  const toBack = () => {
    router.back();
  };

  return (
    <div className={style.noQuotation}>
      <span>沒有這個報價單ID</span>
      <span>{quotationId}</span>
      <button onClick={toBack}>回上一頁</button>
    </div>
  );
};

// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============

const fakeQuotationStateHistory = [
  {
    state_from: '預算',
    state_to: '投標',
    isoString: moment('0111-02-03 05:11:05').toISOString(),
  },
  {
    state_from: '預算',
    state_to: '發包',
    isoString: moment('0111-02-10 09:15:08').toISOString(),
  },
  {
    state_from: '預算',
    state_to: '發包',
    isoString: moment('0111-03-05 15:01:46').toISOString(),
  },
  {
    state_from: '預算',
    state_to: '投標',
    isoString: moment('0111-03-23 13:45:11').toISOString(),
  },
];

// 先把api client建立起來，然後建立幾筆資料
// 先把api client建立起來，然後建立幾筆資料
// 先把api client建立起來，然後建立幾筆資料
// 先把api client建立起來，然後建立幾筆資料
// 先把api client建立起來，然後建立幾筆資料
// 先把api client建立起來，然後建立幾筆資料

// 新增報價單的時候要自動帶使用者的名字降去經辦人，而且不能再改
