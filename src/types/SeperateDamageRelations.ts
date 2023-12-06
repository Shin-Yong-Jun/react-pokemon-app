export interface DamageFromAndTo {
  to: SeperateDamages;
  from: SeperateDamages;
}



export interface SeperateDamages {
  double_damage?: Damage[];
  half_damage?:   Damage[];
  no_damage?:     Damage[];
}

export interface Damage {
  damageValue: string;
  name:        string;
  url:         string;
}
