// 派工單列表
// 派工單列表
// 派工單列表

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import Profile, { Tprofile01 } from 'components/page/worksDepartment/contracList/contract/dispatchList/profile';
import List from 'components/page/worksDepartment/contracList/contract/dispatchList/list';

// gear
import Table01 from 'components/global/gear/table/table01';

// api
import { Tparams, useGetEngineeringContact, useGetEngineeringDispatchingList } from 'js/api/api_engineering';
import { useGetContract_id } from 'js/api/api_quotation';

// helper
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// css
import style from './dispatchList.module.scss';

// ==============================================================

export default function DispatchList() {
  const router = useRouter();
  const { contractId } = router.query as { contractId: string };
  // ----------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id(contractId);
  const engineeringContactId = contract?.engineeringContactId;
  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  const params: Tparams = {
    populate: ['todoList', 'workerEmployee'],
    filter: {
      contractId: { $eq: contractId },
    },
  };

  const { data: dispatchingArr, update } = useGetEngineeringDispatchingList(params);

  useEffect(() => {
    update();
    update_contract();
  }, []);

  useEffect(() => {
    update_engineeringContact();
  }, [engineeringContactId]);

  // ----------------------------------------------------
  const [profile01, setProfile01] = useState<Tprofile01>(creEmptyProfile());

  const onProfile01Change = (key: keyof Tprofile01, v: string) => {
    if (!profile01) {
      return;
    }

    const newProfile = { ...profile01 };
    newProfile[key] = v;
    setProfile01(newProfile);
  };

  useEffect(() => {
    if (engineeringContact) {
      const dispatching = dispatchingArr?.[0];

      setProfile01(() => {
        const {
          projectName,
          // contactPerson,
          projectNumber,
          contractor,
          constructionSitePrincipalContactNumber,
          // quotationNumber,

          county,
          district,
          address,
        } = engineeringContact;

        const allAddress = `${county}${district}${address}`;

        return {
          projectName: projectName,
          contractor: contractor ?? '',
          // 這是承包商的聯絡人
          contractorContactPerson: dispatching?.contractorContactPerson ?? '',
          constructionSiteContactNumber: constructionSitePrincipalContactNumber,
          allAddress,
          //
          projectNumber: projectNumber ?? '',
          // badgeNumber: dispatching?.badgeNumber ?? '',
        };
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineeringContact]);

  // ----------------------------------------------------
  // dispatchingArr
  const dispatch_simpleArr =
    dispatchingArr?.map((item) => {
      return {
        dispatchDate: moment(convertDate_reduce1911(item.dispatchDate)).format('yy-MM-DD'),
        workerNameArr: item.workerEmployee.map((worker) => worker.chName || worker.enName),
        tasks: item.tasks,
        href: {
          pathname: `${router.pathname}/edit`,
          query: {
            ...router.query,
            dispatchingId: item.id,
          },
        },
      };
    }) ?? [];

  // ----------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'addButton',
      label: '新增派工單',
      onClick: () =>
        router.push({
          pathname: `${router.pathname}/edit`,
          query: {
            ...router.query,
          },
        }),
    },
  ];

  // ----------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader panelList={panelList} contractNumber={contract?.content.quotationNumber} />

      <div>
        {/*  */}
        <div className={style.dispatchList}>
          <Profile profile01={profile01} onProfile01Change={onProfile01Change} disabled={true} />
          <List list={dispatch_simpleArr} />
        </div>
        {/*  */}
      </div>
    </SubLayer>
  );
}

// =============================================

const creEmptyProfile = (): Tprofile01 => ({
  projectName: '',
  contractor: '',
  contractorContactPerson: '',
  constructionSiteContactNumber: '',
  allAddress: '',
  projectNumber: '',
});
