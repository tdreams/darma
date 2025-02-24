// utils/locationValidation.ts
export const BAY_AREA_CITIES = {
  OAKLAND: {
    name: "Oakland",
    zipCodes: [
      "94601",
      "94602",
      "94603",
      "94604",
      "94605",
      "94606",
      "94607",
      "94608",
      "94609",
      "94610",
      "94611",
      "94612",
      "94613",
      "94614",
      "94615",
      "94617",
      "94618",
      "94619",
      "94621",
    ],
  },
  FREMONT: {
    name: "Fremont",
    zipCodes: ["94536", "94537", "94538", "94539", "94555"],
  },
  BERKELEY: {
    name: "Berkeley",
    zipCodes: [
      "94701",
      "94702",
      "94703",
      "94704",
      "94705",
      "94706",
      "94707",
      "94708",
      "94709",
      "94710",
      "94712",
      "94720",
    ],
  },
};

export const SUPPORTED_ZIP_CODES = Object.values(BAY_AREA_CITIES).flatMap(
  (city) => city.zipCodes
);

export const isZipCodeSupported = (zipCode: string) => {
  return SUPPORTED_ZIP_CODES.includes(zipCode);
};

export const getCityFromZipCode = (zipCode: string) => {
  return Object.values(BAY_AREA_CITIES).find((city) =>
    city.zipCodes.includes(zipCode)
  )?.name;
};

export const getServiceAreaMessage = () => {
  const cities = Object.values(BAY_AREA_CITIES)
    .map((city) => city.name)
    .join(", ");
  return `Currently, we only service the following areas: ${cities}`;
};
