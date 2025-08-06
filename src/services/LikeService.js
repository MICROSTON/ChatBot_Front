// src/services/LikeService.js
let favorites = [];

export function getFavorites() {
  return [...favorites];
}

export function addFavorite(item) {
  if (!favorites.find((f) => f.benefit_id === item.benefit_id)) {
    favorites.push(item);
  }
}

export function removeFavorite(benefitId) {
  favorites = favorites.filter((f) => f.benefit_id !== benefitId);
}
