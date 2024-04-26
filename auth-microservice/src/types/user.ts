// Base User Entity

export interface User {
  firtstName: string;

  lastName: string;

  email: string;

  passwordHash: string;

  // setter for password
  password: string;

  passwordToken: string | null;

  passwordTokenExpiration: Date | null;

  isVerified: boolean;

  verificationToken: string | null;

  verified: Date;
}

export interface Patient extends User {
  patientId: number;

  dateOfBirth: Date;
}

export interface Personnel extends User {
  personnelId: number;
}
