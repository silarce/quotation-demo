import classNames from 'classnames';

import { Popconfirm } from 'antd';

// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';
import iconAttacth from 'public/image/icon/attach.svg?url';

import scss from './QuotationAttachment.module.scss';

// ===============================================================================

interface Tfile {
  fileInfo: {
    name: string;
    url: string;
  };
  remove: () => void;
}

interface Tprops {
  disabled: boolean;
  fileArr: Tfile[];
  addFile: (files: File[]) => void;
}

// ===============================================================================
export default function QuotationAttachment({ disabled, fileArr, addFile }: Tprops) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const fileList = e.target.files;

    const files = Array.from(fileList);

    addFile(files);
  };

  return (
    <div className={classNames(scss.appendix, scss.listContainer)}>
      <p>附件</p>
      {fileArr.map((item, index) => {
        const {
          fileInfo: { name, url },
          remove,
        } = item;

        return (
          <div key={index} className={classNames(scss.row, scss.rowPlus)}>
            {disabled ? (
              <span></span>
            ) : (
              // 元件太舊了，會跳警告 findDOMNode is deprecated in StrictMode.
              <Popconfirm
                onConfirm={() => remove()}
                title={`"確定要移除${name}?"`}
                okText={<span className="text-white">確定</span>}
                cancelText="取消"
              >
                <IconRemoveCircle />
              </Popconfirm>
            )}
            <span className={scss.serialNumber}>
              {/*  eslint-disable-next-line @next/next/no-img-element */}
              <img src={iconAttacth.src} alt="" />
            </span>

            <a className={classNames(scss.fileName)} href={url} download={name}>
              {name}
            </a>
          </div>
        );
      })}
      <div>
        <label htmlFor="uploadImg" className={classNames(disabled && 'invisible')}>
          <input
            id="uploadImg"
            type="file"
            multiple={true}
            style={{ display: 'none' }}
            onChange={(e) => {
              onChange(e);
              e.target.value = ''; // 使可以連續選擇同樣的檔案
            }}
          />
          <IconAddCircle />
        </label>
      </div>
    </div>
  );
}
