import { useState, useEffect } from 'react';
import classNames from 'classnames';

// antd
import { Select, Collapse } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';

import { ImageDragger, Pattern } from './component';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { Tcontrol_processChain } from 'components/global/gear/processChain';
import MultButtonModal from 'components/global/gear/modal/simpleModal/multButtonModal';

import { useControl_review } from './useControl_review';

import scss from './projectPattern.module.scss';

// api
import {
  apiPostEngineeringContactAttachments,
  apiDeleteEngineeringContactAttachments,
  useEngineeringContactAttachments,
  TengineeringContactAttachmentType,
  TfileDto,
  // 送審
  apiPatchEngineeringContactSubmitAttachment,
  // 審核
  apiPatchEngineeringContactReviewAttachment,
} from 'js/api/api_engineering';

import { Toption } from 'js/utils/options/options';

// =======================================================================
const { Panel } = Collapse;

// =======================================================================

type TpatternType = Exclude<TengineeringContactAttachmentType, 'signature'>;

type TpatternList = {
  [key in TpatternType]: {
    id: string | undefined;
    src: string | undefined;
  };
};

type TisUploading = {
  [key in TpatternType]: boolean;
};

type ThasPattern = {
  hasColor: boolean;
  hasConstruction: boolean;
  hasDetail: boolean;
  hasFloor: boolean;
  hasDesign: boolean;
};

type TshouldHasPattern = {
  shouldHasDetail: boolean;
  shouldHasFloor: boolean;
  shouldHasDesign: boolean;
  shouldHasConstruction: boolean;
  shouldHasColor: boolean;
};

type TpatternReviewProcess = {
  sales: Tcontrol_processChain;
  worker: Tcontrol_processChain;
  manager: Tcontrol_processChain;
};

type TpatternReviewProcessGroup = {
  color: TpatternReviewProcess;
  construction: TpatternReviewProcess;
  detail: TpatternReviewProcess;
  floor: TpatternReviewProcess;
  design: TpatternReviewProcess;
};

type TpatternReviewStatus = {
  salesName: string;
  workerName: string;
  managerName: string;
  pattern: {
    color: {
      colorToWorkerAt: string | null;
      colorWorkerReviewedAt: string | null;
      colorToManagerAt: string | null;
      colorManagerReviewedAt: string | null;
    };
    construction: {
      constructionToWorkerAt: string | null;
      constructionWorkerReviewedAt: string | null;
      constructionToManagerAt: string | null;
      constructionManagerReviewedAt: string | null;
    };
    detail: {
      detailToWorkerAt: string | null;
      detailWorkerReviewedAt: string | null;
      detailToManagerAt: string | null;
      detailManagerReviewedAt: string | null;
    };
    floor: {
      floorToWorkerAt: string | null;
      floorWorkerReviewedAt: string | null;
      floorToManagerAt: string | null;
      floorManagerReviewedAt: string | null;
    };
    design: {
      designToWorkerAt: string | null;
      designWorkerReviewedAt: string | null;
      designToManagerAt: string | null;
      designManagerReviewedAt: string | null;
    };
  };
};

// =======================================================================

// MARK:START

