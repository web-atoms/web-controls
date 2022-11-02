import { AtomViewModel } from "@web-atoms/core/dist/view-model/AtomViewModel";

export interface ICurrencyInfo {
  id: number;
  $deleted?: boolean;
  flag: string;
  currencyCode: string;
  currency: string;
  level: number;
  units: string;
  asOf: string;
  onedChng: number;
}

export default class GridTestViewModel extends AtomViewModel {

    public list: ICurrencyInfo[] = [
        {
          id: 1,
          flag: "EUR",
          currencyCode: "EUR",
          currency: "Euro",
          level: 0.9033,
          units: "EUR / USD",
          asOf: "08/19/2019",
          onedChng: 0.0026
        }
        ,
        {
          id: 2,
          flag: "JPY",
          currencyCode: "JPY",
          currency: "Japanese Yen",
          level: 124.3870,
          units: "JPY / USD",
          asOf: "08/19/2019",
          onedChng: 0.0001
        },
        {
          id: 3,
          flag: "GBP",
          currencyCode: "GBP",
          currency: "Pound Sterling",
          level: 0.6396,
          units: "GBP / USD",
          asOf: "08/19/2019",
          onedChng: 0.00
        },
        {
          id: 4,
          flag: "CHF",
          currencyCode: "CHF",
          currency: "Swiss Franc",
          level: 0.9775,
          units: "CHF / USD",
          asOf: "08/19/2019",
          onedChng: 0.0008
        },
        {
          id: 5,
          flag: "CAD",
          currencyCode: "CAD",
          currency: "Canadian Dollar",
          level: 1.3097,
          units: "CAD / USD",
          asOf: "08/19/2019",
          onedChng: -0.0005
        },
        {
          id: 6,
          flag: "AUD",
          currencyCode: "AUD",
          currency: "Australian Dollar",
          level: 1.3589,
          units: "AUD / USD",
          asOf: "08/19/2019",
          onedChng: 0.0020
        },
        {
          id: 7,
          flag: "NZD",
          currencyCode: "NZD",
          currency: "New Zealand Dollar",
          level: 1.5218,
          units: "NZD / USD",
          asOf: "00911400857619 ::: 00917961341200 ::: 00911408856199 ::: 00911408869029 ::: 00911400082620 ::: 00911408869015 ::: 00911400930231 ::: 00911414231700 ::: 00917554041300 ::: 00911400854126 ::: 00911409281178 ::: 00911400087531 ::: 00911402100644 ::: 00911133529000 ::: 00911409305231 ::: 00911400860302 ::: 00911130999199 ::: 00919737450880 ::: 00911409490041 ::: 00918105204433 ::: 00912271636800 ::: 00919007689949 ::: 00911133500200 ::: 00912271638000 ::: 00911400945820 ::: 00911400854887 ::: 00911400854884 ::: 00919840112830 ::: 00911400854124 ::: 00911409305120 ::: 00912233203000 ::: 00911244367605 ::: 00911400930160 ::: 00911166577140 ::: 00911402001557 ::: 00911402330187 ::: 00911400857623 ::: 00911400500128 ::: 00911400410042 ::: 00911400854883 ::: 00911408869011 ::: 00911401900407 ::: 00911400860305 ::: 00911400930180 ::: 00912239976700 ::: 00911400082682 ::: 00911400930164 ::: 00911401400389 ::: 00911206119300 ::: 00911400930225 ::: 00911400999978 ::: 00911409490512 ::: 00912513080500 ::: 00911400410030 ::: 00911400945135 ::: 00911400930232 ::: 00911206667500 ::: 00911400660171 ::: 00919737450991 ::: 00914033501600 ::: 00911400930178 ::: 00911400930169 ::: 00911400081463 ::: 00911408859159 ::: 00911400945378 ::: 00911400051246 ::: 00911400930174 ::: 00911400860299 ::: 00911408869026 ::: 00911401920570 ::: 00911400857618 ::: 00912261726200 ::: 00911402001556 ::: 00911244367606 ::: 00212692280166 ::: 00911400930217 ::: 00912261167500 ::: 00911400860300 ::: 00911400945816 ::: 00911401308367 ::: 00911400945826 ::: 00911400830119 ::: 00911400490077 ::: 00911400086193 ::: 00911400930181 ::: 00911408869016 ::: 00911400854134 ::: 00911408869017 ::: 00911247108282 ::: 00912653000300 ::: 00911400070001 ::: 00911401308358 ::: 00911400084725 ::: 00911400039534 ::: 0091650001 ::: 00911408941701 ::: 00911401309273 ::: 00911401439056 ::: 00911400039530 ::: 00911244339750 ::: 00911400857622 ::: 00911409922023 ::: 00911409281204 ::: 00911400854886 ::: 00911400930228 ::: 00911400930224 ::: 00911409490483 ::: 00911408943000 ::: 00242800105045 ::: 00911409765039 ::: 00911207163629 ::: 00911400930230 ::: 00911400480052 ::: 00911400930233 ::: 00911400854128 ::: 00911400930234 ::: 00911400945809 ::: 00918140505033 ::: 00911402330184 ::: 00911408869039 ::: 00914224010999 ::: 00911408926000 ::: 00911400930158 ::: 00911400930157 ::: 00912653036100 ::: 00911400440035 ::: 00911400857624 ::: 00911203878300 ::: 00911244826600 ::: 00911400860306 ::: 00911401308365 ::: 00911400854130 ::: 00911400945841 ::: 00911400400148 ::: 00911400930179 ::: 00914449631800 ::: 00911408930020 ::: 00911409450024 ::: 00919737450083 ::: 00911409490370 ::: 00911400860303 ::: 00911400930177 ::: 00911400330028 ::: 00914471889900 ::: 00911400930226 ::: 00911408946800 ::: 00911133603424 ::: 00912071774820 ::: 00911400360281 ::: 00919810203316 ::: 00919737450796 ::: 00911409490157 ::: 00911400330111 ::: 00911402081721 ::: 00911206198555 ::: 00911400945825 ::: 00911400945134 ::: 00911401271503 ::: 00911400930229 ::: 00911409803932 ::: 00914449631600 ::: 00911400930167 ::: 00911408869042 ::: 00911400051281 ::: 00911400540023 ::: 00911400860304 ::: 00911400854127 ::: 00911400930172 ::: 00911402060209 ::: 00911400945845 ::: 00911400860309 ::: 00911408869046 ::: 00911400857617 ::: 00911400540414 ::: 00912245010000 ::: 00911726669400 ::: 00911402001553 ::: 00911727167123 ::: 00911400540413 ::: 00919737450869 ::: 00911409490038 ::: 00919737450999 ::: 00911409490097 ::: 00911408906300 ::: 00911408909902 ::: 00911400051278 ::: 00911409875560 ::: 00911171638300 ::: 00911400945136 ::: 00919737450775 ::: 00911244918650 ::: 00911400510028 ::: 00911400945137 ::: 00911203912400 ::: 00911400945817 ::: 00911400051280 ::: 00917961342100 ::: 00911402001554 ::: 00912261718200 ::: 00911400083952 ::: 00911400910076 ::: 00911408869037 ::: 00911400857621 ::: 00911401400377 ::: 00911206187200 ::: 00911409303966 ::: 00911133529200 ::: 00911400854137 ::: 00911400930163 ::: 00912653934800 ::: 00912271637010 ::: 00911246727700 ::: 00911408869003 ::: 00911206106000 ::: 00911244918550 ::: 00911246772100 ::: 00912233604600 ::: 00911207163453 ::: 00911171638600 ::: 00911400910037 ::: 00919737450756 ::: 00911244913550 ::: 00911409450019 ::: 00911400082741 ::: 00911402001555 ::: 00231332580644 ::: 00911400930168 ::: 00911409830025 ::: 00911204803300 ::: 00911400930165 ::: 00911400083201 ::: 00912653930100 ::: 00911400930176 ::: 00911414235700 ::: 00911400490078 ::: 00911400360269 ::: 00911400039532 ::: 00911400857620 ::: 00917554041200 ::: 00911408869047 ::: 00911244913500 ::: 00911401400378 ::: 00911246725460 ::: 00911401040337 ::: 00911400360270 ::: 00911400039533 ::: 00911400089273 ::: 00919737450084 ::: 00911408869032 ::: 00911400860307 ::: 00911400860301 ::: 00911400370051 ::: 00911409867555 ::: 00911408869023 ::: 00912233919300 ::: 00911244810600 ::: 00911244809200 ::: 00911400930171 ::: 00911400854885 ::: 00911402330186 ::: 00911400930170 ::: 00919737450229 ::: 00911247173900 ::: 00918951055098 ::: 00911130192600 ::: 00911400370058 ::: 00911409490100 ::: 00911408869033 ::: 00911400854879 ::: 00911244367607 ::: 00919737450874 ::: 00911400860308 ::: 00911400945829 ::: 00911401429245 ::: 00914449565500 ::: 00911244367608 ::: 00911400410031 ::: 00911408869000 ::: 00911400930235 ::: 00911400945133 ::: 00911244810700 ::: 00911400039531 ::: 00911400854881 ::: 00911207166000 ::: 00911244576230 ::: 00911409333743 ::: 00911400910048 ::: 00911166219031 ::: 00911409964002 ::: 00911409490122 ::: 00911400930175 ::: 00919737450859",
          onedChng: -0.0036
        },
        {
          id: 8,
          flag: "SEK",
          currencyCode: "SEK",
          currency: "Swedish Krona",
          level: 8.5280,
          units: "SEK / USD",
          asOf: "08/19/2019",
          onedChng: 0.0016
        },
        {
          id: 9,
          flag: "NOK",
          currencyCode: "NOK",
          currency: "Norwegian Krone",
          level: 8.2433,
          units: "NOK / USD",
          asOf: "08/19/2019",
          onedChng: 0.0008
        },
        {
          id: 10,
          flag: "BRL",
          currencyCode: "BRL",
          currency: "Brazilian Real",
          level: 3.4806,
          units: "BRL / USD",
          asOf: "08/19/2019",
          onedChng: -0.0009
        },
        {
          id: 11,
          flag: "CNY",
          currencyCode: "CNY",
          currency: "Chinese Yuan",
          level: 6.3961,
          units: "CNY / USD",
          asOf: "08/19/2019",
          onedChng: 0.0004
        },
        {
          id: 12,
          flag: "RUB",
          currencyCode: "RUB",
          currency: "Russian Rouble",
          level: 65.5980,
          units: "RUB / USD",
          asOf: "08/19/2019",
          onedChng: 0.0059
        },
        {
          id: 13,
          flag: "INR",
          currencyCode: "INR",
          currency: "Indian Rupee",
          level: 65.3724,
          units: "INR / USD",
          asOf: "08/19/2019",
          onedChng: 0.0026
        },
        {
          id: 14,
          flag: "TRY",
          currencyCode: "TRY",
          currency: "New Turkish Lira",
          level: 2.8689,
          units: "TRY / USD",
          asOf: "08/19/2019",
          onedChng: 0.0092
        },
        {
          id: 15,
          flag: "THB",
          currencyCode: "THB",
          currency: "Thai Baht",
          level: 35.5029,
          units: "THB / USD",
          asOf: "08/19/2019",
          onedChng: 0.0044
        },
        {
          id: 16,
          flag: "IDR",
          currencyCode: "IDR",
          currency: "Indonesian Rupiah",
          level: 13.83,
          units: "IDR / USD",
          asOf: "08/19/2019",
          onedChng: -0.0009
        },
        {
          id: 17,
          flag: "MYR",
          currencyCode: "MYR",
          currency: "Malaysian Ringgit",
          level: 4.0949,
          units: "MYR / USD",
          asOf: "08/19/2019",
          onedChng: 0.0010
        },
        {
          id: 18,
          flag: "MXN",
          currencyCode: "MXN",
          currency: "Mexican New Peso",
          level: 16.4309,
          units: "MXN / USD",
          asOf: "08/19/2019",
          onedChng: 0.0017
        },
        {
          id: 19,
          flag: "ARS",
          currencyCode: "ARS",
          currency: "Argentinian Peso",
          level: 9.2534,
          units: "ARS / USD",
          asOf: "08/19/2019",
          onedChng: 0.0011
        },
        {
          id: 20,
          flag: "DKK",
          currencyCode: "DKK",
          currency: "Danish Krone",
          level: 6.7417,
          units: "DKK / USD",
          asOf: "08/19/2019",
          onedChng: 0.0025
        },
        {
          id: 21,
          flag: "ILS",
          currencyCode: "ILS",
          currency: "Israeli New Sheqel",
          level: 3.8262,
          units: "ILS / USD",
          asOf: "08/19/2019",
          onedChng: 0.0084
        },
        {
          id: 22,
          flag: "PHP",
          currencyCode: "PHP",
          currency: "Philippine Peso",
          level: 46.3108,
          units: "PHP / USD",
          asOf: "08/19/2019",
          onedChng: 0.0012
        }
      ];

}
