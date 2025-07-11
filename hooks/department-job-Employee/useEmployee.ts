import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import _ from 'lodash';

// type
import { TemployeeDto } from 'js/api/api_employee';
type TemployeeDto_jobs = TemployeeDto & Pick<Required<TemployeeDto>, 'jobs'>;

class Class_employee {
  constructor(reRender: () => void, employeeDataOri: TemployeeDto_jobs) {
    this._reRender = reRender;

    const employeeDataClone = _.cloneDeep(employeeDataOri);

    if (!employeeDataClone.qualifications[0]) {
      employeeDataClone.qualifications = [{ name: '', years: 0 }];
    }

    this._employeeData = employeeDataClone as TemployeeDto_jobs & Pick<Required<TemployeeDto>, 'qualifications'>;

    if (!this._employeeData.qualifications) {
      this._employeeData.qualifications = [];
    }

    // this._employeeData.birthday = convertDate_reduce1911(this._employeeData.birthday)

    this._employeeData.startDate = (() => {
      if (!this._employeeData.startDate) {
        // return convertDate_reduce1911(new Date().toISOString())
        return new Date().toISOString();
      }

      // return convertDate_reduce1911(this._employeeData.startDate)
      return this._employeeData.startDate;
    })();
    // this._employeeData.leaveDate = convertDate_reduce1911(this._employeeData.leaveDate)
    // this._employeeData.retireDate = convertDate_reduce1911(this._employeeData.retireDate)
    // this._employeeData.severanceDate = convertDate_reduce1911(this._employeeData.severanceDate)

    this.classJobGroupArr = this._employeeData.jobs.map((job) => new Class_JobGroup(reRender, job));

    if (!this.classJobGroupArr[0]) {
      this.classJobGroupArr.push(new Class_JobGroup(reRender));
    }
  } // constructor

  private _reRender;
  private _employeeData;

  readonly classJobGroupArr;
  addJobGroup = () => {
    this.classJobGroupArr.push(new Class_JobGroup(this._reRender));
    this._reRender();
  };
  removeJobGroup = (index: number) => {
    if (this.classJobGroupArr.length === 1) {
      return;
    }

    this.classJobGroupArr.splice(index, 1);
    this._reRender();
  };

  get idNumber() {
    return this._employeeData.idNumber;
  }
  // set idNumber(v: string) {
  //   this._employeeData.idNumber = v
  //   this._reRender()
  // }

  get chName() {
    return this._employeeData.chName;
  }
  set chName(v: string) {
    this._employeeData.chName = v;
    this._reRender();
  }

  get enName() {
    return this._employeeData.enName;
  }
  set enName(v: string) {
    this._employeeData.enName = v;
    this._reRender();
  }

  get identity() {
    return this._employeeData.identity;
  }
  set identity(v: string) {
    this._employeeData.identity = v;
    this._reRender();
  }

  get birthday() {
    return this._employeeData.birthday;
  }
  set birthday(v: string) {
    this._employeeData.birthday = v;
    this._reRender();
  }

  get gender() {
    return this._employeeData.gender;
  }
  set gender(v: string) {
    this._employeeData.gender = v;
    this._reRender();
  }

  get marital() {
    return this._employeeData.marital;
  }
  set marital(v: string) {
    this._employeeData.marital = v;
    this._reRender();
  }

  get education() {
    return this._employeeData.education;
  }
  set education(v: string) {
    this._employeeData.education = v;
    this._reRender();
  }

  get expertise() {
    return this._employeeData.expertise;
  }
  set expertise(v: string) {
    this._employeeData.expertise = v;
    this._reRender();
  }

  get phone1() {
    return this._employeeData.phone1;
  }
  set phone1(v: string) {
    this._employeeData.phone1 = v;
    this._reRender();
  }

  get phone2() {
    return this._employeeData.phone2;
  }
  set phone2(v: string) {
    this._employeeData.phone2 = v;
    this._reRender();
  }

  get email() {
    return this._employeeData.email;
  }
  set email(v: string) {
    this._employeeData.email = v;
    this._reRender();
  }

