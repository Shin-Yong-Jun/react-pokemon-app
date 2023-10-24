import { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import axios from 'axios'
import PokeCard from "./components/PokeCard";

function App() {

  const [pokemons, setPokemons] = useState([]);
  //더보기 기능을 위한 offset(몇번째부터 시작?) / limit (몇개까지 노출)
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    fetchPokeData(true);
  },[]);
  
  const fetchPokeData = async(isFirstFetch) => {
    try {
      const offsetValue = isFirstFetch ? 0 : offset + limit; 
      const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offsetValue}`;

      const response = await axios.get(url)
      // console.log(response.data.results)
      setPokemons([...pokemons, ...response.data.results])
      setOffset(offsetValue);
    } catch(error) {
      console.error(error);
    }
  };

  return (
    <article className="pt-6">
      <header className="flex flex-col justify-content items-center overflow-auto z-0">
        {/* {Input Form 부분} */}
        input form
      </header>
      <section className="pt-6 flex flex-col justify-content items-center overflow-auto z-0">
        <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
          {pokemons.length > 0 ? (
            pokemons.map(({url, name}, index) =>(
                <PokeCard key={url} url={url} name={name}/>
            ))
          ) : (
            <h2 className="font-medium text-lg text-slate-900 mb-1">
              포켓몬이 없습니다.
            </h2>
          )}
        </div>
      </section>
            <div className="text-center">
              <button
                onClick={()=>fetchPokeData(false)}
                className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white">
                더 보기
              </button>
            </div>
    </article>

  );
}

export default App;
