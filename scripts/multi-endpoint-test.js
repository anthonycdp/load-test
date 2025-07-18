import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { SharedArray } from 'k6/data';

// Carregar dados dos arquivos
const testData = new SharedArray('test data', function () {
    return JSON.parse(open('../data/users.json'));
});

// Métricas customizadas por endpoint
export let errorRate = new Rate('errors');
export let postsErrors = new Rate('posts_errors');
export let usersErrors = new Rate('users_errors');
export let albumsErrors = new Rate('albums_errors');
export let commentsErrors = new Rate('comments_errors');

// Configuração do teste multi-endpoint
export let options = {
    stages: [
        { duration: '1m', target: 15 },   // Ramp-up
        { duration: '3m', target: 30 },   // Carga constante
        { duration: '1m', target: 0 },    // Ramp-down
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'],
        http_req_failed: ['rate<0.1'],
        errors: ['rate<0.1'],
        posts_errors: ['rate<0.05'],
        users_errors: ['rate<0.05'],
        albums_errors: ['rate<0.05'],
        comments_errors: ['rate<0.05'],
    },
};

// URLs das APIs
const JSONPLACEHOLDER_URL = 'https://jsonplaceholder.typicode.com';
const REQRES_URL = 'https://reqres.in/api';

export default function () {
    // Selecionar um usuário aleatório dos dados
    const user = testData[Math.floor(Math.random() * testData.length)];
    
    // Distribuir carga entre diferentes endpoints
    let endpointChoice = Math.random();
    
    if (endpointChoice < 0.3) {
        testPostsEndpoints();
    } else if (endpointChoice < 0.5) {
        testUsersEndpoints();
    } else if (endpointChoice < 0.7) {
        testAlbumsEndpoints();
    } else if (endpointChoice < 0.85) {
        testCommentsEndpoints();
    } else {
        testReqresEndpoints();
    }
    
    sleep(Math.random() * 2 + 0.5);
}

function testPostsEndpoints() {
    // GET /posts
    let response = http.get(`${JSONPLACEHOLDER_URL}/posts`);
    check(response, {
        'posts list - status 200': (r) => r.status === 200,
        'posts list - response time ok': (r) => r.timings.duration < 1000,
        'posts list - has data': (r) => JSON.parse(r.body).length > 0,
    }) || postsErrors.add(1);
    
    sleep(0.3);
    
    // GET /posts/{id}
    let postId = Math.floor(Math.random() * 100) + 1;
    response = http.get(`${JSONPLACEHOLDER_URL}/posts/${postId}`);
    check(response, {
        'post detail - status 200': (r) => r.status === 200,
        'post detail - correct id': (r) => JSON.parse(r.body).id === postId,
    }) || postsErrors.add(1);
    
    sleep(0.3);
    
    // POST /posts
    let newPost = {
        title: `Test Post ${Math.floor(Math.random() * 1000)}`,
        body: 'Test post body content',
        userId: Math.floor(Math.random() * 10) + 1,
    };
    
    response = http.post(`${JSONPLACEHOLDER_URL}/posts`, JSON.stringify(newPost), {
        headers: { 'Content-Type': 'application/json' },
    });
    check(response, {
        'post creation - status 201': (r) => r.status === 201,
        'post creation - has id': (r) => JSON.parse(r.body).id !== undefined,
    }) || postsErrors.add(1);
    
    sleep(0.3);
    
    // PUT /posts/{id}
    let updatePost = {
        id: postId,
        title: 'Updated Post Title',
        body: 'Updated post body',
        userId: 1,
    };
    
    response = http.put(`${JSONPLACEHOLDER_URL}/posts/${postId}`, JSON.stringify(updatePost), {
        headers: { 'Content-Type': 'application/json' },
    });
    check(response, {
        'post update - status 200': (r) => r.status === 200,
        'post update - correct id': (r) => JSON.parse(r.body).id === postId,
    }) || postsErrors.add(1);
    
    sleep(0.3);
    
    // DELETE /posts/{id}
    response = http.del(`${JSONPLACEHOLDER_URL}/posts/${postId}`);
    check(response, {
        'post deletion - status 200': (r) => r.status === 200,
    }) || postsErrors.add(1);
}

