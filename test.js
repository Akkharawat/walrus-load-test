import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';

export const options = {
  httpDebug: 'full',
};

const envArray = new SharedArray('env', () => JSON.parse(open('./env.json')));

export default function () {
  const env = {
    baseUrl: {
      fastDeliveryAPI: envArray[0].FAST_DELIVERY_API_BASE_URL,
      fastTransportAPI: envArray[0].FAST_TRANSPORT_API_BASE_URL,
      lmsPortalTransportAPI: envArray[0].LMS_PORTAL_TRANSPORT_API_BASE_URL,
    },
    xApiKey: envArray[0].API_KEY,
    bearerToken: envArray[0].BEAER_TOKEN,
  }

  testFastDeliveryGetApi(env.baseUrl.fastDeliveryAPI, env.xApiKey)
  testFastDeliveryPutApi(env.baseUrl.fastDeliveryAPI, env.xApiKey)
  testFastTransportyGetApi(env.baseUrl.fastTransportAPI, env.xApiKey)
  testLmsPortalTransportGetApi(env.baseUrl.lmsPortalTransportAPI, env.bearerToken)
}

function testFastDeliveryGetApi(baseUrl, apiKey) {
  let endpoints = [
    `/routes?deliveryDate=2024-02-01&deliveryStatus=delivered&riderId=3128`,
    `/tasks/cartons?taskId=1303434`,
    `/delivery-case/reasons/UNCOLLECTED_SIGNATURE`,
    `/extra-works/task?taskId=1303434`,
    `/riders/validate?username=rider_b_1&citizenId=1500000000365`,
    `/tasks/histories?startDate=2024-02-01&endDate=2024-02-01&riderId=3128`,
    `/tasks/taskId/1303434`,
  ]

  endpoints.forEach((endpoint) => {
    const url = baseUrl + endpoint
    const params = {
      headers: {
        'x-api-key': apiKey,
      },
    }

    const response = http.get(url, params);
    const message = `FAST-APP can call delivery-internal-api GET ${endpoint}`
    let checker = {};
    checker[message] = (res) => res.status === 200
    check(response, checker);
  })
}

function testFastDeliveryPutApi(baseUrl, apiKey) {
  const endpoint = '/riders/password'
  const url = baseUrl + endpoint
    const body = {
      newPassword: '12345678',
      username: 'Release_น๊องซ์หมวย',
    }
    const params = {
      headers: {
        'x-api-key': apiKey,
      },
    }

    const response = http.put(url, JSON.stringify(body), params);
    const message = `FAST-APP can call delivery-internal-api PUT ${endpoint}`
    let checker = {};
    checker[message] = (res) => res.status === 200
    check(response, checker);
}

function testFastTransportyGetApi(baseUrl, apiKey) {
  let endpoints = [
    `/hubs`,
    `/hubs/distances?lat=13.730291208342&lng=100.5993783411044`,
    `/riders/attendance?username=AutomateZoneA10&startDate=2023-12-01&endDate=2024-02-01`,
  ]

  endpoints.forEach((endpoint) => {
    const url = baseUrl + endpoint
    const params = {
      headers: {
        'x-api-key': apiKey,
      },
    }

    const response = http.get(url, params);
    const message = `FAST-APP can call transport-internal-api GET ${endpoint}`
    let checker = {};
    checker[message] = (res) => res.status === 200
    check(response, checker);
  })
}

function testLmsPortalTransportGetApi(baseUrl, bearerToken) {
  let endpoints = [
    `/riders/798`,
    `/riders/status?riderId=798&limit=1000`,
    `/riders/status/incomming-status/798`,
    `/roster/leaves/798`,
    `/roster/schedule-master/798`,
    `/roster/shifts/shift`,
    `/roster/works/798`,
    `/skills`,
    `/vehicle/models?limit=100`,
    `/vehicle/models?limit=100&id=9`,
  ]

  endpoints.forEach((endpoint) => {
    const url = baseUrl + endpoint
    const params = {
      headers: {
        'Authorization': 'Bearer ' + bearerToken,
      },
    }

    const response = http.get(url, params);
    const message = `LMS-Portal can call transport-external-api GET ${endpoint}`
    let checker = {};
    checker[message] = (res) => res.status === 200
    check(response, checker);
  })
}