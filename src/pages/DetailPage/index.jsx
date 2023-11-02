import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const DetailPage = () => {

  //
  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const pokemonId = params.id;
  const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;

  useEffect(() => {
    fetchPokemonData();
  
  }, [])
  

  async function fetchPokemonData() {
  const url = `${baseUrl}${pokemonId}`
  try {
    const {data: pokemonData} = await axios.get(url);

    if(pokemonData) {
      const {name, id, types, weight, height, stats, abilities} = pokemonData;
      const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);

      // Promise.all 따로 공부하기
      const DamageRelations = await Promise.all(
        types.map(async(i) => {

          const type = await axios.get(i.type.url);
          return type.data.damage_relations
        })
      )

      const formattedPokemonData = {
        id,
        name,
        weight: weight / 10,
        height: height / 10,
        previous: nextAndPreviousPokemon.previous,
        next: nextAndPreviousPokemon.next,
        abilities: formatPokemonAbilities(abilities),
        stats: formatPokemonStats(stats),
        DamageRelations
      }

      setPokemon(formattedPokemonData);
      setIsLoading(false);
    }


  } catch (error) {
    console.error(error);
  }
}


  // 포켓몬 기술나열 포맷함수 정의
  const formatPokemonAbilities = (abilities) => {
    return abilities.filter((_, index) => index <= 1)
                    .map((obj) => obj.ability.name.replaceAll('-', ' '))
  }

  // 포켓몬 스탯 표시하기
  const formatPokemonStats = ([
    statHP,
    statATK,
    statDEP,
    statSATK,
    statSDEF,
    statSPD
  ]) => [
    {name: 'Hit Point', baseStat: statHP.base_stat},
    {name: 'Attack', baseStat: statATK.base_stat},
    {name: 'Defense', baseStat: statDEP.base_stat},
    {name: 'Special Attack', baseStat: statSATK.base_stat},
    {name: 'Special Defense', baseStat: statSDEF.base_stat},
    {name: 'Speed', baseStat: statSPD.base_stat},
  ]
  

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


  if(isLoading) return <div>...loading</div>

  return (
    <div>DetailPage</div>
  )
}

export default DetailPage