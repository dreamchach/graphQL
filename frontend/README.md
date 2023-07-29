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

```bash
One of your dependencies, babel-preset-react-app, is importing the
"@babel/plugin-proposal-private-property-in-object" package without
declaring it in its dependencies. This is currently working because
"@babel/plugin-proposal-private-property-in-object" is already in your
node_modules folder for unrelated reasons, but it may break at any time.

babel-preset-react-app is part of the create-react-app project, which
is not maintianed anymore. It is thus unlikely that this bug will
ever be fixed. Add "@babel/plugin-proposal-private-property-in-object" to
your devDependencies to work around this error. This will make this message
go away.
```

> 보통 해당 오류는 CRA 환경을 지원하지 않는 일부 라이브러리를 설치하게 될 경우 발생할 수 있다.

해결법
```bash
npm install --save-dev @babel/plugin-proposal-private-property-in-object
```

## 2. Router
>error
https://stackoverflow.com/questions/43620289/react-router-cannot-read-property-pathname-of-undefined
https://anerim.tistory.com/209
