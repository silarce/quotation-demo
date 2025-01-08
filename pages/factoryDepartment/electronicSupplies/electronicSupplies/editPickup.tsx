import { useRouter } from 'next/router';

import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

import EditElectronicSuppliesPickup from 'components/wholePage/editElectronicSuppliesPickup';

export default function EditPickUp() {
  const router = useRouter();

  const panelList: TpanelList = [
    {
      label: '返回',
      type: 'myButton',
      onClick: () => router.back(),
    },
  ];

  return (
    <EditElectronicSuppliesPickup
      CustomPageHeader={() => <PageHeader02 tag="送電備品領取單" panelList={panelList} />}
    />
  );
}
