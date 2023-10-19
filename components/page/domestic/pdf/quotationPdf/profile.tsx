// css
import style from './quotationPdf.module.scss';
// type
import { TuseProfile } from 'components/page/domestic/quotation/hook/useProfile';

export type Tprofile = {
  quotationId: string;
  clientName: string;
  contactPerson: string;
  contactPhone: string;
  fax: string;
  builtDate: string;
  projectAddress: string;
};

export default function Profile({
  profileData,
  index,
  pageCount,
}: {
  profileData: Tprofile;
  index: number;
  pageCount: number;
}) {
  const { quotationId, clientName, contactPerson, contactPhone, fax, builtDate, projectAddress } = profileData;

  const [year, month, day] = builtDate.split('-');
  const date = builtDate ? `${year}年${month}月${day}日` : '未定';

  return (
    <div className={style.profile}>
      <h1>報 價 單</h1>
      <div className={style.grid}>
        <div className={style.customer}>
          <div className={style.info}>
            <span>ATTN</span>
            <span className={style.semi}>:</span>
            <span>{contactPerson}</span>
          </div>
          <div className={style.info}>
            <span>客戶名稱</span>
            <span className={style.semi}>:</span>
            <span>{clientName}</span>
          </div>
          <div className={style.info}>
            <span className={style.flexSpan}>
              <span>電</span>
              <span>話</span>
            </span>
            <span className={style.semi}>:</span>
            <span>{contactPhone}</span>
          </div>
          <div className={style.info}>
            <span className={style.flexSpan}>
              <span>傳</span>
              <span>真</span>
            </span>
            <span className={style.semi}>:</span>
            <span>{fax}</span>
          </div>
        </div>

        <div className={style.date}>
          <div className={style.info}>
            <span>報價編號</span>
            <span className={style.semi}>:</span>
            <span>{quotationId}</span>
          </div>
          <div className={style.info}>
            <span>報價時效</span>
            <span className={style.semi}>:</span>
            <span>{'十天內'}</span>
          </div>
          <div className={style.info}>
            <span>報價日期</span>
            <span className={style.semi}>:</span>
            <span>{date}</span>
          </div>
        </div>

        <div className={style.page}>
          <div>
            <span>頁次</span>
            <span className={style.semi}>:</span>
            <span>{`${index}/${pageCount}`}</span>
          </div>
        </div>
      </div>

      <div className={style.address}>
        <span>工程名稱地點</span>
        <span className={style.semi}>:</span>
        <span>{projectAddress}</span>
      </div>
    </div>
  );
}
