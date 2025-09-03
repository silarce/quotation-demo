import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';
import classNames from 'classnames';

// components
import Discount from 'components/page/accounting/invoiceList/discount';
import InvoiceInfo, { Tstate_invoiceInfo } from 'components/page/accounting/invoiceList/invoiceInfo';

// gear
import Table_antd, { TableProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { modal_empty, modal_delete } from 'components/global/gear/modal/fongModal';
import Selector_invoiceBook from 'components/composition/selectorModal/selector_invoiceBook';
import Selector_paymentRequest_invoice, {
  TpaymentRequestInvoiceList_Dto,
} from 'components/composition/selectorModal/selector_paymentRequestInvoice';

//  api
import { TaccountantInvoiceBookDto, apiGetAccountantInvoiceBook } from 'js/api/api_accountant';
import {
  Tinvoice_Dto,
  Tbody_insertInvoiceDiscount,
  useApiGetInvoiceNumberLists,
  apiUpdateInvoiceStatus,
  apiInsertInvoiceDiscount,
} from 'js/api/api_netCore/api_invoice';
import { Tbody_updatePRInvoice, apiUpdatePRInvoice } from 'js/api/api_netCore/api_accountsReceivable';

import { useGlobal_userInfo } from 'hooks/globalState/useGlobal_userInfo';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// ==========================================================================

interface Tquery {
  id?: string;
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

  const handle_issueInvoice = async (invoice: Tinvoice_Dto) => {
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

  const handle_discount = (invoiceNumber: string) => {
    const { destroy } = modal_empty({
      content: (
        <Discount
          onCancel={() => {
            destroy();
          }}
          onConfirm={async (state) => {
            if (!userIdNumber) {
              myAlert.info({ title: '沒有使用者idNumber' });

              return;
            }

            const { date, amount, note } = state;

            if (!date) {
              myAlert.info({ title: '請輸入折讓日期' });

              return;
            }

            const body: Tbody_insertInvoiceDiscount = {
              createdAt: new Date().toISOString(),
              createdBy: userIdNumber,
              invoiceNumber,
              discountDate: date.toISOString(),
              memo: note,
              invoiceBookId: state_invoiceBook!.id,
              discountAmount: Number(amount || 0),
            };

            try {
              await apiInsertInvoiceDiscount(body);
              await update_invoiceArr();
            } catch (error) {}

            destroy();
          }}
        />
      ),
    });
  };

  // ----------------------------------------------------------------------------

  const columns = createColumn({
    handle_searchPaymentRequest: handle_issueInvoice,
    handle_banInvoice,
    handle_discount,
  });

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
      content: (
        <InvoiceInfo
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

// MARK: createColumn
const createColumn = ({
  handle_searchPaymentRequest,
  handle_banInvoice,
  handle_discount,
}: {
  handle_searchPaymentRequest: (invoice: Tinvoice_Dto) => void;
  handle_banInvoice: (invoiceNumber: string) => void;
  handle_discount: (invoiceNumber: string) => void;
}) => {
  const columns: TableProps<Tinvoice_Dto>['columns'] = [
    {
      title: '開立日期',
      dataIndex: 'invoiceDate',
      width: 100,
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
      width: 110,
      align: 'right',
      render: (text) => '$' + text?.toLocaleString(),
    },
    {
      title: '稅金',
      dataIndex: 'invoiceTaxes',
      width: 110,
      align: 'right',
      render: (text) => '$' + text?.toLocaleString(),
    },
    {
      title: '發票金額',
      dataIndex: 'totalAmount',
      width: 110,
      align: 'right',
      render: (text) => '$' + text?.toLocaleString(),
    },

    {
      title: '發票號碼',
      dataIndex: 'fullInvoiceNumber',
      width: 120,
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
              <Btn
                theme="coinChange"
                onClick={() => {
                  handle_discount(fullInvoiceNumber);
                }}
              >
                折讓
              </Btn>
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

  return columns;
};
