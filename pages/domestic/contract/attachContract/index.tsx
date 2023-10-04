// 舊合約
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextRouter } from 'next/router';
import _ from 'lodash';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
import QuotationProfile, { TreturnBody, TquotationProfile } from 'components/page/domestic/quotation/quotationProfile';

// global gear
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { useGetContract_id } from 'js/api/api_quotation';

// css
import scss from 'pages/domestic/quotationList/quotation/quotation.module.scss';

// ===========================================================================
export default function AttachContract() {
  const router = useRouter();
  const contractId = router.query.contractId as string | undefined;

  // ----------------------------------------------------
  const { data, update } = useGetContract_id(contractId);
  useEffect(() => {
    update();
  }, [contractId]);

  console.log(data);

  // const profile: TquotationProfile = {
  //   id: '',
  //   quotationNumber: '',
  //   quotationDate: '',
  //   validityPeriod: '',
  //   projectName: '',
  //   county: '',
  //   district: '',
  //   address: '',
  //   contactPerson: '',
  //   contactNumber: '',
  //   customer: '',
  //   trackProgress: '',
  //   projectProgress: '',
  // };

  // ------------------------------------------------------------------

  const tagList: TtagList = [
    {
      label: `合約編號 ${'foo'}`,
      onClick: () => {},
    },
  ];

  const uploadPanel: TpanelList[number] = {
    type: 'myButton',
    label: '上傳',
    onClick: async () => {
      //
      try {
        showRootLoading(true);
      } catch (error) {
        myAlert.err({ title: '上傳失敗' });
      } finally {
        showRootLoading(false);
      }
      //
    },
  };

  const panel: TpanelList = [
    //
    {
      type: 'redButton',
      label: '上傳',
      onClick: async () => {
        //
        try {
          showRootLoading(true);
        } catch (error) {
          myAlert.err({ title: '上傳失敗' });
        } finally {
          showRootLoading(false);
        }
        //
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        //
        // router.back();
        router.push({
          pathname: '/domestic/legacyContractIntegration/quotation',
          query: {
            contractId: contractId,
          },
        });
      },
    },
  ];

  // ==========================================================================
  return (
    <SubLayer>
      <PageHeader02 tagList={tagList} panelList={panel} />
      <div>
        <div className={scss.quotation}>
          {/*  */}
          <QuotationProfile profile={data?.content} disabled={true} onProfileChange={() => {}} />
          {/*  */}
          <div className={classNames(scss.switchBar)}>
            <div>合約項目</div>
          </div>
          {/*  */}

          {/*  */}
        </div>
      </div>
    </SubLayer>
  );
}