  get residenceCounty() {
    return this._employeeData.residenceCounty;
  }
  set residenceCounty(v: string) {
    this._employeeData.residenceCounty = v;
    this._reRender();
  }

  get residenceDistrict() {
    return this._employeeData.residenceDistrict;
  }
  set residenceDistrict(v: string) {
    this._employeeData.residenceDistrict = v;
    this._reRender();
  }

  get residenceAddress() {
    return this._employeeData.residenceAddress;
  }
  set residenceAddress(v: string) {
    this._employeeData.residenceAddress = v;
    this._reRender();
  }

  get mailingCounty() {
    return this._employeeData.mailingCounty;
  }
  set mailingCounty(v: string) {
    this._employeeData.mailingCounty = v;
    this._reRender();
  }

  get mailingDistrict() {
    return this._employeeData.mailingDistrict;
  }
  set mailingDistrict(v: string) {
    this._employeeData.mailingDistrict = v;
    this._reRender();
  }

  get mailingAddress() {
    return this._employeeData.mailingAddress;
  }
  set mailingAddress(v: string) {
    this._employeeData.mailingAddress = v;
    this._reRender();
  }

  get seniority() {
    const mStartDate = dayjs(this.startDate); //到職日

    if (!this.startDate) {
      return '請輸入到職日';
    }

    if (this.leaveDate || this.severanceDate) {
      const mEndDate = dayjs(this.leaveDate || this.severanceDate);

      if (mStartDate.isAfter(mEndDate)) {
        return '離職日或資遣日早於到職日';
      }

      const duration = dayjs.duration(mEndDate.diff(mStartDate));

      return `${duration.years()}年${duration.months()}月${duration.days()}天`;
    } else {
      return '請輸入離職日或資遣日';
      // const mNow = moment(new Date()).subtract(1911, "year")
      // const mNow = moment(new Date())

      // if(!mNow.isAfter(mStartDate)) return "離職日小於到職日"
      // const duration = moment.duration(mNow.diff(mStartDate))
      // return `${duration.years()}年${duration.months()}月${duration.days()}天`
    }
  }

  get startDate() {
    return this._employeeData.startDate;
  }
  set startDate(v: string) {
    if (!v) {
      return;
    }

    this._employeeData.startDate = v;
    this._reRender();
  }

  get leaveDate() {
    // 離職日
    return this._employeeData.leaveDate;
  }
  set leaveDate(v: string) {
    this._employeeData.leaveDate = v;
    this._employeeData.severanceDate = '';
    this._reRender();
  }

  get retireDate() {
    return this._employeeData.retireDate;
  }
  set retireDate(v: string) {
    this._employeeData.retireDate = v;
    this._reRender();
  }

  get severanceDate() {
    // 資遣日
    return this._employeeData.severanceDate;
  }
  set severanceDate(v: string) {
    this._employeeData.severanceDate = v;
    this._employeeData.leaveDate = '';
    this._reRender();
  }

  get militaryServiceType() {
    return this._employeeData.militaryServiceType;
  }
  set militaryServiceType(v: string) {
    this._employeeData.militaryServiceType = v;
    this._reRender();
  }

  get emergencyContactPhone() {
    return this._employeeData.emergencyContactPhone;
  }
  set emergencyContactPhone(v: string) {
    this._employeeData.emergencyContactPhone = v;
    this._reRender();
  }

  get emergencyContactRelationship() {
    return this._employeeData.emergencyContactRelationship;
  }
  set emergencyContactRelationship(v: string) {
    this._employeeData.emergencyContactRelationship = v;
    this._reRender();
  }

  get qualifications() {
    return this._employeeData.qualifications;
  }
  setQualifications = (index: number, v: string, years?: number) => {
    if (this._employeeData.qualifications[index] === undefined) {
      return;
    }

    this._employeeData.qualifications[index] = { name: v, years: years ?? 0 };
    this._reRender();
  };
  addQualifications = () => {
    if (this._employeeData.qualifications.length === 3) {
      return;
    }

    this._employeeData.qualifications.push({ name: '', years: 0 });
    this._reRender();
  };
  removeQualifications = (index: number) => {
    if (this._employeeData.qualifications.length === 1) {
      return;
    }

    this._employeeData.qualifications.splice(index, 1);
    this._reRender();
  };

