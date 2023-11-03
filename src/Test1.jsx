import React, { useEffect, useRef, useState } from 'react'

function Test1() {

  const [count, setCount] = useState(0);
  const countRef = useRef(0); 
  let countVariable = 0;

  // 렌더링수 기록하기 위한 useRef작업
  const [value, setValue] = useState('');
  const renderCountRef = useRef(0);

  // 종속성 배열이 없으면 어떤 state든 useEffect가 실행, 뒤에 빈배열[]도 없애야 한다.
  useEffect(() => {
    renderCountRef.current++;
  })
  


  function increaseRef() {
    countRef.current++;
    console.log("Ref + :", countRef.current);
  }

  function increaseState() {
    setCount(prev => prev + 1);
  }

  function increaseVariable() {
    countVariable++;
    console.log("Var + :", countVariable);
  }

  return (
    <div className='App'>
      <header>
        <p>Ref {countRef.current}</p>
        <p>State {count}</p>
        <p>Variable {countVariable}</p>
    <p>I rendered {renderCountRef.current} times</p>


    <input className='rounded-xl border-slate-900 border-2' 
            onChange={(e) => setValue(e.target.value)} value={value} />

        <div>
          <button className='bg-slate-400 rounded-sm px-2 py-2 mx-2 my-2' onClick={increaseRef}>Ref +</button>
          <button className='bg-slate-400 rounded-sm px-2 py-2 mx-2 my-2' onClick={increaseState}>State +</button>
          <button className='bg-slate-400 rounded-sm px-2 py-2 mx-2 my-2' onClick={increaseVariable}>Variable +</button>
        </div>
      </header>

    </div>
  )
}

export default Test1 