

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cryptoList, setCryptoList] = useState([]);
  const [sourceCrypto, setSourceCrypto] = useState('');
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('usd');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCryptos() {
      try {
        const response = await fetch('/api/top100cryptos');
        const data = await response.json();
        setCryptoList(data);
        setSourceCrypto(data[0]?.id || '');
      } catch (error) {
        console.error(error);
      }
    }

    fetchCryptos();
  }, []);

  const convertCurrency = async () => {
    try {
      const response = await fetch(
        `/api/convert?sourceCrypto=${sourceCrypto}&amount=${amount}&targetCurrency=${targetCurrency}`
      );
      const data = await response.json();
      setConvertedAmount(data.convertedAmount);
      setError(null);
    } catch (error) {
      console.error(error);
      setConvertedAmount(null);
      setError('Error converting currency. Please try again.');
    }
  };

  return (
    <div className="App">
      <form>
        <label htmlFor="sourceCrypto">Source Cryptocurrency</label>
        <select id="sourceCrypto" onChange={(e) => setSourceCrypto(e.target.value)} value={sourceCrypto} required>
          {cryptoList.map((crypto) => (
            <option key={crypto.id} value={crypto.id}>
              {crypto.name}
            </option>
          ))}
        </select>

        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          placeholder="Enter amount"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          required
        />

        <label htmlFor="targetCurrency">Target Currency</label>
        <select id="targetCurrency" onChange={(e) => setTargetCurrency(e.target.value)} value={targetCurrency} required>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          
        </select>

        <button type="button" onClick={convertCurrency}>
          Convert
        </button>
      </form>

      {convertedAmount !== null && <div id="result">Converted Amount: {convertedAmount} {targetCurrency}</div>}
      {error && <div id="error">{error}</div>}
    </div>
  );
}

export default App;
