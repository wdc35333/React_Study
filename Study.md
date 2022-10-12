# 리액트를 다루는 기술 정리

## 컴포넌트란?

리액트에서 앱을 이루는 최소한의 단위
각 부분을 재사용 가능한 조각으로 UI를 나눈 것과 같다.

## props와 state의 차이:

props는 외부(부모 컴포넌트)에서 상속받는 데이터이며, 데이터 변경 불가능(읽기전용?)
state는 내부(컴포넌트)에서 생성하고 활동하며 데이터 변경가능

### constructor 없이 state의 초깃값 지정 가능

# setState 시용법
this.setState((prevState, props) => {
    return {
        // 업데이트하고 싶은 내용, props는 필요하지 않다면 생략 가능
    }
})

this.setState(prevState => {
    return {
        // 업데이트 하고 싶은 내용, props를 생략한 형태
    }
})

### 화살표 함수에서 값을 바로 반환하고 싶으면 { }를 생략해도 된다
ex) const sum = (a, b) => a + b;

## this.setState가 끝난 후 특정 작업 실행하기
this.setState(
    {
        // 업데이트 하고 싶은 내용
        number: number + 1
    },
    () => {
        // setState가 끝난 후 작업 하고 싶은 내용
        console.log('방금 setState가 호출되었습니다.');
        console.log(this.state);
    }
}

# useState 사용법
const [현재상태, 상태를 바꾸어 주는 함수(세터 함수)] = useState(디폴트값);

### useState는 한 컴포넌트에서 여러 번 사용가능하다.


# state를 사용할 때 주의사항
state의 값을 변경할 때에는 setState나 useState를 통해 전달받은 세터 함수를 사용해야 한다.
ex) 잘못된 예시
// 클래스형 컴포넌트에서...
this.state.number = this.state.number + 1;
this.state.array = this.array.push(2);
this.state.object.value = 5;

// 함수 컨포넌트에서...
const [object, setObject] = useState({a: 1, b: 1});
object.b = 2;

### 배열이나 객체를 업데이트해야 할 때는 배열이나 객체의 사본을 만들고 그 사본에 값을 업데이트한 후, 그 사본의 상태를 setState 혹은 세터 함수를 통해 업데이트한다.
ex) 사본을 만들어 업데이트하는 예시
// 객체 다루기
const object = { a: 1, b: 2, c: 3};
const nextObject = { ...object, b: 2}; // 사본을 만들어서 b 값만 덮어 쓰기

// 배열 다루기
const array = [
    { id: 1, value: true},
    { id: 2, value: true},
    { id: 3, vlaue: false}
];
let nextArray = array.concat({ id: 4}); // 새 항목 추가
nextArray.filter(item => item.id !== 2); // id가 2인 항목 제거
nextArray.map(item => (item.id === 1 ? { ...item, value: false } : item)); // id가 1인 항목의 value를 false로 설정


# 배열의 map() 함수

## 문법
arr.map(callback, [thisArg])
* callback: 새로운 배열의 요소를 생성하는 함수로 파라미터는 다음 세가지이다.
 - currentValue: 현재 처리하고 있는 요소
 - index: 현재 처리하고 있는 요소의 index 값
 - array: 현재 처리하고 있는 원본 배열
* thisArg(선택 항목): callback 함수 내부에서 사용할 this 레퍼런스

ex) const names = ['눈사람', '얼음', '눈', '바람'];
    const nameList = names.map(name => <li>{name}</li>);
    return <ul>{nameList}</ul>;

# 7장 리액트 컴포넌트의 라이프 사이클
리액트의 컴포넌트에는 라이프 사이클(수명주기)이 존재한다.
컴포넌트의 수명은 페이지에 렌더링되기 전인 준비 과정에서 시작하여 페이지에서 사라질 때 끝난다.
라이프 사이클 메서드는 클래스형 컴포넌트에서만 사용할 수 있다.
함수형 컴포넌트는 Hooks 기능을 사용하여 비슷한 작업을 처리할 수 있다.

## 7.1) 라이프사이클 메서드의 이해
라이프 사이클 메서드의 종류는 총 아홉 가지.
Will 접두사가 붙은 메서드는 어떤 작업을 작동하기 전에 실행
Did 접두사가 붙은 메서드는 어떤 작업을 작동한 후에 실행
이 메서드들은 우리가 컴포넌트 클래스에서 덮어 써 선언함으로써 사용가능

