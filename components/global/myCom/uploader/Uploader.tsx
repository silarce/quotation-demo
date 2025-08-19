import { Upload, Modal } from 'antd';
import {
  PictureOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';

interface LogoUploaderProps {
  defaultPreviewUrl?: string;
  onFileChange: (file: File | null) => void;
  label?: React.ReactNode;
  marginLeft?: string;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ defaultPreviewUrl, onFileChange, label, marginLeft }) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(defaultPreviewUrl);
  const [previewType, setPreviewType] = useState<'image' | 'pdf' | 'word' | 'excel' | 'text' | undefined>();
  const [fileName, setFileName] = useState<string | undefined>();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    setPreviewUrl(defaultPreviewUrl);

    if (defaultPreviewUrl) {
      setPreviewType('image');
    }
  }, [defaultPreviewUrl]);

  const getFileType = (file: File): typeof previewType => {
    const type = file.type;
    const name = file.name.toLowerCase();

    if (type.startsWith('image/')) {
      return 'image';
    }

    if (type === 'application/pdf') {
      return 'pdf';
    }

    if (name.endsWith('.doc') || name.endsWith('.docx')) {
      return 'word';
    }

    if (name.endsWith('.xls') || name.endsWith('.xlsx')) {
      return 'excel';
    }

    if (name.endsWith('.txt')) {
      return 'text';
    }

    return undefined;
  };

  const handlePreview = (file: File) => {
    const type = getFileType(file);
    setFileName(file.name);
    setPreviewType(type);

    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(undefined); // 不是圖片就不用預覽圖
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    setPreviewType(undefined);
    setFileName(undefined);
    onFileChange(null);
  };

  const renderFileIcon = () => {
    switch (previewType) {
      case 'pdf':
        return <FilePdfOutlined className="text-red-500 text-xl mr-2" />;
      case 'word':
        return <FileWordOutlined className="text-blue-500 text-xl mr-2" />;
      case 'excel':
        return <FileExcelOutlined className="text-green-500 text-xl mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className=" gap-4">
      <div className="flex items-center">
        <span className="text-[#212121] font-normal ">{label}</span>
        <Upload
          showUploadList={false}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          beforeUpload={(file) => {
            const type = getFileType(file);

            if (!type) {
              alert('不支援此檔案格式');

              return Upload.LIST_IGNORE;
            }

            handlePreview(file);
            onFileChange(file);

            return false;
          }}
        >
          <div
            className="flex items-center border border-dashed border-[#14256A] px-4 py-2 rounded cursor-pointer text-[#14256A]"
            style={{ marginLeft }}
          >
            <PictureOutlined className="mr-2 text-base" />
            <span className="text-[#14256A]">上傳檔案</span>
          </div>
        </Upload>
      </div>

      {previewType === 'image' && previewUrl && (
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

      {previewType !== 'image' && fileName && (
        <div className="relative mt-2 pl-2 flex items-center border border-gray-300 rounded h-[40px] pr-8">
          {renderFileIcon()}
          <span className="text-sm text-[#212121]">{fileName}</span>
          <CloseCircleOutlined
            onClick={handleRemove}
            className="absolute -top-2 -right-2 text-red-500 text-lg cursor-pointer bg-white rounded-full shadow"
          />
        </div>
      )}
    </div>
  );
};
