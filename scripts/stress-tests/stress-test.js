import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métricas customizadas
export let errorRate = new Rate('errors');

// Configuração do teste de stress - escala progressiva
export let options = {
    stages: [
        { duration: '1m', target: 20 },   // Ramp-up para 20 usuários
        { duration: '2m', target: 50 },   // Escalar para 50 usuários
        { duration: '3m', target: 100 },  // Escalar para 100 usuários
        { duration: '2m', target: 150 },  // Escalar para 150 usuários
        { duration: '1m', target: 200 },  // Máximo: 200 usuários
        { duration: '2m', target: 200 },  // Manter 200 usuários
        { duration: '2m', target: 0 },    // Ramp-down gradual
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% das requisições < 2s
        http_req_failed: ['rate<0.2'],     // Taxa de falha < 20%
        errors: ['rate<0.15'],             // Taxa de erro < 15%
    },
};

// Configuração da API
const BASE_URL = 'https://jsonplaceholder.typicode.com';

export default function () {
    // Simular diferentes tipos de usuários
    let userType = Math.random();
    
    if (userType < 0.4) {
        // 40% dos usuários fazem busca de posts
        browsePosts();
    } else if (userType < 0.7) {
        // 30% dos usuários fazem operações CRUD
        performCRUD();
    } else {
        // 30% dos usuários fazem operações complexas
        performComplexOperations();
    }
    
    // Tempo de think time variável
    sleep(Math.random() * 3 + 1);
}

function browsePosts() {
    // Buscar lista de posts
    let response = http.get(`${BASE_URL}/posts`);
    check(response, {
        'browse posts - status 200': (r) => r.status === 200,
        'browse posts - response time ok': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);
    
    sleep(0.5);
    
    // Buscar post específico
    let postId = Math.floor(Math.random() * 100) + 1;
    response = http.get(`${BASE_URL}/posts/${postId}`);
    check(response, {
        'get post - status 200': (r) => r.status === 200,
        'get post - has content': (r) => JSON.parse(r.body).title !== undefined,
    }) || errorRate.add(1);
    
    sleep(0.5);
    
    // Buscar comentários do post
    response = http.get(`${BASE_URL}/posts/${postId}/comments`);
    check(response, {
        'get comments - status 200': (r) => r.status === 200,
        'get comments - is array': (r) => Array.isArray(JSON.parse(r.body)),
    }) || errorRate.add(1);
}

function performCRUD() {
    // CREATE - Criar novo post
    let payload = JSON.stringify({
        title: `Stress Test Post ${Math.floor(Math.random() * 1000)}`,
        body: 'This is a stress test post created by k6',
        userId: Math.floor(Math.random() * 10) + 1,
    });

    let params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let response = http.post(`${BASE_URL}/posts`, payload, params);
    check(response, {
        'create post - status 201': (r) => r.status === 201,
        'create post - response time ok': (r) => r.timings.duration < 2000,
    }) || errorRate.add(1);
    
    sleep(0.5);
    
    // READ - Buscar o post criado
    let postId = Math.floor(Math.random() * 100) + 1;
    response = http.get(`${BASE_URL}/posts/${postId}`);
    check(response, {
        'read post - status 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    
    sleep(0.5);
    
    // UPDATE - Atualizar post
    payload = JSON.stringify({
        id: postId,
        title: 'Updated Post Title',
        body: 'Updated post body',
        userId: 1,
    });

    response = http.put(`${BASE_URL}/posts/${postId}`, payload, params);
    check(response, {
        'update post - status 200': (r) => r.status === 200,
        'update post - response time ok': (r) => r.timings.duration < 2000,
    }) || errorRate.add(1);
    
    sleep(0.5);
    
    // DELETE - Deletar post
    response = http.del(`${BASE_URL}/posts/${postId}`);
    check(response, {
        'delete post - status 200': (r) => r.status === 200,
    }) || errorRate.add(1);
}

function performComplexOperations() {
    // Buscar usuários
    let response = http.get(`${BASE_URL}/users`);
    check(response, {
        'get users - status 200': (r) => r.status === 200,
        'get users - response time ok': (r) => r.timings.duration < 1500,
    }) || errorRate.add(1);
    
    sleep(0.5);
    
    // Buscar posts de um usuário específico
    let userId = Math.floor(Math.random() * 10) + 1;
    response = http.get(`${BASE_URL}/users/${userId}/posts`);
    check(response, {
        'get user posts - status 200': (r) => r.status === 200,
        'get user posts - is array': (r) => Array.isArray(JSON.parse(r.body)),
    }) || errorRate.add(1);
    
    sleep(0.5);
    
    // Buscar albums do usuário
    response = http.get(`${BASE_URL}/users/${userId}/albums`);
    check(response, {
        'get user albums - status 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    
    sleep(0.5);
    
    // Buscar fotos de um album
    let albumId = Math.floor(Math.random() * 100) + 1;
    response = http.get(`${BASE_URL}/albums/${albumId}/photos`);
    check(response, {
        'get album photos - status 200': (r) => r.status === 200,
        'get album photos - response time ok': (r) => r.timings.duration < 2000,
    }) || errorRate.add(1);
}