라이프사이클은 총 세 가지 마운트, 업데이트, 언마운트 카테고리로 나눔
![img](https://velog.velcdn.com/images/imjkim49/post/9a252d58-6e1d-43a8-99f8-0b652cfc44cc/image.png)

### 마운트
DOM이 생성되고 웹 브라우저 상에 나타나는 것을 마운트라고 함
이때 호출하는 메서드는 다음과 같음
#### 마운트할 때 호출하는 메서드:
컴포넌트 만들기 -> constructor -> getDerivedStateFromPros -> render -> componentDidMount

- constructor: 컴포넌트를 새로 만들 때 마다 호출되는 클래스 생성자 메서드

- getDerivedStateFromProps: props에 있는 값을 state에 넣을 때 사용하는 메서드

- render: 우리가 준비한 UI를 렌더링하는 메서드

- componentDidMount: 컴포넌트가 웹 브라우저상에 나타난 후 호출하는 메서드

### 업데이트
컴포넌트는 다음과 같은 총 네 가지 경우에 업데이트한다.
##### 1. props가 바뀔 때
##### 2. state가 바뀔 때
##### 3. 부모 컴포넌트가 리렌더링될 때
##### 4. this.forceUpdate로 강제로 렌더링을 트리거할 때
이렇게 컴포넌트를 업데이트할 때는 다음 메서드를 호출
#### 업데이트할 때 호출하는 메서드
업데이트를 발생시키는 요인(props 변경, state 변경, 부모 컴포넌트 리렌더링) ->
getDerivedStateFromProps -> shouldComponentUpdate
-true 반환시 render 호출, false 반환 시 여기서 작업 취소> render
-> getSnapshotBeforeUpdate -웹 브라우저상의 실제 DOM 변화>
componentDidUpdate

#### 컴포넌트의 업데이트 이유

##### 첫째, 부모 컴포넌트에서 넘겨주는 props가 바뀔 때

컴포넌트에 전달하는 props의 값이 바뀌면 컴포넌트 렌더링이 이루어짐

##### 둘째, 컴포넌트 자신이 들고 있는 state가 setState를 통해 업데이트될 때

##### 셋째, 부모 컴포넌트가 리렌더링될 때

자신에게 할당된 props가 바뀌지 않아도, 또는 자신이 들고 있는 state가 바뀌지 않아도,

부모 컴포넌트가 리렌더링되면 자식 컴포넌트 또한 리렌더링 됨

- getDerivedStateFromProps: 이 메서드는 마운트 과정에서도 호출되며, 업데이트가 시작하기 전에도 호출됨. props의 변화에 따라 state값에도 변화를 주고 싶을 때 사용
- shouldComponentUpdate: 컴포넌트가 리렌더링을 해야 할지 말아야 할지를 결정하는 메서드. 이 메서드에서는 true 혹은 false 값을 반환해야 하며, true를 반환하면 다음 라이프사이클 메서드를 계속 실행하고, false를 반환하면 작업을 중지. 즉, 리렌더링되지 않음. 만약 특정 함수에서 this.forceUpdate() 함수를 호출한다면 이 과정을 생략하고 바로 render 함수를 호출
- render: 컴포넌트를 리렌더링
- getSnapshotBeforeUpdate: 컴포넌트 변화를 DOM에 반영하기 바로 직전에 호출하는 메서드
- componentDidUpdate: 컴포넌트의 업데이트 작업이 끝난 후 호출하는 메서드

### 언마운트

마운트의 반대 과정, 즉 컴포는트를 DOM에서 제거하는 것을 언마운트라고 한다.

#### 언마운트할 때 호출하는 메서드

언마운트하기 -> componentWillUnmount

- componentWillUnmount: 컴포넌트가 웹 브라우저상에서 사라지기 전에 호출하는 메서드

### 

## 7.2) 라이프사이클 메서드 살펴보기

### 7.2.1) render() 함수

#### render() { ... }

- 이 메서드는 컴포넌트의 모양새를 정의

- **라이프사이클 메서드 중 유일한 필수 메서드 **

- 이 메서드 안에서 this.props와 this.state에 접근할 수 있으며, 리액트 요소를 반환

- 요소는 div같은 태그가 될 수 있고, 따로 선언한 컴포넌트가 될 수도 있다.

- 아무것도 보여 주고 싶지 않다면 null 값이나 false 값을 반환
- 주의사항
  - 이 메서드 안에서는 이벤트 설정이 아닌 곳에서 setState를 사용하면 안되며, 브라우저의 DOM에 접근해서도 안 됨
  - DOM 정보를 가져오거나 state에 변화를 줄 때는 componentDidMount에서 처리해야 함

### 7.2.2) constructor 메서드

#### constructor(props) { ... }

- 컴포넌트의 생성자 메서드로 컴포넌트를 만들 때 처음으로 실행됨
- 이 메서드에서는  초기 state를 정할 수 있음

### 7.2.3) getDerivedStateFromProps 메서드

- 리액트 v16.3 이후에 새로 만든 라이프사이클 메서드
- props로 받아 온 값을 state에 동기화시키는 용도로 사용하며, 컴포넌트가 마운트될 때와 업데이트될 때 호출
- ![img](Studymd_img/getDerivedStaticFromProps_example.png)

### 7.2.4) componentDidMount 메서드

#### componentDidMount() { ... }

- 컴포넌트를 만들고, 첫 렌더링을 다 마친 후 실행
- 이 안에서 다른 자바스크립트 라이브러리 또는 프레임워크의 함수를 호출하거나 이벤트 등록, setTimeout, setInterval, 네트 워크 요청 같은 비동기 작업을 처리

### 7.2.5) shouldComponentUpdate 메서드

#### shouldComponentUpdate(nextProps, nextState) { ... }

- props 또는 state를 변경했을 때, 리렌더링을 시작할지 여부를 지정하는 메서드
- 이 메서드에서는 반드시 true 값 또는 false 값을 반환해야 함
- 컴포넌트를 만들 때 이 메서드를 따로 생성하지 않으면 기본적으로 true 값을 반환
- 이 메서드가 false 값을 반환한다면 업데이트 과정은 여기서 중지
- 이 메서드 안에서 현재 props와 state는 this.props와 this.state로 접근하고, 새로 설정될 props 또는 state는 nextProps와 nextState로 접근할 수 있음
- 프로젝트 성능을 최적화할 때, 상황에 맞는 알고리즘을 작성하여 리렌더링을 방지할 때는 false 값을 반환하게 함

### 7.2.6) getSnapshotBeforeUpdate 메서드

- 리액트 v16.3 이후 만든 메서드

- 이 메서드는 render에서 만들어진 결과물이 브라우저에 실제로 반영되기 직전에 호출

- 이 메서드에서 반환하는 값은 componentDidUpdate에서 세 번째 파라미터인 snapshot 값으로 전달받을 수 있는데, 주로 업데이트하기 직전의 값을 참고할 일이 있을 때 활용 (예: 스크롤바 위치 유지)

- ![img](Studymd_img/getSnapshotBeforeUpdate_example.png)

  

### 7.2.7) componentDidUpdate 메서드

#### componentDidUpdate(prevProps, prevState, snapshot) { ... }

- 이것은 리렌더링을 완료한 후 실행
- 업데이트가 끝난 직후이므로, DOM 관련 처리를 해도 무방
- prevProps 또는 prevState를 사용하여 컴포넌트가 이전에 가졌던 데이터에 접근 가능
- 또 getSnapshotBeforeUpdate에서 반환한 값이 있다면 여기서 snapshot 값을 전달받을 수 있음

### 7.2.8) componentWillUnmount 메서드

#### componentWillUnmount() { ... }

- 이것은 컴포넌트를 DOM에서 제거할 때 실행
- ComponentDidMount에서 등록한 이벤트, 타이머, 직접 생성한 DOM이 있다면 여기서 제거 작업을 해야함

### 7.2.9) componentDidCatch 메서드

- componentDidCatch 메서드는 리액트 v16에서 새롭게 도입됨
- 컴포넌트 렌더링 도중에 에러가 발생했을 때 애플리켕션이 먹통이 되지 않고 오류 UI를 보여 줄 수 있게 해줌
- 사용방법: ![img](Studymd_img/componentDidCatch_example.png)
- 여기서는 error는 파라미터에 어떤 에러가 발생했는지 알려주며, info 파라미터는 어디에 있는 코드에서 오류가 발생했는지에 대한 정보를 줌
- 앞의 코드에서는 그저 console.log만 했지만, 나중에 실제로 사용할 때 오류가 발생하면 서버 API를 호출하여 따로 수집할 수도 있음
- 그러나 이 메서드를 사용할 때는 컴포넌트 자신에게 발생하는 에러를 잡아낼 수 없고 자신의 this.props.children으로 전달되는 컴포넌트에서 발생하는 에러만 잡아낼 수 있다.



## 7.3) 라이프사이클 메서드 사용하기(실습)

### 라이프사이클 메서드 사용

LifeCycleSample 컴포넌트 만들기 -> App에 렌더링하기 -> 버튼 누르고 콘솔 창 관찰하기



# 8장 Hooks

Hooks는 리액트 v16.8에 새로 도입된 기능으로 함수 컴포넌트에서도 상태 관리를 할 수 있는 useState, 렌더링 직후 작업을 설정하는 useEffect 등의 기능을 제공하여 기존의 함수 컴포넌트에서 할 수 없었던 다양한 작업을 할 수 있게 해 줌

이번 실습은 다음과 같은 흐름으로 진행

##### Hooks 배우기

리액트 내장 Hooks 사용하기 -> 커스텀 Hooks 만들기

## 8.1) useState

가장 기본적인 Hook이며, 함수 컨포넌트에서도 가변적인 상태를 지닐 수 있게 해 줌

하나의 useState 함수는 하나의 상태 값만 관리할 수 있음

컴포넌트에서 관리해야 할 상태가 여러 개라면 useState를 여러 번 사용하면 됨

### 8.1.1) useState 여러번 사용하기 실습

## 8.2) useEffect

useEffect는 리액트 컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 설정할 수 있는 Hook

클래스형 컴포넌트의 componentDidMount와 componentDidUpdate를 합친 형태로 보아도 무방

### 8.2.1) 마운트될 때만 실행하고 싶을 때

useEffect에서 설정한 함수를 컴포넌트가 화면에 맨 처음 랜더링될 때만 실행하고, 업데이트될 때는 실행하지 않으려면 함수의 두 번째 파라미터로 비어 있는 배열을 넣어주면 됨

### 8.2.2) 특정 값이 업데이트될 때만 실행하고 싶을 때

useEffect를 사용할 때, 특정 값이 변경될 때만 호출하고 싶은 경우 다음과 같이 작성

![img](/Users/wondongchan/Desktop/Study/React_Study/hooks-tutorial/Studymd_img/useEffect_8.2.2_example.png)

이 코드는 props 안에 들어 있는 value 값이 바뀔 때만 특정 작업을 수행

이러한 작업을 useEffect에서 해야 한다면, useEffect의 두 번째 파라미터로 전달되는 배열 안에 검사하고 싶은 값을 넣어주면 된다

![img](/Users/wondongchan/Desktop/Study/React_Study/hooks-tutorial/Studymd_img/useEffect_8.2.2_example2.png)

​														**Info.js - useEffect**

배열 안에는 useState를 통해 관리하고 있는 상태를 넣어 주어도 되고, props로 전달받은 값을 넣어주어도 됨

### 8.2.3) 뒷정리

useEffect는 기본적으로 렌더링되고 난 직후마다 실행되며, 두 번째 파라미터 배열에 무엇을 넣는지에 따라 실행 조건이 달라짐

컴포넌트가 언마운트되기 전이나 업데이트되기 직전에 어떠한 작업을 수행하고 싶다면 useEffect에서 뒷정리(cleanup) 함수를 반환

![img](/Users/wondongchan/Desktop/Study/React_Study/hooks-tutorial/Studymd_img/useEffect_8.2.2_example3.png)

뒷정리 함수 설정시 렌더링될 때마다 뒷정리 함수가 계속 나타나고, 호출될 때는 업데이트되기 직전의 값을 보여줌

오직 언마운트될 때만 뒷정리 함수를 호출하고 싶다면 useEffect 함수의 두 번째 파라미터에 비어있는 배열을 넣으면 됨

![img](/Users/wondongchan/Desktop/Study/React_Study/hooks-tutorial/Studymd_img/useEffect_8.2.2_example4.png)

``` js
import { useState } from 'react';
import Info from './Info';

const App = () => {
  const [visible, setVisible] = useState(false);
  return (
  <div>
    <button
    onClick={() => {
      setVisible(!visible);
    }}
    >
      {visible ? '숨기기' : '보이기'}
    </button>
    <hr />
    {visible && <Info />}
  </div>
  );
};

export default App;
```

​																					**App.js**



## 8.3) useReducer

useReducer는 useState보다 더 다양한 컴포넌트 상황에 따라 다양한 상태를 다른 값으로 업데이트해주고 싶을 때 사용

리듀서는 현재 상태, 그리고 업데이트를 위해 필요한 정보를 담은 액션값을 전달받아 새로운 상태를 반환하는 함수

리듀서 함수에서 새로운 상태를 만들 때는 반드시 불변성을 지켜 주어야 함

```javascript
function reducer(state, action) {
  return { ... }; // 불변성을 지키면서 업데이트한 새로운 상태를 반환
}
  
  // 액션 값은 주로 다음과 같은 형태로 이루어져 있음
  
{
	type: 'INCREMENT',
  // 다른 값들이 필요하다면 추가로 들어감
}
```

### 8.3.1) 카운터 구현하기

useReducer를 사용하여 기존의 Counter 컴포넌트를 다시 구현

```javascript
const { useReducer } = require("react");

function reducer(state, action) {
  // action.type에 따라 다른 작업 수행
  switch (action.type) {
    case "INCREMENT":
      return { value: state.value + 1 };
    case "DECREMENT":
      return { value: state.value - 1 };
    default:
      // 아무것도 해당되지 않을 때 기존 상태 반환
      return state;
  }
}

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { value: 0 });

  return (
    <div>
      <p>
        현재 카운터 값은 <b>{state.value}</b>입니다.
      </p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+1</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-1</button>
    </div>
  );
};

export default Counter;

```

useReducer의 첫 번째 파라미터에는 리듀서 함수를 넣고, 두 번째 파라미터에는 해당 리듀서의 기본값을 넣어준다

이 Hook을 사용하면 state 값과 dispatch 함수를 받아오는데, 여기서 state는 현재 가리키고 있는 상태고, dispatch는 액션을 발생시키는 함수

dispatch(action)과 같은 형태로 함수 안에 파라미터로 액션 값을 넣어주면 리듀서 함수가 호출되는 구조

useReducer를 사용했을 때의 가장 큰 장점은 컴포넌트 업데이트 로직을 컴포넌트 바깥으로 뺴낼 수 있다는 것

### 8.3.2) 인풋 상태 관리하기 (실습)

useReducer를 사용하여 Info 컴포넌트에서 인풋 상태를 관리해 보겠음

useReducer를 사용하면 기존에 클래스형 컴포넌트에서 input 태그에 name 값을 할당하고 e.target.name을 참조하여 setState를 해 준 것과 유사한 방식으로 작업을 처리할 수 있음

```js
import { useReducer } from "react";

function reducer(state, action) {
  return {
    ...state,
    [action.name]: action.value,
  };
}

const Info = () => {
  const [state, dispatch] = useReducer(reducer, {
    name: "",
    nickname: "",
  });
  const { name, nickname } = state;
  const onChange = (e) => {
    dispatch(e.target);
  };

  return (
    <div>
      <div>
        <input name="name" value={name} onChange={onChange} />
        <input name="nickname" value={nickname} onChange={onChange} />
      </div>
      <div>
        <div>
          <b>이름:</b> {name}
        </div>
        <div>
          <b>닉네임:</b> {nickname}
        </div>
      </div>
    </div>
  );
};

export default Info;
```

​																			**Info.js**

useReducer에서의 액션은 그 어떤 값도 사용 가능함

그래서 이번에는 이번트 객체가 지니고 있는 e.target 값 자체를 액션 값으로 사용했음

이런식으로 인풋을 관리하면 아무리 인풋의 개수가 많아져도 코드를 짧고 깔끔하게 유지할 수 있음

## 8.4) useMemo

useMemo를 사용하면 함수 컴포넌트 내부에서 발생하는 연산을 최적화할 수 있음

리스트에 숫자를 추가하면 추가된 숫자들의 평균을 보여주는 함수 컴포넌트를 작성해보자

``` js
import { useState } from "react";

const getAverage = numbers => {
    console.log('평균값 계산 중..');
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b);
    return sum / numbers.length;
};

const Average = () => {
    const [list, setList] = useState([]);
    const [number, setNumber] = useState('');

    const onChange = e => {
        setNumber(e.target.value);
    };
    const onInsert = e => {
        const nextList = list.concat(parseInt(number));
        setList(nextList);
        setNumber('');
    };

    return (
        <div>
            <input value={number} onChange={onChange} />
            <button onClick={onInsert}>등록</button>
            <ul>
                {list.map((value, index) => (
                    <li key={index}>{value}</li>
                ))}
            </ul>
            <div>
                <b>평균값:</b> {getAverage(list)}
            </div>
        </div>
    );
};

export default Average;
```

​																		**Average.js**

숫자를 등록할 때뿐만 아니라 인풋 내용이 수정될 때도 getAverage 함수가 호출되는 것을 확인할 수 있음

인풋 내용이 바뀔 때는 평균값을 다시 계산할 필요가 없으므로 이렇게 렌더링할 때마다 계산하는 것은 낭비임

useMemo Hook을 사용하면 이러한 작업을 최적화할 수 있음

렌더링 과정에서 특정 값이 바뀌었을 때만 연산을 실행하고, 원하는 값이 바뀌지 않았다면 이전에 연산했던 결과를 다시 사용하는 방식

```js
import { useMemo, useState } from "react";

const getAverage = numbers => {
    console.log('평균값 계산 중..');
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b);
    return sum / numbers.length;
};

const Average = () => {
    const [list, setList] = useState([]);
    const [number, setNumber] = useState('');

    const onChange = e => {
        setNumber(e.target.value);
    };
    const onInsert = e => {
        const nextList = list.concat(parseInt(number));
        setList(nextList);
        setNumber('');
    };
    
    const avg = useMemo(() => getAverage(list), [list]);

    return (
        <div>
            <input value={number} onChange={onChange} />
            <button onClick={onInsert}>등록</button>
            <ul>
                {list.map((value, index) => (
                    <li key={index}>{value}</li>
                ))}
            </ul>
            <div>
                <b>평균값:</b> {avg}
            </div>
        </div>
    );
};

export default Average;
```

​															**useMemo를 사용한 Average.js**



## 8.5) useCallback

useCallback은 useMemo와 비슷한 함수

주로 렌더링 성능을 최적화해야 하는 상황에서 사용하는데, 이 Hook을 사용하면 만들어놨던 함수를 재사용 가능

위에서 구현한 Average 컴포넌트에서 onChange와 onInsert 라는 함수를 선언했었음

이렇게 선언하면 컴포넌트가 리렌더링될 때마다 새로 만들어진 함수를 사용하게 됨

컴포넌트의 렌더링이 자주 발생하거나 렌더링해야 할 컴포넌트의 개수가 많아지면 이 부분을 최적화해주는 것이 좋음

```js
import { useCallback, useMemo, useState } from "react";

const getAverage = numbers => {
    console.log('평균값 계산 중..');
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b);
    return sum / numbers.length;
};

const Average = () => {
    const [list, setList] = useState([]);
    const [number, setNumber] = useState('');

    const onChange = useCallback(e => {
        setNumber(e.target.value);
    }, []);
    const onInsert = useCallback(() => {
        const nextList = list.concat(parseInt(number));
        setList(nextList);
        setNumber('');
    }, [number, list]); // number 혹은 list가 바뀌었을 때만 함수 생성
    
    const avg = useMemo(() => getAverage(list), [list]);

    return (
        <div>
            <input value={number} onChange={onChange} />
            <button onClick={onInsert}>등록</button>
            <ul>
                {list.map((value, index) => (
                    <li key={index}>{value}</li>
                ))}
            </ul>
            <div>
                <b>평균값:</b> {avg}
            </div>
        </div>
    );
};

export default Average;
```

​													**useCallback을 사용한 Average.js**

useCallback의 첫 번째 파라미터에는 생성하고 싶은 함수를 넣고, 두 번째 파라미터에는 배열을 넣으면 됨

이 배열에는 어떤 값이 바뀌었을 때 함수를 새로 생성해야 하는지 명시해야 함

onChange처럼 비어있는 배열을 넣게 되면 컴포넌트가 렌더링될 때 만들었던 함수를 계속해서 재사용하게 되며 onInsert처럼 배열 안에 number와 list를 넣게 되면 인풋 내용이 바뀌거나 새로운 항목이 추가될 때 새로 만들어진 함수를 사용하게 됨

함수 내부에서 상태 값에 의존해야 할 때는 그 값을 반드시 두 번째 파라미터 안에 포함시켜 주어야 함

예를 들어 onChange의 경우 기존의 값을 조회하지 않고 바로 설정만 하기 때문에 배열이 비어있어도 상관없지만, onInsert는 기존의 number와 list를 조회해서 nextList를 생성하기 때문에 배열 안에 number와 list를 꼭 넣어주어야 함

## 8.6) useRef

useRef Hook은 함수 컴포넌트에서 ref를 쉽게 사용할 수 있도록 해줌

Average 컴포넌트에서 등록 버튼을 눌렀을 때 포커스가 인풋 쪽으로 넘어가도록 코드를 작성해보겠음

```js
import { useCallback, useMemo, useRef, useState } from "react";

const getAverage = numbers => {
    console.log('평균값 계산 중..');
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b);
    return sum / numbers.length;
};

const Average = () => {
    const [list, setList] = useState([]);
    const [number, setNumber] = useState('');
    const inputEl = useRef(null);

    const onChange = useCallback(e => {
        setNumber(e.target.value);
    }, []);
    const onInsert = useCallback(() => {
        const nextList = list.concat(parseInt(number));
        setList(nextList);
        setNumber('');
        inputEl.current.focus();
    }, [number, list]); // number 혹은 list가 바뀌었을 때만 함수 생성
    
    const avg = useMemo(() => getAverage(list), [list]);

    return (
        <div>
            <input value={number} onChange={onChange} />
            <button onClick={onInsert}>등록</button>
            <ul>
                {list.map((value, index) => (
                    <li key={index}>{value}</li>
                ))}
            </ul>
            <div>
                <b>평균값:</b> {avg}
            </div>
        </div>
    );
};

export default Average;
```

useRef를 사용하여 ref를 설정하면 useReffㅡㄹ 통해 만든 객체 안의 current 값이 실제 엘리먼트를 가리킴

### 8.6.1) 로컬 변수 사용하기

추가로 컴포넌트 로컬 변수를 사용해야 할 때도 useRef를 활용할 수 있음

여기서 로컬 변수란 렌더링과 상관없이 바뀔 수 있는 값을 의미

클래스 형태로 작성된 컴포넌트의 경우에는 로컬 변수를 사용해야 할 때 다음과 같이 작성할 수 있음

**예시코드**

```js
import { Component} from 'react';

class MyComponet extends Component {
  id = 1
  setId = (n) => {
    this.id = n;
  }
  printId = () => {
    console.log(this.id);
  }
  render() {
    return (
    	<div>
      	MyComponent
      </div>
    );
  }
}

export default MyComponent;
```

이러한 코드를 함수 컴포넌트로 작성한다면 다음과 같이 할 수 있음

**useRef를 사용한 함수 컴포넌트**

```js
import { useRef } from "react";

const RefSample = () => {
  const id = useRef(1);
  const setId = (n) => {
    id.current = n;
  }
  const printId = () => {
    console.log(id.current);
  }
  return (
    <div>
    	refsample
    </div>
  );
};

export default RefSample;

```

이렇게 ref 안의 값이 바뀌어도 컴포넌트가 렌더링되지 않는다는 점에는 주의해야함

렌더링과 관련되지 않은 값을 관리할 때만 이런 방식으로 코딩

## 8.7) 커스텀 Hooks 만들기

여러 컴포넌트에서 비슷한 기능을 공유할 경우, 이를 자신만의 Hook으로 작성하여 로직을 재사용할 수 있음

기존에 Info 컴포넌트에서 여러 개의 인풋을 관리하기 위해 useReducer로 작성했던 로직을 useInputs라는 Hook으로 따로 분리해보자

```js
import { useReducer  } from "react";

function reducer(state, action) {
    return {
        ...state,
        [action.name]: action.value
    };
}

export default function useInputs(initialForm) {
    const [state, dispatch] = useReducer(reducer, initialForm);

    const onChange = e => {
        dispatch(e.target);
    };
    return [state, onChange];
}
```

**useInputs.js**

```js
import useInputs from "./useInputs";

const Info = () => {
  const [state, onChange] = useInputs({
    name: "",
    nickname: "",
  });
  const { name, nickname } = state;

  return (
    <div>
      <div>
        <input name="name" value={name} onChange={onChange} />
        <input name="nickname" value={nickname} onChange={onChange} />
      </div>
      <div>
        <div>
          <b>이름:</b> {name}
        </div>
        <div>
          <b>닉네임:</b> {nickname}
        </div>
      </div>
    </div>
  );
};

export default Info;

```
