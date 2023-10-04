// 舊合約
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextRouter } from 'next/router';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
// global gear
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

export default function AttachContract() {
  const router = useRouter();
  const contractId = router.query.contractId as string | undefined;

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

  return (
    <SubLayer>
      <PageHeader02 tagList={tagList} panelList={panel} />
      <div>foooooo</div>
      <div></div>
      <div></div>
    </SubLayer>
  );
}
