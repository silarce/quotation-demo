import { Upload, UploadProps } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { RcFile } from 'antd/es/upload';

import Image from 'next/image';
import UploadImage from 'public/image/icon/UploadImage.svg?url';

export const LogoUploader2 = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileData, setFileData] = useState<RcFile | null>(null);

  const handlePreview = (file: RcFile) => {
    const reader = new FileReader();

    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleBeforeUpload = (file: RcFile) => {
    handlePreview(file); // 預覽
    setFileData(file); // 儲存檔案資料供後續送出 API 使用

    return false; // 阻止自動上傳
  };

  const uploadProps: UploadProps = {
    showUploadList: false,
    accept: 'image/*',
    beforeUpload: handleBeforeUpload,
  };

  return (
    <div className="flex items-start">
      {/* 左側圖片預覽區 */}
      <div className="relative w-[150px] h-[150px] border border-dashed border-[#14256A] flex items-center justify-center rounded">
        {previewUrl ? (
          <img src={previewUrl} alt="預覽圖" className="w-full h-full object-contain" />
        ) : (
          <div className="absolute top-[35px]">
            <Image src={UploadImage} alt="image" />
          </div>
        )}
      </div>

      {/* 右側選擇區 */}
      <div className="flex flex-col gap-2 ml-6">
        <Upload {...uploadProps}>
          <div className="flex items-center justify-center bg-[#14256A] text-white w-[80px] h-[40px] rounded-md  text-sm font-medium cursor-pointer">
            選擇檔案
          </div>
        </Upload>

        <div className="text-xs text-[#909090] leading-snug whitespace-nowrap mt-3">
          <div>＊ 支援 JPG、PNG 格式</div>
          <div className="mt-3">＊ 圖片大小上限 10MB</div>
        </div>
      </div>
    </div>
  );
};
