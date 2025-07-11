import { Upload, Modal } from 'antd';
import { PictureOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

interface LogoUploaderProps {
  defaultPreviewUrl?: string;
  onFileChange: (file: File | null) => void;
  label?: React.ReactNode;
  marginLeft?: string;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ defaultPreviewUrl, onFileChange, label, marginLeft }) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(defaultPreviewUrl);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
    <div className="flex  gap-4">
      <div className="flex items-center">
        <span className={` text-[#212121] font-normal `}>{label}</span>
        <Upload
          showUploadList={false}
          accept="image/*"
          beforeUpload={(file) => {
            handlePreview(file);
            onFileChange(file); // 傳給父層處理

            return false; // 阻止自動上傳
          }}
        >
          <div
            className={` flex items-center border border-dashed border-[#14256A] px-4 py-2 rounded cursor-pointer text-[#14256A] `}
            style={{ marginLeft }}
          >
            <PictureOutlined className="mr-2 text-base" />
            <span className="text-[#14256A]">上傳檔案</span>
          </div>
        </Upload>
      </div>

      {previewUrl && (
        <div className="relative mt-2 w-fit">
          <img
            src={previewUrl}
            alt="預覽圖"
            className="max-w-[100px] h-auto border border-gray-300 rounded"
            onClick={() => setIsPreviewOpen(true)}
          />
          <Modal open={isPreviewOpen} footer={null} onCancel={() => setIsPreviewOpen(false)} centered>
            <img src={previewUrl} alt="放大預覽" className="w-full h-auto" />
          </Modal>
          <CloseCircleOutlined
            onClick={handleRemove}
            className="absolute -top-2 -right-2 text-red-500 text-lg cursor-pointer bg-white rounded-full shadow"
          />
        </div>
      )}
    </div>
  );
};
