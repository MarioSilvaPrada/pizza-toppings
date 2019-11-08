import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [ toppings, setToppings ] = useState('');

  const [ combinations, setCombinations ] = useState('');
  const [ rankIngredients, setRankIngredients ] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const result = await axios.get('http://files.olo.com/pizzas.json');

    setToppings(result.data);

    let combinations = [];

    result.data.map((topping) => {
      if (topping.toppings.length > 1) {
        combinations.push(topping.toppings);
      }
    });

    let numCombination = {};

    combinations.map((el) => {
      if (numCombination[el]) {
        numCombination[el]++;
      } else {
        numCombination[el] = 1;
      }
    });

    let sortCombination = Object.keys(numCombination).sort((a, b) => {
      return numCombination[b] - numCombination[a];
    });

    setCombinations(sortCombination);

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

    // sort topping by order amount
    let sortTopping = Object.keys(ranking).sort((a, b) => {
      return ranking[b] - ranking[a];
    });
    setRankIngredients(sortTopping);
    console.log(sortTopping);
  };

  return (
    toppings &&
    rankIngredients &&
    combinations && (
      <div className='App'>
        <h1>Top order toppings:</h1>
        {rankIngredients.map((ing, i) => i > 0 && <p key={i}>{ing}</p>)}
        <h1>Top order combinations:</h1>
        {combinations.map((comb, i) => <p key={i}>{comb}</p>)}
      </div>
    )
  );
}

export default App;
