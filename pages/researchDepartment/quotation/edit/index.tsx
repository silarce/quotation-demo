import useRouter from 'next/router';

import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

import Profile from 'components/page/researchDepartment/quotation/profile';

export default function Edit() {
  return (
    <SubLayer>
      <PageHeader02 tag="新增報價單" />
      <div>
        <Profile />
      </div>
    </SubLayer>
  );
}
