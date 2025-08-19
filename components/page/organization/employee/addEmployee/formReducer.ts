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
  genderPcode: undefined,
  marital_pcode: undefined,
  education_pcode: undefined,
  militaryServiceTypePcode: undefined,
  emergencyContactRelationshipPcode: undefined,
  residence_county_pcode: undefined,
  departmentId: undefined,
  jobId: undefined,
  nationalityPcode: undefined,
  workLocationPcode: undefined,
  workTypePcode: undefined,
  shiftId: undefined,
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
