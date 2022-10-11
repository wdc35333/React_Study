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

# 리액트 컴포넌트의 라이프 사이클
리액트의 컴포넌트에는 라이프 사이클(수명주기)이 존재한다.
컴포넌트의 수명은 페이지에 렌더링되기 전인 준비 과정에서 시작하여 페이지에서 사라질 때 끝난다.
라이프 사이클 메서드는 클래스형 컴포넌트에서만 사용할 수 있다.
함수형 컴포넌트는 Hooks 기능을 사용하여 비슷한 작업을 처리할 수 있다.

## 라이프사이클 메서드의 이해
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

##### constructor
컴포넌트를 새로 만들 때 마다 호출되는 클래스 생성자 메서드
##### getDerivedStateFromProps
props에 있는 값을 state에 넣을 때 사용하는 메서드
##### render
우리가 준비한 UI를 렌더링하는 메서드
##### componentDidMount
컴포넌트가 웹 브라우저상에 나타난 후 호출하는 메서드

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
