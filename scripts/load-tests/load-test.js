import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métricas customizadas
export let errorRate = new Rate('errors');

// Configuração do teste de carga
export let options = {
    stages: [
        { duration: '30s', target: 5 },  // Ramp-up para 5 usuários
        { duration: '1m', target: 10 },  // Manter 10 usuários
        { duration: '30s', target: 0 },  // Ramp-down para 0 usuários
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% das requisições < 500ms
        errors: ['rate<0.1'], // Taxa de erro < 10%
    },
};

// Configuração da API
const BASE_URL = 'https://jsonplaceholder.typicode.com';

export default function () {
    // Teste GET - Buscar posts
    let response = http.get(`${BASE_URL}/posts`);
    check(response, {
        'status é 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
        'response contém posts': (r) => JSON.parse(r.body).length > 0,
    }) || errorRate.add(1);

    sleep(1);

    // Teste GET - Buscar post específico
    let postId = Math.floor(Math.random() * 100) + 1;
    response = http.get(`${BASE_URL}/posts/${postId}`);
    check(response, {
        'status é 200': (r) => r.status === 200,
        'response time < 300ms': (r) => r.timings.duration < 300,
        'post tem id correto': (r) => JSON.parse(r.body).id === postId,
    }) || errorRate.add(1);

    sleep(1);

    // Teste POST - Criar novo post
    let payload = JSON.stringify({
        title: 'Test Post',
        body: 'This is a test post created by k6',
        userId: Math.floor(Math.random() * 10) + 1,
    });

    let params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    response = http.post(`${BASE_URL}/posts`, payload, params);
    check(response, {
        'status é 201': (r) => r.status === 201,
        'response time < 1000ms': (r) => r.timings.duration < 1000,
        'post foi criado': (r) => JSON.parse(r.body).title === 'Test Post',
    }) || errorRate.add(1);

    sleep(1);
}