import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

// antd
import { Select, Collapse, Upload, Image as AntdImage, Spin } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import ProcessChain, { Tcontrol_processChain, TstatusLabelProps } from 'components/global/gear/processChain';
import MultButtonModal from 'components/global/gear/modal/simpleModal/multButtonModal';

import scss from './projectPattern.module.scss';

// icon
import iconGrayAddCircle from 'public/image/icon/grayAddCircle.svg';
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

// api
import {
  apiPostEngineeringContactAttachments,
  apiDeleteEngineeringContactAttachments,
  useEngineeringContactAttachments,
  TengineeringContactAttachmentType,
  TfileDto,
  // 送審
  apiPatchEngineeringContactSubmitAttachment,
  // 審核
  apiPatchEngineeringContactReviewAttachment,
} from 'js/api/api_engineering';

// =======================================================================
const { Panel } = Collapse;
const { Dragger } = Upload;

// =======================================================================

type TpatternType = Exclude<TengineeringContactAttachmentType, 'signature'>;

type TpatternList = {
  [key in TpatternType]: {
    id: string | undefined;
    src: string | undefined;
  };
};

type TisUploading = {
  [key in TpatternType]: boolean;
};

type ThasPattern = {
  hasColor: boolean;
  hasConstruction: boolean;
  hasDetail: boolean;
  hasFloor: boolean;
  hasDesign: boolean;
};

type TpatternReviewProcess = {
  sales: Tcontrol_processChain;
  worker: Tcontrol_processChain;
  manager: Tcontrol_processChain;
};

type TpatternReviewProcessGroup = {
  color: TpatternReviewProcess;
  construction: TpatternReviewProcess;
  detail: TpatternReviewProcess;
  floor: TpatternReviewProcess;
  design: TpatternReviewProcess;
};

type TpatternReviewStatus = {
  salesName: string;
  workerName: string;
  managerName: string;
  pattern: {
    color: {
      colorToWorkerAt: string | null;
      colorWorkerReviewedAt: string | null;
      colorToManagerAt: string | null;
      colorManagerReviewedAt: string | null;
    };
    construction: {
      constructionToWorkerAt: string | null;
      constructionWorkerReviewedAt: string | null;
      constructionToManagerAt: string | null;
      constructionManagerReviewedAt: string | null;
    };
    detail: {
      detailToWorkerAt: string | null;
      detailWorkerReviewedAt: string | null;
      detailToManagerAt: string | null;
      detailManagerReviewedAt: string | null;
    };
    floor: {
      floorToWorkerAt: string | null;
      floorWorkerReviewedAt: string | null;
      floorToManagerAt: string | null;
      floorManagerReviewedAt: string | null;
    };
    design: {
      designToWorkerAt: string | null;
      designWorkerReviewedAt: string | null;
      designToManagerAt: string | null;
      designManagerReviewedAt: string | null;
    };
  };
};

export type {
  //
  ThasPattern,
  TpatternReviewProcessGroup,
  TpatternReviewProcess,
  TpatternReviewStatus,
};

