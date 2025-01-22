import { useMemo } from 'react';
import { TstatusLabelProps } from 'components/global/gear/processChain';

import type { TpatternReviewStatus } from '.';

const useControl_review = ({
  isReviewer_worker,
  isReviewer_manager,
  patternReviewStatus,
}: {
  patternReviewStatus: TpatternReviewStatus;
  isReviewer_worker: boolean;
  isReviewer_manager: boolean;
}) => {
  const controlList = useMemo(() => {
    let isReviewer_design = false;
    let isReviewer_color = false;
    let isReviewer_construction = false;
    let isReviewer_detail = false;
    let isReviewer_floor = false;

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

    //
    const statusArr_design: TstatusLabelProps[] = [
      {
        label: `業務 ${salesName}`,
        dotColor: 'green',
      },
      // 工務從缺，暫時拿掉
      // {
      //   label: `工務 ${workerName}`,
      //   dotColor: checkStatus({
      //     toAt: designToWorkerAt,
      //     reviewedAt: designWorkerReviewedAt,
      //   }),
      // },
      {
        label: `總經理 ${managerName}`,
        dotColor: checkStatus({
          toAt: designToManagerAt,
          reviewedAt: designManagerReviewedAt,
        }),
      },
    ];

    const statusArr_floor: TstatusLabelProps[] = [
      { label: `業務 ${salesName}`, dotColor: 'green' },
      // 工務從缺，暫時拿掉
      // {
      //   label: `工務 ${workerName}`,
      //   dotColor: checkStatus({ toAt: floorToWorkerAt, reviewedAt: floorWorkerReviewedAt }),
      // },
      {
        label: `總經理 ${managerName}`,
        dotColor: checkStatus({ toAt: floorToManagerAt, reviewedAt: floorManagerReviewedAt }),
      },
    ];

    const statusArr_color: TstatusLabelProps[] = [
      { label: `業務 ${salesName}`, dotColor: 'green' },
      // 工務從缺，暫時拿掉
      // {
      //   label: `工務 ${workerName}`,
      //   dotColor: checkStatus({ toAt: colorToWorkerAt, reviewedAt: colorWorkerReviewedAt }),
      // },
      {
        label: `總經理 ${managerName}`,
        dotColor: checkStatus({ toAt: colorToManagerAt, reviewedAt: colorManagerReviewedAt }),
      },
    ];

    const statusArr_construction: TstatusLabelProps[] = [
      { label: `業務 ${salesName}`, dotColor: 'green' },
      // 工務從缺，暫時拿掉
      // {
      //   label: `工務 ${workerName}`,
      //   dotColor: checkStatus({
      //     toAt: constructionToWorkerAt,
      //     reviewedAt: constructionWorkerReviewedAt,
      //   }),
      // },
      {
        label: `總經理 ${managerName}`,
        dotColor: checkStatus({
          toAt: constructionToManagerAt,
          reviewedAt: constructionManagerReviewedAt,
        }),
      },
    ];

    const statusArr_detail: TstatusLabelProps[] = [
      { label: `業務 ${salesName}`, dotColor: 'green' },
      // 工務從缺，暫時拿掉
      // {
      //   label: `工務 ${workerName}`,
      //   dotColor: checkStatus({ toAt: detailToWorkerAt, reviewedAt: detailWorkerReviewedAt }),
      // },
      {
        label: `總經理 ${managerName}`,
        dotColor: checkStatus({ toAt: detailToManagerAt, reviewedAt: detailManagerReviewedAt }),
      },
    ];
    //

    if ((designToManagerAt && isReviewer_manager) || (designToWorkerAt && isReviewer_worker)) {
      isReviewer_design = true;
    }

    if ((colorToManagerAt && isReviewer_manager) || (colorToWorkerAt && isReviewer_worker)) {
      isReviewer_color = true;
    }

    if ((constructionToManagerAt && isReviewer_manager) || (constructionToWorkerAt && isReviewer_worker)) {
      isReviewer_construction = true;
    }

    if ((detailToManagerAt && isReviewer_manager) || (detailToWorkerAt && isReviewer_worker)) {
      isReviewer_detail = true;
    }

    if ((floorToManagerAt && isReviewer_manager) || (floorToWorkerAt && isReviewer_worker)) {
      isReviewer_floor = true;
    }

    return {
      color: statusArr_color,
      construction: statusArr_construction,
      detail: statusArr_detail,
      floor: statusArr_floor,
      design: statusArr_design,

      // isColorSubmit: !!colorToWorkerAt,
      // isConstructionSubmit: !!constructionToWorkerAt,
      // isDetailSubmit: !!detailToWorkerAt,
      // isFloorSubmit: !!floorToWorkerAt,
      // isDesignSubmit: !!designToWorkerAt,
      isColorSubmit: !!colorToManagerAt,
      isConstructionSubmit: !!constructionToManagerAt,
      isDetailSubmit: !!detailToManagerAt,
      isFloorSubmit: !!floorToManagerAt,
      isDesignSubmit: !!designToManagerAt,

      isReviewer_design,
      isReviewer_color,
      isReviewer_construction,
      isReviewer_detail,
      isReviewer_floor,
    };

    //
  }, [patternReviewStatus]);

  return controlList;
};

export { useControl_review };
