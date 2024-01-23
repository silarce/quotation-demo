import { useState, useEffect } from 'react';
import classNames from 'classnames';
import Image from 'next/image';

// antd
import { Select, Collapse, Upload, Image as AntdImage } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload';

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

type TpatternType = Exclude<TengineeringContactAttachmentType, 'construction'>;

type TpatternList = {
  [key in TpatternType]: {
    id: string | undefined;
    src: string | undefined;
  };
};

// =======================================================================
export default function ProjectPattern({ engineeringContactId }: { engineeringContactId: string | null | undefined }) {
  const { signaturePatternArr, floorPlanPatternArr, designDiagramPatternArr, colorCardPatternArr, update, updateAll } =
    useEngineeringContactAttachments(engineeringContactId);

  useEffect(() => {
    updateAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineeringContactId]);

  const fileInfo_signature = signaturePatternArr?.[0] as TfileDto | undefined;
  const fileSrc_signature = fileInfo_signature
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${fileInfo_signature.id}`
    : undefined;
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

  const patternList: TpatternList = {
    signature: {
      id: fileInfo_signature?.id,
      src: fileSrc_signature,
    },
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
  } as const;

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
      await apiPostEngineeringContactAttachments(engineeringContactId, patternType, formData);
      await update(patternType);
    } catch (error) {}
  };

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

  const onUploadBtnClick = async () => {
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

  const onDraggerChange = async (e: UploadChangeParam, patternType: TpatternType) => {
    const {
      file,
      // fileList
    } = e;

    await reqUploadPattern(file.originFileObj as File | undefined, patternType);
  };

  // =======================================================================
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

  const props_signature: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.signature.src,
    onRemoveClick: () => reqDeletePattern('signature'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'signature'),
  };
  const props_floor: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.floor.src,
    onRemoveClick: () => reqDeletePattern('floor'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'floor'),
  };
  const props_design: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.design.src,
    onRemoveClick: () => reqDeletePattern('design'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'design'),
  };
  const props_color: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.color.src,
    onRemoveClick: () => reqDeletePattern('color'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'color'),
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
        />
      </div>
      {/*  */}

      <Collapse
        className={scss.antdCollapse}
        defaultActiveKey={['signature']}
        // onChange={(v) => {console.log(v);}}
      >
        <Panel header="簽認圖" key="signature" className={scss.panel}>
          <ImageDragger {...props_signature} />
        </Panel>
        <Panel header="平面圖" key="floor" className={scss.panel}>
          <ImageDragger {...props_floor} />
        </Panel>
        <Panel header="設計圖" key="design" className={scss.panel}>
          <ImageDragger {...props_design} />
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
}: {
  fileSrc?: string | undefined;
  onRemoveClick: () => void;
  onDraggerChange: (e: UploadChangeParam) => void;
}) => {
  return (
    <>
      <div className={classNames('relative w-fit', !fileSrc && 'hidden')}>
        <AntdImage className={scss.antdImage} src={fileSrc ?? ''} alt="" />
        <IconRemove02 className="global_absoluteRightTop" onClick={() => onRemoveClick()} />
      </div>
      <div className={classNames(scss.draggerContainer, fileSrc && 'hidden')}>
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
  { value: 'signature', label: '簽認圖' },
  { value: 'floor', label: '平面圖' },
  { value: 'design', label: '設計圖' },
  { value: 'color', label: '色卡' },
  // { value: '施工圖', label: '施工圖' },
];
