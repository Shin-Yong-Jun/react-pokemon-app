import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loading } from "../../assets/Loading";
import { LessThan } from "../../assets/LessThan";
import { GreaterThan } from "../../assets/GreaterThan";
import { ArrowLeft } from "../../assets/ArrowLeft";
import { Balance } from "../../assets/Balance";
import { Vector } from "../../assets/Vector";
import Type from "../../components/Type";

const DetailPage = () => {
  //
  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const pokemonId = params.id;
  const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;

  useEffect(() => {
    fetchPokemonData();
  }, []);

  async function fetchPokemonData() {
    const url = `${baseUrl}${pokemonId}`;
    try {
      const { data: pokemonData } = await axios.get(url);

      if (pokemonData) {
        const { name, id, types, weight, height, stats, abilities } =
          pokemonData;
        const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);

        // Promise.all 따로 공부하기
        const DamageRelations = await Promise.all(
          types.map(async (i) => {
            const type = await axios.get(i.type.url);
            return type.data.damage_relations;
          })
        );

        const formattedPokemonData = {
          id,
          name,
          weight: weight / 10,
          height: height / 10,
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities: formatPokemonAbilities(abilities),
          stats: formatPokemonStats(stats),
          DamageRelations,
          types: types.map((type) => type.type.name),
        };

        setPokemon(formattedPokemonData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  // 포켓몬 기술나열 포맷함수 정의
  const formatPokemonAbilities = (abilities) => {
    return abilities
      .filter((_, index) => index <= 1)
      .map((obj) => obj.ability.name.replaceAll("-", " "));
  };

  // 포켓몬 스탯 표시하기
  const formatPokemonStats = ([
    statHP,
    statATK,
    statDEP,
    statSATK,
    statSDEF,
    statSPD,
  ]) => [
    { name: "Hit Point", baseStat: statHP.base_stat },
    { name: "Attack", baseStat: statATK.base_stat },
    { name: "Defense", baseStat: statDEP.base_stat },
    { name: "Special Attack", baseStat: statSATK.base_stat },
    { name: "Special Defense", baseStat: statSDEF.base_stat },
    { name: "Speed", baseStat: statSPD.base_stat },
  ];

  //여기서 이전 다음 포켓몬 데이터 준비하는 함수 구현
  async function getNextAndPreviousPokemon(id) {
    const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`;

    const { data: pokemonData } = await axios.get(urlPokemon);

    const nextResponse =
      pokemonData.next && (await axios.get(pokemonData.next));
    const previousResponse =
      pokemonData.previous && (await axios.get(pokemonData.previous));

    return {
      next: nextResponse?.data?.results?.[0]?.name,
      previous: previousResponse?.data?.results?.[0]?.name,
    };
  }

  if (isLoading) {
    return (
      <div
        className={`absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50`}
      >
        <Loading className="w-12 h-12 z-50 animate-spin text-slate-900" />
      </div>
    );
  }

  if (!isLoading && !pokemon) {
    return <div>...NOT FOUND</div>;
  }

  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  const bg = `bg-${pokemon?.types?.[0]}`;
  const text = `text-${pokemon?.types?.[0]}`;

  return (
    <article className="flex items-center gap-1 flex-col w-full">
      <div
        className={`${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
      >
        {/* 이전 다음 넘어가기 버튼 */}
        {pokemon.previous && (
          <Link
            className="absolute top-[40%] -translate-y-1/2 z-50 left-1"
            to={`/pokemon/${pokemon.previous}`}
          >
            <LessThan className="w-5 h-8 p-1" />
          </Link>
        )}

        {pokemon.next && (
          <Link
            className="absolute top-[40%] -translate-y-1/2 z-50 right-1"
            to={`/pokemon/${pokemon.next}`}
          >
            <GreaterThan className="w-5 h-8 p-1" />
          </Link>
        )}

        {/* 윗부분 UI - Header 부분 */}
        <section className="w-full flex flex-col z-20 items-center justify-end relative h-full">
          <div className="absolute z-30 top-6 flex items-center w-full justify-between px-2">
            <div className="flex items-center gap-1">
              <Link to="/">
                <ArrowLeft className="w-6 h-8 text-zinc-200" />
              </Link>
              <h1 className="text-zinc-200 font-bold text-xl capitalize">
                {pokemon.name}
              </h1>
            </div>
            <div className="text-zinc-200 font-bold text-md">
              #{pokemon.id.toString().padStart(3, "00")}
            </div>
          </div>

          {/* 윗부분 UI - 포켓몬이미지 부분 */}
          <div className="relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16">
            <img
              src={img}
              width="100%"
              height="auto"
              loading="lazy"
              alt={pokemon.name}
              className={`object-contain h-full`}
            />
          </div>
        </section>

        {/* 중간부분  */}
        <section className="w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4">
          <div className="flex items-center justify-center gap-4">
            {/* 포켓몬 타입 태그_컴포넌트 새로 만들어서 적용 */}
            {pokemon.types.map((type) => (
              <Type key={type} type={type}/>
            ))}
          </div>

          <h2 className={`text-base font-semibold ${text}`}>
            정보
          </h2>

          <div className="flex w-full items-center justify-between max-w-[400px] text-center">
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Weight</h4>
              {/* 정보 내용물 weight */}
              <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                <Balance />
                {pokemon.weight}kg
              </div>
            </div>

            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Height</h4>
              {/* 정보 내용물 height */}
              <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                <Vector />
                {pokemon.height}m
              </div>
            </div>

            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Moves</h4>
              {/* 정보 내용물 moves */}
              {pokemon.abilities.map((ability) => (
                <div
                  key={ability}
                  className="text-[0.5rem] text-zinc-100 capitalize"
                >
                  {ability}
                </div>
              ))}
            </div>
          </div>

          <h2 className={`text-base font-semibold ${text}`}>
            기본 능력치
          </h2>
          
          <div className="w-full">
            Stat
          </div>

          {/* 데미지 게이지 */}
          {pokemon.DamageRelations && (
            <div className="w-10/12">
              <h2 className={`text-base text-center font-semibold ${text}`}>
                데미지 관계
              </h2>
              데미지


            </div>

          )}



        </section>
      </div>
    </article>
  );
};

export default DetailPage;
