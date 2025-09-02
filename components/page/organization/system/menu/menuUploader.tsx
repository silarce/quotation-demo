import { Upload } from 'antd';
import { PictureOutlined, CloseOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

type LogoUploaderProps = {
  iconFile: File | null;
  setIconFile: (file: File | null) => void;
  defaultPreviewUrl?: string;
};

export const LogoUploader = ({ iconFile, setIconFile, defaultPreviewUrl }: LogoUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 根據傳入 props 動態控制預覽圖
  useEffect(() => {
    if (defaultPreviewUrl) {
      setPreviewUrl(defaultPreviewUrl);
    } else if (!iconFile) {
      setPreviewUrl(null); //清除預覽圖
    }
  }, [defaultPreviewUrl, iconFile]);

  const handlePreview = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setIconFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="flex flex-col">
      <span className=" font-bold">上傳圖示</span>

      {previewUrl ? (
        <div className="relative w-32 h-32 border border-gray-300 rounded flex items-center justify-center mt-2">
          <img src={previewUrl} alt="預覽圖" className="object-contain w-full h-full" />
          <CloseOutlined
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 cursor-pointer"
          />
        </div>
      ) : (
        <Upload
          showUploadList={false}
          accept="image/*"
          beforeUpload={(file) => {
            const isLt10M = file.size / 1024 / 1024 < 10;

            if (!isLt10M) {
              alert('圖片大小不能超過 10MB');

              return Upload.LIST_IGNORE;
            }

            setIconFile(file);
            handlePreview(file);

            return false;
          }}
        >
          <div className="flex items-center border border-dashed border-[#14256A] px-4 py-2 mt-2 rounded cursor-pointer text-[#14256A]">
            <PictureOutlined className="mr-2" />
            <span className="text-[#14256A]">上傳檔案</span>
          </div>
        </Upload>
      )}
    </div>
  );
};
