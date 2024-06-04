import http from 'k6/http';
import { sleep } from 'k6';

const host = 'http://localhost:3000/api/v1';


export let options = {


    stages: [
      { duration: '2m', target: 2000 }, // fast ramp-up to a high point
      // No plateau
      { duration: '1m', target: 0 }, // quick ramp-down to 0 users
    ],
    // iterations : 10,
    // vus: 10,
};



export function setup() {
    // setup script to run before the test
    //@ Delete everything in the database
    http.del(`${host}/users/all`);

    const facilityPayload = JSON.stringify({
        name: "myFacility",
        address: "myAddress",
        email: "facility@email.com",
        website: "facility.com",
        description: "myVeryOwnFacilty",
        phone: "081-0923",
        type: "hospital",
        qualification: {
            name: "myQualification",
            start: "12-12-12",
            end: "12-12-12",
            description: "A qualification",
            issuer: "NCDC"
        },

    });

    const facilityParams = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    http.post(`${host}/facilities`, facilityPayload, facilityParams);



    //@ create 10 personnel


    for (let i = 0; i < 10; i++) {
        const payload = JSON.stringify({
            firstName: "Mike",
            lastName: "Don",
            email: `mike${i}@don.com`,
            password: "secret",
            facilityId: 1,
            dateOfBirth: "03-03-03",
            telecom: "08088167662",
            gender: "M",
            type: "other"
        });

        const params = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        http.post(`${host}/auth/personnelRegister`, payload, params);

        sleep(1); // Wait for 1 second between requests

    }

    //@ login as random personnel 

    let num = Math.floor(Math.random() * 10);

    const loginPayload = JSON.stringify({
        email: `mike${num}@don.com`,
        password: "secret",
    });

    const loginParams = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const loginResponse = http.post(`${host}/auth/personnelLogin`, loginPayload, loginParams);
    const cookie = loginResponse.headers['Set-Cookie'];


    for (let i = 0; i < 10; i++) {
        const patientPayload = JSON.stringify({
            firstName: "Mike",
            lastName: "Don",
            email: `pat${i}@don.com`,
            dateOfBirth: "03-03-03",
            telecom: "08088167662",
            maritalStatus: "single",
            gender: "M"
        });
        const patientParams = {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie, // Include the cookie obtained from the login request
            },
        };
        http.post(`${host}/auth/patientRegister`, patientPayload, patientParams);

    }

}


export default function () {
    //@ login request to /auth/personnelLogin to login the personnel and get cookie from the response
    let num = Math.floor(Math.random() * 10);

    const loginPayload = JSON.stringify({
        email: `mike${num}@don.com`,
        password: "secret",
    });

    const loginParams = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const loginResponse = http.post(`${host}/auth/personnelLogin`, loginPayload, loginParams);
    const cookie = loginResponse.headers['Set-Cookie'];


    //@ create  patient

    const patientPayload = JSON.stringify({
        firstName: "Mike",
        lastName: "Don",
        email: `pat${__VU}e@don.com`,
        dateOfBirth: "03-03-03",
        telecom: "08088167662",
        maritalStatus: "single",
        gender: "M"
    });
    const patientParams = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie, // Include the cookie obtained from the login request
        },
    };
    const registerPatResp = http.post(`${host}/auth/patientRegister`, patientPayload, patientParams);
    const verToken = JSON.parse(registerPatResp.body).data.verificationToken;
    const patId = JSON.parse(registerPatResp.body).data.patientId;

    //@ verify patient /auth/resetPassword
    const verifyPayload = JSON.stringify({
        email: `pat${__VU}e@don.com`,
        token: verToken,
        password: "secret",
    });


    const verifyParams = {
        headers: {
            'Content-Type': 'application/json',
        },

    };

    http.post(`${host}/auth/resetPassword`, verifyPayload, verifyParams);

    //@ get all patients /users/patients
    const getPatientsParams = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie, // Include the cookie obtained from the login request
        },
    };

    http.get(`${host}/users/patients`, getPatientsParams);


    //@ get patient by id /users/patients/:id
    const getPatientParams = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie, // Include the cookie obtained from the login request
        },
    };

    http.get(`${host}/users/patients/${patId}`, getPatientParams);

    //@ get facility staff /facilities/:id/staff

    const getFacilityStaffParams = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie, // Include the cookie obtained from the login request
        },
    };

    const staffResp = http.get(`${host}/facilities/1/staff`, getFacilityStaffParams);
    const pers1 = JSON.parse(staffResp.body).data[0]
    const pers2 = JSON.parse(staffResp.body).data[1]
    const persId = pers1.personnelId;

    //@ get personnel by id /users/personnel/:id
    const getPersonnelParams = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie, // Include the cookie obtained from the login request
        },
    };

    http.get(`${host}/users/personnel/${persId}`, getPersonnelParams);

    //@ get facilities /facilities

    const getFacilitiesParams = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie, // Include the cookie obtained from the login request
        },
    };

    http.get(`${host}/facilities`, getFacilitiesParams);


    //@ create appointment /appointments
    const appointmentPayload = JSON.stringify({
        patientId: patId,
        description: "my Appointment",
        phone: "081-0923",
        type: "hospital",
        facilityId: 1,
        appointmentDateTime: "12-12-12"
    });

    const appointmentParams = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie, // Include the cookie obtained from the login request
        },
    };

    const appointResp = http.post(`${host}/facilities/1/appointments`, appointmentPayload, appointmentParams);

    const appointmentId = JSON.parse(appointResp.body).data.appointmentId;

    //@ get appointments /appointments
    const getAppointmentsParams = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie, // Include the cookie obtained from the login request
        },
    };

    http.get(`${host}/facilities/1/appointments`, getAppointmentsParams);

    //@ get appointment by id /appointments/:id
    const getAppointmentParams = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie, // Include the cookie obtained from the login request
        },
    };

    http.get(`${host}/facilities/1/appointments/${appointmentId}`, getAppointmentParams);

    //@ get patient appointments /users/patients/:id/appointments
    const getPatientAppointmentsParams = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie, // Include the cookie obtained from the login request
        },
    };

    http.get(`${host}/users/patients/${patId}/appointments`, getPatientAppointmentsParams);

    //@ Login as patient /auth/patientLogin

    const patientLoginPayload = JSON.stringify({
        email: `pat${__VU}e@don.com`,
        password: 'secret',
    });

    const patientLoginParams = {
        headers: {

            'Content-Type': 'application/json',
        },
    };

    const patientLoginResponse = http.post(`${host}/auth/patientLogin`, patientLoginPayload, patientLoginParams);
    const patientCookie = patientLoginResponse.headers['Set-Cookie'];

    const persToAddorRemove = pers1.email == `mike${num}@don.com` ? pers2.personnelId : pers1.personnelId;

    //@ add personnel to appointment facilities/1/appointments/:id/personnel
    const addPersonnelPayload = JSON.stringify({
        personnelId: persToAddorRemove
    });

    const addPersonnelParams = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': patientCookie, // Include the cookie obtained from the login request
        },
    };

    http.post(`${host}/facilities/1/appointments/${appointmentId}/personnel`, addPersonnelPayload, addPersonnelParams);

    //@ remove personnel from appointment facilities/1/appointments/:id/personnel/:id
    const removePersonnelParams = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': patientCookie, // Include the cookie obtained from the login request
        },

    };

    const removePersonnelPayload = JSON.stringify({
        personnelId: persToAddorRemove
    });


    http.del(`${host}/facilities/1/appointments/${appointmentId}/personnel`, removePersonnelPayload, removePersonnelParams);



}  
