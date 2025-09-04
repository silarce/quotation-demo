import { useReducer } from 'react';
import { CreateEmployeePayload } from '../type';

export const initialFormState: CreateEmployeePayload = {
  empCode: '',
  userId: '',
  idNo: '',
  empChName: '',
  empEnName: '',
  email: '',
  birthdayDate: '',
  genderPcode: '',
  maritalPcode: '',
  educationPcode: '',
  militaryServiceTypePcode: '',
  nationalityPcode: '',
  phone1: '',
  phone2: '',
  emergencyContactName: '',
  emergencyContactRelationshipPcode: '',
  emergencyContactPhone: '',
  residenceCountyPcode: '',
  residenceAddress: '',
  mailingCountyPcode: '',
  mailingAddress: '',
  department: '',
  jobGradeId: '',
  seniority: '',
  startDate: '',
  leaveDate: '',
  severanceDate: '',
  retireDate: '',
  insuranceItems: [],
  dependents: [],
  employeeEmployment: {
    workTypePcode: '',
    workLocationPcode: '',
    salaryAccountPcode: '',
    salaryPlainText: '',
    laborRetirePercentage: '',
    shiftId: '',
    userAddr: '',
    extensionNo: '',
  },
  isInvalid: undefined,
  residenceDistrictPcode: '',
  mailingDistrictPcode: '',
  isEnable: undefined,
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