  get jobIdArr(): string[] {
    const arr = this.classJobGroupArr.map((classJobGroup) => {
      return classJobGroup.job?.id;
    });
    const jobIdArrNoNull = arr.filter((item): item is string => !!item);

    return jobIdArrNoNull;
  }

  get postBody() {
    this._employeeData.qualifications = this.qualifications.filter((item) => !!item.name);
    this._reRender();

    const birthday = this._employeeData.birthday;
    // convertDate_add1911(this._employeeData.birthday)
    const startDate = this._employeeData.startDate;
    // convertDate_add1911(this._employeeData.startDate)
    const leaveDate = this._employeeData.leaveDate;
    // convertDate_add1911(this._employeeData.leaveDate)
    const retireDate = this._employeeData.retireDate;
    // convertDate_add1911(this._employeeData.retireDate)
    const severanceDate = this._employeeData.severanceDate;
    // convertDate_add1911(this._employeeData.severanceDate)

    // 直接傳date物件的話，時區會被轉變
    return {
      ...this._employeeData,
      idNumber: undefined, // 後端不收這個
      jobId: this.jobIdArr,
      birthday: birthday,
      startDate: startDate,
      leaveDate: leaveDate,
      retireDate: retireDate,
      severanceDate: severanceDate,
    };
  }
} // Class_employee

// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
class Class_JobGroup {
  constructor(reRender: () => void, job?: TemployeeDto_jobs['jobs'][number]) {
    this._reRender = reRender;

    if (job) {
      this._department = {
        id: job.department.id,
        name: job.department.name,
      };
      this._job = {
        id: job.id,
        name: job.name,
        grade: `${job.grade}`,
      };
    } else {
      this._department = null;
      this._job = null;
    }
  }
  private _reRender;
  private _department;
  private _job;

  get department() {
    return this._department;
  }
  set department(v: typeof this._department) {
    this._department = v;
    this._job = null;
    this._reRender();
  }
  get job() {
    return this._job;
  }
  set job(v: typeof this._job) {
    this._job = v;
    this._reRender();
  }
} // Class_JobGroup

// =============================================

const useClassEmployee = (employeeData?: TemployeeDto_jobs) => {
  const [render, setRender] = useState(0);
  const reRender = () => setRender((state) => state + 1);
  const [classEmployee, setClassEmployee] = useState(new Class_employee(reRender, emptyDataOri()));

  useEffect(() => {
    if (employeeData) {
      setClassEmployee(new Class_employee(reRender, employeeData));
    }
  }, [employeeData]);

  return classEmployee;
};

export { Class_employee, Class_JobGroup, useClassEmployee };

// ======================================================
const emptyDataOri = (): TemployeeDto_jobs => ({
  id: '',
  createdAt: '',
  updatedAt: '',
  idNumber: '',
  chName: '',
  enName: '',
  identity: '',
  birthday: '',
  gender: '',
  marital: '',
  education: '',
  expertise: '',
  phone1: '',
  phone2: '',
  email: '',
  residenceCounty: '',
  residenceDistrict: '',
  residenceAddress: '',
  mailingCounty: '',
  mailingDistrict: '',
  mailingAddress: '',
  processPermission: true,
  seniority: '',
  startDate: '',
  leaveDate: '',
  retireDate: '',
  severanceDate: '',
  militaryServiceType: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  qualifications: [{ name: '', years: 0 }],
  jobs: [],
});
// =======================================================================

// const convertDate_reduce1911 = (ISOString: string) => {
//   if (!ISOString) return ISOString
//   const dateTime = new Date(ISOString)
//   const year = dateTime.getFullYear()
//   const chYear = year - 1911
//   dateTime.setFullYear(chYear)
//   return dateTime.toISOString()
// }

// const convertDate_add1911 = (ISOString: string) => {
//   if (!ISOString) return ISOString
//   const dateTime = new Date(ISOString)
//   const twYear = dateTime.getFullYear()
//   const year = twYear + 1911
//   dateTime.setFullYear(year)
//   return dateTime.toISOString()
// }
