import { useEffect, useState } from "react";
import Type from "./Type";
import {DamageRelations as DamageRelationsProps} from '../types/DamageRelationOfPokemonTypes'
import { Damage, DamageFromAndTo, SeperateDamages } from "../types/SeperateDamageRelations";

interface DamageModalProps {
  damages: DamageRelationsProps[];
}

interface Info {
  name: string;
  url: string;
}


// 백엔드 데이터 1차 가공!
// 데이터 받아오고 -> To와 From을 나눠주기 함수 -> 검색한 단어의 데이터를 [key, value] 방식으로 골라주는 함수
const DamageRelations = ({ damages }: DamageModalProps) => {
  // 지금까지 잘 정돈한 데이터를 저장할 변수 state
  const [damagePokemonForm, setDamagePokemonForm] = useState<SeperateDamages>();

  useEffect(() => {
    const arrayDamage = damages.map((damage) =>
      // 1차 가공
      seperateObjectBetweenToAndFrom(damage)
    );

    // 2차 가공(타입이 2개 이상일 경우, 합치기부터)
    if (arrayDamage.length === 2) {
      //합치는 부분
      const obj = joinDamageRelations(arrayDamage);
      setDamagePokemonForm(reduceDuplicateValues(postDamageValue(obj.from)));
    } else {
      console.log(JSON.stringify(postDamageValue(arrayDamage[0].from)))
      setDamagePokemonForm(postDamageValue(arrayDamage[0].from));
    }
  }, [damages]);

  const joinDamageRelations = (props: DamageFromAndTo[]):DamageFromAndTo => {
    return {
      to: joinObjects(props, "to"),
      from: joinObjects(props, "from"),
    };
  };

  const reduceDuplicateValues = (props: SeperateDamages) => {
    const duplicateValues = {
      double_damage: "4x",
      half_damage: "1/4x",
      no_damage: "0x",
    };

    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName as keyof typeof props;

      const verifiedValue = filterForUniqueValues(value, duplicateValues[key]);
      return (acc = { [keyName]: verifiedValue, ...acc });
    }, {});
  };

  // 먼저 중복되는거 안보이게 하는 함수부터! 4배하기 전에!
  const filterForUniqueValues = (valueForFiltering: Damage[], damageValue: string) => {

    const initialArray: Damage[] = [];

    return valueForFiltering.reduce((acc, currentValue) => {
      //아래가 디스트럭쳐링 쪼개는 코드!
      const { url, name } = currentValue;

      // 중복 안되는 특성만 넣어주기
      const filterACC = acc.filter((a) => a.name !== name);

      // 중복이 없었을 경우
      return filterACC.length === acc.length
        ? (acc = [currentValue, ...acc])
        : (acc = [{ damageValue: damageValue, name, url }, ...filterACC]);
    }, initialArray);
  };

  const joinObjects = (props: DamageFromAndTo[], string: string) => {
    const key = string as keyof typeof props[0];
    const firstArrayValue = props[0][key];
    const secondArrayValue = props[1][key];

    // 여기가 실제로 합쳐지는 곳
    const result = Object.entries(secondArrayValue)
      .reduce((acc, [keyName, value]: [string, Damage]) => {
        // secondArrayValue의 value를 firstArrayValue에 합친다.
        
        const key = keyName as keyof typeof firstArrayValue;

        const result = firstArrayValue[key]?.concat(value);

        return (acc = { [keyName]: result, ...acc });
      },
      {}
    );
    return result;
  };

  const postDamageValue = (props: SeperateDamages):SeperateDamages => {
    const result = Object.entries(props)
      .reduce((acc, [keyName, value]) => {

        const key = keyName as keyof typeof props

      const valuesOfKeyName = {
        double_damage: "2x",
        half_damage: "1/2x",
        no_damage: "0x",
      };

      return (acc = {
        [keyName]: value.map((i:Info[]) => ({

          damageValue: valuesOfKeyName[key],
          ...i,
        })),
        ...acc,
      });
    }, {});
    return result;
  };

  const seperateObjectBetweenToAndFrom = (damage: DamageRelationsProps): DamageFromAndTo => {
    const from = filterDamageRelations("_from", damage);
    const to = filterDamageRelations("_to", damage);
    
    return { from, to };
  };

  //to, from 없는건 걸러지는 함수.
  const filterDamageRelations = (valueFilter: string, damage: DamageRelationsProps) => {
    const result: SeperateDamages = Object.entries(damage)
      .filter(([keyName, _]) => {
        return keyName.includes(valueFilter);
      })
      .reduce((acc, [keyName, value]): SeperateDamages => {
        //_to, _from을 빼고자 함.
        const keyWithValueFilterRemove = keyName.replace(valueFilter, "");

        return (acc = { [keyWithValueFilterRemove]: value, ...acc });
      }, {});

    return result;
  };

  return (
    <div className="flex gap-2 flex-col">
      {damagePokemonForm ? (
        <>
          {Object.entries(damagePokemonForm)
            .map(([keyName, value]:[string, Damage[]]) => {
            const key = keyName as keyof typeof damagePokemonForm;
            const valuesOfKeyName = {
              double_damage: "Weak",
              half_damage: "Resistant",
              no_damage: "Immune",
            };

            return (
              <div key={key}>
                <h3 className="capitalize font-medium text-sm md:text-base text-slate-500 text-center">
                  {valuesOfKeyName[key]}
                </h3>
                <div className="flex flex-wrap gap-1 justify-center mt-1">
                  {value.length > 0 ? (
                    value.map(({ name, url, damageValue }) => {
                      return (
                        <Type type={name} key={url} damageValue={damageValue} />
                      );
                    })
                  ) : (
                    <Type type={"none"} key={"none"} />
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default DamageRelations;
