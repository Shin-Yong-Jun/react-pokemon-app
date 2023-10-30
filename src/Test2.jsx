import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import PokeCard from "./components/PokeCard";
import { useDebounce } from "./hooks/useDebounce";

function Test2() {

  const [pokemons, setPokemons] = useState([]);
  //====
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  //====
  const [searchTerm, setSearchTerm] = useState("");
  //====
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  
  useEffect(() => {
    fetchPokemonsData(true);
  }, [])
  
  // debounce를 위한 useEffect
  useEffect(() => {
    handleSearchInput(debouncedSearchTerm)
  }, [debouncedSearchTerm])
  

  
  const fetchPokemonsData = async(isFirstFetch) => {
    try {
      const offsetValue = isFirstFetch ? 0 : offset + limit;
      const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offsetValue}`;
      const response = await axios.get(url);
      setPokemons([...pokemons, ...response.data.results]);
      setOffset(offsetValue);
    } catch (error) {
      console.error(error);
    }
  }

  //==== 검색을 위한 첫등장부터 작동할 로직의 useEffect가 생겼다보니 수정!
  // e-> searchTerm으로 변경 / e.target => UI에 직접 관여된 searchTerm으로 변경
  const handleSearchInput = async(searchTerm) => {
    // setSearchTerm(e.target.value);
    // debounce를 위해
    // input태그의 onChange 에서 직접 setSearchTerm 작동시키는걸로

    if(searchTerm.length > 0) {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
        const pokemonData = {
          url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}`,
          name: searchTerm
        }
        setPokemons([pokemonData])
      } catch (error) {
        setPokemons([]);
        console.error(error);
      }
    } else {
      //검색어 입력후 다 지웠을때 다시 첫20개 등장하도록 하기
      fetchPokemonsData(true);
    }
  }

  //====

  return (
  <article className="pt-6 bg-green-50">
    <header className="bg-black-100 flex flex-col gap-2 w-full z-50">
      <div className="relative z-50">
        <form className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto"
        >
          <input 
            type="text"
            value={searchTerm}
            // onChange={handleSearchInput}
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

      </div>
    </header>
    <section className="bg-blue-100 pt-6 flex flex-col justify-content items-center overflow-auto z-0">
      <div className="bg-gray-100 flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
        {pokemons.length > 0 ? (
          pokemons.map(({url, name}, index) => (
            <PokeCard key={url} url={url} name={name} />
          ))
        ) : ([])} 

      </div>
    </section>
        <div className="text-center">
            <button 
              onClick={()=> fetchPokemonsData(false)}
              className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white">
              더 보기
            </button>
        </div>
  </article>
  );
}

export default Test2;
