import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import PageHeader from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// composition
import MeetingMinutes_contract from 'components/composition/meetingMinutes/contract';

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

  // ---------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id(contractId, {
    preBuiltPopulate: 'worksDepartment02',
  });
  const engineeringContactId = contract?.engineeringContactId;

  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

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

  const panelList: TpanelList = [];

  // ---------------------------------------------------------------------------
  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader panelList={panelList} contractNumber={engineeringContact?.contractNumber ?? ''} />

      <div>
        <MeetingMinutes_contract />
        <div></div>
      </div>
    </SubLayer>
  );
}
