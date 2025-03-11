import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

import WorkContactDoc_component, {
  TimperativeHandle,
  TonStateChange,
  Tprofile,
  TshouldPatternList,
  TstateContact,
} from 'components/page/worksDepartment/contracList/contract/workContactDoc/workContactDoc_component';

export default function CreateWorkContactDoc() {
  const router = useRouter();

  const ref = useRef<TimperativeHandle>(null!);

  const panelList: TpanelList = [
    {
      type: 'myButton',
      label: '上傳',
      onClick: () => {},
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => router.back(),
    },
  ];

  useEffect(() => {
    ref.current.setDisabled(false);
  }, []);

  return (
    <SubLayer>
      <PageHeader02 panelList={panelList} />

      <div>
        <WorkContactDoc_component
          //
          ref={ref}
          contract={undefined}
          engineeringContactId={undefined}
        />
      </div>
    </SubLayer>
  );
}
