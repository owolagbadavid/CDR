export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
}

export interface CreatePersonnelDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  facilityId?: number;
}
