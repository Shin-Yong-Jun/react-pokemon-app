import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import PokeCard from "./components/PokeCard";

function Test2() {

  const [pokemons, setPokemons] = useState([]);

  //====
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  //====

  
  useEffect(() => {
    fetchPokemonsData(true);
  }, [])
  
  
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

  return (
  <article className="pt-6 bg-green-50">
    <header className="bg-black-100 flex flex-col gap-2 w-full z-50">
      {/* Input form */}
      input form
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
