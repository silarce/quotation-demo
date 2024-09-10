import { useRouter } from 'next/router';

import AccountReceivable from 'pages/worksDepartment/contractList/contract/accountReceivable';

type Tquery = {
  contractId: string | undefined;
};

export default function AccountReceivable_readonly() {
  const router = useRouter();
  const { contractId } = router.query as Tquery;

  return <AccountReceivable contractId={contractId} readonly={true} showSubPageHeader={false} />;
}
