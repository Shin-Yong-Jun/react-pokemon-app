import React, { useState } from "react";

const AutoComplete = ({ allPokemons, setDisplayedPokemons }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // 이게 실제 찾아주는 역할! include!
  const filterNames = (Input) => {
    const value = Input.toLowerCase();
    return value ? allPokemons.filter((e) => e.name.includes(value)) : [];
  };

  // 검색버튼을 누를때 실제 입력값이 포함된 데이터를 찾아주는 기능구현
  function handleSubmit(e) {
    e.preventDefault();

    let text = searchTerm.trim();
    setDisplayedPokemons(filterNames(text));
    setSearchTerm("");
  }

  // 검색하는 것에 정확히 일치하는 포켓몬 이름이 있으면 autoComplete 영역 없애기
  const checkEqualName = (input) => {
    const filteredArray = filterNames(input);
    // 배열로 구성되어있고 0번째 값에 name이 들어가있어서 그걸 비교해야함.
    return filteredArray[0]?.name === input ? [] : filteredArray;
  };

  return (
    <div className="relative z-50">
      <form
        // 그 다음 애써 만든 함수기능을 onSubmit속성으로 연결
        onSubmit={handleSubmit}
        className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-xs w-[20.5rem] h-6 px-2 py-1 bg-[hsl(214,13%,47%)] rounded-lg text-gray-300 text-center"
        />

        <button
          type="submit"
          className="text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700"
        >
          검색
        </button>
      </form>
      {checkEqualName(searchTerm).length > 0 && (
        // 전체를 감싸는 부분
        <div
          className={`w-full flex bottom-0 h-0 flex-col absolute justify-center items-center translate-y-2`}
        >
          {/* 세모 화살표 부분 */}
          <div
            className={`w-0 h-0 bottom-0 border-x-transparent border-x-8 border-b-[8px] border-gray-700 -translate-y-1/2`}
          ></div>

          <ul
            className={`w-40 max-h-[134px] py-1 bg-gray-700 rounded-lg absolute top-0 overflow-auto scrollbar-none`}
          >
            {checkEqualName(searchTerm).map((e, i) => (
              <li key={`button-${i}`}>
                <button
                  // autoComplete으로 나열된 문자를 선택하면 해당 문자가 검색태그에 입력되게.
                  onClick={() => setSearchTerm(e.name)}
                  className={`text-base w-full hover:bg-gray-600 p-[2px] text-gray-100`}
                >
                  {e.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
