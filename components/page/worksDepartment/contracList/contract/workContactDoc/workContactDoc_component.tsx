// 工程聯絡單
// 工程聯絡單
// 工程聯絡單

import { useEffect, useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import classNames from 'classnames';

// component
import Profile, {
  Tcontroll as Tcontroll_profile,
} from 'components/page/worksDepartment/contracList/contract/workContactDoc/profile';
import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';
import ProjectPattern from 'components/page/worksDepartment/contracList/contract/workContactDoc/projectPattern';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import WorkSheetSelector from 'components/global/gear/modal/workSheetSelector';
import TextListEditor_v2, {
  TstringObj as Tcontroll_textListEditor,
} from 'components/page/domestic/quotation/quotationTotal/TextListEditor_v2';

// api
import {
  TupdateEngineeringContactDto,
  useGetEngineeringContact,
  apiPatchEngineeringContact,
  apiPostWorkSheet,
} from 'js/api/api_engineering';

import { TquotationProductDto, TquotationContractDto } from 'js/api/api_quotation';

// hook
import { useProductList } from 'hooks/quotation/useProduct';

// css
import scss from './workContactDoc.module.scss';

// type
import { TgetAnnotation } from 'js/api/api_workSheet';

// ============================================================================
type Tquery = {
  contractId: string;
};

type Tprofile = {
  paymentStatus: string;
  projectName: string;
  projectContent: string;
  zipCode: string;
  county: string;
  district: string;
  address: string;
  projectPrincipal: string;
  constructionSitePrincipalContactNumber: string;
  constructionSiteFaxNumber: string;
  constructionSiteContactNumber: string;
  projectNumber: string;
  contractor: string;
  contractorPrincipal: string;
  contractorContactNumber: string;
  contractorFaxNumber: string;
};

type TonStateChange = (props: {
  disabled: boolean;
  isLoading: boolean;
  isShowPattern: boolean;
  contractNumber: string;
}) => void;

type TimperativeHandle = {
  reqPatch: () => Promise<void>;
  closePattern: () => void;
  setDisabled: (state: boolean) => void;
};

export type { TimperativeHandle, TonStateChange };

// ============================================================================

const WorkContactDoc_component = forwardRef(PreWorkContactDoc_component);

// _________________________________________
function PreWorkContactDoc_component(
  {
    contract,
    engineeringContactId,
    onStateChange,
  }: {
    contract: TquotationContractDto | undefined;
    engineeringContactId: string | undefined | null;
    onStateChange: TonStateChange;
  },
  ref: React.ForwardedRef<unknown>
) {
  const router = useRouter();
  const { contractId } = router.query as Tquery;

  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [showAnnoSelector, setShowAnnoSelector] = useState(false);

  const [isShowPattern, setIsShowPattern] = useState(false);

  const showPattern = () => {
    setDisabled(true);
    setIsShowPattern(true);
  };

  useImperativeHandle(ref, () => ({
    reqPatch,
    closePattern: () => setIsShowPattern(false),
    setDisabled,
  }));

  // ---------------------------------------------------------------------------

  const { productArr, latestQuotationDiscount } = useMemo(() => {
    const list: { [key: string]: TquotationProductDto } = {};

    const subContractArr = contract?.subContracts ?? [];
    const orderedSubContracts = _.sortBy(subContractArr, 'version');

    orderedSubContracts.forEach((contract) => {
      const prodArr = contract.content.products;

      prodArr.forEach((prod) => {
        list[prod.rootProductId] = prod;
      });
    });

    const productArr = Object.values(list);
    const latestSubContract: TquotationContractDto | undefined = orderedSubContracts[orderedSubContracts.length - 1];

    const latestQuotationDiscount = latestSubContract?.content?.discount || '100';

    return { productArr, latestQuotationDiscount };
  }, [contract]);

  const {
    //
    productList,
    prodCellConfig,
    prodKeyArr,
    changeProdKeyArr,
  } = useProductList({
    productArr: productArr,
    others: [],
    resetTrigger: productArr,
    quotationDiscount: Number(latestQuotationDiscount) || 100,
  });

  // ---------------------------------------------------------------------------

  /**data裡只會有一筆資料 */
  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);
  useEffect(() => {
    (async () => {
      try {
        await update_engineeringContact();
      } catch (error) {
        myAlert.err({ title: '取得工程聯絡單失敗', content: '請確認該合約是否已產生工程聯絡單' });
      }
    })();
  }, [contractId, engineeringContactId]);

  // 預計未來會有工程圖表資料
  type Tpattern = {
    label: string;
    haveData: boolean;
    shouldHaveData: boolean;
  };

  const [patternA, setPatternA] = useState<Tpattern>({
    label: '簽認圖',
    haveData: false,
    shouldHaveData: true,
  });
  const [patternB, setPatternB] = useState<Tpattern>({
    label: '平面圖',
    haveData: true,
    shouldHaveData: true,
  });
  const [patternC, setPatternC] = useState<Tpattern>({
    label: '設計圖',
    haveData: true,
    shouldHaveData: true,
  });
  const [patternD, setPatternD] = useState<Tpattern>({
    label: '色卡',
    haveData: false,
    shouldHaveData: false,
  });

  const changePatternShouldHaveData = (patternType: 'a' | 'b' | 'c' | 'd', bool: boolean) => {
    if (patternType === 'a') {
      setPatternA((pattern) => ({ ...pattern, shouldHaveData: bool }));
    } else if (patternType === 'b') {
      setPatternB((pattern) => ({ ...pattern, shouldHaveData: bool }));
    } else if (patternType === 'c') {
      setPatternC((pattern) => ({ ...pattern, shouldHaveData: bool }));
    } else if (patternType === 'd') {
      setPatternD((pattern) => ({ ...pattern, shouldHaveData: bool }));
    }
  };

  // ---------------------------------------------------------------------------

  useEffect(() => {
    onStateChange &&
      onStateChange({
        disabled,
        isLoading,
        isShowPattern,
        contractNumber: engineeringContact?.contractNumber ?? '',
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, isLoading, isShowPattern, engineeringContact?.contractNumber]);

  // ---------------------------------------------------------------------------

  const [profile, setProfile] = useState<Tprofile>();

  const profileChange = (key: keyof Tprofile, v: string) => {
    setProfile((profile) => {
      if (!profile) {
        return;
      }

      const newProfile = { ...profile };
      newProfile[key] = v;

      return newProfile;
    });
  };

  // ---------------------------------------------------------------------------

  const [annoArr, setAnnoArr] = useState<string[]>([]);

  const control_anno: Tcontroll_textListEditor = {
    stringArr: annoArr,
    editString: (index, v) => {
      setAnnoArr((arr) => {
        const newAnnoArr = [...arr];
        newAnnoArr[index] = v;

        return newAnnoArr;
      });
    },
    delString: (index) => {
      setAnnoArr((arr) => {
        const newAnnoArr = [...arr];
        newAnnoArr.splice(index, 1);

        return newAnnoArr;
      });
    },
    addString: (v) => {
      setAnnoArr((arr) => {
        const newAnnoArr = [...arr];
        newAnnoArr.push(v);

        return newAnnoArr;
      });
    },
    showSelector: () => setShowAnnoSelector(true),
  };

  const onConfirm_anno = (v: TgetAnnotation['data']) => {
    const vArr = v.map((item) => item.description);

    if (!vArr[0]) {
      vArr[0] = '';
    }

    setAnnoArr((arr) => {
      const newAnnoArr = [...arr];
      newAnnoArr.push(...vArr);

      return newAnnoArr;
    });
  };

  // ---------------------------------------------------------------------------
  const [contactArr, setContactArr] = useState<{ contactPerson: string; contactNumber: string }[]>([]);

  const onAddClick = () => {
    setContactArr((arr) => {
      const newArr = [...arr];
      newArr.push({ contactPerson: '', contactNumber: '' });

      return newArr;
    });
  };

  // ---------------------------------------------------------------------------

  const reSet = () => {
    if (!engineeringContact) {
      return;
    }

    const {
      annotations,
      //
      paymentStatus,
      projectName,
      projectContent,
      zipCode,
      county,
      district,
      address,
      projectPrincipal,
      constructionSitePrincipalContactNumber,
      constructionSiteFaxNumber,
      constructionSiteContactNumber,
      projectNumber,
      contractor,
      contractorPrincipal,
      contractorContactNumber,
      contractorFaxNumber,
      contactInfo,
    } = engineeringContact;

    if (annotations) {
      setAnnoArr(annotations);
    }

    if (contactInfo) {
      setContactArr(contactInfo);
    }

    setProfile({
      paymentStatus,
      projectName,
      projectContent,
      zipCode: zipCode ?? '',
      county,
      district,
      address,
      projectPrincipal,
      constructionSitePrincipalContactNumber,
      constructionSiteFaxNumber,
      constructionSiteContactNumber,
      projectNumber,
      contractor,
      contractorPrincipal,
      contractorContactNumber,
      contractorFaxNumber,
    });
  };

  useEffect(() => {
    if (!engineeringContact) {
      return;
    }

    reSet();
  }, [engineeringContact]);

  // ---------------------------------------------------------------------------

  const contactPersonsArr: Tcontroll_profile['contactPersons']['arr'] = contactArr.map((item, index) => {
    return {
      contactPerson: {
        value: item.contactPerson,
        onChange: (v) => {
          setContactArr((arr) => {
            const newArr = [...arr];
            newArr[index].contactPerson = v;

            return newArr;
          });
        },
      },
      contactPhone: {
        value: item.contactNumber,
        onChange: (v) => {
          setContactArr((arr) => {
            const newArr = [...arr];
            newArr[index].contactNumber = v;

            return newArr;
          });
        },
      },
      onDelClick: () => {
        setContactArr((arr) => {
          const newArr = [...arr];
          newArr.splice(index, 1);

          return newArr;
        });
      },
    };
  });

  const controll: Tcontroll_profile = {
    /**請款狀態 */
    paymentStatus: {
      value: profile?.paymentStatus ?? '',
      onChange: (v) => {
        profileChange('paymentStatus', v);
      },
    },
    projectName: {
      value: profile?.projectName ?? '',
      onChange: (v) => {
        profileChange('projectName', v);
      },
    },
    /**工程內容 */
    projectContent: {
      value: profile?.projectContent ?? '',
      onChange: (v) => {
        profileChange('projectContent', v);
      },
    },
    projectPattern: {
      onCaptionClick: showPattern,
      statusArr: [
        {
          ...patternA,
          onCheck: (bool) => {
            changePatternShouldHaveData('a', bool);
          },
        },
        {
          ...patternB,
          onCheck: (bool) => {
            changePatternShouldHaveData('b', bool);
          },
        },
        {
          ...patternC,
          onCheck: (bool) => {
            changePatternShouldHaveData('c', bool);
          },
        },
        {
          ...patternD,
          onCheck: (bool) => {
            changePatternShouldHaveData('d', bool);
          },
        },
      ],
    },
    addressBarProps: {
      inputSelProps: {
        caption: '工程地點',
      },
      addressProps: {
        zipCode: {
          props: {
            value: profile?.zipCode ?? '',
          },
        },
        county: {
          props: {
            isDisabled: disabled,
            value: profile?.county ? { value: profile.county, label: profile.county } : null,
            onChange: (option) => {
              const value = option ? option.value : '';
              profileChange('county', value);
              profileChange('district', '');
              profileChange('zipCode', '');
            },
          },
        },
        district: {
          easyValue: profile?.district ?? null,
          props: {
            isDisabled: disabled,
            value: profile?.district ? { value: profile.district, label: profile.district } : null,
            onChange: (option) => {
              if (!option) {
                return;
              }

              const value = option ? option.value : '';
              profileChange('district', value);
              profileChange('zipCode', option.zipCode ?? '');
            },
          },
        },
        address: {
          props: {
            disabled,
            value: profile?.address ?? '',
            onChange: (e) => {
              profileChange('address', e.target.value);
            },
          },
        },
      },
    },
    //
    /**工程負責人 */
    projectPerson: {
      value: profile?.projectPrincipal ?? '',
      onChange: (v) => {
        profileChange('projectPrincipal', v);
      },
    },
    /**工程負責人聯絡電話 */
    projectPersonNumber: {
      value: profile?.constructionSitePrincipalContactNumber ?? '',
      onChange: (v) => {
        profileChange('constructionSitePrincipalContactNumber', v);
      },
    },
    projectFaxNumber: {
      value: profile?.constructionSiteFaxNumber ?? '',
      onChange: (v) => {
        profileChange('constructionSiteFaxNumber', v);
      },
    },
    /**工地電話 */
    projectNumber: {
      value: profile?.constructionSiteContactNumber ?? '',
      onChange: (v) => {
        profileChange('constructionSiteContactNumber', v);
      },
    },

    //
    //
    /**工程編號 */
    engineeringNumber: {
      value: profile?.projectNumber ?? '',
      onChange: (v) => {
        profileChange('projectNumber', v);
      },
    },
    /**承包商 */
    contractor: {
      value: profile?.contractor ?? '',
      onChange: (v) => {
        profileChange('contractor', v);
      },
    },
    /**負責人 */
    principal: {
      value: profile?.contractorPrincipal ?? '',
      onChange: (v) => {
        profileChange('contractorPrincipal', v);
      },
    },
    /**公司電話 */
    contactNumber: {
      value: profile?.contractorContactNumber ?? '',
      onChange: (v) => {
        profileChange('contractorContactNumber', v);
      },
    },
    faxNumber: {
      value: profile?.contractorFaxNumber ?? '',
      onChange: (v) => {
        profileChange('contractorFaxNumber', v);
      },
    },
    //
    contactPersons: {
      onAddClick,
      arr: contactPersonsArr,
    },
  };

  // ----------------------------------------------------------------------------

  const reqPatch = async () => {
    if (!profile || !engineeringContact) {
      return;
    }

    const body: TupdateEngineeringContactDto = {
      ...profile,
      annotations: annoArr,
      contactInfo: contactArr,
    };

    try {
      setIsLoading(true);
      await apiPatchEngineeringContact(engineeringContact.id, body);
      await update_engineeringContact();
      setDisabled(true);
    } catch (error) {
      myAlert.err({ title: '更新工程聯絡單失敗' });
    } finally {
      setIsLoading(false);
    }
  };

  // const reqCreateWorkSheet = async () => {
  //   if (!contractId) {
  //     return myAlert.info({ title: '無合約id', content: '請回到工務部合約列表再次選擇合約' });
  //   }

  //   try {
  //     setIsLoading(true);
  //     await apiPostWorkSheet({ contractId });
  //     myAlert.success({ title: '產生工作表成功' });
  //   } catch (error) {
  //     const err = error as Error;

  //     myAlert.info({ title: '產生工作表失敗', content: err.message });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // ----------------------------------------------------------------------------

  // 把金額隱藏
  const filteredProdKeyArr = prodKeyArr.filter((key) => {
    if (key === 'price' || key === 'dualPrice' || key === 'unitPrice' || key === 'totalPrice') {
      return false;
    }

    return true;
  });

  // ----------------------------------------------------------------------------
  return (
    <div>
      <div>
        {/* 工程聯絡單 */}
        <div className={classNames(isShowPattern && 'hidden')}>
          <Profile controll={controll} disabled={disabled} />
          {/* <WorkProject /> */}
          <Table_prod
            disabled={true}
            prodList={productList}
            prodCellConfig={prodCellConfig}
            prodKeyArr={filteredProdKeyArr}
            changeProdKeyArr={changeProdKeyArr}
            addProd={() => {}}
            setTargetProd={() => {}}
            // panelBox="easyBox"
            panelBox="emptyBox"
            emptyBlockWidth="40px"
            rowHeight="h60"
            isShowDndBtn={false}
          />
          {/* <Remark /> */}
          <div className={scss.textListContainer}>
            <TextListEditor_v2 label={'備註'} disabled={disabled} stringObj={control_anno} />
          </div>
        </div>
        {/* 工程圖表資料 */}
        <div className={classNames(!isShowPattern && 'hidden')}>
          <ProjectPattern />
        </div>
      </div>

      <WorkSheetSelector
        label="備註"
        tip="可複選、可不選(按確定即可)"
        showModal={showAnnoSelector}
        onConfirm={(vArr) => onConfirm_anno(vArr)}
        onCancel={() => setShowAnnoSelector(false)}
        apiFamily="annotation"
      />
    </div>
  );
}

export default WorkContactDoc_component;
