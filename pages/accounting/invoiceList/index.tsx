import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Dayjs } from 'dayjs';
import Decimal from 'decimal.js';

import classNames from 'classnames';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { DataEntry_fong, Input, DatePicker } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { Container_confirm } from 'components/global/container/modal';

import { modal_empty, modal_delete } from 'components/global/gear/modal/fongModal';

import Selector_invoiceBook from 'components/composition/selectorModal/selector_invoiceBook';
import Selector_paymentRequest_invoice, {
  TpaymentRequestInvoiceList_Dto,
} from 'components/composition/selectorModal/selector_paymentRequestInvoice';

//  api
import { TaccountantInvoiceBookDto, apiGetAccountantInvoiceBook } from 'js/api/api_accountant';
import { Tinvoice_Dto, useApiGetInvoiceNumberLists, apiUpdateInvoiceStatus } from 'js/api/api_netCore/api_invoice';
import { Tbody_updatePRInvoice, apiUpdatePRInvoice } from 'js/api/api_netCore/api_accountsReceivable';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import { useGlobal_userInfo } from 'hooks/globalState/useGlobal_userInfo';

// ==========================================================================

interface Tquery {
  id?: string;
}

interface Tstate_invoiceInfo {
  invoiceDate: Dayjs | null;
  invoiceAmount: `${number}` | '';
}

// ==========================================================================

// MARK: START

