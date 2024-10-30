import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

// antd
import { Spin } from 'antd';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import SearchSwitch from 'components/page/accounting/accountsPayableDetailList/SearchSwitch';
import { Row_thead, Row_tbody } from 'components/page/accounting/accountsPayableDetailList/Table';

// gear

import { useYearMonth_options } from 'js/utils/helpers/hook/useYearMonth';

import {
  Taccount_payable_Dto,
  //
  useGetAccountPayableBySupplierId,
  useGetAccountPayableBy,
  useGetAccountPayableStatisticsByIdOrDate,
  useGetAccountPayableStatisticsDetailByStatisticsId,
  apiPostAddAccountPayableStatistics,
  apiPatchUpdateAccountPayableStatisticsById,
  apiDeleteAccountPayableStatisticsById,
} from 'js/api/api_netCore/api_accountant';

// ================================================================================
type Tquery = {
  year?: string;
  month?: string;
  invoiceNumber?: string;
  searchType: 'date' | 'invoice';
};

type TcheckedRaw = {
  [id: string]: Taccount_payable_Dto;
};

// ================================================================================

// MARK: START
export default function AccountsPayableDetailList() {
  const router = useRouter();
  const query = router.query as Tquery;

  const { thisYear, thisMonth } = useYearMonth_options();
  const {
    //
    year,
    month,
    invoiceNumber,
    searchType = 'date',
  } = query;

  // ----------------------------------------------------------------
  // MARK: DATA

  const params = useMemo(() => {
    let params: Parameters<typeof useGetAccountPayableBy>[0] = undefined;

    if (searchType === 'date' && year && month) {
      params = {
        dateForUnpaid: {
          date: `${year}-${month}`,
        },
      };
    } else if (searchType === 'invoice' && invoiceNumber) {
      params = {
        invoiceNumber: {
          invoice_number: invoiceNumber,
        },
      };
    }

    return params;
  }, [year, month, invoiceNumber, searchType]);

  const { raw: raw_accountPayable } = useGetAccountPayableBy(params, { autoUpdate: true });

  // ----------------------------------------------------------------
  // MARK: STATE

  const [checkedRaw, setCheckedRaw] = useState<TcheckedRaw>({});

  const isAllChecked = useMemo(() => {
    let checked = Object.keys(checkedRaw).length === raw_accountPayable?.length;

    if (checked) {
      checked = !!raw_accountPayable?.every((raw) => !!checkedRaw[raw.id]);
    }

    return checked;
  }, [checkedRaw, raw_accountPayable]);

  // ----------------------------------------------------------------
  // MARK: API
  // ----------------------------------------------------------------
  // MARK: HANDLE

  const handleCheckAllChange = (checked: boolean) => {
    if (checked) {
      const rawDict: TcheckedRaw = {};
      raw_accountPayable?.forEach((raw) => {
        rawDict[raw.id] = raw;
      });

      setCheckedRaw(rawDict);
    } else {
      setCheckedRaw({});
    }
  };

  const handleCheck = (checked: boolean, id: string, raw: Taccount_payable_Dto) => {
    setCheckedRaw((prev) => {
      let copy = { ...prev };

      if (checked) {
        copy[id] = raw;
      } else {
        const { [id]: removed, ...restCopy } = copy;
        copy = restCopy;
      }

      return copy;
    });
  };

  const createProps = (raw: Taccount_payable_Dto) => {
    const {
      id,
      serial_number,
      review_status,
      note,
      agent_employee_id,
      invoice_title,
      invoice_date,
      invoice_number,
      invoice_price,
      payment_account,
      payment_account_uuid,
      payment_status,
      payment_order_uuid,
      payment_order_serial_number,
      purchase_invoice_uuid,
      supplier_uuid,
      transaction_date,
      source_number,
      settled_amount,
      balance,
      supplier,
    } = raw;

    const props: Parameters<typeof Row_tbody>[0] = {
      serial_number,
      廠商編號: 'no property',
      發票廠商: 'no property',
      invoice_price: invoice_price ? invoice_price.toLocaleString() : invoice_price,
      票期日: 'no property',
      付款帳號: 'no property',
      支付方式: 'no property',
      支票號碼: 'no property',
      invoice_number,
      payment_status,
      review_status,
      checked: !!checkedRaw[id],
      onCheck: (checked) => {
        handleCheck(checked, id, raw);
      },
    };

    return props;
  };

  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // MARK: useEffect
  useEffect(() => {
    if (!query.year || !query.month) {
      router.replace({
        query: {
          ...query,
          year: thisYear.toString(),
          month: thisMonth.toString(),
        },
      });
    }
  }, []);

  // ----------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02
        tag="應付帳款明細表"
        customeLeft={[<SearchSwitch className="ml-2" key="0" />]}
        panelList={createPanel()}
      />

      <div>
        <Spin spinning={false} delay={300}>
          <Row_thead checked={isAllChecked} onCheckChange={handleCheckAllChange} />

          {raw_accountPayable?.map((raw) => {
            const props: Parameters<typeof Row_tbody>[0] = createProps(raw);

            return <Row_tbody key={raw.id} {...props} />;
          })}
        </Spin>
      </div>
    </SubLayer>
  );
}
// MARK: END

// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================

// ==============================================================================

const createPanel = () => {
  const panelList: TpanelList = [
    {
      type: 'myButton',
      label: '產生當月應付帳款統計表',
      onClick: () => {},
    },
    {
      type: 'myButton',
      label: '查看當月應付帳款統計表',
      onClick: () => {},
    },
  ];

  return panelList;
};

// ==========================================================================
