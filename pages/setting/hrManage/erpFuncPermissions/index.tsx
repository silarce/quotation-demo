// ERP功能權限
// ERP功能權限
// ERP功能權限

import { useState, useEffect } from 'react';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';
import GridPanel from 'components/page/setting/hrManage/modal/gridSelector.tsx/gridPanel';

// gear
import { setRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';
import TwoButtonModal from 'components/global/gear/modal/simpleModal/twoButtonModal';
import MyButton from 'components/global/gear/button/myButton';

// icon
import { IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

// api
import {
  TerpFeatureDto,
  useErpFeatures,
  apiPostErpFeatures_id_departments,
  apiDeleteErpFeatures_id_departments,
} from 'js/api/api_erpFeature';
import { TdepartmentDto, useDepartments } from 'js/api/api_department';

// css
import scss from './erpFuncPermissions.module.scss';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// config
import { hrManageLinkArr } from 'components/page/setting/hrManage/hrManageLinkArr';
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// =============================================================================
export default function ErpFuncPermissions() {
  const [isLoading, setIsLoading] = useState(false);
  // --------------------------------------------------------------------------
  const { data: erpData, update: updateErp } = useErpFeatures();
  const erpArr = erpData ?? [];

  const updateList = async () => {
    setIsLoading(true);
    await updateErp();
    setIsLoading(false);
  };

  // ________________
  const { data: departmentsData, update: updateDepartments } = useDepartments();
  const departmentArr = departmentsData?.data ?? [];
  const departmentNameArr = departmentArr.map((item) => item.name);

  // --------------------------------------------------------------------------

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await Promise.all([updateErp(), updateDepartments()]);
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------------------------------
  // 新增部門
  const [erpId_add, setErpId_add] = useState<string>();

  const openAddPanel = (erpId: string) => {
    if (isLoading) {
      return;
    }

    setErpId_add(erpId);
  };

  const cancelAddPanel = () => {
    setErpId_add(undefined);
  };

  const addDepartment = async (indexArr: number[]) => {
    if (isLoading) {
      return;
    }

    if (!erpId_add) {
      return;
    }

    const departmentsIdArr = departmentArr.map((item) => item.id);
    const body = {
      departmentIds: departmentsIdArr.filter((item, index) => {
        return indexArr.includes(index);
      }),
    };

    try {
      setRootLoading(true);
      await apiPostErpFeatures_id_departments(erpId_add, body);
      cancelAddPanel();
    } catch {
      myAlert.err({ title: '新增部門失敗' });
    }

    setRootLoading(false);
    await updateList();
  };

  // --------------------------------------------------------------------------
  // 移除部門
  const [erpData_del, setErpData_del] = useState<TerpFeatureDto>();
  const [departmentData_del, setDepartmentData_del] = useState<TdepartmentDto>();

  const confirmDelete = async () => {
    if (!erpData_del || !departmentData_del) {
      return;
    }

    const body = { departmentIds: [departmentData_del.id] };

    try {
      setRootLoading(true);
      await apiDeleteErpFeatures_id_departments(erpData_del.id, body);
      cancelDelete();
    } catch {
      myAlert.err({ title: '移除部門失敗' });
    }

    setRootLoading(false);
    await updateList();
  };

  const cancelDelete = () => {
    setErpData_del(undefined);
    setDepartmentData_del(undefined);
  };

  // --------------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader02 linkList={hrManageLinkArr} />

      <div className={scss.body}>
        {erpArr.map((erp) => {
          const { departments: depArr, id: erpId, name } = erp;

          const removeData = (index: number) => {
            if (isLoading) {
              return;
            }

            setErpData_del(erp);
            setDepartmentData_del(depArr[index]);
          };

          return (
            <div key={erpId} className={scss.card}>
              <div className={scss.left}>
                <span>{name}</span>
              </div>
              <div className={scss.right}>
                {depArr.map((dep, index) => {
                  const { id: depId, name: depName } = dep;

                  return (
                    <CellWithBar key={depId} className={scss.row}>
                      <div>
                        <span>{depName}</span>
                      </div>
                      <div>
                        <IconRemoveCircle className={scss.removeBtn} onClick={() => removeData(index)} />
                      </div>
                    </CellWithBar>
                  );
                })}
                <div className={scss.row_btn}>
                  <CellWithBar>
                    <MyButton
                      className={scss.btn}
                      label="新增管理部門"
                      preImg="add"
                      onClick={() => openAddPanel(erpId)}
                    />
                  </CellWithBar>
                  <CellWithBar>
                    <MyButton className={scss.btn} label="新增管理人員" preImg="add" onClick={() => alert('test')} />
                  </CellWithBar>
                </div>
              </div>
            </div>
          );
        })}
        {/* <LoadingCover01 isLoading={isLoading} /> */}
      </div>

      <GridPanel
        visible={!!erpId_add}
        title="請選擇部門"
        note="可複選"
        dataArr={departmentNameArr}
        onCancel={cancelAddPanel}
        onConfirm={addDepartment}
      />

      <TwoButtonModal
        visible={!!erpData_del && !!departmentData_del}
        text={`請確認是否從${erpData_del?.name}移除${departmentData_del?.name}`}
        onConfirm={confirmDelete}
        onCancel={() => cancelDelete()}
      />
    </SubLayer>
  );
}