export default function InvoiceList() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { id: invoiceBookId } = query;

  const { userInfo } = useGlobal_userInfo();
  const userIdNumber = userInfo?.employee?.idNumber;

  const [state_invoiceBook, setState_invoiceBook] = useState<TaccountantInvoiceBookDto>();

  const invoiceBookDesc = state_invoiceBook && getInvoiceBookDesc(state_invoiceBook);

  const {
    data: raw_invoiceArr,
    update: update_invoiceArr,
    clear: clear_invoiceArr,
  } = useApiGetInvoiceNumberLists(state_invoiceBook?.id);

  // ----------------------------------------------------------------------------

  const reqPatchBanInvoice = async (invoiceNumber: string) => {
    if (!userIdNumber) {
      myAlert.info({ title: '沒有使用者idNumber' });

      return;
    }

    const now = new Date().toISOString();

    const body = {
      invoiceNumber,
      status: 9, // 作廢
      updatedBy: userIdNumber,
      updatedAt: now,
    };

    try {
      await apiUpdateInvoiceStatus(body);
      await update_invoiceArr();
    } catch (error) {}
  };

  // ----------------------------------------------------------------------------

  const handle_searchInvoiceBood = () => {
    const { destroy } = modal_empty({
      content: (
        <Selector_invoiceBook
          onCancel={() => destroy()}
          onConfirm={(invoiceBook) => {
            if (invoiceBook) {
              setState_invoiceBook(invoiceBook);
              clear_invoiceArr();
            }

            if (invoiceBook?.id) {
              router.replace({
                query: {
                  ...query,
                  id: invoiceBook.id,
                },
              });
            }

            destroy();
          }}
        />
      ),
    });
  };

  const handle_searchPaymentRequest = async (invoice: Tinvoice_Dto) => {
    if (!state_invoiceBook) {
      return;
    }

    const paymentRequest = await getPaymentRequest();
    const invoiceInfo = await getInvoiceInfo(invoice.fullInvoiceNumber, paymentRequest);

    if (!paymentRequest.id) {
      return;
    }

    let errorMessage = '';

    if (!invoiceInfo.invoiceDate) {
      errorMessage = '請輸入發票日期';
    } else if (!invoiceInfo.invoiceDate) {
      errorMessage = '請設定日期';
    }

    if (errorMessage) {
      myAlert.info({
        title: errorMessage,
      });

      return;
    }

    const totalAmount = Number(invoiceInfo.invoiceAmount);
    const amount = new Decimal(totalAmount).div(1.05).toNumber();
    const taxes = new Decimal(totalAmount).minus(amount).toNumber();

    const body: Tbody_updatePRInvoice = {
      paymentRequestId: paymentRequest.id,
      invoice: {
        invoiceDate: invoiceInfo.invoiceDate!.toISOString(),
        invoiceNumber: invoice.fullInvoiceNumber,
        buyer: paymentRequest.customerName || '',

        amount,
        taxes,
        totalAmount: Number(invoiceInfo.invoiceAmount),

        taxId: paymentRequest.taxId || '',
        taxAddress: null,
        remark: null,

        invoiceBookId: state_invoiceBook.id,
        period: `${state_invoiceBook.period}`,
      },
    };

    await apiUpdatePRInvoice(body);
    update_invoiceArr();
  };

  const handle_banInvoice = (invoiceNumber: string) => {
    modal_delete({
      title: '確定作廢發票?',
      content: '作廢後將無法復原',
      onConfirm: () => {
        reqPatchBanInvoice(invoiceNumber);
      },
    });
  };

  // ----------------------------------------------------------------------------

  const columns: TableProps<Tinvoice_Dto>['columns'] = [
    {
      title: '開立日期',
      dataIndex: 'invoiceDate',
      width: 120,
      render: (text) => getTaiwanDateStr(text),
    },

    {
      title: '報價編號',
      dataIndex: 'quotationNumber',
      width: 120,
      render: (text, record) => {
        return record.quotationNumber as string;
      },
    },
    {
      title: '合約編號',
      dataIndex: 'contractNumber',
      width: 120,
    },
    {
      title: '專案名稱',
      dataIndex: 'projectName',
    },
    {
      title: '買受人',
      dataIndex: 'buyer',
      width: 300,
    },
    {
      title: '未稅金額',
      dataIndex: 'invoiceAmount',
      width: 150,
      align: 'right',
      render: (text) => '$' + text?.toLocaleString(),
    },
    {
      title: '稅金',
      dataIndex: 'invoiceTaxes',
      width: 150,
      align: 'right',
      render: (text) => '$' + text?.toLocaleString(),
    },
    {
      title: '發票金額',
      dataIndex: 'totalAmount',
      width: 150,
      align: 'right',
      render: (text) => '$' + text?.toLocaleString(),
    },

    {
      title: '發票號碼',
      dataIndex: 'fullInvoiceNumber',
      width: 150,
    },
    {
      key: 'panel',
      width: 220,
      align: 'center',
      render: (_, record) => {
        const { buyer, taxId, projectName, invoiceAmount, invoiceTaxes, totalAmount, fullInvoiceNumber } = record;
        const isInvoiced = buyer || taxId || projectName || invoiceAmount || invoiceTaxes || totalAmount;

        if (isInvoiced) {
          return (
            <div className="flex gap-4">
              <Btn theme="coinChange">折讓</Btn>
              <Btn icon="ban" themeColor="red_I" onClick={() => handle_banInvoice(fullInvoiceNumber)}>
                作廢
              </Btn>
            </div>
          );
        }

        return (
          <Btn
            onClick={async () => {
              handle_searchPaymentRequest(record);
            }}
          >
            開立
          </Btn>
        );
      },
    },
  ];

  // ----------------------------------------------------------------------------

  useEffect(() => {
    (async () => {
      if (!invoiceBookId) {
        return;
      }

      await apiGetAccountantInvoiceBook({
        filter: {
          id: { $eq: invoiceBookId },
        },
      })
        .then(({ data: invoiceBookArr }) => {
          setState_invoiceBook(invoiceBookArr[0]);
        })
        .catch(() => {
          myAlert.notify.error({ message: '取得發票本失敗' });
        });
    })();
  }, []);

  // ----------------------------------------------------------------------------

  // MARK: RENDER

  return (
    <div>
      <div className={'pageTop flex justify-between'}>
        <div className={classNames('flex gap-4 items-center')}>
          <div className="text-base font-semibold">發票列表</div>

          <span className="w-[150px]">{invoiceBookDesc}</span>

          <Btn theme="query" onClick={handle_searchInvoiceBood}>
            選擇發票本
          </Btn>
        </div>
      </div>
      <Table_antd
        rowKey={'fullInvoiceNumber'}
        dataSource={raw_invoiceArr || undefined}
        columns={columns}
        pagination={false}
        scroll={{ y: 600 }}
        rowClassName={'h-[60px]'}
      />
    </div>
  );
}

