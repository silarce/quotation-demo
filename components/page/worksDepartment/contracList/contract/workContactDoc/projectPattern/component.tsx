import { useContext, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';

import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

import { AppContext } from 'pages/_app';

// antd
import { Upload, Image as AntdImage, Spin } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import ProcessChain, { TstatusLabelProps } from 'components/global/gear/processChain';
import ReviewFlowSelector from 'components/composition/review/reviewFlowSelector';
import { useReviewFlow } from 'components/composition/review/reviewFlow';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// icon
import iconGrayAddCircle from 'public/image/icon/grayAddCircle.svg';
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

// api
import {
  TfileDto,
  TengineeringContactAttachmentType,
  useGetEngineeringContact,
  useEngineeringContactAttachments,
} from 'js/api/api_engineering';

import type { TpatternType } from '.';

import scss from './projectPattern.module.scss';

// =========================================================================================================

type Tquery = {
  engineeringContactId?: string;
  patternType?: TengineeringContactAttachmentType;
  document_uuid?: string;
  document_id?: string;
};

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

const BtnBar = ({ onSubmitClick }: { onSubmitClick?: (() => void) | null }) => {
  return (
    <div className={scss.btnBar}>
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
  engineeringContactId,
  patternType,
  props,
  onSubmiSuccess,
  onDeleteSuccess,
}: // isDetailSubmit,
// statusArr,
// isReviewer,
// confirmReqSubmitPattern,
// reqReviewPattern,
// setReviewConfirm,
{
  engineeringContactId?: string | null | undefined;
  patternType: TpatternType;
  props: Parameters<typeof ImageDragger>[0];
  onSubmiSuccess: () => void;
  onDeleteSuccess: () => void;
  // isDetailSubmit: boolean;
  // isReviewer: boolean;
  // confirmReqSubmitPattern: (patternType: TpatternType) => void;
  // reqReviewPattern: (props: { attachmentType: string; isPass: boolean }) => void;
  // setReviewConfirm: (confirm: (isPass: boolean) => void) => void;
  // statusArr: TstatusLabelProps[];
}) => {
  const { userInfo } = useContext(AppContext);
  const userId = userInfo?.employee?.id;

  const { name: patternName } = lookup_pattern[patternType];

  const { ReviewFlow, reqAddReview, reqSentReviewStop, isAllReviewPass } = useReviewFlow({
    uuid: engineeringContactId,
    document_id: patternType,
    reviewBackAnyStatus: true,
  });

  const handle_submit = () => {
    const { destroy } = ReviewFlowSelector.open2({
      userId: userId,
      onConfirm({ reviewFlowId, purpose }) {
        if (!reviewFlowId) {
          return;
        }

        if (!userId) {
          throw new Error('handle_submit: userId is undefined');
        }

        reqAddReview({
          review_id: reviewFlowId,
          // document_uuid: engineeringContactId,
          // document_id: patternType,
          // document_type: '工程圖表',
          document_type: patternName,
          user_id: userId,
          document_title: purpose,
          query: {
            engineeringContactId: engineeringContactId || undefined,
            patternType,
            document_uuid: engineeringContactId || undefined,
            document_id: patternType,
          },
        }).then(() => {
          onSubmiSuccess();
        });

        destroy();
      },
    });
  };

  const handleRemove = async () => {
    const onRemoveClick = props.onRemoveClick;

    myAlert.confirm({
      title: '確定移除?',
      content: (
        <span>
          移除後無法復原
          <br />
          重新上傳需要重新審核
        </span>
      ),
      props: {
        onOk: async () => {
          await reqSentReviewStop()
            .then(async () => await onRemoveClick?.())
            .then(async () => onDeleteSuccess());
        },
      },
    });
  };

  return (
    <div>
      <BtnBar onSubmitClick={isAllReviewPass ? null : handle_submit} />

      <ImageDragger {...props} onRemoveClick={handleRemove} />

      <br />
      <ReviewFlow />
    </div>
  );
};

// MARK:Pattern_readonly
const Pattern_readonly = () => {
  const router = useRouter();
  const { engineeringContactId, patternType } = router.query as Tquery;

  const { ReviewFlow } = useReviewFlow();

  const { data: { projectName = '', projectContent = '' } = {}, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  const {
    update: update_pattern,
    floorPlanPatternArr,
    designDiagramPatternArr,
    colorCardPatternArr,
    pattern_constructionArr,
    pattern_detailArr,
  } = useEngineeringContactAttachments(engineeringContactId);

  const imgSrc = useMemo(() => {
    const lookup: Record<TengineeringContactAttachmentType, TfileDto[]> = {
      color: colorCardPatternArr,
      construction: pattern_constructionArr,
      detail: pattern_detailArr,
      floor: floorPlanPatternArr,
      design: designDiagramPatternArr,
    };

    const pattern = patternType ? lookup[patternType] : undefined;
    const fileInfo_pattern = pattern?.[0] as TfileDto | undefined;

    if (!fileInfo_pattern) {
      return undefined;
    }

    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${fileInfo_pattern.id}`;
  }, [
    patternType,
    floorPlanPatternArr,
    designDiagramPatternArr,
    colorCardPatternArr,
    pattern_constructionArr,
    pattern_detailArr,
  ]);

  const name = patternType ? lookup_pattern[patternType].name : '';

  useEffect(() => {
    update_engineeringContact();
  }, [engineeringContactId]);

  useEffect(() => {
    patternType && update_pattern(patternType);
  }, [engineeringContactId, patternType]);

  return (
    <div>
      <h1 className="text-3xl text-main">{name}</h1>
      <InputSel caption="工程名稱" wrapperStyle={{ width: 400 }} node={projectName} />
      <br />
      <InputSel caption="工程內容" wrapperStyle={{ width: 400 }} node={projectContent} />
      <br />
      <br />
      <AntdImage src={imgSrc} alt="沒有取得工程圖表" height="500px" />
      <br />
      <br />
      <ReviewFlow />
    </div>
  );
};

const lookup_pattern = {
  color: {
    name: '色卡',
  },
  construction: {
    name: '施工圖',
  },
  detail: {
    name: '簽認圖',
  },
  floor: {
    name: '平面圖',
  },
  design: {
    name: '設計圖',
  },
} as const;

export { ImageDragger, BtnBar, Pattern, Pattern_readonly };
