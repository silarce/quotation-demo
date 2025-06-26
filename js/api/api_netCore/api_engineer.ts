import { useState, useEffect } from 'react';

import { axi_netCore } from '../_axiosCreator';

import { AxiosError } from 'axios';

import type { TengineerContactExport } from './_schemas';

import { useEngineeringContactAttachments } from '../api_engineering';

// ==========================================================

// 網址：https://localhost:44383/api/Engineer/GetEngineerContactExport?contactId=工程聯絡單id

const apiGetEngineerContactExport = async (contactId: string) => {
  const api = '/api/Engineer/GetEngineerContactExport';

  const params = {
    contactId,
  };

  return axi_netCore.get<TengineerContactExport>(api, { params }).then(({ data }) => data);
};

const useApiEngineerContactExport = (
  contactId: string | undefined,
  {
    autoUpdate = true,
  }: {
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<TengineerContactExport | null>();

  const {
    floorPlanPatternArr,
    designDiagramPatternArr,
    colorCardPatternArr,
    pattern_constructionArr,
    pattern_detailArr,
    updateAll: updateAllAttachment,
  } = useEngineeringContactAttachments(contactId);

  const patternList = {
    floorPlan: floorPlanPatternArr,
    designDiagram: designDiagramPatternArr,
    colorCard: colorCardPatternArr,
    construction: pattern_constructionArr,
    detail: pattern_detailArr,
  };

  const hasPattern = {
    floorPlan: floorPlanPatternArr.length > 0,
    designDiagram: designDiagramPatternArr.length > 0,
    colorCard: colorCardPatternArr.length > 0,
    construction: pattern_constructionArr.length > 0,
    detail: pattern_detailArr.length > 0,
  };

  const hasPattern_bool =
    floorPlanPatternArr.length > 0 ||
    designDiagramPatternArr.length > 0 ||
    colorCardPatternArr.length > 0 ||
    pattern_constructionArr.length > 0 ||
    pattern_detailArr.length > 0;

  const update = async () => {
    if (!contactId) {
      setData(undefined);

      return;
    }

    setIsFetching(true);

    try {
      const data = await apiGetEngineerContactExport(contactId);
      setData(data);
      await updateAllAttachment();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('API Error:', error.message);
      } else {
        console.error('未知錯誤:', error);
      }

      setData(null);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    autoUpdate && update();
  }, [contactId]);

  return {
    isFetching,
    engineerContactExport: data,
    patternList,
    hasPattern,
    hasPattern_bool,
    update,
  };
};

export { useApiEngineerContactExport };
export type { TengineerContactExport };
