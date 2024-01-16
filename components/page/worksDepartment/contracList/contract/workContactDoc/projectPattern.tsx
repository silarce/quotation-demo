import { useState, useEffect } from 'react';
import classNames from 'classnames';

// antd
import { Select, Collapse, Upload } from 'antd';
import type { UploadProps } from 'antd';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import scss from './projectPattern.module.scss';

// =======================================================================
const { Panel } = Collapse;
const { Dragger } = Upload;

// =======================================================================
export default function ProjectPattern() {
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
          <Dragger
            onChange={(e) => {
              console.log('onChange', e);
            }}
            onDrop={(e) => {
              console.log('onDrop', e);
            }}
            className={classNames(scss.antdDragger, scss.plus)}
          >
            <div className={scss.dragTip}>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="41" height="40" viewBox="0 0 41 40" fill="none">
                  <path
                    d="M20.979 0C32.025 0 40.979 8.954 40.979 20C40.979 31.046 32.025 40 20.979 40C9.933 40 0.979004 31.046 0.979004 20C0.979004 8.954 9.933 0 20.979 0ZM20.979 10C20.6165 10 20.2663 10.1313 19.9931 10.3695C19.72 10.6078 19.5423 10.9369 19.493 11.296L19.479 11.5V18.5H12.479C12.099 18.5001 11.7331 18.6445 11.4554 18.9039C11.1777 19.1634 11.0089 19.5186 10.983 19.8978C10.957 20.2769 11.076 20.6518 11.3159 20.9466C11.5557 21.2414 11.8985 21.4342 12.275 21.486L12.479 21.5H19.479V28.5C19.4791 28.88 19.6235 29.2459 19.8829 29.5236C20.1424 29.8013 20.4976 29.9701 20.8768 29.9961C21.2559 30.022 21.6308 29.903 21.9256 29.6631C22.2204 29.4233 22.4132 29.0805 22.465 28.704L22.479 28.5V21.5H29.479C29.8591 21.4999 30.2249 21.3555 30.5026 21.0961C30.7803 20.8366 30.9492 20.4814 30.9751 20.1022C31.001 19.7231 30.882 19.3482 30.6421 19.0534C30.4023 18.7586 30.0595 18.5658 29.683 18.514L29.479 18.5H22.479V11.5C22.479 11.1022 22.321 10.7206 22.0397 10.4393C21.7584 10.158 21.3768 10 20.979 10Z"
                    fill="#8C8CA2"
                  />
                </svg>
              </div>
              <span>請選擇圖片</span>
            </div>
          </Dragger>
        </Panel>
        <Panel header="平面圖" key="2" className={scss.panel}>
          <p>{'平面圖'}</p>
        </Panel>
        <Panel header="設計圖" key="3" className={scss.panel}>
          <p>{'設計圖'}</p>
        </Panel>
        <Panel header="色卡" key="4" className={scss.panel}>
          <p>{'色卡'}</p>
        </Panel>
        <Panel header="施工圖" key="5" className={scss.panel}>
          <p>{'施工圖'}</p>
        </Panel>
      </Collapse>
    </div>
  );
}

// ==================================================

const options = [
  { value: '簽認圖', label: '簽認圖' },
  { value: '平面圖', label: '平面圖' },
  { value: '設計圖', label: '設計圖' },
  { value: '色卡', label: '色卡' },
  { value: '施工圖', label: '施工圖' },
];