export default function ProjectPattern({
  engineeringContactId,
  onPatternChange,
  // patternReviewStatus,
  onSubmitSuccess,
  onReviewSuccess,
  onDeleteSuccess,
  shouldHasPattern,
}: // isReviewer_worker,
// isReviewer_manager,
{
  engineeringContactId: string | null | undefined;
  onPatternChange: (hasPattern: ThasPattern) => void;
  // patternReviewStatus: TpatternReviewStatus;
  onSubmitSuccess: () => void;
  onReviewSuccess: () => void;
  onDeleteSuccess: () => void;
  shouldHasPattern: TshouldHasPattern;
  // isReviewer_worker: boolean;
  // isReviewer_manager: boolean;
}) {
  // const {
  //   color: { colorManagerReviewedAt },
  //   construction: { constructionManagerReviewedAt },
  //   detail: { detailManagerReviewedAt },
  //   floor: { floorManagerReviewedAt },
  //   design: { designManagerReviewedAt },
  // } = patternReviewStatus.pattern;

  // -----------------------------------------------------------------------
  const [isUploading, setIsUploading] = useState<TisUploading>({
    floor: false,
    detail: false,
    color: false,
    construction: false,
    design: false,
  });

  const isUploading_any = Object.values(isUploading).some((v) => v);

  const [reviewConfirm, setReviewConfirm] = useState<(isPass: boolean) => void>();

  // -----------------------------------------------------------------------

  const {
    floorPlanPatternArr,
    designDiagramPatternArr,
    colorCardPatternArr,
    pattern_constructionArr,
    pattern_detailArr,
    update,
    updateAll,
  } = useEngineeringContactAttachments(engineeringContactId);

  useEffect(() => {
    updateAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineeringContactId]);

  useEffect(() => {
    onPatternChange({
      hasColor: colorCardPatternArr.length > 0,
      hasConstruction: pattern_constructionArr.length > 0,
      hasDetail: pattern_detailArr.length > 0,
      hasFloor: floorPlanPatternArr.length > 0,
      hasDesign: designDiagramPatternArr.length > 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    //
    floorPlanPatternArr,
    designDiagramPatternArr,
    colorCardPatternArr,
    pattern_constructionArr,
    pattern_detailArr,
  ]);

  const fileInfo_floor = floorPlanPatternArr?.[0] as TfileDto | undefined;
  const fileSrc_floor = fileInfo_floor
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${fileInfo_floor.id}`
    : undefined;
  const fileInfo_design = designDiagramPatternArr?.[0] as TfileDto | undefined;
  const fileSrc_design = fileInfo_design
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${fileInfo_design.id}`
    : undefined;
  const fileInfo_color = colorCardPatternArr?.[0] as TfileDto | undefined;
  const fileSrc_color = fileInfo_color
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${fileInfo_color.id}`
    : undefined;
  const fileInfo_construction = pattern_constructionArr?.[0] as TfileDto | undefined;
  const fileSrc_construction = fileInfo_construction
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${fileInfo_construction.id}`
    : undefined;
  const fileInfo_detail = pattern_detailArr?.[0] as TfileDto | undefined;
  const fileSrc_detail = fileInfo_detail
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${fileInfo_detail.id}`
    : undefined;

  const patternList: TpatternList = {
    floor: {
      id: fileInfo_floor?.id,
      src: fileSrc_floor,
    },
    design: {
      id: fileInfo_design?.id,
      src: fileSrc_design,
    },
    color: {
      id: fileInfo_color?.id,
      src: fileSrc_color,
    },
    construction: {
      id: fileInfo_construction?.id,
      src: fileSrc_construction,
    },
    detail: {
      id: fileInfo_detail?.id,
      src: fileSrc_detail,
    },
  } as const;

  // -----------------------------------------------------------------------
  const reqUploadPattern = async (file: File | undefined, patternType: TpatternType) => {
    const info = patternList[patternType];

    if (!file || !info || !engineeringContactId) {
      return;
    }

    const isImage = checkFileIsImage(file);

    // if (!isImage) {
    //   myAlert.info({ title: '該檔案非圖片，只能上傳圖片' });

    //   return;
    // }

    const theFile = file;
    const formData = new FormData();
    formData.append('file', theFile);

    try {
      setIsUploading((prev) => ({ ...prev, [patternType]: true }));
      await apiPostEngineeringContactAttachments(engineeringContactId, patternType, formData);
      await update(patternType);
    } catch (error) {
    } finally {
      setIsUploading((prev) => ({ ...prev, [patternType]: false }));
    }
  };

  //
  const reqDeletePattern = async (patternType: TpatternType) => {
    const id = patternList[patternType]?.id;

    if (!engineeringContactId || !id) {
      return;
    }

    try {
      await apiDeleteEngineeringContactAttachments(engineeringContactId, patternType, id);
      await update(patternType);
      await onDeleteSuccess();
    } catch (error) {}
  };

  // _____________________________________________________________
  //
  const onUploadBtnClick = async () => {
    if (isUploading_any) {
      return;
    }

    if (!patternType) {
      myAlert.info({ title: '請選擇要上傳的工程圖表項目' });

      return;
    }

    if (patternList[patternType].id) {
      myAlert.info({ title: '該工程圖表項目已有圖片，請先刪除' });

      return;
    }

    await reqUploadPattern(preUploadFile, patternType);
  };

  // ---------------------------------------------------------------------0
  // 送審
  const confirmReqSubmitPattern = async (patternType: TpatternType) => {
    myAlert.confirm({
      title: '確定送審?',
      props: {
        onOk: () => {
          reqSubmitPattern(patternType);
        },
      },
    });
  };

  const reqSubmitPattern = async (patternType: TpatternType) => {
    if (engineeringContactId) {
      try {
        await apiPatchEngineeringContactSubmitAttachment(engineeringContactId, { attachmentType: patternType });
        await onSubmitSuccess();
      } catch (error) {}
    }
  };

  // 審核

  const reqReviewPattern = async ({ attachmentType, isPass }: { attachmentType: string; isPass: boolean }) => {
    if (engineeringContactId) {
      try {
        await apiPatchEngineeringContactReviewAttachment(engineeringContactId, { attachmentType, isPass });
        setReviewConfirm(undefined);
        await onReviewSuccess();
      } catch (error) {}
    }
  };

  // ---------------------------------------------------------------------
  //
  const onDraggerChange = async (e: UploadChangeParam, patternType: TpatternType) => {
    const {
      file,
      // fileList
    } = e;

    await reqUploadPattern(file.originFileObj as File | undefined, patternType);
  };

  //
  const onRemoveClick = async (pattern: TpatternType) => {
    await reqDeletePattern(pattern);
  };

  // =======================================================================
  // 上方上傳按鈕用的
  const [preUploadFile, setPreUploadFile] = useState<File>();
  const [patternType, setPatternType] = useState<TpatternType>();

  const getFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) {
      return;
    }

    const file = e.target.files[0];
    const isImage = checkFileIsImage(file);

    // if (!isImage) {
    //   myAlert.info({ title: '該檔案非圖片，只能上傳圖片' });

    //   return;
    // }

    setPreUploadFile(file);
  };

  // -----------------------------------------------------------------------

  const props_floor: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.floor.src,
    onRemoveClick: () => onRemoveClick('floor'),
    // onRemoveClick: floorManagerReviewedAt ? null : () => onRemoveClick('floor'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'floor'),
    isUploading: isUploading.floor,
    isImage: checkFileIsImage_str(fileInfo_floor?.mime ?? ''),
    fileName: fileInfo_floor?.name ?? '',
  };
  const props_design: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.design.src,
    onRemoveClick: () => onRemoveClick('design'),
    // onRemoveClick: designManagerReviewedAt ? null : () => onRemoveClick('design'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'design'),
    isUploading: isUploading.design,
    isImage: checkFileIsImage_str(fileInfo_design?.mime ?? ''),
    fileName: fileInfo_design?.name ?? '',
  };
  const props_color: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.color.src,
    onRemoveClick: () => onRemoveClick('color'),
    // onRemoveClick: colorManagerReviewedAt ? null : () => onRemoveClick('color'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'color'),
    isUploading: isUploading.color,
    isImage: checkFileIsImage_str(fileInfo_color?.mime ?? ''),
    fileName: fileInfo_color?.name ?? '',
  };
  const props_construction: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.construction.src,
    onRemoveClick: () => onRemoveClick('construction'),
    // onRemoveClick: constructionManagerReviewedAt ? null : () => onRemoveClick('construction'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'construction'),
    isUploading: isUploading.construction,
    isImage: checkFileIsImage_str(fileInfo_construction?.mime ?? ''),
    fileName: fileInfo_construction?.name ?? '',
  };
  const props_detail: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.detail.src,
    onRemoveClick: () => onRemoveClick('detail'),
    // onRemoveClick: detailManagerReviewedAt ? null : () => onRemoveClick('detail'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'detail'),
    isUploading: isUploading.detail,
    isImage: checkFileIsImage_str(fileInfo_detail?.mime ?? ''),
    fileName: fileInfo_detail?.name ?? '',
  };
  // -----------------------------------------------------------------------

  // const controlList = useControl_review({
  //   patternReviewStatus: patternReviewStatus,
  //   isReviewer_worker,
  //   isReviewer_manager,
  // });

  // -----------------------------------------------------------------------

  // MARK: RENDER

  return (
    <div className={scss.container}>
      <div className={scss.controlBar}>
        <Select
          className={classNames(scss.antdSelect, scss.plus)}
          options={createOptions(shouldHasPattern)}
          // onChange={(v) => console.log(v)}
          onChange={(v) => setPatternType(v)}
          placeholder="選擇要上傳工程圖表項目"
          style={{ width: 359 }}
        />

        <label className={scss.preUploadBtn}>
          <span className={classNames(!preUploadFile && scss.placeholder)}>
            {preUploadFile?.name || '選擇要上傳工程圖表項目'}
          </span>
          <input
            type="file"
            className={'hidden'}
            onChange={(e) => {
              getFile(e);
            }}
          />
        </label>

        <MyButton_v2
          label="上傳圖片"
          px="px28"
          className={scss.btn_uploadImg}
          onClick={() => {
            onUploadBtnClick();
          }}
          isLoading={isUploading_any}
        />
      </div>
      <Collapse
        className={scss.antdCollapse}
        // defaultActiveKey={['detail']}
      >
        {/* 簽認圖 */}
        {shouldHasPattern.shouldHasDetail && (
          <Panel header="簽認圖" key="detail" className={scss.panel}>
            <Pattern
              engineeringContactId={engineeringContactId}
              patternType={'detail'}
              props={props_detail}
              // isDetailSubmit={!!controlList.isDetailSubmit}
              // isReviewer={controlList.isReviewer_detail}
              // statusArr={controlList.detail}
              // confirmReqSubmitPattern={confirmReqSubmitPattern}
              // reqReviewPattern={reqReviewPattern}
              // setReviewConfirm={setReviewConfirm}
            />
          </Panel>
        )}

        {/* 平面圖 */}
        {shouldHasPattern.shouldHasFloor && (
          <Panel header="平面圖" key="floor" className={scss.panel}>
            <Pattern
              engineeringContactId={engineeringContactId}
              patternType={'floor'}
              props={props_floor}
              // isDetailSubmit={!!controlList.isFloorSubmit}
              // isReviewer={controlList.isReviewer_floor}
              // statusArr={controlList.floor}
              // confirmReqSubmitPattern={confirmReqSubmitPattern}
              // reqReviewPattern={reqReviewPattern}
              // setReviewConfirm={setReviewConfirm}
            />
          </Panel>
        )}

        {/* 設計圖 */}
        {shouldHasPattern.shouldHasDesign && (
          <Panel header="設計圖" key="design" className={scss.panel}>
            <Pattern
              engineeringContactId={engineeringContactId}
              patternType={'design'}
              props={props_design}
              // isDetailSubmit={!!controlList.isDesignSubmit}
              // isReviewer={controlList.isReviewer_design}
              // statusArr={controlList.design}
              // confirmReqSubmitPattern={confirmReqSubmitPattern}
              // reqReviewPattern={reqReviewPattern}
              // setReviewConfirm={setReviewConfirm}
            />
          </Panel>
        )}

        {/* 施工圖 */}
        {shouldHasPattern.shouldHasConstruction && (
          <Panel header="施工圖" key="construction" className={scss.panel}>
            <Pattern
              engineeringContactId={engineeringContactId}
              patternType={'construction'}
              props={props_construction}
              // isDetailSubmit={!!controlList.isConstructionSubmit}
              // isReviewer={controlList.isReviewer_construction}
              // statusArr={controlList.construction}
              // confirmReqSubmitPattern={confirmReqSubmitPattern}
              // reqReviewPattern={reqReviewPattern}
              // setReviewConfirm={setReviewConfirm}
            />
          </Panel>
        )}

        {/* 色卡 */}
        {shouldHasPattern.shouldHasColor && (
          <Panel header="色卡" key="color" className={scss.panel}>
            <Pattern
              engineeringContactId={engineeringContactId}
              patternType={'color'}
              props={props_color}
              // isDetailSubmit={!!controlList.isColorSubmit}
              // isReviewer={controlList.isReviewer_color}
              // statusArr={controlList.color}
              // confirmReqSubmitPattern={confirmReqSubmitPattern}
              // reqReviewPattern={reqReviewPattern}
              // setReviewConfirm={setReviewConfirm}
            />
          </Panel>
        )}
      </Collapse>

      <MultButtonModal
        visible={!!reviewConfirm}
        text={'是否通過審核?'}
        onCancel={() => setReviewConfirm(undefined)}
        modalWidth={600}
        btnPropsArr={[
          {
            label: '通過審核',
            theme: 'danger',
            onClick: () => reviewConfirm?.(true),
          },
          {
            label: '不通過審核',
            onClick: () => reviewConfirm?.(false),
          },
          {
            label: '取消',
            onClick: () => setReviewConfirm(undefined),
          },
        ]}
      />
    </div>
  ); // return
}

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================

// MARK:FUNCTIONS

const checkFileIsImage = (file: File) => {
  const imageReg = /^image/;
  const isImage = imageReg.test(file.type);

  return isImage;
};

const checkFileIsImage_str = (str: string) => {
  const imageReg = /^image/;
  const isImage = imageReg.test(str);

  return isImage;
};

const createOptions = (shouldHasPattern: TshouldHasPattern) => {
  const list = {
    shouldHasDetail: { value: 'detail', label: '簽認圖' },
    shouldHasFloor: { value: 'floor', label: '平面圖' },
    shouldHasDesign: { value: 'design', label: '設計圖' },
    shouldHasConstruction: { value: 'construction', label: '施工圖' },
    shouldHasColor: { value: 'color', label: '色卡' },
  };

  const options: Toption[] = [];
  const keyArr = Object.keys(shouldHasPattern) as (keyof TshouldHasPattern)[];

  keyArr.forEach((key) => {
    if (shouldHasPattern[key]) {
      options.push(list[key]);
    }
  });

  return options;
};

// =======================================================================
export type {
  TpatternType,
  TpatternList,
  TisUploading,
  ThasPattern,
  TshouldHasPattern,
  TpatternReviewProcess,
  TpatternReviewProcessGroup,
  TpatternReviewStatus,
};
