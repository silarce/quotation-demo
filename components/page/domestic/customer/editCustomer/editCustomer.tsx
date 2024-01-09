// component
import EditCustomerItem01 from './editCustomerItem01';
import EditCustomerItem02 from './editCustomerItem02';

// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';

// type
import { Class_customer } from 'hooks/customer/useCustomer';

// icon
import { IconCheck01, IconCross01 } from 'public/image/icon/svgComponent/svgIcons';
import CircularProgress from '@mui/material/CircularProgress';

// css
import scss from '../customer.module.scss';

export default function EditCustomer({
  classCustomer,
  nameCheck,
  customerNumberCheck,
  disabled,
}: {
  classCustomer: Class_customer;
  nameCheck: 'ok' | 'notOk' | 'loading';
  customerNumberCheck?: 'ok' | 'notOk' | 'loading';
  disabled?: boolean;
}) {
  // ==================================================
  return (
    <div className={scss.editCustomer}>
      <div className={scss.theId}>
        <InputSel
          className={scss.input02}
          label="客戶編號"
          captionWidth="100px"
          gap="40px"
          disabled={disabled}
          inputProps={{
            value: classCustomer.customerNumber,
            onChange: (value: string) => {
              classCustomer.customerNumber = value;
            },
          }}
        />
        {customerNumberCheck && (
          <span className={scss.checkTip}>
            {customerNumberCheck === 'ok' ? (
              <IconCheck01 className={scss.check} cursor="auto" />
            ) : customerNumberCheck === 'notOk' ? (
              <IconCross01 className={scss.cross} cursor="auto" />
            ) : (
              <CircularProgress size={30} />
            )}
            {customerNumberCheck === 'notOk' && (
              <span className={scss.alertTip}>{classCustomer.name ? '此客戶編號已被使用' : '請輸入編號全稱'}</span>
            )}
          </span>
        )}
      </div>

      <EditCustomerItem01 classCustomer={classCustomer} nameCheck={nameCheck} />
      <EditCustomerItem02 classCustomer={classCustomer} />
    </div>
  );
}
