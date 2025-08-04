import type { Treview_status__stages, Tdocument_status } from './shared';

interface TreviewFlow {
  id: string;
  name: string;
  enable: boolean;
  stage_counter: number;
  user_id: string;
  created_at: string;
  update_at: string;
  stages: {
    stage_uid: string;
    stage_order: number;
    stage_user_name: string;
    stage_user_title: string;
    review_id: string;
    review_type: string;
  }[];
}

interface TgetReviewById {
  id: string;
  create_at: string;
  create_by: string;
  document_uuid: string;
  /**
   * document_id不是真正的，用來辨識唯一資料的識別id，
   * 也就是說，可能會有多筆資料有同樣的document_id
   * 基本上會是serial_number，但不一定，也不是非serial_number不可
   * 後端似乎通常稱為單號
   */
  document_id: string;
  current_stage: `${number}`;
  document_status: Tdocument_status;
  document_title: string;
  document_type: string;
  prestage_review: string;
  query: string;
  review_id: string;
  stages: {
    review_id: string;
    review_order: number;
    review_memo: string;
    review_person: string;
    review_status: Treview_status__stages;
    review_time: string | '0001-01-01T00:00:00'; // '0001-01-01T00:00:00'代表未審核
    review_title: string;
  }[];
}

interface TaddReview {
  review_id: TgetReviewById['id']; // 審核流程id
  // 舊時document_id是必須要有值的，但不是每個資料都有document_id
  // 所以有些地方會workaround的送cretedAt進去
  // 但現在可以直接不送document_id了
  // 已經送了document_id的地方不要改掉，不然舊資料會取不到
  document_id?: TgetReviewById['document_id'] | undefined;
  document_uuid: string; // 唯一識別id // 被審核資料的唯一識別id
  document_type: string; // ex:請購單 // 任意字串
  // username: string;
  user_id: string;
  document_title: string; // ex:請購單20241024 // 任意字串
  // get被審核資料時用的query
  query: {
    [key: string]: string | number | undefined;
  };
}

interface TgetReview {
  id: string;
  document_type: string;
  document_id: TgetReviewById['document_id'];
  create_at: string;
  create_by: string;
  review_id: string;
  current_stage: number;
  prestage_review: string;
  document_status: string;
  query: string;
  document_uuid: string;
  document_title: string;
  readed: boolean;
}

export type { TreviewFlow, TgetReviewById, TaddReview, TgetReview };
