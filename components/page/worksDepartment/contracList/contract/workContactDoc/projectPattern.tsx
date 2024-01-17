import { useState } from 'react';
import classNames from 'classnames';
import Image from 'next/image';

// antd
import { Select, Collapse, Upload, Image as AntdImage } from 'antd';
import type { UploadProps, UploadFile } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import scss from './projectPattern.module.scss';

// icon
import iconGrayAddCircle from 'public/image/icon/grayAddCircle.svg';
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

import { getBase64_RcFile, RcFile } from 'js/utils/helpers/getBase64';

// =======================================================================
const { Panel } = Collapse;
const { Dragger } = Upload;

// =======================================================================

type TpatternType = 'a' | 'b' | 'c' | 'd' | 'e';

// =======================================================================
export default function ProjectPattern() {
  // 簽認圖
  const [fileList_a, setFileList_a] = useState<UploadProps['fileList']>([]);
  // const fileA = fileList_a?.[0]?.originFileObj;
  const fileA = fileList_a?.[0];
  // 平面圖
  const [fileList_b, setFileList_b] = useState<UploadProps['fileList']>([]);
  const fileB = fileList_b?.[0];
  // 設計圖
  const [fileList_c, setFileList_c] = useState<UploadProps['fileList']>([]);
  const fileC = fileList_c?.[0];
  // 色卡
  const [fileList_d, setFileList_d] = useState<UploadProps['fileList']>([]);
  const fileD = fileList_d?.[0];
  // 施工圖
  const [fileList_e, setFileList_e] = useState<UploadProps['fileList']>([]);
  const fileE = fileList_e?.[0];

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

  const onDraggerChange = async (e: UploadChangeParam, patternType: TpatternType) => {
    const {
      file,
      // fileList
    } = e;

    const url = await getBase64_RcFile(file.originFileObj as RcFile);

    file.url = url;

    if (patternType === 'a') {
      setFileList_a([file]);
    } else if (patternType === 'b') {
      setFileList_b([file]);
    } else if (patternType === 'c') {
      setFileList_c([file]);
    } else if (patternType === 'd') {
      setFileList_d([file]);
    } else if (patternType === 'e') {
      setFileList_e([file]);
    }
  };

  const onRemoveClick = (patternType: TpatternType) => {
    if (patternType === 'a') {
      setFileList_a([]);
    } else if (patternType === 'b') {
      setFileList_b([]);
    } else if (patternType === 'c') {
      setFileList_c([]);
    } else if (patternType === 'd') {
      setFileList_d([]);
    } else if (patternType === 'e') {
      setFileList_e([]);
    }
  };

  const props_a: Parameters<typeof ImageDragger>[0] = {
    file: fileA,
    onRemoveClick: () => onRemoveClick('a'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'a'),
  };
  const props_b: Parameters<typeof ImageDragger>[0] = {
    file: fileB,
    onRemoveClick: () => onRemoveClick('b'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'b'),
  };
  const props_c: Parameters<typeof ImageDragger>[0] = {
    file: fileC,
    onRemoveClick: () => onRemoveClick('c'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'c'),
  };
  const props_d: Parameters<typeof ImageDragger>[0] = {
    file: fileD,
    onRemoveClick: () => onRemoveClick('d'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'd'),
  };
  const props_e: Parameters<typeof ImageDragger>[0] = {
    file: fileE,
    onRemoveClick: () => onRemoveClick('e'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'e'),
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
        defaultActiveKey={['1']}
        // onChange={(v) => {
        //   console.log(v);
        // }}
      >
        <Panel header="簽認圖" key="1" className={scss.panel}>
          <ImageDragger {...props_a} />
        </Panel>
        <Panel header="平面圖" key="2" className={scss.panel}>
          <ImageDragger {...props_b} />
        </Panel>
        <Panel header="設計圖" key="3" className={scss.panel}>
          <ImageDragger {...props_c} />
        </Panel>
        <Panel header="色卡" key="4" className={scss.panel}>
          <ImageDragger {...props_d} />
        </Panel>
        {/* <Panel header="施工圖" key="5" className={scss.panel}>
          <ImageDragger {...props_e} />
        </Panel> */}
      </Collapse>
    </div>
  );
}

// ==================================================

const ImageDragger = ({
  //
  file,
  onRemoveClick,
  onDraggerChange,
}: {
  file: UploadFile<any> | undefined;
  onRemoveClick: (fileType: TpatternType) => void;
  onDraggerChange: (e: UploadChangeParam) => void;
}) => {
  return (
    <>
      <div className={classNames('relative w-fit', !file?.url && 'hidden')}>
        <AntdImage className={scss.antdImage} src={file?.url ?? ''} alt="" />
        <IconRemove02 className="global_absoluteRightTop" onClick={() => onRemoveClick('a')} />
      </div>
      <div className={classNames(scss.draggerContainer, file?.url && 'hidden')}>
        <Dragger
          className={classNames(scss.antdDragger, scss.plus)}
          onChange={(e) => {
            onDraggerChange(e);
          }}
          // fileList={fileList_a}
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
