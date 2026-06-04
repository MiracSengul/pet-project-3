const parseCategory = (category) => {
  const isString = typeof category === "string";
  if (!isString) return;
  const isCategory = (category) =>
    ["Head", "Hand", "Leg", "Medicine", "Heart"].includes(category);

  if (isCategory(category)) return category;
};

const parseName = (name) => {
  const isString = typeof name === "string";
  if (!isString) return;

  // Boş olmadığını ve en az 1 karakter olduğunu kontrol et
  const trimmedName = name.trim();
  if (trimmedName.length > 0) return trimmedName;
};

export const parseFilterParams = (query) => {
  const { category, name } = query;

  const parsedCategory = parseCategory(category);
  const parsedName = parseName(name);

  return {
    category: parsedCategory,
    name: parsedName,
  };
};