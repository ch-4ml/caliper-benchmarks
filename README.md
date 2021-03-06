# Prerequisite

## node.js 버전 8.x or 10.x로 맞추기

- lts/carbon (8.x)
- lts/dubnium (10.x)

## Install & Configuration

```bash
$ npm init -y
$ npm install --only=prod @hyperledger/caliper-cli@0.4.0
$ npx caliper bind --caliper-bind-sut fabric:1.4
```

### Network 설정 파일 generate

**networks/fabric/*** 경로에서 사용하려는 네트워크 설정 디렉토리로 접근한 뒤 **[generate.sh](http://generate.sh)** 파일을 실행함으로써 네트워크 설정 파일을 생성한다.

```bash
~/caliper-benchmarks/networks/fabric/config_solo_raft$ ./generate.sh
```

# Run with local npm

```
~/caliper-benchmarks$ npx caliper launch manager \
	--caliper-workspace . \
	--caliper-benchconfig benchmarks/samples/fabric/fabcar-hash/config.yaml \
	--caliper-networkconfig networks/fabric/v1/v1.4.1/2org1peercouchdb_raft/fabric-go-tls-solo.yaml
```

정상적으로 수행되면 설정 파일에 따라 네트워크가 구성되고 테스트를 진행한다.

이 경우 hyperledger fabric v1.4.1 버전, 2개의 Org, 각 1개 Peer, CouchDB를 사용하는 네트워크를 구성했다.

---

# Hyperledger Caliper Benchmarks
This repository contains sample benchmarks that may be used by Caliper, a blockchain performance benchmark framework. For more information on Caliper, please see the [Caliper main repository](https://github.com/hyperledger/caliper/)

Associated performance reports, based on running these benchmarks, are published to the [repository github pages](https://hyperledger.github.io/caliper-benchmarks/).

## Repository Branches
This repository has three branches:
1. **master**. Contains sample benchmarks
2. **reports**. Contains md files that are built and published to the `gh-pages` branch
3. **gh-pages**. Contains the build output from the `reports` branch 

## Master Branch Contents
The benchmarks contained within the master branch are split into three directories:
1. **benchmarks**. Comprises the test configuration and callback files. The test configuration files describe the benchmark test parameters and also reference the callback files that are executed by Caliper clients during the benchmark. The Benchmark folder contains the following subfolders:
    - **api** Tests directed towards the API of a single target blockchain.
	- **samples** Tests directed towards the native samples provided by target blockchain platforms.
	- **scenario** Generic scenarios that are valid for all (supported) target blockchain platforms
2. **networks**. Comprises sample blockchain networks that may be used as target systems under test (SUT) for benchmarking purposes.
3. **src**. Comprises the source smart contract files that are deployed to the SUT and interacted with via the test callbacks located within the benchmarks folder. Each smart contract is held within its own folder, under the blockchain technology that the smart contract corresponds to. 

## Running a Benchmark
To run any of the benchmarks present in this repository, it is required to have installed [Hyperledger Caliper]((https://github.com/hyperledger/caliper/)), which is the intended consumer of all the contained files.

Steps:
1. Install the Caliper CLI - for details please see the [Caliper main repository](https://github.com/hyperledger/caliper/)
2. Clone this repository
3. Run a Caliper CLI command that targets one of the contained benchmarks. 
For instance, to run the benchmark that targets the Fabric Marbles sample against a Fabric v1.4.1 network, you would:
  - Ensure that the crypto configuration files have been generated. Do this by navigating to the relevant `/networks/fabric/config_x` directory and running the command:
	```bash
	./generate.sh
	```
 - Run the benchmark using the Caliper CLI command: 
	```bash
	caliper launch master --caliper-benchconfig benchmarks/samples/fabric/marbles/config.yaml --caliper-networkconfig networks/fabric/fabric-v1.4.1/2org1peergoleveldb/fabric-go.yaml --caliper-workspace <path_to_caliper_benchmarks_root_directory>
	```
## Extending the Documented Reports
The documented reports are built automatically from the `reports` branch of this repository and subsequently hosted on the `gh-pages` branch; pull requests must be target the [`reports` branch](https://github.com/hyperledger/caliper-benchmarks/tree/reports) in order for any modifications to be built.
