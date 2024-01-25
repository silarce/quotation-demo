import { useState, useEffect } from 'react';
import classNames from 'classnames';
import Image from 'next/image';

// antd
import { Select, Collapse, Upload, Image as AntdImage, Spin } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import scss from './projectPattern.module.scss';

// icon
import iconGrayAddCircle from 'public/image/icon/grayAddCircle.svg';
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

// api
import {
  apiPostEngineeringContactAttachments,
  apiDeleteEngineeringContactAttachments,
  useEngineeringContactAttachments,
  TengineeringContactAttachmentType,
  TfileDto,
} from 'js/api/api_engineering';

// =======================================================================
const { Panel } = Collapse;
const { Dragger } = Upload;

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

export type { ThasPattern };

// =======================================================================
export default function ProjectPattern({
  engineeringContactId,
  onPatternChange,
}: {
  engineeringContactId: string | null | undefined;
  onPatternChange: (hasPattern: ThasPattern) => void;
}) {
  const [isUploading, setIsUploading] = useState<TisUploading>({
    floor: false,
    detail: false,
    color: false,
    construction: false,
    design: false,
  });

  const isUploading_any = Object.values(isUploading).some((v) => v);

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

    if (!isImage) {
      myAlert.info({ title: '該檔案非圖片，只能上傳圖片' });

      return;
    }

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

  //
  const onDraggerChange = async (e: UploadChangeParam, patternType: TpatternType) => {
    const {
      file,
      // fileList
    } = e;

    await reqUploadPattern(file.originFileObj as File | undefined, patternType);
  };

  //
  const onRemoveClick = (pattern: TpatternType) => {
    myAlert.confirm({
      title: '確定移除?',
      props: {
        onOk: () => reqDeletePattern(pattern),
      },
    });
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

    if (!isImage) {
      myAlert.info({ title: '該檔案非圖片，只能上傳圖片' });

      return;
    }

    setPreUploadFile(file);
  };

  // -----------------------------------------------------------------------

  const props_floor: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.floor.src,
    onRemoveClick: () => onRemoveClick('floor'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'floor'),
    isUploading: isUploading.floor,
  };
  const props_design: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.design.src,
    onRemoveClick: () => onRemoveClick('design'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'design'),
    isUploading: isUploading.design,
  };
  const props_color: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.color.src,
    onRemoveClick: () => onRemoveClick('color'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'color'),
    isUploading: isUploading.color,
  };
  const props_construction: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.construction.src,
    onRemoveClick: () => onRemoveClick('construction'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'construction'),
    isUploading: isUploading.construction,
  };
  const props_detail: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.detail.src,
    onRemoveClick: () => onRemoveClick('detail'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'detail'),
    isUploading: isUploading.detail,
  };

  return (
    <div className={scss.container}>
      <div className={scss.controlBar}>
        <Select
          className={classNames(scss.antdSelect, scss.plus)}
          options={options}
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
      {/*  */}

      <Collapse
        className={scss.antdCollapse}
        defaultActiveKey={['detail']}
        // onChange={(v) => {console.log(v);}}
      >
        <Panel header="簽認圖" key="detail" className={scss.panel}>
          <ImageDragger {...props_detail} />
        </Panel>
        <Panel header="平面圖" key="floor" className={scss.panel}>
          <ImageDragger {...props_floor} />
        </Panel>
        <Panel header="設計圖" key="design" className={scss.panel}>
          <ImageDragger {...props_design} />
        </Panel>
        <Panel header="施工圖" key="construction" className={scss.panel}>
          <ImageDragger {...props_construction} />
        </Panel>
        <Panel header="色卡" key="color" className={scss.panel}>
          <ImageDragger {...props_color} />
        </Panel>
      </Collapse>
    </div>
  );
}

// ==================================================

const ImageDragger = ({
  fileSrc,
  onRemoveClick,
  onDraggerChange,
  isUploading,
}: {
  fileSrc?: string | undefined;
  onRemoveClick: () => void;
  onDraggerChange: (e: UploadChangeParam) => void;
  isUploading: boolean;
}) => {
  return (
    <>
      <div className={classNames('relative w-fit', !fileSrc && 'hidden')}>
        <AntdImage className={scss.antdImage} src={fileSrc ?? ''} alt="" />
        <IconRemove02 className="global_absoluteRightTop" onClick={() => onRemoveClick()} />
      </div>
      <div className={classNames(scss.draggerContainer, fileSrc && 'hidden')}>
        <Spin spinning={isUploading} size="large">
          <Dragger
            className={classNames(scss.antdDragger, scss.plus)}
            onChange={(e) => {
              onDraggerChange(e);
            }}
            fileList={[]}
          >
            <div className={scss.dragTip}>
              <div>
                <Image src={iconGrayAddCircle} alt="" />
              </div>
              <span>請選擇圖片</span>
            </div>
          </Dragger>
        </Spin>
      </div>
    </>
  );
};

// ==================================================

const checkFileIsImage = (file: File) => {
  const imageReg = /^image/;
  const isImage = imageReg.test(file.type);

  return isImage;
};

const options = [
  { value: 'detail', label: '簽認圖' },
  { value: 'floor', label: '平面圖' },
  { value: 'design', label: '設計圖' },
  { value: 'construction', label: '施工圖' },
  { value: 'color', label: '色卡' },
];
