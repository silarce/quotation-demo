export interface DetailItem {
  key: string;
  depId: string;
  comId: string;
  parentId: string;
  depCode: string;
  depChName: string;
  depEnName: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  deletedBy: string;
  deletedAt: string;
  isInvalid: boolean;
}

export type CreateDepFormState = {
  depCode: string;
  depChName: string;
  depEnName: string;
  description: string;
  isEnabled: boolean;
};
