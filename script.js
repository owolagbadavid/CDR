import http from 'k6/http';
import { sleep } from 'k6';

const host = 'http://localhost:3000/api/v1';

export default function () {
  if (__ITER === 0) {
    for (let i = 0; i < 10; i++) {
      const payload = JSON.stringify({
        firstName: "Mike",
        lastName: "Don",
        email: `mike${i}@do.com`,
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
  }


    // login request to /auth/login to login the personnel
    

    
    // delete request to /personnel (no payload) to delete the personnel only at the last iteration
    if (__ITER === 9) {
      http.del(`${host}/personnel`);
    }

}