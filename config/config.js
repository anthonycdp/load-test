// Configurações globais para os testes k6
export const config = {
    // URLs das APIs para teste
    apis: {
        jsonplaceholder: 'https://jsonplaceholder.typicode.com',
        reqres: 'https://reqres.in/api',
    },
    
    // Configurações de timeout
    timeouts: {
        default: '30s',
        long: '60s',
        short: '10s',
    },
    
    // Thresholds padrão para diferentes tipos de teste
    thresholds: {
        load: {
            http_req_duration: ['p(95)<500'],
            http_req_failed: ['rate<0.05'],
            errors: ['rate<0.05'],
        },
        stress: {
            http_req_duration: ['p(95)<2000'],
            http_req_failed: ['rate<0.2'],
            errors: ['rate<0.15'],
        },
        spike: {
            http_req_duration: ['p(95)<5000'],
            http_req_failed: ['rate<0.3'],
            errors: ['rate<0.25'],
        },
    },
    
    // Configurações de usuários virtuais
    vus: {
        load: {
            min: 1,
            max: 20,
            target: 10,
        },
        stress: {
            min: 10,
            max: 200,
            target: 100,
        },
        spike: {
            min: 10,
            max: 500,
            target: 500,
        },
    },
    
    // Headers padrão
    headers: {
        json: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        standard: {
            'User-Agent': 'k6-load-test',
            'Accept': 'application/json',
        },
    },
    
    // Configurações de relatórios
    reports: {
        html: {
            enabled: true,
            outputPath: './results/report.html',
        },
        json: {
            enabled: true,
            outputPath: './results/results.json',
        },
        csv: {
            enabled: true,
            outputPath: './results/results.csv',
        },
    },
    
    // Configurações de ambiente
    environment: {
        development: {
            baseURL: 'https://jsonplaceholder.typicode.com',
            debug: true,
        },
        staging: {
            baseURL: 'https://jsonplaceholder.typicode.com',
            debug: false,
        },
        production: {
            baseURL: 'https://jsonplaceholder.typicode.com',
            debug: false,
        },
    },
};