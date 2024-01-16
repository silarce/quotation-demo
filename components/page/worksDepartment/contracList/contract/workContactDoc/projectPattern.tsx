import { useState, useEffect } from 'react';
import classNames from 'classnames';

// antd
import { Select, Collapse } from 'antd';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import scss from './projectPattern.module.scss';

// =======================================================================
const { Panel } = Collapse;

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
          <p>{'簽認圖'}</p>
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
