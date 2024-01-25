import { useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

import scss from './edit.module.scss';

// ====================================================================

type Tquery = {
  id: string | undefined;
};

// ====================================================================
export default function Edit() {
  const router = useRouter();
  const { id } = router.query as Tquery;

  // ---------------------------------------------------------------------------

  const [disabled, setDisabled] = useState(false);

  // ---------------------------------------------------------------------------
  const panelList_disabled: TpanelList = [
    {
      type: 'redButton',
      label: '刪除',
      onClick: () => {
        alert('test');
      },
    },
    {
      type: 'myButton',
      label: '回簽',
      onClick: () => {
        alert('test');
      },
    },
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
        router.back();
      },
    },
  ];

  const panelList02_abled: TpanelList = [
    {
      type: 'redButton',
      label: '確認',
      onClick: () => {
        alert('test');
      },
    },
    {
      type: 'myButton',
      label: `${!!id ? '取消' : '返回'}`,
      onClick: () => {
        if (!!id) {
          setDisabled(true);
        } else {
          router.back();
        }
      },
    },
  ];

  const panelList = disabled ? panelList_disabled : panelList02_abled;

  // ---------------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader contractNumber={'foooo'} panelList={panelList} />

      <div>
        <div></div>
      </div>
    </SubLayer>
  );
}
