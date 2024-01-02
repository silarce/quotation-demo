import { useEffect } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import EditCustomer from 'components/page/domestic/customer/editCustomer/editCustomer';

// global gear
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { setRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

// api
import { apiPostCustomers, useApiCustomersNameExist, useApiCustomersNumberExist } from 'js/api/api_customer';

// hook
import { useClassCustomer } from 'hooks/customer/useCustomer';
import { ConsoleSqlOutlined } from '@ant-design/icons';

// ====================================================

type Tquery = {
  reDeirectorToEdit: string | undefined;
};

// ====================================================
// 防抖
let timeoutId_check: NodeJS.Timeout;
let timeoutId_checkCustomerNumber: NodeJS.Timeout;

// ====================================================
export default function Add() {
  const router = useRouter();
  const { reDeirectorToEdit } = router.query as Tquery;
  // ------------------------------------------------------
  const classCustomer = useClassCustomer();

  // ------------------------------------------------------
  // 檢查客戶全稱不重複
  const {
    check: nameCheck,
    setCheck: SetNameCheck,
    reCheck: reNameCheck,
  } = useApiCustomersNameExist(classCustomer.name);

  const {
    check: customerNumberCheck,
    setCheck: setCustomerNumberCheck,
    reCheck: reCustomerNumberCheck,
  } = useApiCustomersNumberExist(classCustomer.customerNumber);

  useEffect(() => {
    SetNameCheck('loading');
    clearTimeout(timeoutId_check);
    timeoutId_check = setTimeout(() => {
      if (!classCustomer.name) {
        return SetNameCheck('notOk');
      }

      reNameCheck();
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classCustomer.name]);

  useEffect(() => {
    setCustomerNumberCheck('loading');
    clearTimeout(timeoutId_checkCustomerNumber);
    timeoutId_checkCustomerNumber = setTimeout(() => {
      if (!classCustomer.customerNumber) {
        return setCustomerNumberCheck('notOk');
      }

      reCustomerNumberCheck();
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classCustomer.customerNumber]);

  // ------------------------------------------------------

  const panelList: TpanelList = [
    {
      type: 'redButton',
      label: '上傳',
      onClick: async () => {
        if (nameCheck === 'notOk') {
          if (classCustomer.name) {
            return myAlert.err({ title: '客戶全稱已被使用' });
          } else {
            return myAlert.err({ title: '請輸入客戶全稱' });
          }
        }

        if (nameCheck === 'loading') {
          return myAlert.info({ title: '正在檢查客戶全稱' });
        }

        if (customerNumberCheck === 'notOk') {
          if (classCustomer.customerNumber) {
            return myAlert.err({ title: '客戶編號已被使用' });
          } else {
            return myAlert.err({ title: '請輸入客戶編號' });
          }
        }

        if (customerNumberCheck === 'loading') {
          return myAlert.info({ title: '正在檢查客戶編號' });
        }

        const postBody = classCustomer.postBody;

        try {
          setRootLoading(true);
          const res = await apiPostCustomers(postBody);
          myAlert.success({ title: '新增客戶資料完成' });

          if (reDeirectorToEdit === 'true') {
            router.push({
              pathname: '/domestic/customer/edit',
              query: {
                id: res.id,
              },
            });
          } else {
            router.push({
              pathname: '/domestic/customer',
            });
          }
        } catch {
          myAlert.err({ title: '新增客戶資料失敗' });
        } finally {
          setRootLoading(false);
        }
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        router.back();
      },
    },
  ];

  return (
    <SubLayer>
      <PageHeader02 tag="客戶列表" panelList={panelList} />
      <div>
        <EditCustomer classCustomer={classCustomer} nameCheck={nameCheck} customerNumberCheck={customerNumberCheck} />
      </div>
    </SubLayer>
  );
}
