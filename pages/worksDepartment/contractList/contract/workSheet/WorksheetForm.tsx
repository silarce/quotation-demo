import { useWorksheet } from 'components/page/worksDepartment/worksheet/productForm/useWorksheet';
import { useShallow } from 'zustand/react/shallow';
import scss from './workSheet.module.scss';
import classNames from 'classnames';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import {
  Form_product_location,
  Form_product_basic,
  Form_product_ABCD,
  Form_product_motor,
  Form_product_headBox,
  Form_product_roller,
  Form_product_slat,
  Form_product_guideRail,
  Form_product_bottomBar,
  Form_product_sidePlate,
  Form_product_accessories,
  Form_product_other,
  WorksheetTable,
} from 'components/page/worksDepartment/worksheet/productForm/productForm';

import {
  Container,
  Section,
  MainFormWrapper,
  FormGrid,
} from 'components/page/worksDepartment/worksheet/productForm/productFormLayout';

export default function WorksheetForm({
  reqPatchWorkSheet = () => {},
  disabled = false,
  uploadButton = true,
}: {
  reqPatchWorkSheet?: () => void;
  disabled?: boolean;
  uploadButton?: boolean;
}) {
  const { calcData_2, shouldCalcData, shouldCalcData2 } = useWorksheet(
    useShallow((state) => ({
      shouldCalcData: state.shouldCalcData,
      shouldCalcData2: state.shouldCalcData2,
      calcData_2: state.calcData_2,
    }))
  );

  return (
    <Container>
      <div>
        <Section>位置與編號：</Section>
        <Form_product_location disabled={disabled} />
      </div>
      <div>
        <Section>設定產品基本規格：</Section>
        <Form_product_basic disabled={disabled} />
      </div>
      <MainFormWrapper>
        <Section>設定產品細部規格：</Section>
        <FormGrid>
          <Form_product_ABCD disabled={disabled} />
          <Form_product_motor disabled={disabled} />
          <Form_product_headBox disabled={disabled} />
          <Form_product_roller disabled={disabled} />
          <Form_product_slat disabled={disabled} />
          <Form_product_guideRail disabled={disabled} />
          <Form_product_bottomBar disabled={disabled} />
          <Form_product_sidePlate disabled={disabled} />
          <Form_product_other disabled={disabled} />
        </FormGrid>
        <div className={classNames(scss.cover, !shouldCalcData && 'hidden')}></div>
      </MainFormWrapper>
      <div>
        <Form_product_accessories disabled={disabled} />
      </div>
      <div className={classNames('relative', disabled && 'hidden')}>
        <MyButton_v2 px="px32" className={classNames('block m-auto')} onClick={calcData_2}>
          取得剩餘資料
        </MyButton_v2>
        <div className={classNames(scss.cover, !shouldCalcData && 'hidden')}></div>
      </div>
      <div className="relative">
        <WorksheetTable />
        {shouldCalcData2 && <div className={scss.cover}></div>}
      </div>
      {uploadButton && (
        <div className={classNames('relative', disabled && 'hidden')}>
          <MyButton_v2 px="px32" className="block m-auto " onClick={reqPatchWorkSheet}>
            確認上傳
          </MyButton_v2>
          <div className={classNames(scss.cover, !shouldCalcData2 && 'hidden')}></div>
        </div>
      )}
    </Container>
  );
}
