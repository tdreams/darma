import { ItemSize } from "./returnFormContent";

export const PRICES = {
  small: 500,
  medium: 800,
  large: 1200,
  express: 300,
};

export const calculateTotal = (
  itemSize: ItemSize,
  expressPickup: boolean
): number => {
  return PRICES[itemSize] + (expressPickup ? PRICES.express : 0);
};