function testUsersEndpoints() {
    // GET /users
    let response = http.get(`${JSONPLACEHOLDER_URL}/users`);
    check(response, {
        'users list - status 200': (r) => r.status === 200,
        'users list - has data': (r) => JSON.parse(r.body).length > 0,
    }) || usersErrors.add(1);
    
    sleep(0.3);
    
    // GET /users/{id}
    let userId = Math.floor(Math.random() * 10) + 1;
    response = http.get(`${JSONPLACEHOLDER_URL}/users/${userId}`);
    check(response, {
        'user detail - status 200': (r) => r.status === 200,
        'user detail - has email': (r) => JSON.parse(r.body).email !== undefined,
    }) || usersErrors.add(1);
    
    sleep(0.3);
    
    // GET /users/{id}/posts
    response = http.get(`${JSONPLACEHOLDER_URL}/users/${userId}/posts`);
    check(response, {
        'user posts - status 200': (r) => r.status === 200,
        'user posts - is array': (r) => Array.isArray(JSON.parse(r.body)),
    }) || usersErrors.add(1);
    
    sleep(0.3);
    
    // GET /users/{id}/albums
    response = http.get(`${JSONPLACEHOLDER_URL}/users/${userId}/albums`);
    check(response, {
        'user albums - status 200': (r) => r.status === 200,
        'user albums - is array': (r) => Array.isArray(JSON.parse(r.body)),
    }) || usersErrors.add(1);
}

function testAlbumsEndpoints() {
    // GET /albums
    let response = http.get(`${JSONPLACEHOLDER_URL}/albums`);
    check(response, {
        'albums list - status 200': (r) => r.status === 200,
        'albums list - has data': (r) => JSON.parse(r.body).length > 0,
    }) || albumsErrors.add(1);
    
    sleep(0.3);
    
    // GET /albums/{id}
    let albumId = Math.floor(Math.random() * 100) + 1;
    response = http.get(`${JSONPLACEHOLDER_URL}/albums/${albumId}`);
    check(response, {
        'album detail - status 200': (r) => r.status === 200,
        'album detail - correct id': (r) => JSON.parse(r.body).id === albumId,
    }) || albumsErrors.add(1);
    
    sleep(0.3);
    
    // GET /albums/{id}/photos
    response = http.get(`${JSONPLACEHOLDER_URL}/albums/${albumId}/photos`);
    check(response, {
        'album photos - status 200': (r) => r.status === 200,
        'album photos - is array': (r) => Array.isArray(JSON.parse(r.body)),
        'album photos - has data': (r) => JSON.parse(r.body).length > 0,
    }) || albumsErrors.add(1);
}

function testCommentsEndpoints() {
    // GET /comments
    let response = http.get(`${JSONPLACEHOLDER_URL}/comments`);
    check(response, {
        'comments list - status 200': (r) => r.status === 200,
        'comments list - has data': (r) => JSON.parse(r.body).length > 0,
    }) || commentsErrors.add(1);
    
    sleep(0.3);
    
    // GET /comments/{id}
    let commentId = Math.floor(Math.random() * 500) + 1;
    response = http.get(`${JSONPLACEHOLDER_URL}/comments/${commentId}`);
    check(response, {
        'comment detail - status 200': (r) => r.status === 200,
        'comment detail - has email': (r) => JSON.parse(r.body).email !== undefined,
    }) || commentsErrors.add(1);
    
    sleep(0.3);
    
    // GET /posts/{id}/comments
    let postId = Math.floor(Math.random() * 100) + 1;
    response = http.get(`${JSONPLACEHOLDER_URL}/posts/${postId}/comments`);
    check(response, {
        'post comments - status 200': (r) => r.status === 200,
        'post comments - is array': (r) => Array.isArray(JSON.parse(r.body)),
    }) || commentsErrors.add(1);
}

function testReqresEndpoints() {
    // GET /users (Reqres)
    let response = http.get(`${REQRES_URL}/users?page=1`);
    check(response, {
        'reqres users - status 200': (r) => r.status === 200,
        'reqres users - has data': (r) => JSON.parse(r.body).data.length > 0,
    }) || errorRate.add(1);
    
    sleep(0.3);
    
    // GET /users/{id} (Reqres)
    let userId = Math.floor(Math.random() * 12) + 1;
    response = http.get(`${REQRES_URL}/users/${userId}`);
    check(response, {
        'reqres user - status 200': (r) => r.status === 200,
        'reqres user - has data': (r) => JSON.parse(r.body).data !== undefined,
    }) || errorRate.add(1);
    
    sleep(0.3);
    
    // POST /users (Reqres)
    let newUser = {
        name: 'Test User',
        job: 'QA Engineer',
    };
    
    response = http.post(`${REQRES_URL}/users`, JSON.stringify(newUser), {
        headers: { 'Content-Type': 'application/json' },
    });
    check(response, {
        'reqres create user - status 201': (r) => r.status === 201,
        'reqres create user - has id': (r) => JSON.parse(r.body).id !== undefined,
    }) || errorRate.add(1);
}

// Setup do teste
export function setup() {
    console.log('🔄 Iniciando teste multi-endpoint...');
    console.log('🎯 Testando múltiplas rotas das APIs JSONPlaceholder e Reqres');
    console.log('📊 Métricas serão coletadas por endpoint');
}

// Teardown do teste
export function teardown(data) {
    console.log('✅ Teste multi-endpoint concluído');
    console.log('📈 Analise as métricas específicas de cada endpoint');
}