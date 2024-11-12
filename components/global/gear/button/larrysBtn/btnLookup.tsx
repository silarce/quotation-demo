import * as Icons from '../../../../../public/image/icon/fcIconComponent/fcIcons';

const btnLookup: {
  [key in
    | 'add'
    | 'arrowDone'
    | 'cancel'
    | 'delete'
    | 'edit'
    | 'export'
    | 'flow'
    | 'exclam'
    | 'save'
    | 'search'
    | 'sentReview'
    | 'sentReviewStop']: {
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    i18nKey?: string | null;
  };
} = {
  add: {
    Icon: Icons.Icon_fc_add2,
    i18nKey: 'add',
  },
  arrowDone: {
    Icon: Icons.Icon_fc_arrowDone,
    // i18nKey: 'arrowDone',
  },
  cancel: {
    Icon: Icons.Icon_fc_cancel,
    i18nKey: 'cancel',
  },
  delete: {
    Icon: Icons.Icon_fc_delete,
    i18nKey: 'delete',
  },
  edit: {
    Icon: Icons.Icon_fc_edit,
    i18nKey: 'edit',
  },
  export: {
    Icon: Icons.Icon_fc_export,
    i18nKey: 'export',
  },
  flow: {
    Icon: Icons.Icon_fc_flow,
    // i18nKey: 'flow',
  },
  exclam: {
    Icon: Icons.Icon_fc_exclam,
    // i18nKey: 'exclam',
  },
  save: {
    Icon: Icons.Icon_fc_save,
    i18nKey: 'save',
  },
  search: {
    Icon: Icons.Icon_fc_search,
    i18nKey: 'search',
  },
  sentReview: {
    Icon: Icons.Icon_fc_sentReview,
    i18nKey: 'sentReview',
  },
  sentReviewStop: {
    Icon: Icons.Icon_fc_sentReviewStop,
    i18nKey: 'sentReviewStop',
  },
};

export { btnLookup };
