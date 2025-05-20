import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import Nav_worksDepartment from 'components/page/worksDepartment/nav_worksDepartment';

// composition
import MeetingMinutes_contract, { TimperativeHandle, Tstate } from 'components/composition/meetingMinutes/contract';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { useGetContract_id } from 'js/api/api_quotation';
import { useGetEngineeringContact } from 'js/api/api_engineering';

import { usePanel_returnWorksDepartmentContractList } from 'components/page/worksDepartment/hook/usePanel_returnWorksDepartmentContractList';

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
  // const [disabled, setDisabled] = useState(true);
  const [meetingMinutesState, setMeetingMinutesState] = useState<Tstate>();

  // ---------------------------------------------------------------------------

  const {
    data: contract,
    update: update_contract,
    isFetching: isFetching_contract,
    contactThatSkipContract,
  } = useGetContract_id(contractId, {
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

  const returnPanel = usePanel_returnWorksDepartmentContractList();

  const panelList: TpanelList = (() => {
    const panelList_read: TpanelList = [
      {
        type: 'myButton',
        label: '返回',
        onClick: () => {
          ref.current?.toList();
        },
      },
      ...returnPanel,
    ];

    const { isAdd, isEdit, isRead } = meetingMinutesState ?? {};

    if (isRead) {
      return panelList_read;
    }

    return [...returnPanel];
  })();

  // ---------------------------------------------------------------------------
  return (
    <SubLayer isLoading_all={isLoading || meetingMinutesState?.isLoading || isFetching_contract}>
      <div>
        <PageHeader02 panelList={panelList} tag={`合約編號 ${engineeringContact?.contractNumber ?? ''}`} />
        <Nav_worksDepartment contactThatSkipContract={contactThatSkipContract} />
      </div>

      <div>
        <MeetingMinutes_contract ref={ref} onStateChange={onMeetingMinutesStateChange} />
      </div>
    </SubLayer>
  );
}
