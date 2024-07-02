import { createContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeList, setRecipeList] = useState([]);
  const [recipeDetailsData, setRecipeDetailsData] = useState(null);
  const [favoritesList, setFavoritesList] = useState([]);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParam}`
      );
      const data = await res.json();

      if (data?.data?.recipes) {
        setRecipeList(data.data.recipes);
        setLoading(false);
        setSearchParam("");
        navigate('/')
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setSearchParam("");
    }
  }

  function handleAddToFavorites(getCurrentItem) {
    let cpyFavorites = [...favoritesList];
    const index = cpyFavorites.findIndex(
      (item) => item.id === getCurrentItem.id
    );

    if (index === -1) {
      cpyFavorites.push(getCurrentItem);
    } else {
      cpyFavorites.splice(index);
    }
    setFavoritesList(cpyFavorites);
  }

  console.log(favoritesList);

  return (
    <GlobalContext.Provider
      value={{
        searchParam,
        loading,
        recipeList,
        setSearchParam,
        handleSubmit,
        recipeDetailsData,
        setRecipeDetailsData,
        handleAddToFavorites,
        favoritesList,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
