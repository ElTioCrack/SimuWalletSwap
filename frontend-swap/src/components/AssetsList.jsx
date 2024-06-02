import React, { useEffect, useState } from 'react';
import { getAssets } from '../services/api';
import { Link } from 'react-router-dom';

const AssetsList = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await getAssets();
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets', error);
    }
  };

  return (
    <div>
      <h2>Assets</h2>
      <ul>
        {assets.map(asset => (
          <li key={asset.id}>{asset.name} ({asset.symbol})</li>
        ))}
      </ul>
      <Link to="/create-order">Create Order</Link>
    </div>
  );
};

export default AssetsList;
