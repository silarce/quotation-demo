import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
// import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import Nav_worksDepartment from 'components/page/worksDepartment/nav_worksDepartment';
import EditTransfer, {
  Tcontroll as Tcontroll_transfer,
} from 'components/page/worksDepartment/contracList/contract/listOfDeliveryOrders/editTransfer';
import IconEdit, {
  UploadFile,
} from 'components/page/worksDepartment/contracList/contract/listOfDeliveryOrders/iconEdit';

import Profile, {
  Tcontroll as Tcontroll_profile,
} from 'components/page/worksDepartment/contracList/contract/gear/profile';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import ReviewFlowSelector from 'components/composition/review/reviewFlowSelector';
import { useReviewFlow } from 'components/composition/review/reviewFlow';

// api
import { useGetContract_id } from 'js/api/api_quotation';
import {
  TcreateExchgangeDto,
  useGetEngineeringExchanges_id,
  apiPostEngineeringExchange,
  apiPatchEngineeringExchange,
  useGetEngineeringContact,
} from 'js/api/api_engineering';

import { apiPostEngineeringExchangeAttachments, apiDeleteEngineeringExchangeAttachments } from 'js/api/api_engineering';

import { TuserDto } from 'js/api/dtoTypes';

import { usePanel_returnWorksDepartmentContractList } from 'components/page/worksDepartment/hook/usePanel_returnWorksDepartmentContractList';

// -----------------------------------------------------------

type Tquery = { contractId: string; exchangeId: string | undefined };

type Tprofile = {
  sheetNumber: string;
  projectNumber: string;
  projectName: string;
  requirementsDate: string;
  dispatchDate: string;
};

type Ttransfer = {
  id?: string;
  goodsName: string;
  goodsSpec: string;
  goodsQuantity: number;
  reason: string;
};

