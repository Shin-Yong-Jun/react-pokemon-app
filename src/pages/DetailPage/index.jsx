import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const DetailPage = () => {

  const params = useParams();
  const pokemonId = params.id;
  const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;

  useEffect(() => {
    fetchPokemonData();
  
  }, [])
  

  async function fetchPokemonData() {
  const url = `${baseUrl}${pokemonId}`
  try {
    // 이걸 resopnse로 받게 되면 response.data 로 받게 되는데
    // 애초부터 data만 받으려면 아래와 같이 {data}로 디스트럭쳐링하면 된다.
    // 그리고 이렇게 data로 받아올때 pokemonData라는 이름으로 받아오게끔 :pokemonData처리하기
    // const response = await axios.get(url);
    const {data: pokemonData} = await axios.get(url);
    // console.log(pokemonData);

    // 이제 해당 데이터의 세부데이터들을 각각 변수에 담아서 추출하는 것과 이전, 다음 포켓몬 데이터 id 함수호출 하는걸 구현함
    if(pokemonData) {
      // 아래 각 항목별 데이터는 그냥 보여줄수 없고 가공해서 보여줘야 한다. 
      const {name, id, types, weight, height, stats, abilities} = pokemonData;
      console.log(name, id, types, weight, height, stats, abilities);
      const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);
      console.log(nextAndPreviousPokemon);
    }

  } catch (error) {
    console.error(error);
  }
}

  //여기서 이전 다음 포켓몬 데이터 준비하는 함수 구현
  async function getNextAndPreviousPokemon(id) {
    const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`;

    const {data: pokemonData} = await axios.get(urlPokemon);
    // console.log('*****',pokemonData)

    const nextResponse = pokemonData.next && (await axios.get(pokemonData.next));
    const previousResponse = pokemonData.previous && (await axios.get(pokemonData.previous));

    // console.log('previousResponse', previousResponse);

    return {
      next: nextResponse?.data?.results?.[0]?.name,
      previous: previousResponse?.data?.results?.[0]?.name
    }
  }


  return (
    <div>DetailPage</div>
  )
}

export default DetailPage