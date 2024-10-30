import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

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
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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

  const [disabled, setDisabled] = useState(true);

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

  const reqPostAddAccountPayableStatistics = async () => {
    const date = moment(`${year}-${month}`).format('YYYY-MM-DD');
    const note = '';
    const account_payable_uuids = Object.keys(checkedRaw);

    if (account_payable_uuids.length === 0) {
      myAlert.info({ title: '請選擇應付帳款' });
    }

    return await apiPostAddAccountPayableStatistics({
      date,
      note,
      account_payable_uuids,
    });
  };

  // ----------------------------------------------------------------
  // MARK: HANDLE

  const handleAddAccountPayableStatistics = async () => {
    await reqPostAddAccountPayableStatistics().then(() => {
      setDisabled(true);
    });
  };

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
      // note,
      // agent_employee_id,
      // invoice_title,
      // invoice_date,
      invoice_number,
      invoice_price,
      // payment_account,
      // payment_account_uuid,
      payment_status,
      // payment_order_uuid,
      // payment_order_serial_number,
      // purchase_invoice_uuid,
      // supplier_uuid,
      // transaction_date,
      // source_number,
      // settled_amount,
      // balance,
      // supplier,
    } = raw;

    const props: Parameters<typeof Row_tbody>[0] = {
      disabled,
      //
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

  useEffect(() => {
    setCheckedRaw({});
  }, [raw_accountPayable, disabled]);

  // ----------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02
        tag="應付帳款明細表"
        customeLeft={[<SearchSwitch className="ml-2" key="0" />]}
        panelList={createPanel({ disabled, setDisabled, onAddClick: handleAddAccountPayableStatistics })}
      />

      <div>
        <Spin spinning={false} delay={300}>
          <Row_thead disabled={disabled} checked={isAllChecked} onCheckChange={handleCheckAllChange} />

          {raw_accountPayable?.map((raw) => {
            // disabled包含在createProps裏面了
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

// MARK:createPanel

const createPanel = ({
  disabled,
  setDisabled,
  onAddClick,
}: {
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  onAddClick: () => void;
}) => {
  const panel1: TpanelList[number] = {
    type: 'myButton',
    label: '勾選並產生當月應付帳款統計表',
    onClick: () => {
      setDisabled(false);
    },
  };

  const panel2: TpanelList[number] = {
    type: 'myButton',
    label: '查看當月應付帳款統計表',
    onClick: () => {},
  };

  const panel3: TpanelList[number] = {
    type: 'myButton',
    label: '取消',
    onClick: () => {
      setDisabled(true);
    },
  };

  const panel4: TpanelList[number] = {
    type: 'redButton',
    label: '確認產生當月應付帳款統計表',
    onClick: onAddClick,
  };

  const panelList: TpanelList = disabled ? [panel1, panel2] : [panel3, panel4];

  return panelList;
};

// ==========================================================================