// MARK: END

const getInvoiceBookDesc = (invoiceBook: TaccountantInvoiceBookDto) => {
  const { year, month, period, alphabeticLetter } = invoiceBook;

  const twYear = Number(year) - 1911;

  const monthRanve = `${month}-${Number(month) + 1}`;

  return `${twYear}年 ${monthRanve} ${alphabeticLetter} 第${period}期`;
};

const getPaymentRequest = async () => {
  return new Promise<TpaymentRequestInvoiceList_Dto>((resolve, reject) => {
    const { destroy } = modal_empty({
      content: (
        <Selector_paymentRequest_invoice
          onCancel={() => {
            reject();
            destroy();
          }}
          onConfirm={async (paymentRequest) => {
            if (paymentRequest) {
              resolve(paymentRequest);
            } else {
              reject();
            }

            destroy();
          }}
        />
      ),
    });
  });
};

const getInvoiceInfo = (invoiceNumber: string, paymentRequest: TpaymentRequestInvoiceList_Dto) => {
  return new Promise<Tstate_invoiceInfo>((resolve, reject) => {
    const { destroy } = modal_empty({
      width: 600,
      content: (
        <InputInvoiceInfo
          invoiceNumber={invoiceNumber}
          paymentRequest={paymentRequest}
          onConfirm={(invoiceInfo) => {
            resolve(invoiceInfo);
            destroy();
          }}
          onCancel={() => {
            reject();
            destroy();
          }}
        />
      ),
    });
  });
};

// ===========================================================================

const InputInvoiceInfo = ({
  invoiceNumber,
  paymentRequest,
  onConfirm,
  onCancel,
}: {
  invoiceNumber: string;
  paymentRequest: TpaymentRequestInvoiceList_Dto;
  onConfirm: (params: Tstate_invoiceInfo) => void;
  onCancel: () => void;
}) => {
  const [state, setState] = useState<Tstate_invoiceInfo>({
    invoiceDate: null,
    invoiceAmount: '',
  });

  const handle_confirm = () => {
    onConfirm(state);
  };

  return (
    <Container_confirm
      title="發票資訊"
      footerRight={
        <>
          <Btn onClick={onCancel} themeColor="red_I">
            取消
          </Btn>
          <Btn onClick={handle_confirm}>確認</Btn>
        </>
      }
    >
      <div className="grid gap-4">
        <DataEntry_fong caption="案場名稱" disabled={true}>
          {paymentRequest.constructionSite}
        </DataEntry_fong>

        <DataEntry_fong caption="請款期數" disabled={true}>
          {paymentRequest.period}
        </DataEntry_fong>

        <DataEntry_fong caption="請款類型" disabled={true}>
          {paymentRequest.type}
        </DataEntry_fong>

        <DataEntry_fong caption="請款金額" disabled={true}>
          {paymentRequest.paymentAmount}
        </DataEntry_fong>

        <DataEntry_fong caption="發票號碼" disabled={true}>
          {invoiceNumber}
        </DataEntry_fong>

        <DataEntry_fong caption="發票日期">
          <DatePicker value={state.invoiceDate} onChange={(date) => setState({ ...state, invoiceDate: date })} />
        </DataEntry_fong>

        <DataEntry_fong caption="發票金額">
          <Input
            type="number"
            value={state.invoiceAmount}
            onChange={(e) => setState({ ...state, invoiceAmount: e.target.value as `${number}` | '' })}
          />
        </DataEntry_fong>
      </div>
    </Container_confirm>
  );
};
