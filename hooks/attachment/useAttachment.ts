import { useState, useEffect, useMemo, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { axi } from 'js/api/_axiosCreator';

import { createFileUrl } from 'js/api/api_file';
import { TfileDto } from 'js/api/dtoTypes';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/lib/upload';

// ===============================================================================

// interface TfileInfo {
//   uid: string;
//   url: string;
//   name: string;
//   isNew?: boolean;
// }
// type TfileInfo = {
//   uid: string;
//   url: string;
//   name: string;
//   isNew?: boolean;
// } & UploadFile;
type TfileInfo = UploadFile & {
  // uid: string;
  url: string;
  // name: string;
  isNew?: boolean;
};

interface Tkit {
  fileInfo: TfileInfo;
  remove: () => void;
}

type Traw = Pick<TfileDto, 'id' | 'name'>;

// ===============================================================================

// 未來要找時間把把重構的報價單用的useAttachment替換為這一個版本

// 這個版本可以直接用在antd的Upload上
const useAttachment = ({
  rawArr,
  resetTrigger,
  kitOption,
}: {
  rawArr: Traw[] | undefined | null;
  resetTrigger?: any; // 基本上會放disabled
  kitOption?: {
    removeWithConfirm?: boolean;
  };
}) => {
  if (!Array.isArray(resetTrigger)) {
    resetTrigger = [resetTrigger];
  }

  const defaultState = useDefaultState(rawArr);

  const [fileInfoArr, setFileInfoArr] = useState<TfileInfo[]>(defaultState);
  const [willDeleteArr, setWillDeleteArr] = useState<TfileInfo[]>([]);

  const addFile = (files: File | RcFile | (File | RcFile)[]) => {
    setFileInfoArr((prev) => {
      let arr: (File | RcFile)[] = [];

      if (!Array.isArray(files)) {
        arr = [files];
      } else {
        arr = files;
      }

      const infoArr: TfileInfo[] = arr.map((file) => {
        const {
          name,
          // type
        } = file;

        let uid = 'new-' + nanoid();

        if ('uid' in file) {
          uid = file.uid;
        }

        const fileSrc = URL.createObjectURL(file);

        const fileInfo: TfileInfo = {
          uid: uid,
          url: fileSrc,
          name,
          isNew: true,
        };

        return fileInfo;
      });

      return [...prev, ...infoArr];
    });
  };

  const removeFile = (indexOrId: number | string) => {
    const copy = [...fileInfoArr];
    const copy_delete = [...willDeleteArr];

    const index = typeof indexOrId === 'number' ? indexOrId : null;
    const id = typeof indexOrId === 'string' ? indexOrId : null;

    const targetFileInfo = index !== null ? copy[index] : copy.find((item) => item.uid === id);

    if (!targetFileInfo) {
      console.error('removeFile: targetFileInfo not found');
      console.error('indexOrId', indexOrId);
      console.error('copy', copy);
      myAlert.err({ title: '移除附件失敗', content: '找不到目標附件' });

      return;
    }

    copy.splice(copy.indexOf(targetFileInfo), 1);

    if (!targetFileInfo.isNew) {
      copy_delete.push(targetFileInfo);
    }

    setFileInfoArr(copy);
    setWillDeleteArr(copy_delete);
  };

  const removeFile_withConfirm = (indexOrId: number | string) => {
    myAlert.confirm({
      title: '確定要移除嗎',
      props: {
        onOk: () => {
          removeFile(indexOrId);
        },
      },
    });
  };

  const createKitArr = useCallback((): Tkit[] => {
    const { removeWithConfirm } = kitOption ?? {};

    return fileInfoArr.map((info, index) => {
      const kit: Tkit = {
        fileInfo: info,
        remove: () => {
          !removeWithConfirm && removeFile(index);
          removeWithConfirm && removeFile_withConfirm(index);
        },
      };

      return kit;
    });
  }, [fileInfoArr]);

  useEffect(() => {
    setFileInfoArr(defaultState);
    setWillDeleteArr([]);
  }, [defaultState, ...resetTrigger]);

  return {
    fileInfoArr,
    willDeleteArr,
    addFile,
    removeFile,
    // createFileArr: () => createFileArr(fileInfoArr),
    getAttachmentFormData: () => fileInfoToFormData(fileInfoArr),

    createKitArr,
    removeFile_withConfirm,
  };
};

// ===============================================================================
const useDefaultState = (rawArr: Traw[] | undefined | null) => {
  const defaultState: TfileInfo[] = useMemo(() => {
    if (!rawArr) {
      return [];
    }

    const arr: TfileInfo[] = rawArr.map((raw) => {
      const fileInfo: TfileInfo = {
        uid: raw.id,
        url: createFileUrl(raw.id),
        name: raw.name,
      };

      return fileInfo;
    });

    return arr;
  }, [rawArr]);

  return defaultState;
};

const createFromDataArr = (fileArr: File[]) => {
  const formDataArr: FormData[] = [];

  for (const file of fileArr) {
    const formData = new FormData();
    formData.append('file', file);
    formDataArr.push(formData);
  }

  return formDataArr;
};

const createFileArr = async (fileInfoArr: TfileInfo[]) => {
  const arr: File[] = [];

  for (const file of fileInfoArr) {
    const url = file.url;
    const isBlob = url.startsWith('blob:');
    await axi
      .get(url, {
        baseURL: isBlob ? '' : undefined,
        responseType: 'blob',
      })
      .then(({ data }) => {
        const fileName = file.name;
        const fileType = data.type || 'application/octet-stream';
        const fileObj = new File([data], fileName, { type: fileType });
        arr.push(fileObj);
      })
      .catch((err) => Promise.reject(err));
  }

  return arr;
};

const fileInfoToFormData = async (fileInfoArr: TfileInfo[]) => {
  const fileArr = await createFileArr(fileInfoArr);

  const formDataArr = createFromDataArr(fileArr);

  return formDataArr;
};

export { useAttachment, fileInfoToFormData };
