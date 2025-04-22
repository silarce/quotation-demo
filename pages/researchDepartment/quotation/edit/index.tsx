import useRouter from 'next/router';

import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

export default function Edit() {
  return (
    <SubLayer>
      <PageHeader02 tag="新增報價單" />
      <div>喵喵</div>
    </SubLayer>
  );
}
