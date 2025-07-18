<div align="center">

# 🚀 k6 Performance Testing Framework

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![k6](https://img.shields.io/badge/k6-7D64FF?style=for-the-badge&logo=k6&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Performance Testing](https://img.shields.io/badge/Performance%20Testing-4CAF50?style=for-the-badge&logo=checkmarx&logoColor=white)

*Comprehensive performance testing framework demonstrating expertise in non-functional testing using k6*

[🚀 Getting Started](#-installation) • [📚 Documentation](#-project-structure) • [🧪 Test Types](#-main-features) • [📄 License](#-license)

</div>

---

## 📋 Overview

This project demonstrates comprehensive **non-functional testing** expertise using k6, a modern performance testing tool. The framework includes different types of tests (load, stress, spike) and multiple configurations for complete performance analysis, showcasing professional approaches to performance validation and system reliability assessment.

## 🎯 Objectives

- Demonstrate proficiency in performance testing using k6
- Implement comprehensive load, stress, and spike testing scenarios
- Apply best practices for performance test automation
- Provide detailed reporting and metrics analysis
- Create reusable and maintainable test configurations

## 🛠️ Technologies

- **[k6](https://k6.io/)** - Modern performance testing tool
- **[JavaScript](https://developer.mozilla.org/docs/Web/JavaScript)** - Scripting language for test scenarios
- **[Node.js](https://nodejs.org/)** - JavaScript runtime for script execution
- **[JSON](https://www.json.org/)** - Data format for configuration and reporting
- **[CSV](https://en.wikipedia.org/wiki/Comma-separated_values)** - Data format for spreadsheet analysis
- **[JSONPlaceholder](https://jsonplaceholder.typicode.com/)** - Public API for testing
- **[Reqres](https://reqres.in/)** - Alternative public API for testing

## 📁 Project Structure

```
load-test/
├── scripts/
│   ├── load-tests/
│   │   └── load-test.js          # Load test (10 users)
│   ├── stress-tests/
│   │   └── stress-test.js        # Stress test (progressive scaling)
│   ├── spike-tests/
│   │   └── spike-test.js         # Spike test (sudden load)
│   └── multi-endpoint-test.js    # Multi-route testing
├── config/
│   └── config.js                 # Global configurations
├── data/
│   ├── test-data.csv            # Test data (CSV)
│   └── users.json               # User data (JSON)
├── results/                     # Generated reports
├── package.json                 # NPM scripts
└── README.md                    # Documentation
```

## 🚀 Prerequisites

Before running the tests, ensure you have the following installed:

- **k6** installed on your machine
- **Node.js** (optional, for script management)
- Internet access for testing public APIs

### k6 Installation

#### Windows (using Chocolatey)
```bash
choco install k6
```

#### macOS (using Homebrew)
```bash
brew install k6
```

#### Linux (Ubuntu/Debian)
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

#### Verify Installation
```bash
k6 version
```

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anthonycdp/load-test.git
   cd load-test
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create result directories**:
   ```bash
   npm run setup
   ```

## 🧪 Usage

### Basic Commands

```bash
# Load test
npm run test:load

# Stress test
npm run test:stress

# Spike test
npm run test:spike

# Multi-endpoint test
npm run test:multi

# All tests
npm run test:all
```

### Commands with Detailed Reports

```bash
# Load test with HTML, JSON and CSV reports
npm run test:load:verbose

# Stress test with detailed reports
npm run test:stress:verbose

# Spike test with detailed reports
npm run test:spike:verbose

# Multi-endpoint test with detailed reports
npm run test:multi:verbose
```

### Commands with Statistical Summary

```bash
# Load test with detailed statistics
npm run test:load:summary

# Stress test with detailed statistics
npm run test:stress:summary
```

### Utility Commands

```bash
# Clean previous results
npm run clean

# Setup directories
npm run setup

# View available commands
npm run help
```

## 🧪 Main Features

### 1. Load Test
- **Objective**: Test behavior under normal load
- **Configuration**: 10 concurrent users for 1 minute
- **Scenarios**: GET, POST, PUT, DELETE on posts
- **Thresholds**: p(95) < 500ms, error < 5%

### 2. Stress Test
- **Objective**: Find capacity limits
- **Configuration**: Progressive scaling up to 200 users
- **Scenarios**: Simulation of different user profiles
- **Thresholds**: p(95) < 2000ms, error < 15%

### 3. Spike Test
- **Objective**: Test behavior with sudden spikes
- **Configuration**: Spike of 500 users for 2 minutes
- **Scenarios**: Sudden load and recovery analysis
- **Thresholds**: p(95) < 5000ms, error < 25%

### 4. Multi-Endpoint Test
- **Objective**: Test multiple routes simultaneously
- **Configuration**: 30 users testing different endpoints
- **Scenarios**: JSONPlaceholder and Reqres APIs
- **Thresholds**: Specific metrics per endpoint

## ✅ Validations

### Main Metrics

| Metric | Description | Ideal Values |
|---------|-----------|----------------|
| `http_req_duration` | Response time | p(95) < 500ms (normal load) |
| `http_req_failed` | Failure rate | < 5% (normal load) |
| `http_reqs` | Requests per second | Higher is better |
| `vus` | Active virtual users | As configured |
| `vus_max` | Maximum virtual users | As configured |

### Analysis by Test Type

#### 🟢 Load Test
- **Success**: All metrics within thresholds
- **Warning**: p(95) between 500-1000ms
- **Problem**: Error rate > 5% or p(95) > 1000ms

#### 🟡 Stress Test
- **Success**: System maintains performance to the limit
- **Warning**: Gradual performance degradation
- **Problem**: Catastrophic failures or timeout

#### 🔴 Spike Test
- **Success**: System recovers after the spike
- **Warning**: Recovery time > 30s
- **Problem**: System doesn't recover

### HTTP Status Codes

- **2xx**: Success ✅
- **3xx**: Redirection ⚠️
- **4xx**: Client error ❌
- **5xx**: Server error 🚨

## 📊 Statistics

### Report Types Generated

1. **HTML Report** (`results/*.html`)
   - Interactive charts
   - Visual metrics analysis
   - Easy sharing

2. **JSON Report** (`results/*.json`)
   - Structured data
   - Tool integration
   - Programmatic analysis

3. **CSV Report** (`results/*.csv`)
   - Tabular data
   - Excel/Google Sheets analysis
   - Metrics history

### Example Terminal Output

```
scenarios: (100.00%) 1 scenario, 10 max VUs, 2m30s max duration (incl. graceful stop):
           * default: Up to 10 looping VUs for 2m0s over 3 stages

running (2m00.1s), 00/10 VUs, 890 complete and 0 interrupted iterations
default ✓ [======================================] 00/10 VUs  2m0s

checks.........................: 100.00% ✓ 2670 ✗ 0
data_received..................: 2.1 MB  17 kB/s
data_sent......................: 180 kB  1.5 kB/s
http_req_blocked...............: avg=1.2ms    min=0s     med=0s     max=156ms  p(90)=0s     p(95)=0s
http_req_connecting............: avg=0.4ms    min=0s     med=0s     max=52ms   p(90)=0s     p(95)=0s
http_req_duration..............: avg=89.4ms   min=58ms   med=85ms   max=340ms  p(90)=118ms  p(95)=142ms
http_req_failed................: 0.00%   ✓ 0    ✗ 2670
http_req_receiving.............: avg=0.3ms    min=0s     med=0s     max=12ms   p(90)=1ms    p(95)=1ms
http_req_sending...............: avg=0.1ms    min=0s     med=0s     max=2ms    p(90)=0s     p(95)=0s
http_req_tls_handshaking.......: avg=0.7ms    min=0s     med=0s     max=92ms   p(90)=0s     p(95)=0s
http_req_waiting...............: avg=89ms     min=57ms   med=84ms   max=339ms  p(90)=117ms  p(95)=141ms
http_reqs......................: 2670    22.2/s
iteration_duration.............: avg=3.1s     min=3s     med=3s     max=3.4s   p(90)=3.1s   p(95)=3.1s
iterations.....................: 890     7.4/s
vus............................: 10      min=0  max=10
vus_max........................: 10      min=10 max=10
```

## 🎓 Best Practices

### Implemented in This Project

- ✅ **Different test types** (load, stress, spike)
- ✅ **Multiple endpoints and scenarios**
- ✅ **Flexible and reusable configurations**
- ✅ **Detailed report generation**
- ✅ **CI/CD integration ready**
- ✅ **Comprehensive documentation**

### Performance Testing Guidelines

1. **Customizing Tests**
   ```javascript
   thresholds: {
       http_req_duration: ['p(95)<1000'], // 95% < 1s
       http_req_failed: ['rate<0.01'],    // < 1% failures
   }
   ```

2. **Modifying Stages**
   ```javascript
   stages: [
       { duration: '2m', target: 20 },  // Ramp-up
       { duration: '5m', target: 50 },  // Load
       { duration: '2m', target: 0 },   // Ramp-down
   ]
   ```

3. **Configuring External Data**
   ```javascript
   const data = new SharedArray('data', function () {
       return papaparse.parse(open('./data/test-data.csv'), {
           header: true,
       }).data;
   });
   ```

### CI/CD Integration

```yaml
# .github/workflows/performance-test.yml
name: Performance Tests
on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install k6
        run: |
          curl https://github.com/grafana/k6/releases/download/v0.45.0/k6-v0.45.0-linux-amd64.tar.gz -L | tar xvz --strip-components 1
      - name: Run Load Test
        run: ./k6 run scripts/load-tests/load-test.js
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

<div align="center">

**Anthony Coelho**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/anthonycdp)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anthonycoelhoqae/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:anthonycoelho.dp@hotmail.com)

*QA Engineer specialized in performance testing and automation*

</div>

---

<div align="center">

### ⭐ If this project was helpful to you, consider giving it a star!

### 🤝 Contributions are welcome!

**Version**: 1.0.0

</div>