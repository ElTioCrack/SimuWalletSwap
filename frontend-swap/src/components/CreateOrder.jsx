import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { createOrder, getAssets, getAssetPrice } from '../services/api';

const CreateOrder = () => {
  const [assetSymbol, setAssetSymbol] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await getAssets();
      const assetOptions = response.data.map(asset => ({
        value: asset.symbol,
        label: asset.name
      }));
      setAssets(assetOptions);
    } catch (error) {
      console.error('Error fetching assets', error);
    }
  };

  const handleAssetChange = async (selectedOption) => {
    setSelectedAsset(selectedOption);
    setAssetSymbol(selectedOption.value);
    try {
      const response = await getAssetPrice(selectedOption.value);
      setPrice(response.data.price); // Asegúrate de acceder a la propiedad 'price'
    } catch (error) {
      console.error('Error fetching asset price', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const order = { asset_symbol: assetSymbol, amount: parseFloat(amount) };
      const response = await createOrder(order);
      setMessage('Order created successfully!');
    } catch (error) {
      console.error('Error creating order', error);
      setMessage('Failed to create order');
    }
  };

  return (
    <div>
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Asset Symbol:</label>
          <Select
            options={assets}
            onChange={handleAssetChange}
            value={selectedAsset}
          />
        </div>
        {price !== null && (
          <div>
            <label>Price: </label>
            <span>{price}</span> {/* Asegúrate de que solo renderizas un número o cadena */}
          </div>
        )}
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button type="submit">Create Order</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateOrder;
