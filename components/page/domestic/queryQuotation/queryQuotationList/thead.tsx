// gear
import Pop_form, { Tcontrol_pop_form } from 'components/global/gear/pop/pop_form';

// import <DownSquareFilled />
import { DownSquareFilled } from '@ant-design/icons';

// css
import scss from '../queryQuotationList.module.scss';

// ===================================================================
type TpopFormList = {
  quotationNumber: Tcontrol_pop_form;
  status: Tcontrol_pop_form;
  quoteDate: Tcontrol_pop_form;
  county: Tcontrol_pop_form;
  projectName: Tcontrol_pop_form;
  customerName: Tcontrol_pop_form;
};

export type { TpopFormList as Thead_popFormList };

// ===================================================================
export default function Thead({ popFormList }: { popFormList: TpopFormList }) {
  return (
    <div className={scss.thead}>
      <Pop_form control={popFormList.quotationNumber} placement="bottom">
        <div className={scss.cell}>
          <span>報價編號</span>
          <DownSquareFilled />
        </div>
      </Pop_form>

      <Pop_form control={popFormList.status} placement="bottom">
        <div className={scss.cell}>
          <span>狀態</span>
          <DownSquareFilled />
        </div>
      </Pop_form>

      <Pop_form control={popFormList.quoteDate} placement="bottom">
        <div className={scss.cell}>
          <span>報價日期</span>
          <DownSquareFilled />
        </div>
      </Pop_form>

      <Pop_form control={popFormList.county} placement="bottom">
        <div className={scss.cell}>
          <span>地區</span>
          <DownSquareFilled />
        </div>
      </Pop_form>

      <Pop_form control={popFormList.projectName} placement="bottom">
        <div className={scss.cell}>
          <span>工程名稱</span>
          <DownSquareFilled />
        </div>
      </Pop_form>

      <Pop_form control={popFormList.customerName} placement="bottom">
        <div className={scss.cell}>
          <span>客戶名稱</span>
          <DownSquareFilled />
        </div>
      </Pop_form>
      <div className={scss.cell}>
        <span>聯絡人</span>
      </div>

      <div className={scss.cell}>
        <span>連絡電話</span>
      </div>

      <span>{/* 按鈕格 留白 */}</span>
    </div>
  );
}

// ======================