// =======================================================================
export default function ProjectPattern({
  engineeringContactId,
  onPatternChange,
  patternReviewStatus,
  onSubmitSuccess,
  onReviewSuccess,
}: {
  engineeringContactId: string | null | undefined;
  onPatternChange: (hasPattern: ThasPattern) => void;
  patternReviewStatus: TpatternReviewStatus;
  onSubmitSuccess: () => void;
  onReviewSuccess: () => void;
}) {
  const [isUploading, setIsUploading] = useState<TisUploading>({
    floor: false,
    detail: false,
    color: false,
    construction: false,
    design: false,
  });

  const isUploading_any = Object.values(isUploading).some((v) => v);

  const [reviewConfirm, setReviewConfirm] = useState<(isPass: boolean) => void>();

  // -----------------------------------------------------------------------

  const {
    floorPlanPatternArr,
    designDiagramPatternArr,
    colorCardPatternArr,
    pattern_constructionArr,
    pattern_detailArr,
    update,
    updateAll,
  } = useEngineeringContactAttachments(engineeringContactId);

  useEffect(() => {
    updateAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineeringContactId]);

  useEffect(() => {
    onPatternChange({
      hasColor: colorCardPatternArr.length > 0,
      hasConstruction: pattern_constructionArr.length > 0,
      hasDetail: pattern_detailArr.length > 0,
      hasFloor: floorPlanPatternArr.length > 0,
      hasDesign: designDiagramPatternArr.length > 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    //
    floorPlanPatternArr,
    designDiagramPatternArr,
    colorCardPatternArr,
    pattern_constructionArr,
    pattern_detailArr,
  ]);

  const fileInfo_floor = floorPlanPatternArr?.[0] as TfileDto | undefined;
  const fileSrc_floor = fileInfo_floor
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${fileInfo_floor.id}`
    : undefined;
  const fileInfo_design = designDiagramPatternArr?.[0] as TfileDto | undefined;
  const fileSrc_design = fileInfo_design
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${fileInfo_design.id}`
    : undefined;
  const fileInfo_color = colorCardPatternArr?.[0] as TfileDto | undefined;
  const fileSrc_color = fileInfo_color
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${fileInfo_color.id}`
    : undefined;
  const fileInfo_construction = pattern_constructionArr?.[0] as TfileDto | undefined;
  const fileSrc_construction = fileInfo_construction
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${fileInfo_construction.id}`
    : undefined;
  const fileInfo_detail = pattern_detailArr?.[0] as TfileDto | undefined;
  const fileSrc_detail = fileInfo_detail
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${fileInfo_detail.id}`
    : undefined;

  const patternList: TpatternList = {
    floor: {
      id: fileInfo_floor?.id,
      src: fileSrc_floor,
    },
    design: {
      id: fileInfo_design?.id,
      src: fileSrc_design,
    },
    color: {
      id: fileInfo_color?.id,
      src: fileSrc_color,
    },
    construction: {
      id: fileInfo_construction?.id,
      src: fileSrc_construction,
    },
    detail: {
      id: fileInfo_detail?.id,
      src: fileSrc_detail,
    },
  } as const;

  // -----------------------------------------------------------------------
  const reqUploadPattern = async (file: File | undefined, patternType: TpatternType) => {
    const info = patternList[patternType];

    if (!file || !info || !engineeringContactId) {
      return;
    }

    const isImage = checkFileIsImage(file);

    // if (!isImage) {
    //   myAlert.info({ title: '該檔案非圖片，只能上傳圖片' });

    //   return;
    // }

    const theFile = file;
    const formData = new FormData();
    formData.append('file', theFile);

    try {
      setIsUploading((prev) => ({ ...prev, [patternType]: true }));
      await apiPostEngineeringContactAttachments(engineeringContactId, patternType, formData);
      await update(patternType);
    } catch (error) {
    } finally {
      setIsUploading((prev) => ({ ...prev, [patternType]: false }));
    }
  };

  //
  const reqDeletePattern = async (patternType: TpatternType) => {
    const id = patternList[patternType]?.id;

    if (!engineeringContactId || !id) {
      return;
    }

    try {
      await apiDeleteEngineeringContactAttachments(engineeringContactId, patternType, id);
      await update(patternType);
    } catch (error) {}
  };

  // _____________________________________________________________
  //
  const onUploadBtnClick = async () => {
    if (isUploading_any) {
      return;
    }

    if (!patternType) {
      myAlert.info({ title: '請選擇要上傳的工程圖表項目' });

      return;
    }

    if (patternList[patternType].id) {
      myAlert.info({ title: '該工程圖表項目已有圖片，請先刪除' });

      return;
    }

    await reqUploadPattern(preUploadFile, patternType);
  };

  // ---------------------------------------------------------------------0
  // 送審
  const confirmReqSubmitPattern = async (patternType: TpatternType) => {
    myAlert.confirm({
      title: '確定送審?',
      props: {
        onOk: () => {
          reqSubmitPattern(patternType);
        },
      },
    });
  };

  const reqSubmitPattern = async (patternType: TpatternType) => {
    if (engineeringContactId) {
      try {
        await apiPatchEngineeringContactSubmitAttachment(engineeringContactId, { attachmentType: patternType });
        await onSubmitSuccess();
      } catch (error) {}
    }
  };

  // 審核

  const reqReviewPattern = async ({ attachmentType, isPass }: { attachmentType: string; isPass: boolean }) => {
    if (engineeringContactId) {
      try {
        await apiPatchEngineeringContactReviewAttachment(engineeringContactId, { attachmentType, isPass });
        setReviewConfirm(undefined);
        await onReviewSuccess();
      } catch (error) {}
    }
  };

  // ---------------------------------------------------------------------
  //
  const onDraggerChange = async (e: UploadChangeParam, patternType: TpatternType) => {
    const {
      file,
      // fileList
    } = e;

    await reqUploadPattern(file.originFileObj as File | undefined, patternType);
  };

  //
  const onRemoveClick = (pattern: TpatternType) => {
    myAlert.confirm({
      title: '確定移除?',
      props: {
        onOk: () => reqDeletePattern(pattern),
      },
    });
  };

  // =======================================================================
  // 上方上傳按鈕用的
  const [preUploadFile, setPreUploadFile] = useState<File>();
  const [patternType, setPatternType] = useState<TpatternType>();

  const getFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) {
      return;
    }

    const file = e.target.files[0];
    const isImage = checkFileIsImage(file);

    // if (!isImage) {
    //   myAlert.info({ title: '該檔案非圖片，只能上傳圖片' });

    //   return;
    // }

    setPreUploadFile(file);
  };

  // -----------------------------------------------------------------------

  const props_floor: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.floor.src,
    onRemoveClick: () => onRemoveClick('floor'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'floor'),
    isUploading: isUploading.floor,
    isImage: checkFileIsImage_str(fileInfo_floor?.mime ?? ''),
    fileName: fileInfo_floor?.name ?? '',
  };
  const props_design: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.design.src,
    onRemoveClick: () => onRemoveClick('design'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'design'),
    isUploading: isUploading.design,
    isImage: checkFileIsImage_str(fileInfo_design?.mime ?? ''),
    fileName: fileInfo_design?.name ?? '',
  };
  const props_color: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.color.src,
    onRemoveClick: () => onRemoveClick('color'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'color'),
    isUploading: isUploading.color,
    isImage: checkFileIsImage_str(fileInfo_color?.mime ?? ''),
    fileName: fileInfo_color?.name ?? '',
  };
  const props_construction: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.construction.src,
    onRemoveClick: () => onRemoveClick('construction'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'construction'),
    isUploading: isUploading.construction,
    isImage: checkFileIsImage_str(fileInfo_construction?.mime ?? ''),
    fileName: fileInfo_construction?.name ?? '',
  };
  const props_detail: Parameters<typeof ImageDragger>[0] = {
    fileSrc: patternList.detail.src,
    onRemoveClick: () => onRemoveClick('detail'),
    onDraggerChange: (e: UploadChangeParam) => onDraggerChange(e, 'detail'),
    isUploading: isUploading.detail,
    isImage: checkFileIsImage_str(fileInfo_detail?.mime ?? ''),
    fileName: fileInfo_detail?.name ?? '',
  };
  // -----------------------------------------------------------------------

  const controlList = useControl_review({
    patternReviewStatus: patternReviewStatus,
  });

  // -----------------------------------------------------------------------

  return (
    <div className={scss.container}>
      <div className={scss.controlBar}>
        <Select
          className={classNames(scss.antdSelect, scss.plus)}
          options={options}
          // onChange={(v) => console.log(v)}
          onChange={(v) => setPatternType(v)}
          placeholder="選擇要上傳工程圖表項目"
          style={{ width: 359 }}
        />

        <label className={scss.preUploadBtn}>
          <span className={classNames(!preUploadFile && scss.placeholder)}>
            {preUploadFile?.name || '選擇要上傳工程圖表項目'}
          </span>
          <input
            type="file"
            className={'hidden'}
            onChange={(e) => {
              getFile(e);
            }}
          />
        </label>

        <MyButton_v2
          label="上傳圖片"
          px="px28"
          className={scss.btn_uploadImg}
          onClick={() => {
            onUploadBtnClick();
          }}
          isLoading={isUploading_any}
        />
      </div>
      {/* 簽認圖 */}
      <Collapse className={scss.antdCollapse} defaultActiveKey={['detail']}>
        <Panel header="簽認圖" key="detail" className={scss.panel}>
          <div>
            <BtnBar
              shouldRender={!!props_detail.fileSrc}
              onSubmitClick={checkAndReturnMethod({
                check: !controlList.isDetailSubmit,
                method: () => confirmReqSubmitPattern('detail'),
              })}
              onReviewClick={checkAndReturnMethod({
                check: controlList.isDetailSubmit,
                method: () => {
                  const theReviewconfirm = (isPass: boolean) => {
                    reqReviewPattern({
                      attachmentType: 'detail',
                      isPass,
                    });
                  };

                  setReviewConfirm(() => theReviewconfirm);
                },
              })}
            />
            <ImageDragger {...props_detail} />

            {controlList.isDetailSubmit && (
              <ProcessChain
                className="mt-5"
                control={{
                  statusArr: controlList.detail,
                }}
              />
            )}
          </div>
        </Panel>
        {/* 平面圖 */}
        <Panel header="平面圖" key="floor" className={scss.panel}>
          <div>
            <BtnBar
              shouldRender={!!props_floor.fileSrc}
              onSubmitClick={checkAndReturnMethod({
                check: !controlList.isFloorSubmit,
                method: () => confirmReqSubmitPattern('floor'),
              })}
              onReviewClick={checkAndReturnMethod({
                check: controlList.isFloorSubmit,
                method: () => {
                  const theReviewconfirm = (isPass: boolean) => {
                    reqReviewPattern({
                      attachmentType: 'floor',
                      isPass,
                    });
                  };

                  setReviewConfirm(() => theReviewconfirm);
                },
              })}
            />
            <ImageDragger {...props_floor} />
            {controlList.isFloorSubmit && (
              <ProcessChain
                className="mt-5"
                control={{
                  statusArr: controlList.floor,
                }}
              />
            )}
          </div>
        </Panel>
        {/* 設計圖 */}
        <Panel header="設計圖" key="design" className={scss.panel}>
          <BtnBar
            shouldRender={!!props_design.fileSrc}
            onSubmitClick={checkAndReturnMethod({
              check: !controlList.isDesignSubmit,
              method: () => confirmReqSubmitPattern('design'),
            })}
            onReviewClick={checkAndReturnMethod({
              check: controlList.isDesignSubmit,
              method: () => {
                const theReviewconfirm = (isPass: boolean) => {
                  reqReviewPattern({
                    attachmentType: 'design',
                    isPass,
                  });
                };

                setReviewConfirm(() => theReviewconfirm);
              },
            })}
          />
          <ImageDragger {...props_design} />
          {controlList.isDesignSubmit && (
            <ProcessChain
              className="mt-5"
              control={{
                statusArr: controlList.design,
              }}
            />
          )}
        </Panel>
        {/* 施工圖 */}
        <Panel header="施工圖" key="construction" className={scss.panel}>
          <BtnBar
            shouldRender={!!props_construction.fileSrc}
            onSubmitClick={checkAndReturnMethod({
              check: !controlList.isConstructionSubmit,
              method: () => confirmReqSubmitPattern('construction'),
            })}
            onReviewClick={checkAndReturnMethod({
              check: controlList.isConstructionSubmit,
              method: () => {
                const theReviewconfirm = (isPass: boolean) => {
                  reqReviewPattern({
                    attachmentType: 'construction',
                    isPass,
                  });
                };

                setReviewConfirm(() => theReviewconfirm);
              },
            })}
          />

          <ImageDragger {...props_construction} />
          {controlList.isConstructionSubmit && (
            <ProcessChain
              className="mt-5"
              control={{
                statusArr: controlList.construction,
              }}
            />
          )}
        </Panel>
        {/* 色卡 */}
        <Panel header="色卡" key="color" className={scss.panel}>
          <BtnBar
            shouldRender={!!props_color.fileSrc}
            onSubmitClick={checkAndReturnMethod({
              check: !controlList.isColorSubmit,
              method: () => confirmReqSubmitPattern('color'),
            })}
            onReviewClick={checkAndReturnMethod({
              check: controlList.isColorSubmit,
              method: () => {
                const theReviewconfirm = (isPass: boolean) => {
                  reqReviewPattern({
                    attachmentType: 'color',
                    isPass,
                  });
                };

                setReviewConfirm(() => theReviewconfirm);
              },
            })}
          />
          <ImageDragger {...props_color} />
          {controlList.isColorSubmit && (
            <ProcessChain
              className="mt-5"
              control={{
                statusArr: controlList.color,
              }}
            />
          )}
        </Panel>
      </Collapse>

      <MultButtonModal
        visible={!!reviewConfirm}
        text={'是否通過審核?'}
        onCancel={() => setReviewConfirm(undefined)}
        modalWidth={600}
        btnPropsArr={[
          {
            label: '通過審核',
            theme: 'danger',
            onClick: () => reviewConfirm?.(true),
          },
          {
            label: '不通過審核',
            onClick: () => reviewConfirm?.(false),
          },
          {
            label: '取消',
            onClick: () => setReviewConfirm(undefined),
          },
        ]}
      />
    </div>
  ); // return
}

// ==================================================

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
  onRemoveClick: () => void;
  onDraggerChange: (e: UploadChangeParam) => void;
  isUploading: boolean;
  fileName: string;
}) => {
  return (
    <>
      <div className={classNames('relative w-fit', !fileSrc && 'hidden')}>
        {isImage && <AntdImage className={scss.antdImage} src={fileSrc ?? ''} alt={fileName} />}

        {!isImage && <Link href={fileSrc ?? ''}>{fileName}</Link>}

        <IconRemove02 className="global_absoluteRightTop" onClick={() => onRemoveClick()} />
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

const BtnBar = ({
  //
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

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================

const useControl_review = ({ patternReviewStatus }: { patternReviewStatus: TpatternReviewStatus }) => {
  const controlList = useMemo(() => {
    const { salesName, workerName, managerName, pattern } = patternReviewStatus;

    const {
      color: { colorToWorkerAt, colorWorkerReviewedAt, colorToManagerAt, colorManagerReviewedAt },
      construction: {
        constructionToWorkerAt,
        constructionWorkerReviewedAt,
        constructionToManagerAt,
        constructionManagerReviewedAt,
      },
      detail: { detailToWorkerAt, detailWorkerReviewedAt, detailToManagerAt, detailManagerReviewedAt },
      floor: { floorToWorkerAt, floorWorkerReviewedAt, floorToManagerAt, floorManagerReviewedAt },
      design: { designToWorkerAt, designWorkerReviewedAt, designToManagerAt, designManagerReviewedAt },
    } = pattern;

    const checkStatus = ({ toAt, reviewedAt }: { toAt: string | null; reviewedAt: string | null }) => {
      if (reviewedAt) {
        return 'green';
      } else if (toAt) {
        return 'red';
      } else {
        return 'gray';
      }
    };

    const statusArr_design: TstatusLabelProps[] = [
      {
        label: `業務 ${salesName}`,
        dotColor: 'green',
      },
      {
        label: `工務主管 ${workerName}`,
        dotColor: checkStatus({
          toAt: designToWorkerAt,
          reviewedAt: designWorkerReviewedAt,
        }),
      },
      {
        label: `經理 ${managerName}`,
        dotColor: checkStatus({
          toAt: designToManagerAt,
          reviewedAt: designManagerReviewedAt,
        }),
      },
    ];

    const statusArr_floor: TstatusLabelProps[] = [
      { label: `業務 ${salesName}`, dotColor: 'green' },
      {
        label: `工務主管 ${workerName}`,
        dotColor: checkStatus({ toAt: floorToWorkerAt, reviewedAt: floorWorkerReviewedAt }),
      },
      {
        label: `經理 ${managerName}`,
        dotColor: checkStatus({ toAt: floorToManagerAt, reviewedAt: floorManagerReviewedAt }),
      },
    ];

    const statusArr_color: TstatusLabelProps[] = [
      { label: `業務 ${salesName}`, dotColor: 'green' },
      {
        label: `工務主管 ${workerName}`,
        dotColor: checkStatus({ toAt: colorToWorkerAt, reviewedAt: colorWorkerReviewedAt }),
      },
      {
        label: `經理 ${managerName}`,
        dotColor: checkStatus({ toAt: colorToManagerAt, reviewedAt: colorManagerReviewedAt }),
      },
    ];

    const statusArr_construction: TstatusLabelProps[] = [
      { label: `業務 ${salesName}`, dotColor: 'green' },
      {
        label: `工務主管 ${workerName}`,
        dotColor: checkStatus({
          toAt: constructionToWorkerAt,
          reviewedAt: constructionWorkerReviewedAt,
        }),
      },
      {
        label: `經理 ${managerName}`,
        dotColor: checkStatus({
          toAt: constructionToManagerAt,
          reviewedAt: constructionManagerReviewedAt,
        }),
      },
    ];

    const statusArr_detail: TstatusLabelProps[] = [
      { label: `業務 ${salesName}`, dotColor: 'green' },
      {
        label: `工務主管 ${workerName}`,
        dotColor: checkStatus({ toAt: detailToWorkerAt, reviewedAt: detailWorkerReviewedAt }),
      },
      {
        label: `經理 ${managerName}`,
        dotColor: checkStatus({ toAt: detailToManagerAt, reviewedAt: detailManagerReviewedAt }),
      },
    ];

    return {
      color: statusArr_color,
      construction: statusArr_construction,
      detail: statusArr_detail,
      floor: statusArr_floor,
      design: statusArr_design,

      isColorSubmit: !!colorToWorkerAt,
      isConstructionSubmit: !!constructionToWorkerAt,
      isDetailSubmit: !!detailToWorkerAt,
      isFloorSubmit: !!floorToWorkerAt,
      isDesignSubmit: !!designToWorkerAt,
    };

    //
  }, [patternReviewStatus]);

  return controlList;
};

// ==================================================

const checkFileIsImage = (file: File) => {
  const imageReg = /^image/;
  const isImage = imageReg.test(file.type);

  return isImage;
};

const checkFileIsImage_str = (str: string) => {
  const imageReg = /^image/;
  const isImage = imageReg.test(str);

  return isImage;
};

const options = [
  { value: 'detail', label: '簽認圖' },
  { value: 'floor', label: '平面圖' },
  { value: 'design', label: '設計圖' },
  { value: 'construction', label: '施工圖' },
  { value: 'color', label: '色卡' },
];

const checkAndReturnMethod = ({ check, method }: { check: boolean; method: () => void }) => {
  if (check) {
    return method;
  } else {
    return null;
  }
};
