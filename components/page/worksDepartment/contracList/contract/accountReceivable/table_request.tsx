import { useState, useEffect } from 'react';
import classNames from 'classnames';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import InputSel, { TinputSelProps, TcheckboxProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import TwoButtonModal_free, { TwoBtnFooter } from 'components/global/gear/modal/simpleModal/twoButtonModal_free';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  TcreateAccountReceivableInvoiceDto,
  TaccountsReceivableInvoiceDto,
  TupdateEngineeringContactDto,
  TupdateAccountReceivableDto,
  TaccountReceivableDto,
  useGetEngineeringContact,
  apiPatchEngineeringContact,
  apiPostWorkSheet,
  useGetFinalProduct,
  useGetAccountReceivable_id,
  apiPatchAccountReceivable,
  useGetAccountReceivableAccountants,
  apiPostAccountReceivableAccountant,
  apiDeleteAccountReceivableAccountant,
  apiPostAccountReceivableIncoice,
} from 'js/api/api_engineering';
import { TquotationProductDto, useGetContract_id_noItems } from 'js/api/api_quotation';
import { TaccountantDto } from 'js/api/api_accountant';
import { TaccountsReceivableDeductionDto } from 'js/api/dtoTypes';

// css
import scss from './table_request.module.scss';

// =================================================
export default function Table_request({
  contractId,
  accountReceivableId,
  invoiceArr,
  onInvoiceAdd,
}: {
  contractId: string | undefined;
  accountReceivableId: string | undefined;
  invoiceArr: TaccountsReceivableInvoiceDto[] | undefined;
  onInvoiceAdd?: (invoice: TaccountsReceivableInvoiceDto) => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState<boolean>(false);

  // ---------------------------------------------------------

  const { data: data_finalProduct, update: update_finalProduct } = useGetFinalProduct(contractId);

  // const {} = useGetAccountReceivable_id();

  useEffect(() => {
    (async () => {
      const res = await update_finalProduct();
      // console.log(res);
    })();
  }, [contractId]);

  // ---------------------------------------------------------

  /**新增發票 */
  const reqPostAccountReceivableIncoice = async (body: TcreateAccountReceivableInvoiceDto) => {
    if (!accountReceivableId || isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiPostAccountReceivableIncoice(accountReceivableId, body);
      setShowAddInvoiceModal(false);
      onInvoiceAdd?.(res);
    } catch (error) {
      const err = error as Error;
      myAlert.err({
        title: '新增發票失敗',
        content: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------
  const control = {
    onAddClick: () => {
      setShowAddInvoiceModal(true);
    },
  };

  // ---------------------------------------------------------
  return (
    <>
      <View control={control} />
      {/*  */}
      <TwoButtonModal_free
        //
        title="請輸入新增發票"
        visible={showAddInvoiceModal}
        onCancel={() => setShowAddInvoiceModal(false)}
        modalProps={{
          width: 400,
          footer: null,
        }}
      >
        <form
          className={classNames()}
          onSubmit={async (e) => {
            e.preventDefault();
            const target = e.target as HTMLFormElement;
            const invoiceDate = (target[0] as HTMLInputElement).value;
            const invoiceNumber = (target[1] as HTMLInputElement).value;
            const price = Number((target[2] as HTMLInputElement).value);
            const note = (target[3] as HTMLInputElement).value;

            reqPostAccountReceivableIncoice({
              invoiceDate,
              invoiceNumber,
              price,
              note,
            });
          }}
        >
          <div className={scss.addInvoiceModal}>
            <label>
              <InputSel caption="發票日期" datePickerProps={{}} showBaseline="invisible" />
            </label>
            <label>
              <InputSel caption="發票號碼" inputProps={{}} showBaseline="invisible" />
            </label>
            <label>
              <InputSel caption="發票金額" inputProps={{ props: { type: 'number' } }} showBaseline="invisible" />
            </label>
            <label>
              <InputSel caption="發票備註" inputProps={{}} showBaseline="invisible" />
            </label>
          </div>

          <TwoBtnFooter
            onConfirm={() => {}}
            onCancel={(e) => {
              e.preventDefault();
              setShowAddInvoiceModal(false);
            }}
          />
        </form>
      </TwoButtonModal_free>
    </>
  );
}

// =================================================

type Tcontrol = {
  onAddClick: () => void;
};

const View = ({ control }: { control: Tcontrol }) => {
  const { onAddClick } = control;

  return (
    <div className={scss.container}>
      <div className={scss.wrapper}>
        <div className={scss.top}>
          <div></div>
          <div>
            <MyButton_v2 label="新增發票、期數" preImg="add" onClick={onAddClick} />
          </div>
        </div>
        {/*  */}
        <div className={scss.main}></div>
        {/*  */}
      </div>
    </div>
  );
};
