import dynamic from 'next/dynamic';

import { useState, useEffect } from 'react';
import { Image } from 'antd';
import classNames from 'classnames';

// gear
const PdfViewer01 = dynamic(() => import('components/global/gear/pdf/pdfViewer01'));
import myAlert from '../../modal/simpleModal/alertModals';

// icon
import { IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';
// import iconAttacth from 'public/image/icon/attach.svg?url';

// import { TfileDto } from 'js/api/dtoTypes';

// css
import scss from './upload_nameList.module.scss';

// ====================================================================

type Tfile = {
  file: File;
  src: string;
  type: 'image' | 'pdf' | 'other';
  name: string;
};

type TfileOriginal = Omit<Tfile, 'file'> & { id: string };

type TonFilsChange = (props: { deleteArr: TfileOriginal[]; newFileArr: Tfile[] }) => void;

export type { TfileOriginal, Tfile, TonFilsChange };

// ====================================================================
export function Upload_nameList({
  fileArr: fileArr_original,
  disabled,
  className,
  onFilesChange,
  style: containerStyle,
  captionStyle,
}: {
  fileArr: TfileOriginal[];
  disabled?: boolean;
  className?: string;
  onFilesChange?: TonFilsChange;
  style?: React.CSSProperties;
  captionStyle?: React.CSSProperties;
}) {
  const [fileArr, setFileArr] = useState<TfileOriginal[]>([]);
  const [deletedFileDtoArr, setDeletedFileDtoArr] = useState<TfileOriginal[]>([]);
  const [newFileArr, setNewFileArr] = useState<Tfile[]>([]);

  const [showFileId, setShowFileId] = useState<string>();

  // ---------------------------------------------------------------------------

  const deleteFile = (index: number, name?: string) => {
    myAlert.confirm({
      title: '確認刪除?',
      content: name,
      props: {
        onOk: () => {
          setFileArr((arr) => {
            const newArr = [...arr];
            const deletedFileDto = newArr.splice(index, 1);
            setDeletedFileDtoArr((arr) => [...arr, ...deletedFileDto]);

            return newArr;
          });
        },
      },
    });
  };

  const deleteNewFile = (index: number, name?: string) => {
    myAlert.confirm({
      title: '確認刪除?',
      content: name,
      props: {
        onOk: () => {
          setNewFileArr((arr) => {
            const newArr = [...arr];
            newArr.splice(index, 1);

            return newArr;
          });
        },
      },
    });
  };

  const preload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || disabled) {
      return;
    }

    const file = e.target.files[0];
    const { name, type } = file;
    const isImage = type.includes('image');
    const isPDF = type.includes('pdf');
    const fileType = isImage ? 'image' : isPDF ? 'pdf' : 'other';

    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) {
        return;
      }

      const base64 = e.target.result;

      const fileObj: Tfile = {
        file,
        src: base64 as string,
        type: fileType,
        name,
      };

      setNewFileArr((arr) => {
        const newArr = [...arr, fileObj];

        return newArr;
      });
    };

    reader.readAsDataURL(file);
  };

  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (disabled) {
      setFileArr(fileArr_original);
      setNewFileArr([]);
      setDeletedFileDtoArr([]);
    }
  }, [fileArr_original, disabled]);

  useEffect(() => {
    onFilesChange &&
      onFilesChange({
        deleteArr: deletedFileDtoArr,
        newFileArr,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedFileDtoArr, newFileArr]);

  // ---------------------------------------------------------------------------

  return (
    <div className={classNames(scss.container, className)} style={containerStyle}>
      <div className={scss.left} style={captionStyle}>
        <span className={scss.caption}>附件</span>
      </div>
      {/*  */}

      <div className={scss.right}>
        <label className={classNames(scss.label, disabled && scss.disabled)}>
          <input type="file" onChange={preload} className="hidden" />
          上傳附件
        </label>

        <ul>
          {fileArr.map((item, index) => {
            const { id, name, type, src } = item;

            return (
              <li key={index}>
                <div>
                  <IconDelete01
                    className={classNames(scss.btn, disabled && scss.disabled)}
                    onClick={() => !disabled && deleteFile(index, name)}
                  />

                  {type !== 'other' && (
                    <span
                      onClick={() => {
                        setShowFileId(`${id}`);
                      }}
                    >
                      {item.name}
                    </span>
                  )}

                  {type === 'other' && (
                    <a href={src} download={name}>
                      {item.name}
                    </a>
                  )}
                </div>

                {type === 'image' && (
                  <Image
                    src={src}
                    alt={name}
                    style={{ display: 'none' }}
                    preview={{
                      visible: showFileId === id,
                      onVisibleChange: () => {
                        setShowFileId(undefined);
                      },
                    }}
                  />
                )}

                {type === 'pdf' && showFileId === String(index) && (
                  <PdfViewer01 pdfSrc={src} fileName={name} closeModal={() => setShowFileId(undefined)} />
                )}
              </li>
            );
          })}

          {newFileArr.map((item, index) => {
            const { type, src, name } = item;

            return (
              <li key={index}>
                <div>
                  <IconDelete01
                    className={classNames(scss.btn, disabled && scss.disabled)}
                    onClick={() => !disabled && deleteNewFile(index, name)}
                  />

                  {type !== 'other' && (
                    <span
                      onClick={() => {
                        setShowFileId(`${index}`);
                      }}
                    >
                      {item.name}
                    </span>
                  )}

                  {type === 'other' && (
                    <a href={src} download={name} target="_blank" rel="noreferrer">
                      {item.name}
                    </a>
                  )}
                </div>

                {type === 'image' && (
                  <Image
                    src={src}
                    alt={name}
                    style={{ display: 'none' }}
                    preview={{
                      visible: showFileId === String(index),
                      onVisibleChange: () => {
                        setShowFileId(undefined);
                      },
                    }}
                  />
                )}

                {type === 'pdf' && showFileId === String(index) && (
                  <PdfViewer01 pdfSrc={src} fileName={name} closeModal={() => setShowFileId(undefined)} />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