// -----------------------------------------------------------
export default function Edit({ userInfo, isReadonly }: { userInfo: TuserDto; isReadonly?: boolean }) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { contractId, exchangeId } = query;

  const userId = userInfo.employee?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(!!exchangeId);
  const [attachmentUpdateTrigger, setAttachmentUpdateTrigger] = useState(0);

  const [profile, setProfile] = useState<Tprofile>(emptyProfileOri());
  const [transferArr, setTransferArr] = useState<Ttransfer[]>([]);

  const [newImgArr, setNewImgArr] = useState<UploadFile[]>([]);
  const [delImgIdArr, setDelImgIdArr] = useState<string[]>([]);
  // ----------------------------------------------------

  const {
    data: contract,
    update: update_contract,
    contactThatSkipContract,
    isFetching: isFetching_contract,
  } = useGetContract_id(contractId);
  const engineeringContactId = contract?.engineeringContactId;
  const {
    data: engineeringContact,
    update: update_engineeringContact,
    isFetching: isFetching_engineeringContact,
  } = useGetEngineeringContact(engineeringContactId);

  const {
    data: exchange,
    update: update_exchange,
    isFetching: isFetching_exchange,
  } = useGetEngineeringExchanges_id(exchangeId);

  const { ReviewFlow, reqAddReview } = useReviewFlow({ uuid: exchange?.id });

  // ----------------------------------------------------

  const changeProfile = (key: keyof Tprofile, v: string) => {
    setProfile((profile) => {
      return { ...profile, [key]: v };
    });
  };

  // ----------------------------------------------------

  const addTransfer = () => {
    setTransferArr((transferList) => {
      return [...transferList, emptyTransferOri()];
    });
  };

  const deleteTransfer = (index: number) => {
    setTransferArr((transferList) => {
      const newTransferList = [...transferList];
      newTransferList.splice(index, 1);

      return newTransferList;
    });
  };

  const changeTransfer = (index: number, key: keyof Ttransfer, v: string) => {
    setTransferArr((transferList) => {
      const newTransferList = [...transferList];

      if (key === 'goodsQuantity') {
        newTransferList[index][key] = Number(v);
      } else {
        newTransferList[index][key] = v;
      }

      return newTransferList;
    });
  };

  // ----------------------------------------------------

  const controll_profile: Tcontroll_profile = {
    info: {
      sheetNumber: {
        value: profile.sheetNumber,
        onChange: (v: string) => changeProfile('sheetNumber', v),
      },
      projectNumber: {
        value: profile.projectNumber,
        onChange: (v: string) => changeProfile('projectNumber', v),
        disabled: true,
        showBaseline: 'invisible',
      },
      projectName: {
        value: profile.projectName,
        onChange: (v: string) => changeProfile('projectName', v),
        disabled: true,
        showBaseline: 'invisible',
      },
      requirementsDate: {
        value: profile.requirementsDate,
        onChange: (v: string) => changeProfile('requirementsDate', v),
      },
      dispatchDate: {
        value: profile.dispatchDate,
        onChange: (v: string) => changeProfile('dispatchDate', v),
      },
    },
  };

  // ----------------------------------------------------

  const controll_transfer_arr: Tcontroll_transfer['arr'] = transferArr.map((item, index) => {
    return {
      goodsName: {
        value: item.goodsName,
        onChange: (v: string) => changeTransfer(index, 'goodsName', v),
      },
      goodsSpec: {
        value: item.goodsSpec,
        onChange: (v: string) => changeTransfer(index, 'goodsSpec', v),
      },
      goodsQuantity: {
        value: String(item.goodsQuantity),
        onChange: (v: string) => changeTransfer(index, 'goodsQuantity', v),
      },
      reason: {
        value: item.reason,
        onChange: (v: string) => changeTransfer(index, 'reason', v),
      },
      onDelete: () => deleteTransfer(index),
    };
  });

  const controll_transfer: Tcontroll_transfer = {
    arr: controll_transfer_arr,
    add: addTransfer,
  };

  // ----------------------------------------------------

  const reqPost = async () => {
    const body: TcreateExchgangeDto = {
      ...profile,
      exchangeRecords: transferArr,
      contractId: contractId,
    };

    try {
      setIsLoading(true);

      if (exchangeId) {
        await apiPatchEngineeringExchange(exchangeId, body);
        await updateAttachments({
          exchangeId,
          newImgArr,
          delImgIdArr,
        });

        update_exchange();
        setAttachmentUpdateTrigger((state) => state + 1);
      } else {
        const res = await apiPostEngineeringExchange(body);
        await updateAttachments({
          exchangeId: res.id as string,
          newImgArr,
          delImgIdArr,
        });
        router.push({
          query: { ...router.query, exchangeId: res.id },
        });
      }

      myAlert.success({ title: '更新調(退)貨單成功' });
    } catch (error) {
      myAlert.err({ title: '更新調(退)貨單失敗' });
    } finally {
      setIsLoading(false);
      setDisabled(true);
    }
  };

  // ----------------------------------------------------

  // const tagCallback = () => {
  //   return `新增調(退)貨單 ${contract?.content.quotationNumber}`;
  // };

  const panelList_add: TpanelList = [
    {
      type: 'redButton',
      label: '儲存',
      onClick: reqPost,
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.push({
          pathname: '/worksDepartment/contractList/contract/listOfDeliveryOrders',
          query: {
            contractId,
          },
        });
      },
    },
  ];

  const panelList_edit01: TpanelList = [
    disabled
      ? {
          type: 'myButton',
          label: '送審',
          onClick: () => {
            if (!userId) {
              throw new Error('送審:userId is undefined');
            }

            const { destroy } = ReviewFlowSelector.open2({
              userId,
              onConfirm: (v) => {
                const { purpose, reviewFlowId } = v;

                if (!reviewFlowId) {
                  return;
                }

                reqAddReview({
                  review_id: reviewFlowId,
                  document_uuid: exchange?.id,
                  document_type: '調貨單',
                  user_id: userId,
                  document_title: `調貨單-${purpose}`,
                  query,
                });
                destroy();
              },
            });
          },
        }
      : null,
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => {
        setDisabled(false);
      },
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.push({
          pathname: '/worksDepartment/contractList/contract/listOfDeliveryOrders',
          query: {
            contractId,
          },
        });
      },
    },
  ];
  const panelList_edit02: TpanelList = [
    {
      type: 'redButton',
      label: '儲存',
      onClick: reqPost,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => setDisabled(true),
    },
  ];

  let panelList: TpanelList | undefined = !exchangeId ? panelList_add : disabled ? panelList_edit01 : panelList_edit02;
  panelList = [...panelList, ...usePanel_returnWorksDepartmentContractList()];

  if (panelList) {
    panelList = undefined;
  }

  // ------------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await update_contract();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '取得合約失敗', content: err.message });
      }

      try {
        await update_exchange();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '取得調(退)貨單失敗', content: err.message });
      }

      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId, exchangeId]);

  useEffect(() => {
    update_engineeringContact();
  }, [engineeringContactId]);

  useEffect(() => {
    const { projectName, projectNumber } = engineeringContact ?? {};
    const { sheetNumber, requirementsDate, dispatchDate } = exchange ?? {};

    setProfile({
      sheetNumber: sheetNumber ?? '',
      projectNumber: projectNumber ?? '',
      projectName: projectName ?? '',
      requirementsDate: requirementsDate ?? '',
      dispatchDate: dispatchDate ?? '',
    });

    const recoreds = _.cloneDeep(exchange?.exchangeRecords ?? []);
    setTransferArr(recoreds);

    //
  }, [engineeringContact, exchange, disabled]);

  // ------------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer isLoading_all={isLoading || isFetching_contract || isFetching_engineeringContact || isFetching_exchange}>
      {/* <PageHeader
        showReturnBtn={isReadonly ? false : disabled}
        panelList={isReadonly ? undefined : panelList}
        createTagLable={tagCallback}
        contractNumber={contract?.content.quotationNumber}
        linkForbidden={isReadonly}
        contactThatSkipContract={contactThatSkipContract}
      /> */}
      <div>
        <PageHeader02 tag={`新增調(退)貨單 ${contract?.content.quotationNumber}`} panelList={panelList} />
        {!isReadonly && <Nav_worksDepartment contactThatSkipContract={contactThatSkipContract} />}
      </div>

      <div>
        <div>
          <Profile controll={controll_profile} disabled={disabled} />
          <EditTransfer controll={controll_transfer} disabled={disabled} />
          <IconEdit
            //
            disabled={disabled}
            exchangeId={exchangeId}
            onAdd={(arr) => {
              setNewImgArr(arr);
            }}
            onDel={(arr) => {
              setDelImgIdArr(arr);
            }}
            updateTrigger={attachmentUpdateTrigger}
          />
          <br />
          <br />
          <ReviewFlow className={'w-fit ml-4 gap-4'} />
        </div>
      </div>
    </SubLayer>
  );
}

// ===========================================================

const emptyProfileOri = (): Tprofile => ({
  sheetNumber: '',
  projectNumber: '',
  projectName: '',
  requirementsDate: '',
  dispatchDate: '',
});

const emptyTransferOri = (): Ttransfer => ({
  goodsName: '',
  goodsSpec: '',
  goodsQuantity: 1,
  reason: '',
});

const updateAttachments = async ({
  //
  exchangeId,
  newImgArr,
  delImgIdArr,
}: {
  exchangeId: string;
  newImgArr?: UploadFile[];
  delImgIdArr?: string[];
}) => {
  if (delImgIdArr) {
    for (const id of delImgIdArr) {
      await apiDeleteEngineeringExchangeAttachments(exchangeId, id);
    }
  }

  if (newImgArr) {
    for (const uploadFile of newImgArr) {
      const file = uploadFile.originFileObj as File;
      const formData = new FormData();
      formData.append('file', file);
      await apiPostEngineeringExchangeAttachments(exchangeId, formData);
    }
  }
};
