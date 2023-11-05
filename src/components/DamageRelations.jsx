import React, { useEffect } from "react";

// 백엔드 데이터 1차 가공!
// 데이터 받아오고 -> To와 From을 나눠주기 함수 -> 검색한 단어의 데이터를 [key, value] 방식으로 골라주는 함수
const DamageRelations = ({ damages }) => {
  useEffect(() => {
    const arrayDamage = damages.map((damage) =>
      // 1차 가공
      seperateObjectBetweenToAndFrom(damage)
    );

    // 2차 가공(타입이 2개 이상일 경우, 합치기부터)
    if (arrayDamage.length === 2) {
      //합치는 부분
      const obj = joinDamageRelations(arrayDamage);
      console.log(obj);

    } else {
      postDamageValue(arrayDamage[0].from);
    }
  }, []);

  const joinDamageRelations = (props) => {
    return {
      to: joinObjects(props, "to"),
      from: joinObjects(props, 'from'),
    };
  };

  const joinObjects = (props, string) => {
    const key = string;
    const firstArrayValue = props[0][key];
    const secondArrayValue = props[1][key];


    // 여기가 실제로 합쳐지는 곳
    const result = Object.entries(secondArrayValue).reduce(
      (acc, [keyName, value]) => {
        // console.log(acc, [keyName, value]);

        // secondArrayValue의 value를 firstArrayValue에 합친다.
        const result = firstArrayValue[keyName].concat(value);

        return (acc = { [keyName]: result, ...acc });
      },
      {}
    );
    return result
  };

  const postDamageValue = (props) => {
    const result = Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName;

      const valuesOfKeyName = {
        double_damage: "2x",
        half_damage: "1/2x",
        no_damage: "0x",
      };

      return (acc = {
        [keyName]: value.map((i) => ({
          damageValue: valuesOfKeyName[key],
          ...i,
        })),
        ...acc,
      });
    }, {});

    console.log(result);
  };

  const seperateObjectBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations("_from", damage);
    const to = filterDamageRelations("_to", damage);

    return { from, to };
  };

  //to, from 없는건 걸러지는 함수.
  const filterDamageRelations = (valueFilter, damage) => {
    const result = Object.entries(damage)
      .filter(([keyName, value]) => {
        return keyName.includes(valueFilter);
      })
      .reduce((acc, [keyName, value]) => {
        //_to, _from을 빼고자 함.
        const keyWithValueFilterRemove = keyName.replace(valueFilter, "");

        return (acc = { [keyWithValueFilterRemove]: value, ...acc });
      }, {});

    return result;
  };

  return <div>DamageRelations</div>;
};

export default DamageRelations;
