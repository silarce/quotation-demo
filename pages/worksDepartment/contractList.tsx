// option
import { optionsCreator_county } from 'js/utils/options/countryAndDistrict';

import ContractList_forDepartment from 'components/wholePage/contractList_forDepartment';

// ===========================================

const optionsCounty = optionsCreator_county();
optionsCounty.unshift({ value: '', label: '不拘' });
// ===========================================

export default function ContractList() {
  return <ContractList_forDepartment targetUrl="/worksDepartment/contractList/contract/workContactDoc" />;
}
