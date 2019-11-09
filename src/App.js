import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  // all Combinations
  const [ combinations, setCombinations ] = useState('');
  // all toppings
  const [ toppings, setToppings ] = useState('');

  // sorted Combinations
  const [ sortCombinations, setSortCombinations ] = useState('');
  // sorted Toppings
  const [ rankIngredients, setRankIngredients ] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const result = await axios.get('http://files.olo.com/pizzas.json');

    // Insert all combinations toppings in an array
    let combinations = [];

    result.data.map((topping) => {
      if (topping.toppings.length > 1) {
        combinations.push(topping.toppings);
      }
    });

    // count ordered combiantions
    let numCombination = {};
    
    combinations.map((el) => {
      if (numCombination[el]) {
        numCombination[el]++;
      } else {
        numCombination[el] = 1;
      }
    });

    setCombinations(numCombination);

    // Sort this combinations toppings object
    let sortCombination = Object.keys(numCombination).sort((a, b) => {
      return numCombination[b] - numCombination[a];
    });

    setSortCombinations(sortCombination);

    // count ordered toppings
    let ranking = {};
    result.data.map((topping) => {
      if (topping.toppings.length > 1) {
        topping.toppings.map((top) => {
          ranking[top] ? ranking[top]++ : (ranking[top] = 1);
        });
      } else {
        ranking[topping] ? ranking[topping]++ : (ranking[topping] = 1);
      }
    });

    setToppings(ranking);

    // sort topping by order amount
    let sortTopping = Object.keys(ranking).sort((a, b) => {
      return ranking[b] - ranking[a];
    });
    setRankIngredients(sortTopping);
  };

  return (
    rankIngredients &&
    sortCombinations && (
      <div className='App'>
        <h1>Top ordered toppings:</h1>
        {rankIngredients.map(
          (ing, i) =>
            i > 0 && (
              <p key={i}>
                {ing}: <b>{toppings[ing]} orders</b>
              </p>
            ),
        )}
        <h1>Top ordered combinations:</h1>
        {sortCombinations.map((comb, i) => (
          <p key={i}>
            {comb}: <b>{combinations[comb]} orders</b>
          </p>
        ))}
      </div>
    )
  );
}

export default App;
