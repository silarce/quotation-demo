import { useState, useEffect } from 'react';

// antd
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

// css
import style from './listOfDeliveryOrders.module.scss';

// api
import {
  useApiGetEngineeringExchangeAttachments,
  // apiPostEngineeringExchangeAttachments,
  // apiDeleteEngineeringExchangeAttachments,
  // TfileDto,
} from 'js/api/api_engineering';

// ====================================================================

export type { UploadFile };

// ====================================================================
export default function IconEdit({
  //
  disabled,
  exchangeId,
  onChange,
  onAdd,
  onDel,
}: {
  disabled: boolean;
  exchangeId: string | undefined;
  onChange?: UploadProps['onChange'];
  onAdd?: (arr: UploadFile[]) => void;
  onDel?: (arr: string[]) => void;
}) {
  const { attachments, updateAttachments } = useApiGetEngineeringExchangeAttachments(exchangeId);

  useEffect(() => {
    updateAttachments();
  }, [exchangeId]);

  // console.log(attachments);
  // --------------------------------------------------------------------------
  const [newImgArr, setNewImgArr] = useState<UploadFile[]>([]);
  const [delImgIdArr, setDelImgIdArr] = useState<string[]>([]);

  const onDelClick = (delId: string) => {
    const attachmentsIdArr =
      attachments?.map((item) => {
        return item.id;
      }) ?? [];

    if (attachmentsIdArr.includes(delId)) {
      setDelImgIdArr((arr) => {
        return [...arr, delId];
      });
    }
  };

  // console.log(newImgArr);
  // console.log(delImgIdArr);

  useEffect(() => {
    onAdd?.(newImgArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newImgArr]);

  useEffect(() => {
    onDel?.(delImgIdArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delImgIdArr]);

  //

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileArr, setFileArr] = useState<UploadFile[]>([]);

  useEffect(() => {
    const arr: UploadFile[] =
      attachments?.map((item) => {
        return {
          uid: item.id,
          name: item.name,
          status: 'done',
          url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${item.id}`,
        };
      }) ?? [];

    setFileArr(arr);
  }, [attachments]);

  //

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  // const handleChange: UploadProps['onChange'] = async ({ file, fileList: newFileList }) => {
  const handleChange: UploadProps['onChange'] = async (props) => {
    const { file, fileList: newFileList } = props;
    let isAdd = false;
    let isDel = false;

    const haveId = newFileList.some((item) => {
      return item.uid === file.uid;
    });

    haveId ? (isAdd = true) : (isDel = true);

    if (isAdd && file.status === 'done') {
      setNewImgArr((arr) => {
        return [...arr, file];
      });
    }

    if (isDel) {
      const delIndex = newImgArr.findIndex((item) => {
        return item.uid === file.uid;
      });

      if (delIndex > -1) {
        const delIndex = newImgArr.findIndex((item) => {
          return item.uid === file.uid;
        });

        setNewImgArr((arr) => {
          const copyArr = [...arr];
          copyArr.splice(delIndex, 1);

          return copyArr;
        });
      }

      // setDelImgIdArr((arr) => {
      //   return [...arr, file.uid];
      // });
      onDelClick(file.uid);
    }

    setFileArr(newFileList);

    onChange?.(props);
  };

  //
  const closePreview = () => setPreviewOpen(false);

  // -------------------------------------------------------------

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // -------------------------------------------------------------
  return (
    <div className={style.iconEdit}>
      <div className={style.head}>
        <span>圖示</span>
      </div>
      {/*  */}

      <div className={style.gallery}>
        <Upload
          // action={`${process.env.NEXT_PUBLIC_API_BASE_URL}/engineering/exchange/${exchangeId}/attachments`}
          disabled={disabled}
          listType="picture-card"
          fileList={fileArr}
          onPreview={handlePreview}
          onChange={handleChange}
          withCredentials={true}
          multiple={true} // 一次選擇多張圖片會使圖片不顯示，還不知道問題在哪
        >
          {/* {fileList.length >= 8 ? null : uploadButton} */}
          {uploadButton}
        </Upload>
      </div>

      <Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={closePreview}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      {/*  */}
    </div>
  );
}
// ===============================================================================

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// [
//   {
//     uid: '-1',
//     name: 'image.png',
//     status: 'done',
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//   },
//   {
//     uid: '-2',
//     name: 'image.png',
//     status: 'done',
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//   },
//   {
//     uid: '-3',
//     name: 'image.png',
//     status: 'done',
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//   },
//   {
//     uid: '-4',
//     name: 'image.png',
//     status: 'done',
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//   },
//   {
//     uid: '-xxx',
//     percent: 50,
//     name: 'image.png',
//     status: 'uploading',
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//   },
//   {
//     uid: '-5',
//     name: 'image.png',
//     status: 'error',
//   },
//   {
//     uid: '-6',
//     name: 'image.png',
//     status: 'done',
//     url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${'38406e73-24a5-4321-aca3-d6a310817b55'}`,
//   },
// ]
