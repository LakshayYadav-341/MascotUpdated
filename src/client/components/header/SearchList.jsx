import { SearchResult } from "./SearchResult";
import classes from "./styles.module.scss"

export const SearchList = ({ results, setSearchResults, setInput, setBlur }) => {
  return (
    <div className={classes.list}>
      {results.map((result, id) => {
        return <SearchResult result={result} key={id} setSearchResults={setSearchResults} setInput={setInput} setBlur = {setBlur}/>;
      })}
    </div>
  );
};