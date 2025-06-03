import { useState, useEffect } from 'react';
import moment from 'moment';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import Router from 'next/router';

// =====================================================================

type TstorageKit<T = unknown> = ReturnType<typeof localStorageKit<T>>;
interface TbackupMetaItem {
  identity?: string;
  type?: string;
  pathnameWhenUpdate?: string;

  updatedAt?: string; // ISO string
  clearAt?: string; // ISO string
}

interface Tbackup {
  [key: string]: TbackupMetaItem;
}

// =====================================================================

const key_backupMeta = 'backupMeta';

// =====================================================================
function localStorageKit<T = unknown>(key: string) {
  const isWindowExist = typeof window !== 'undefined';

  const json = !isWindowExist ? undefined : window.localStorage.getItem(key);

  const localStorageItem = json && (JSON.parse(json) as T);

  const edit = (value: T) => {
    if (!isWindowExist) {
      alert('無法存取localStorage，window不存在');

      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  };

  const clear = () => {
    if (!isWindowExist) {
      alert('無法移除localStorage，window不存在');

      return;
    }

    window.localStorage.removeItem(key);
  };

  return { localStorageItem, edit, clear };
}

// useBackupa用於狀態備份
// 預想使用情境為給時常壞掉的page在編輯state時可以備份
// 以便在壞掉後快速復原
function useBackup<T = unknown>(
  key: string | undefined,
  {
    keyPrefix = 'backup_',
    identity = key,
    type,
  }: {
    keyPrefix?: string;
    identity?: TbackupMetaItem['identity']; // 放key、id、或其他用於識別的唯一值
    type?: TbackupMetaItem['type'];
  } = {}
) {
  const backupKey = `${keyPrefix}${key}`;

  const [, setForceRender] = useState(0);

  const [backupKit, setBackupKit] = useState<TstorageKit<T>>(() => localStorageKit<T>(backupKey));
  const backup = backupKit.localStorageItem || null;

  const backupMetaKit: TstorageKit<Tbackup> = localStorageKit<Tbackup>(key_backupMeta);
  const backupMetaDict = backupMetaKit.localStorageItem || {};
  const backupMeta = backupMetaDict[backupKey];

  const updateBackup = (value: T) => {
    if (!key) {
      myAlert.notify.error({
        message: '無法更新備份，key未定義',
      });

      return;
    }

    try {
      backupKit.edit(value);
    } catch (error) {
      myAlert.notify.error({
        message: '更新備份失敗',
      });
      console.error('更新備份失敗:', error);

      return;
    }

    const timeNow = moment();

    const meta: TbackupMetaItem = {
      identity,
      type,
      pathnameWhenUpdate: Router.pathname,
      updatedAt: timeNow.toISOString(),
      clearAt: timeNow.clone().add(7, 'days').toISOString(),
    };

    try {
      backupMetaKit.edit({ ...backupMetaDict, [backupKey]: meta });
    } catch (error) {
      myAlert.notify.error({
        message: '更新backupMeta失敗',
      });
      console.error('更新備份Meta失敗:', error);
    }
  };

  const clearBackup = () => {
    if (!key) {
      myAlert.notify.error({
        message: '無法清除備份，key未定義',
      });

      return;
    }

    backupKit.clear();

    const copy_meta = { ...backupMetaDict };
    delete copy_meta[backupKey];
    backupMetaKit.edit(copy_meta);
  };

  useEffect(() => {
    setBackupKit(localStorageKit<T>(backupKey));
  }, [backupKey]);

  useEffect(() => {
    if (backupMeta && backupMeta.identity !== identity) {
      myAlert.notify.warning({
        message: 'backupMeta.identity與identity不相符',
      });
    }
  }, [backupMeta?.identity, identity]);

  useEffect(() => {
    const forceRender = () => {
      setForceRender((prev) => prev + 1);
    };

    window.addEventListener('storage', forceRender);

    return () => {
      window.removeEventListener('storage', forceRender);
    };
  }, []);

  if (!key) {
    return {
      backup: undefined,
      backupMeta,
      updateBackup,
      clearBackup,
    };
  } else {
    return {
      backup,
      backupMeta,
      updateBackup,
      clearBackup,
    };
  }
}

// 預期會放在_app，每次進入page時就檢查是否有備份過期並清除
const useClearBackup = () => {
  useEffect(() => {
    const { localStorageItem: backupMeta, edit, clear } = localStorageKit<Tbackup>(key_backupMeta);

    if (!backupMeta || Object.keys(backupMeta).length === 0) {
      clear();
    } else {
      const timeNow = moment();

      const arr = Object.entries(backupMeta).map(([key, item]) => {
        let clearAt = moment(item.clearAt);
        !clearAt.isValid && (clearAt = timeNow.clone().add(30, 'days'));

        const shouldClear = timeNow.isAfter(clearAt);

        if (shouldClear) {
          localStorage.removeItem(key);

          return null;
        }

        return {
          ...item,
          clearAt: clearAt.toISOString(),
          key,
        };
      });

      const dict = arr.reduce((current, item_) => {
        if (!item_) {
          return current;
        }

        const { key, ...item } = item_;

        current[key] = {
          ...item,
        };

        return current;
      }, {} as Tbackup);

      if (Object.keys(dict).length === 0) {
        clear();
      } else {
        edit(dict);
      }
    }
  }, []);
};

export { useBackup, useClearBackup };
