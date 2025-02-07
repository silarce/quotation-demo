import { useEffect } from 'react';
import classNames from 'classnames';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// api
import { useDepartments } from 'js/api/api_department';

import { Interface_classState } from './type';

import { useTranslation } from 'react-i18next';

const Profile = ({
  //
  disabled,
  classState,
  // onInovoiceBtnClick,
  changeInvoice,
  invoiceBtn,
}: {
  disabled: boolean;
  classState: Interface_classState;
  // onInovoiceBtnClick: () => void;
  changeInvoice: (invoiceNumber: string) => void;
  invoiceBtn: {
    onSelectClick: () => void;
    onInputClick: () => void;
    onClearClick: () => void;
    status: 'selected' | 'unselected';
  };
}) => {
  const { t } = useTranslation('accounting', { keyPrefix: 'purchaseCollectTicket' });
  const { t: t_common } = useTranslation('common');

  const { optionArr_name, update } = useDepartments();

  useEffect(() => {
    update();
  }, []);

  return (
    <div className="global_grid01">
      <InputSel
        caption={t('serial_number')}
        showBaseline="invisible"
        inputProps={{
          props: {
            defaultValue: classState.serial_number,
            placeholder: '儲存後自動產生',
            readOnly: true,
          },
        }}
      />
      <InputSel
        caption={t('applicant_department')}
        showBaseline="auto"
        disabled={disabled}
        selectProps={{
          props: {
            placeholder: '請選擇支出部門',
            options: optionArr_name,
            value: classState.applicant_department
              ? {
                  value: classState.applicant_department,
                  label: classState.applicant_department,
                }
              : null,
            onChange: (option) => {
              classState.applicant_department = option?.value ?? '';
            },
          },
        }}
      />
      <InputSel caption={t_common('agent')} showBaseline="invisible" node={classState.agentName} />
      <div />
      {/*  */}
      <InputSel
        caption={t('ticket_method')}
        disabled={disabled}
        showBaseline="auto"
        inputProps={{
          props: {
            value: classState.ticket_method,
            onChange: (e) => {
              classState.ticket_method = e.target.value;
            },
            readOnly: disabled,
            disabled: false,
          },
        }}
      />

      <InputSel
        caption={t('tax_deduction_category')}
        disabled={disabled}
        showBaseline="auto"
        inputProps={{
          props: {
            value: classState.tax_deduction_category,
            onChange: (e) => {
              classState.tax_deduction_category = e.target.value;
            },
            readOnly: disabled,
            disabled: false,
          },
        }}
      />
      <InputSel
        caption={t('journal_method')}
        showBaseline="auto"
        disabled={disabled}
        inputProps={{
          props: {
            value: classState.journal_method,
            onChange: (e) => {
              classState.journal_method = e.target.value;
            },
            readOnly: disabled,
            disabled: false,
          },
        }}
      />
      <div />
      {/*  */}

      <InputSel
        className="col-span-2"
        wrapperStyle={{ width: 750 }}
        caption={t('invoice_number')}
        showBaseline="auto"
        disabled={disabled}
        inputProps={{
          props: {
            placeholder: '請選擇發票',
            value: classState.invoice_number,
            onChange: (e) => {
              changeInvoice(e.target.value);
            },
            // readOnly: disabled,
          },
        }}
        suffix={
          <div className="flex gap-2">
            <SquareBtn
              className={classNames(disabled && 'invisible')}
              label={t_common('input')}
              sharp="mini"
              onClick={invoiceBtn.onInputClick}
            />
            <SquareBtn
              className={classNames(disabled && 'invisible')}
              label={t('selectInvoice')}
              sharp="mini"
              onClick={invoiceBtn.onSelectClick}
            />
            <SquareBtn
              className={classNames(disabled && 'invisible')}
              label={t_common('clear')}
              sharp="mini"
              onClick={invoiceBtn.onClearClick}
            />
            <span className="text-sm text-danger self-end">編輯發票號碼將會清除明細資料</span>

            {/* <SquareBtn
              className={classNames(disabled && 'invisible', 'ml-2')}
              label={invoiceBtn.status === 'selected' ? t_common('clear') : t('selectInvoice')}
              sharp="mini"
              onClick={() => {
                const { onSelectClick, onClearClick, status } = invoiceBtn;

                if (status === 'selected') {
                  onClearClick();
                } else {
                  onSelectClick();
                }
              }}
            /> */}
          </div>
        }
      />

      <div />
      <div />
      {/*  */}
      <InputSel
        caption={t('note')}
        disabled={disabled}
        showBaseline="auto"
        inputProps={{
          props: {
            value: classState.note,
            onChange: (e) => {
              classState.note = e.target.value;
            },
            readOnly: disabled,
            disabled: false,
          },
        }}
      />
    </div>
  );
};

export { Profile };
