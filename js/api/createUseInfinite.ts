import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';

import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// type
import { Tparams, TpageMetaDto } from './dtoTypes';

type Tres = {
  data: any[];
  meta: TpageMetaDto;
};

type Tapi<TapiReq> = (params?: Tparams) => Promise<TapiReq>;

export type { Tparams, Tres };

// ==================================================================

export function createUseInfinite<TapiReq extends Tres>({
  //
  apiClient,
  errTitle,
  errContent,
}: {
  apiClient: Tapi<TapiReq>;
  errTitle: string;
  errContent?: (error: AxiosError) => string;
}) {
  const useApi_infinite = ({
    //
    customParams,
  }: {
    customParams?: Tparams;
  }) => {
    /**resetCount就只是用來使呼叫reset後，若page沒有改變的話，還是可以觸發update*/
    const [resetCount, setResetCount] = useState(0);
    const [isLoadingPage1, setIsLoadingPage1] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const [viewRef_top, inView_top] = useInView();
    const [viewRef_bottom, inView_bottom] = useInView();

    const [isReqFail, setIsReqFail] = useState(false);

    // ----------------------------------------------------------------
    const [dataList, setDataList] = useState<{ [key: `${number}`]: TapiReq['data'] }>({});

    const [page, setPage] = useState<number>();
    const [meta, setMeta] = useState<TpageMetaDto>();
    const [hasNextPage, setHasNextPage] = useState<boolean>();

    // ----------------------------------------------------------------
    const defaultParams = {
      page,
    };
    // ----------------------------------------------------------------

    const update = async (dynaParams?: Tparams) => {
      const params = {
        ...defaultParams,
        ...customParams,
        ...dynaParams,
      };

      try {
        if (page === 1) {
          setIsLoadingPage1(true);
        }

        setIsloading(true);

        const res = await apiClient(params);

        if (res) {
          setDataList((list) => {
            list[`${res.meta.page}`] = res.data;

            return { ...list };
          });
          setMeta(res.meta);
          setHasNextPage(res.meta.hasNextPage);
        }

        return res;
        //
      } catch (error) {
        const err = error as AxiosError;
        myAlert.err({
          //
          title: errTitle,
          content: (errContent && errContent(err)) ?? err.message,
        });

        console.log(error);
        setIsReqFail(true);

        return null;
      } finally {
        setIsloading(false);
        setIsLoadingPage1(false);
      }
    };

    const nextPage = () => {
      if (hasNextPage === false || !page || isReqFail) {
        return;
      }

      setPage((page) => (page ? page + 1 : page));
    };

    // -----------------------------------------------
    const init = () => {
      setDataList({});
      setPage(undefined);
      setHasNextPage(undefined);
      setResetCount(0);
      setIsReqFail(false);
    };

    const reset = () => {
      setDataList({});
      setPage(1);
      setHasNextPage(true);
      setResetCount((count) => ++count);
    };

    // -----------------------------------------------
    useEffect(() => {
      if (!page) {
        return;
      }

      update();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, resetCount]);

    useEffect(() => {
      if (isLoading) {
        return;
      }

      if (inView_bottom) {
        nextPage();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView_bottom, isLoading]);
    // -----------------------------------------------

    return {
      dataList,
      // dataArr: _.flatten(Object.values(dataList)),
      dataArr: _.flatten(Object.values(dataList)) as (typeof dataList)[`${number}`],
      viewRef_top,
      viewRef_bottom,
      isLoadingPage1,
      isLoading,
      meta,
      init,
      reset,
      nextPage,
    };
  };

  return useApi_infinite;
}
