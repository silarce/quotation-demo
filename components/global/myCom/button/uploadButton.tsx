import { Upload } from 'antd';
import { PictureOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

interface LogoUploaderProps {
  defaultPreviewUrl?: string;
  onFileChange: (file: File | null) => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ defaultPreviewUrl, onFileChange }) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(defaultPreviewUrl);

  useEffect(() => {
    setPreviewUrl(defaultPreviewUrl); // 當外部有設新的預覽圖時，更新顯示
  }, [defaultPreviewUrl]);

  const handlePreview = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      setPreviewUrl(reader.result as string); // 顯示選擇的圖片
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    onFileChange(null); // 告知父層清除 file（不會清除 logo_file_id）
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-4">
        <span className="text-black font-medium">LOGO圖示</span>
        <Upload
          showUploadList={false}
          accept="image/*"
          beforeUpload={(file) => {
            handlePreview(file);
            onFileChange(file); // 傳給父層處理

            return false; // 阻止自動上傳
          }}
        >
          <div className="flex items-center border border-dashed border-blue-500 px-4 py-2 rounded cursor-pointer text-blue-700">
            <PictureOutlined className="mr-2 text-base" />
            <span>上傳檔案</span>
          </div>
        </Upload>
      </div>

      {previewUrl && (
        <div className="relative mt-2 w-fit">
          <img src={previewUrl} alt="預覽圖" className="max-w-[200px] h-auto border border-gray-300 rounded" />
          <CloseCircleOutlined
            onClick={handleRemove}
            className="absolute -top-2 -right-2 text-red-500 text-lg cursor-pointer bg-white rounded-full shadow"
          />
        </div>
      )}
    </div>
  );
};
