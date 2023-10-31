import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const DetailPage = () => {

  const params = useParams();
  const pokemonId = params.id;
  console.log(params.id);

  useEffect(() => {
    fetchPokemonData();
  
  }, [])
  

  async function fetchPokemonData() {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  try {
    // 이걸 resopnse로 받게 되면 response.data 로 받게 되는데
    // 애초부터 data만 받으려면 아래와 같이 {data}로 디스트럭쳐링하면 된다.
    // 그리고 이렇게 data로 받아올때 pokemonData라는 이름으로 받아오게끔 :pokemonData처리하기
    // const response = await axios.get(url);
    const {data: pokemonData} = await axios.get(url);
    console.log(pokemonData);

    // 이제 해당 데이터에서 원하는것만 추출하는 것과 이전, 다음 포켓몬 데이터 id 함수호출 하는걸 구현함
    if(pokemonData) {
      const {name, id, types, weight, height, stats, abilities} = pokemonData;
      const nextAndPreviousPokemon = await getnextAndPreviousPokemon(id);
      console.log(nextAndPreviousPokemon);
    }

  } catch (error) {
    console.error(error);
  }
}

  //여기서 이전 다음 포켓몬 데이터 준비하는 함수 구현


  return (
    <div>DetailPage</div>
  )
}

export default DetailPage