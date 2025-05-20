import Router from 'next/router';

import { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// globalState
import { useUrlHistory } from 'hooks/globalState/useUrlHistory';

const usePanel_returnWorksDepartmentContractList = () => {
  const history_contractList = useUrlHistory((state) => state.contractList);

  if (!history_contractList.pathname) {
    history_contractList.pathname = '/worksDepartment/contractList';
    history_contractList.query = undefined;
  }

  return [
    {
      type: 'myButton',
      label: '返回合約列表',
      onClick: () => {
        Router.push(history_contractList);
      },
    },
  ] as TpanelList;
};

export { usePanel_returnWorksDepartmentContractList };
