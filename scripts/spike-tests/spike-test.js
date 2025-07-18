import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métricas customizadas
export let errorRate = new Rate('errors');

// Configuração do teste de pico - carga súbita
export let options = {
    stages: [
        { duration: '30s', target: 10 },   // Warm-up com 10 usuários
        { duration: '10s', target: 500 },  // Pico súbito: 500 usuários
        { duration: '2m', target: 500 },   // Manter pico por 2 minutos
        { duration: '30s', target: 10 },   // Queda súbita para 10 usuários
        { duration: '1m', target: 10 },    // Recuperação: manter 10 usuários
        { duration: '30s', target: 0 },    // Ramp-down final
    ],
    thresholds: {
        http_req_duration: ['p(95)<5000'], // 95% das requisições < 5s (mais tolerante)
        http_req_failed: ['rate<0.3'],     // Taxa de falha < 30%
        errors: ['rate<0.25'],             // Taxa de erro < 25%
    },
};

// Configuração da API
const BASE_URL = 'https://jsonplaceholder.typicode.com';

export default function () {
    // Durante o pico, simular comportamento mais agressivo
    let currentVUs = __VU;
    let isSpikePeriod = __ITER > 10 && __ITER < 50; // Aproximadamente durante o pico
    
    if (isSpikePeriod) {
        // Comportamento durante o pico - mais requisições simultâneas
        performSpikeTest();
    } else {
        // Comportamento normal
        performNormalTest();
    }
    
    // Sleep menor durante o pico para aumentar a pressão
    sleep(isSpikePeriod ? Math.random() * 0.5 + 0.1 : Math.random() * 2 + 0.5);
}

function performSpikeTest() {
    // Múltiplas requisições simultâneas para simular pico real
    let responses = http.batch([
        ['GET', `${BASE_URL}/posts`],
        ['GET', `${BASE_URL}/users`],
        ['GET', `${BASE_URL}/albums`],
        ['GET', `${BASE_URL}/comments`],
    ]);
    
    responses.forEach((response, index) => {
        const endpoints = ['posts', 'users', 'albums', 'comments'];
        check(response, {
            [`spike ${endpoints[index]} - status not 5xx`]: (r) => r.status < 500,
            [`spike ${endpoints[index]} - response time acceptable`]: (r) => r.timings.duration < 10000,
        }) || errorRate.add(1);
    });
    
    sleep(0.1);
    
    // Teste POST durante o pico
    let payload = JSON.stringify({
        title: `Spike Test Post ${Math.random()}`,
        body: 'Created during spike test',
        userId: Math.floor(Math.random() * 10) + 1,
    });

    let params = {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: '10s', // Timeout maior para picos
    };

    let response = http.post(`${BASE_URL}/posts`, payload, params);
    check(response, {
        'spike post - not server error': (r) => r.status < 500,
        'spike post - response time under 10s': (r) => r.timings.duration < 10000,
    }) || errorRate.add(1);
}

function performNormalTest() {
    // Operações normais fora do período de pico
    let response = http.get(`${BASE_URL}/posts`);
    check(response, {
        'normal posts - status 200': (r) => r.status === 200,
        'normal posts - response time ok': (r) => r.timings.duration < 2000,
    }) || errorRate.add(1);
    
    sleep(0.5);
    
    // Buscar post específico
    let postId = Math.floor(Math.random() * 100) + 1;
    response = http.get(`${BASE_URL}/posts/${postId}`);
    check(response, {
        'normal post - status 200': (r) => r.status === 200,
        'normal post - has data': (r) => JSON.parse(r.body).id === postId,
    }) || errorRate.add(1);
    
    sleep(0.5);
    
    // Operação de escrita
    let payload = JSON.stringify({
        title: 'Normal Test Post',
        body: 'Created during normal period',
        userId: Math.floor(Math.random() * 10) + 1,
    });

    let params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    response = http.post(`${BASE_URL}/posts`, payload, params);
    check(response, {
        'normal post creation - status 201': (r) => r.status === 201,
        'normal post creation - response time ok': (r) => r.timings.duration < 3000,
    }) || errorRate.add(1);
}

// Função para setup do teste
export function setup() {
    console.log('🚀 Iniciando teste de pico...');
    console.log('⚠️  Este teste irá gerar carga súbita de 500 usuários');
    console.log('📊 Monitore as métricas para identificar o ponto de quebra');
}

// Função para teardown do teste
export function teardown(data) {
    console.log('✅ Teste de pico concluído');
    console.log('📈 Analise os resultados para identificar:');
    console.log('   - Tempo de resposta durante o pico');
    console.log('   - Taxa de erro durante sobrecarga');
    console.log('   - Tempo de recuperação após o pico');
}