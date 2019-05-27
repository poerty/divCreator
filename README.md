### Div Creator

#### [proto.io](https://proto.io) 를 보고 웹 디벨로핑 툴을 작성하려 시도했던 흔적들을 react, redux를 이용하여 재구성 작업 ing

### [live page](http://div-creator.surge.sh)

### [usage video](https://vimeo.com/338688156)

* Source 에서 Drag n Drop으로 다양한 box들을 생성
* 생성된 box들은 dragging이 가능
* 근데 왠지 모르게 jQuery draggable/resizable +snap을 구현하는 프로젝트인 느낌
* 현재 기능 : drag/resize with snap, multi select, group/ungroup, copy/delete/paste, edit css property(by edit tab), page

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm test](#npm-test)
  - [npm run build](#npm-run-build)
  - [npm run eject](#npm-run-eject)
  
  
  
##### [과거 APM 환경에서 진행한 결과 live demo](http://poerty.co.kr/divCreator)

* APM에서 jquery 라이브러리를 이용, snap 에 약간의 변형을 통해 구현
* keeper 에서 Drag n Drop으로 다양한 box들을 생성(추가 쉬움)
* 생성된 box들은 resizing 과 dragging이 가능
* resizing과 dragging 시, snap과, 그를 위한 helping line 제공(가까운 경계에 달라붙기)
* shift를 누른 상태에서 마우스 클릭을 통해 중복 선택 후 resizing 과 dragging이 가능

