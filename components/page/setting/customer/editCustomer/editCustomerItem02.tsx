// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';
// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

// css
import style from '../customer.module.scss';

// type
import { Class_customer } from 'hooks/customer/useCustomer';

// ======================================================
export default function EditCustomerItem02({ classCustomer }: { classCustomer: Class_customer }) {
  const { classContactArr, addContact, removeContact } = classCustomer;

  return (
    <div className={style.editCustomerItem02}>
      <p className={style.subTitle}>公司資訊</p>

      <div className={`${style.form}`}>
        {classContactArr?.map((classContact, index) => {
          const onChangeName = (value: string) => {
            classContact.name = value;
          };

          const onChangePhone = (value: string) => {
            classContact.phone = value;
          };

          return (
            <div className={style.inputBox} key={index}>
              <InputSel
                className={style.input02}
                label={`聯絡人 ${index + 1}`}
                presetStyle="s01"
                captionWidth="100px"
                inputProps={{
                  value: classContact.name,
                  onChange: onChangeName,
                }}
              />
              <InputSel
                className={style.input02}
                label={'電話'}
                presetStyle="s01"
                captionWidth="100px"
                inputProps={{
                  value: classContact.phone,
                  onChange: onChangePhone,
                }}
              />
              <div className={style.buttonBox}>
                <IconAddCircle onClick={addContact} />
                <IconRemoveCircle
                  className={classContactArr.length === 1 ? style.noShow : ''}
                  onClick={() => removeContact(index)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
