# GraphQL + React
## 1. Installation
```bash
npx create-react-app
npm i @apollo/client
npm i graphql
npm i react-router-dom
```

```bash
npm ERR! Could not resolve dependency : 
peerOptional react@"^16.8.0 || ^17.0.0 from @apollo/client@3.5.10
```
만약 위와 같은 에러가 발생할 경우,
```bash
npm i react-router-dom --legacy-peer-deps
```
로 설치할 것