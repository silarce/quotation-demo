export interface DetailItem {
  key: string;
  dep_code: string;
  dep_ch_name: string;
  dep_en_name: string;
  description: string;
  is_invalid: boolean;
}

export type formState = {
  dep_code: string;
  dep_ch_name: string;
  dep_en_name: string;
  description: string;
};
