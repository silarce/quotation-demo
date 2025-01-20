import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

// antd
import { Upload, Image as AntdImage, Spin } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import ProcessChain, { TstatusLabelProps } from 'components/global/gear/processChain';

import scss from './projectPattern.module.scss';

// icon
import iconGrayAddCircle from 'public/image/icon/grayAddCircle.svg';
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

import type { TpatternType } from '.';

// =========================================================================================================

const { Dragger } = Upload;

const checkAndReturnMethod = ({ check, method }: { check: boolean; method: () => void }) => {
  if (check) {
    return method;
  } else {
    return null;
  }
};

// =========================================================================================================
// MARK:ImageDragger
const ImageDragger = ({
  fileSrc,
  isImage,
  onRemoveClick,
  onDraggerChange,
  isUploading,
  fileName,
}: {
  fileSrc?: string | undefined;
  isImage: boolean;
  onRemoveClick: (() => void) | null;
  onDraggerChange: (e: UploadChangeParam) => void;
  isUploading: boolean;
  fileName: string;
}) => {
  return (
    <>
      <div className={classNames('relative w-fit', !fileSrc && 'hidden')}>
        {isImage && <AntdImage className={scss.antdImage} src={fileSrc ?? ''} alt={fileName} />}

        {!isImage && <Link href={fileSrc ?? ''}>{fileName}</Link>}

        {onRemoveClick && <IconRemove02 className="global_absoluteRightTop" onClick={() => onRemoveClick()} />}
      </div>
      <div className={classNames(scss.draggerContainer, fileSrc && 'hidden')}>
        <Spin spinning={isUploading} size="large">
          <Dragger
            className={classNames(scss.antdDragger, scss.plus)}
            onChange={(e) => {
              onDraggerChange(e);
            }}
            fileList={[]}
          >
            <div className={scss.dragTip}>
              <div>
                <Image src={iconGrayAddCircle} alt="" />
              </div>
              <span>請選擇圖片</span>
            </div>
          </Dragger>
        </Spin>
      </div>
    </>
  );
};

// MARK:BtnBar

const BtnBar = ({
  onReviewClick,
  onSubmitClick,
  shouldRender = true,
}: {
  onReviewClick?: (() => void) | null;
  onSubmitClick?: (() => void) | null;
  shouldRender?: boolean;
}) => {
  if (!shouldRender) {
    return null;
  }

  return (
    <div className={scss.btnBar}>
      {onReviewClick && <MyButton_v2 onClick={onReviewClick}>審核</MyButton_v2>}
      {onSubmitClick && (
        <MyButton_v2 onClick={onSubmitClick} theme="danger">
          送審
        </MyButton_v2>
      )}
    </div>
  );
};

// MARK:Pattern

const Pattern = ({
  patternType,
  props,
  isDetailSubmit,
  statusArr,
  isReviewer,
  confirmReqSubmitPattern,
  reqReviewPattern,
  setReviewConfirm,
}: {
  patternType: TpatternType;
  props: Parameters<typeof ImageDragger>[0];
  isDetailSubmit: boolean;
  isReviewer: boolean;
  confirmReqSubmitPattern: (patternType: TpatternType) => void;
  reqReviewPattern: (props: { attachmentType: string; isPass: boolean }) => void;
  setReviewConfirm: (confirm: (isPass: boolean) => void) => void;
  statusArr: TstatusLabelProps[];
}) => {
  return (
    <div>
      <BtnBar
        shouldRender={!!props.fileSrc}
        onSubmitClick={checkAndReturnMethod({
          check: !isDetailSubmit,
          method: () => confirmReqSubmitPattern(patternType),
        })}
        onReviewClick={checkAndReturnMethod({
          check: isDetailSubmit && isReviewer,
          method: () => {
            const theReviewconfirm = (isPass: boolean) => {
              reqReviewPattern({
                attachmentType: patternType,
                isPass,
              });
            };

            setReviewConfirm(() => theReviewconfirm);
          },
        })}
      />
      <ImageDragger {...props} />

      {isDetailSubmit && (
        <ProcessChain
          className="mt-5"
          control={{
            statusArr: statusArr,
          }}
        />
      )}
    </div>
  );
};

export { ImageDragger, BtnBar, Pattern };
