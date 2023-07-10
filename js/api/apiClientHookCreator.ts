import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
// type
import { Tparams, TpageMetaDto } from './dtoTypes';

interface TgetDto_array {
  data: { [key: string]: any }[];
  meta: TpageMetaDto;
}

const createUseApi_array_infinite = <TgetDto extends TgetDto_array>({
  apiClient,
  defaultParams,
}: {
  apiClient: (params: Tparams) => Promise<TgetDto>;
  /**
      pageSize必須大於畫面一次可顯示的item數量才不會壞掉    
      不過應該只有在嚴格模式會壞掉
      沒事不要送page進來
       */
  defaultParams?: Tparams;
}) => {
  type Tdata = TgetDto['data'];
  type Tmeta = TgetDto['meta'];

  const useApi = (customParams?: Tparams) => {
    /**就只是為了render */
    const [render, setRender] = useState(0);
    const [isLoading, setIsloading] = useState(false);
    /**viewRef 不可以放在一開始就會出現在畫面上的item上，
     * 不然無法觸發nextPage */
    const [viewRef, inView] = useInView();
    const [page, setPage] = useState(1);

    const params = {
      page,
      ...defaultParams,
      ...customParams,
    } as const;

    const [dataArrQueue, setDataArrQueue] = useState<Tdata>([]);
    const [data, setData] = useState<Tdata>();
    const [meta, setMeta] = useState<Tmeta>();

    const update_infinite = async () => {
      if (meta && !meta.hasNextPage) {
        return;
      }

      const res = await apiClient(params);
      setIsloading(false);
      const dataArrQueueCopy = [...dataArrQueue];
      dataArrQueueCopy[page - 1] = res.data;
      setDataArrQueue(dataArrQueueCopy);
      setData(dataArrQueueCopy.flat());
      setMeta(res.meta);

      return res;
    };

    const nextPage = async () => {
      if (meta && !meta.hasNextPage) {
        return;
      }

      setPage(page + 1);
    };

    const reset = () => {
      setIsloading(true);
      setDataArrQueue([]);
      setData(undefined);
      setMeta(undefined);
      setPage(1);
      setRender((state) => ++state);
    };

    useEffect(() => {
      if (render === 0) {
        return;
      }

      update_infinite();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, render]);

    useEffect(() => {
      if (inView) {
        nextPage();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return {
      data,
      meta,
      setData,
      nextPage,
      reset,
      viewRef,
      isLoading,
    };
  };

  return useApi;
};

export { createUseApi_array_infinite };
