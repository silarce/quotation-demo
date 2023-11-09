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
  apiGetEngineeringExchangeAttachments,
  apiPostEngineeringExchangeAttachments,
  apiDeleteEngineeringExchangeAttachments,
} from 'js/api/api_engineering';

// ====================================================================
export default function IconEdit({ exchangeId }: { exchangeId: string | undefined }) {
  const { attachments, updateAttachments } = useApiGetEngineeringExchangeAttachments(exchangeId);

  useEffect(() => {
    updateAttachments();
  }, [exchangeId]);

  console.log(attachments);
  // `${domain}/file/download/${item.id}`
  // --------------------------------------------------------------------------

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-3',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-4',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-xxx',
      percent: 50,
      name: 'image.png',
      status: 'uploading',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-5',
      name: 'image.png',
      status: 'error',
    },
  ]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = async ({ file, fileList: newFileList }) => {
    console.log(file);
    console.log('foo');
    setFileList(newFileList);
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
      <Upload
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        action={`${process.env.NEXT_PUBLIC_API_BASE_URL}/engineering/exchange/${exchangeId}/attachments`}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        withCredentials={true}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
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
