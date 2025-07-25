import { useReducer } from 'react';

export const initialFormState = {
  emp_id: '',
  emp_name: '',
  emp_ext: '',
  seniority: '',
  residence_address: '',
  mailing_address: '',
  mailing_county_pcode: undefined,
  email: '',
  contact_person: '',
  contact_phone: '',
  contact_phone2: '',
  urgent_phone: '',
  birthday_date: '',
  start_date: '',
  leave_date: '',
  severance__date: '',
  retire__date: '',
  county: '',
  district: '',
  logo_file_id: '',
  gender_pcode: undefined,
  marital_pcode: undefined,
  education_pcode: undefined,
  military_service_type_pcode: undefined,
  emergency_contact_relationship: undefined,
  residence_county_pcode: undefined,
  department: undefined,
  job_grade_id: undefined,
};

export function useFormReducer() {
  const reducer = (state: typeof initialFormState, action: any) => {
    switch (action.type) {
      case 'SET_FIELD':
        return { ...state, [action.field]: action.value };
      case 'SET_ALL':
        return { ...action.payload };
      case 'RESET':
        return { ...initialFormState };
      default:
        return state;
    }
  };

  return useReducer(reducer, initialFormState);
}
