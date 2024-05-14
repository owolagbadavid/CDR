export class AppointmentDto {
  description: string;

  facilityId: number;

  patientId: string;

  appointmentDateTime: Date;

  previousAppointmentId: number;
}

export class UpdateAppointmentDto {
  description: string;

  appointmentDateTime: Date;

  previousAppointmentId: number;

  documentation: {
    type: string;
    url: string;
  }[];

  servicesReceived?: string[];
}
