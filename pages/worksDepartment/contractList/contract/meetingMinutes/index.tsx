import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import PageHeader from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// composition
import MeetingMinutes_contract, { TimperativeHandle, Tstate } from 'components/composition/meetingMinutes/contract';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { useGetContract_id } from 'js/api/api_quotation';
import {
  // TupdateEngineeringDeliveryList,
  // TupdateDeliveryStatus,
  TupdateEngineeringDeliveryStatusDto,
  useGetEngineeringContact,
  useGetEngineeringDeliveryList,
  apiPatchEngineeringDeliveryList,
  TcreateEngineeringDeliveryStatusDto,
  apiPostDeliveryStatus,
  apiPatchDeliveryStatus,
  apiDeleteDeliveryStatus,
} from 'js/api/api_engineering';

// ============================================================================
type Tquery = {
  contractId: string;
};

// ============================================================================
export default function MeetingMinutes() {
  const router = useRouter();
  const { contractId } = router.query as Tquery;
  const ref = useRef<TimperativeHandle>(null);

  // ---------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [meetingMinutesState, setMeetingMinutesState] = useState<Tstate>();

  // ---------------------------------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id(contractId, {
    preBuiltPopulate: 'worksDepartment02',
  });
  const engineeringContactId = contract?.engineeringContactId;

  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  // ---------------------------------------------------------------------------

  const onMeetingMinutesStateChange = (state: Tstate) => {
    setMeetingMinutesState(state);
  };

  // ---------------------------------------------------------------------------

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await update_contract();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '取得合約失敗', content: err.message });
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await update_engineeringContact();
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------

  const panelList: TpanelList = (() => {
    const panelList_list: TpanelList = [
      {
        type: 'myButton',
        label: '新增',
        onClick: () => {
          ref.current?.add();
        },
      },
    ];

    const panelList_read: TpanelList = [
      {
        type: 'myButton',
        label: '編輯',
        onClick: () => {
          ref.current?.edit();
        },
      },
      {
        type: 'myButton',
        label: '返回',
        onClick: () => {
          ref.current?.toList();
        },
      },
    ];

    const panelList_edit: TpanelList = [
      {
        type: 'redButton',
        label: '確定',
        onClick: () => {
          ref.current?.reqPostPatch();
        },
      },
      {
        type: 'myButton',
        label: '取消',
        onClick: () => {
          ref.current?.cancelEdit();
        },
      },
    ];

    const panelList_add: TpanelList = [
      {
        type: 'redButton',
        label: '確定',
        onClick: () => {
          ref.current?.reqPostPatch();
        },
      },
      {
        type: 'myButton',
        label: '返回',
        onClick: () => {
          ref.current?.toList();
        },
      },
    ];

    const { isAdd, isEdit, isRead } = meetingMinutesState ?? {};

    if (isAdd) {
      return panelList_add;
    }

    if (isRead) {
      return panelList_read;
    }

    if (isEdit) {
      return panelList_edit;
    }

    return panelList_list;
  })();

  // ---------------------------------------------------------------------------
  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader panelList={panelList} contractNumber={engineeringContact?.contractNumber ?? ''} />

      <div>
        <MeetingMinutes_contract ref={ref} onStateChange={onMeetingMinutesStateChange} />
      </div>
    </SubLayer>
  );
}
