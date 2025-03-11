import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

import WorkContactDoc_component, {
  TimperativeHandle,
} from 'components/page/worksDepartment/contracList/contract/workContactDoc/workContactDoc_component';

export default function CreateWorkContactDoc() {
  const router = useRouter();

  const ref = useRef<TimperativeHandle>(null!);

  const panelList: TpanelList = [
    {
      type: 'myButton',
      label: '建立',
      onClick: () => {
        // w 用這個api建立的工程聯絡單，會建立一個contract並把工程聯絡單放在該contract下
        ref.current.reqPost();
      },
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
      <PageHeader02 tag="新建工程聯絡單(無合約)" panelList={panelList} />

      <div>
        <WorkContactDoc_component
          //
          ref={ref}
          contract={undefined}
          engineeringContactId={undefined}
          showProd={false}
          showPatternPanel={false}
        />
      </div>
    </SubLayer>
  );
}
