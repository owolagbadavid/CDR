// Base User Entity

export interface User {
  firtstName: string;

  lastName: string;

  email: string;

  passwordHash: string;

  // setter for password
  password: string;
}

export interface Patient extends User {
  patientId: number;

  dateOfBirth: Date;
}

export interface Personnel extends User {
  personnelId: number;
}
