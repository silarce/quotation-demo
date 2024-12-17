import { useState, useEffect, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { axi } from 'js/api/_axiosCreator';

import { createFileUrl } from 'js/api/api_file';
import { TfileDto } from 'js/api/dtoTypes';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

interface TfileInfo {
  id: string;
  url: string;
  name: string;
}

interface Tkit {
  fileInfo: TfileInfo;
  remove: () => void;
}

const useAttachment = ({
  //
  resetTrigger,
  rawArr,
  kit = { removeWithConfirm: true },
}: {
  resetTrigger: any;
  rawArr: TfileDto[] | undefined | null;
  kit?: {
    removeWithConfirm?: boolean;
  };
}) => {
  if (!Array.isArray(resetTrigger)) {
    resetTrigger = [resetTrigger];
  }

  const defaultState = useDefaultState(rawArr);

  const [fileInfoArr, setFileInfoArr] = useState<TfileInfo[]>(defaultState);

  const addFile = (files: File | File[]) => {
    let arr: File[] = [];

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

      const fileSrc = URL.createObjectURL(file);

      return {
        id: 'new-' + nanoid(),
        url: fileSrc,
        name,
      };
    });

    setFileInfoArr([...fileInfoArr, ...infoArr]);
  };

  // w 不呼叫刪除的api，是因為應該會導致不同版本的content的附件缺失
  const removeFile = (indexOrId: number | string) => {
    let copy = [...fileInfoArr];

    const index = typeof indexOrId === 'number' ? indexOrId : null;
    const id = typeof indexOrId === 'string' ? indexOrId : null;

    if (index !== null) {
      copy.splice(index, 1);
    } else if (id !== null) {
      copy = copy.filter((item) => item.id !== id);
    }

    setFileInfoArr(copy);
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

  const createFileArr = async () => {
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

  const fileInfoKitArr: Tkit[] = useMemo(() => {
    const { removeWithConfirm } = kit;

    return fileInfoArr.map((info, index) => {
      return {
        fileInfo: info,
        remove: () => {
          !removeWithConfirm && removeFile(index);
          removeWithConfirm && removeFile_withConfirm(index);
        },
      };
    });
  }, [fileInfoArr]);

  useEffect(() => {
    setFileInfoArr(defaultState);
  }, [defaultState, ...resetTrigger]);

  return {
    fileInfoArr,
    fileInfoKitArr,
    addFile,
    removeFile,
    removeFile_withConfirm,
    createFileArr,
    //
  };
};

// ============================================================================

const useDefaultState = (rawArr: TfileDto[] | undefined | null) => {
  const defaultState: TfileInfo[] = useMemo(() => {
    if (!rawArr) {
      return [];
    }

    const arr: TfileInfo[] = rawArr.map((raw) => {
      return {
        id: raw.id,
        url: createFileUrl(raw.id),
        name: raw.name,
      };
    });

    return arr;
  }, [rawArr]);

  return defaultState;
};

export { useAttachment };
