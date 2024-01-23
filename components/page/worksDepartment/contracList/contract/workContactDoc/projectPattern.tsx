import { useState, useEffect } from 'react';
import classNames from 'classnames';
import Image from 'next/image';

// antd
import { Select, Collapse, Upload, Image as AntdImage } from 'antd';
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

  const onDraggerChange_foo = async (e: UploadChangeParam, patternType: TpatternType) => {
    const {
      file,
      // fileList
    } = e;
    const info = patternList[patternType];

    if (!file.originFileObj || !info || !engineeringContactId) {
      return;
    }

    const theFile = file.originFileObj as File;
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

  // =======================================================================
  const [preUploadFile, setPreUploadFile] = useState<File>();

  const getFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) {
      return;
    }

    const file = e.target.files[0];

    const imageReg = /^image/;

    const isImage = imageReg.test(file.type);

    if (!isImage) {
      myAlert.info({ title: '該檔案非圖片，只能上傳圖片' });

      return;
    }

    setPreUploadFile(file);
  };

  const props_a: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.signature.src,
    onRemoveClick: () => reqDeletePattern('signature'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange_foo(e, 'signature'),
  };
  const props_b: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.floor.src,
    onRemoveClick: () => reqDeletePattern('floor'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange_foo(e, 'floor'),
  };
  const props_c: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.design.src,
    onRemoveClick: () => reqDeletePattern('design'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange_foo(e, 'design'),
  };
  const props_d: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.color.src,
    onRemoveClick: () => reqDeletePattern('color'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange_foo(e, 'color'),
  };

  return (
    <div className={scss.container}>
      <div className={scss.controlBar}>
        <Select
          className={classNames(scss.antdSelect, scss.plus)}
          options={options}
          onChange={(v) => console.log(v)}
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
            myAlert.success({ title: '測試上傳介面', content: '並沒有上傳' });
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
          <ImageDragger {...props_a} />
        </Panel>
        <Panel header="平面圖" key="floor" className={scss.panel}>
          <ImageDragger {...props_b} />
        </Panel>
        <Panel header="設計圖" key="design" className={scss.panel}>
          <ImageDragger {...props_c} />
        </Panel>
        <Panel header="色卡" key="color" className={scss.panel}>
          <ImageDragger {...props_d} />
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

const options = [
  { value: '簽認圖', label: '簽認圖' },
  { value: '平面圖', label: '平面圖' },
  { value: '設計圖', label: '設計圖' },
  { value: '色卡', label: '色卡' },
  // { value: '施工圖', label: '施工圖' },
];
