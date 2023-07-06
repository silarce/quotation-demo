// glogal gear
import Status from 'components/global/gear/other/status';
import InputSel from 'components/global/gear/inputAndSel/inputSel';

// css
import style from './workContactDoc.module.scss';

// ==================================================
export default function Profile() {
  return (
    <div className={style.profile}>
      <div className={style.leftBlock}>
        <Status text={`請款狀態:${'已出具證明，尚未收足款項'}`} />
        <div className={style.leftUpBlock}>
          <InputSel
            label="工程名稱"
            inputProps={{ value: '台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程' }}
            {...inputStyle01}
          />
          <InputSel label="工程內容" inputProps={{ value: '捲門＋大門工程' }} {...inputStyle01} />
        </div>

        <hr />

        <div className={style.leftDownBlock}>
          <InputSel label="工程電話" inputProps={{ value: '04-1234567' }} {...inputStyle01} />
          <InputSel label="工程負責人" inputProps={{ value: '王先生' }} {...inputStyle02} />
          <InputSel label="工程傳真" inputProps={{ value: '04-1234567' }} {...inputStyle01} />
          <InputSel label="負責人電話" inputProps={{ value: '0987654321' }} {...inputStyle02} />
          <InputSel
            label="工程地點"
            inputProps={{
              value: '臺中市梧棲區經二路27號臺中市梧棲區經二路27號臺中市梧棲區經二路27號臺中市梧棲區經二路27號',
            }}
            {...inputStyle01}
          />
        </div>
      </div>

      <div className={style.rightBlock}>
        <InputSel label="工程編號" inputProps={{ value: 'M-1101201' }} {...inputStyle01} />
        <InputSel label="承包商" inputProps={{ value: '創典科技A有限公司' }} {...inputStyle01} />
        <InputSel label="負責人" inputProps={{ value: '李先生' }} {...inputStyle01} />
        <InputSel label="公司電話" inputProps={{ value: '04-1234567' }} {...inputStyle01} />
        <InputSel label="公司傳真" inputProps={{ value: '04-1234567' }} {...inputStyle01} />
      </div>
    </div>
  );
}

// =============================================================
// =============================================================
// =============================================================
const inputStyle01 = {
  captionWidth: '80px',
  gap: '24px',
  captionClassName: style.inputCaption,
  captionColor: 'main' as const,
  showBaseline: 'invisible' as const,
  disabled: true,
};
const inputStyle02 = {
  captionWidth: '90px',
  gap: '24px',
  captionClassName: style.inputCaption,
  captionColor: 'main' as const,
  showBaseline: 'invisible' as const,
  disabled: true,
};
