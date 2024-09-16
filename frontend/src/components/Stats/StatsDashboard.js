import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar';

const StatsDashboard = () => {
  const [players, setPlayers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchPlayersStats = async () => {
      try {

        const response = await fetch('http://localhost:5000/api/players', {
          method: 'GET', 
          credentials: 'include',  // Add this line to send cookies with the request
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch players: ${response.statusText}`);
        }

        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching players stats:', error);
      }
    };

    fetchPlayersStats();
  }, []);

  // Sorting function
  const handleSort = (key) => {
    let direction = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  // Function to get sorting symbol
  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▼' : '▲';
    }
    return ''; // No symbol for unselected columns
  };

  const sortedPlayers = React.useMemo(() => {
    let sortablePlayers = [...players];
    if (sortConfig.key) {
      sortablePlayers.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
  
        // Special handling for "ratio"
        if (sortConfig.key === 'ratio') {
          aValue = a.minutesPlayed / (a.goals + a.assists || 1); // Avoid division by 0
          bValue = b.minutesPlayed / (b.goals + b.assists || 1);
        }
  
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePlayers;
  }, [players, sortConfig]);
  

  // Function to assign colors based on position
  const getPositionColor = (position) => {
    switch (position) {
      case 'Goalkeeper':
        return 'bg-gradient-to-br from-slate-600 via-stone-500 to-slate-600';
      case 'Defender':
        return 'bg-gradient-to-br from-teal-600 via-emerald-500 to-teal-600';
      case 'Midfielder':
        return 'bg-gradient-to-br from-indigo-500 via-cyan-500 to-indigo-500';
      case 'Forward':
        return 'bg-gradient-to-br from-orange-600 via-amber-500 to-orange-600';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.png')" }}
    >
      <NavBar />
      <div className="container mx-auto p-4 flex-grow">
        <h1 className="text-6xl text-white text-center font-bold m-16">Team Stats</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full rounded-t-xl table-auto">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="border-collapse rounded-tl-xl border-gray-600 p-2">Name</th>
                <th 
                  className={`border-collapse hover:bg-gray-500 border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'gamesPlayed' ? 'bg-gray-400' : ''
                  }`}
                  onClick={() => handleSort('gamesPlayed')}
                >
                  Games Played {getSortSymbol('gamesPlayed')}
                </th>
                <th 
                  className={`border-collapse hover:bg-gray-500 border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'gamesStarted' ? 'bg-gray-400' : ''
                  }`}
                  onClick={() => handleSort('gamesStarted')}
                >
                  Games Started {getSortSymbol('gamesStarted')}
                </th>
                <th 
                  className={`border-collapse hover:bg-gray-500 border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'minutesPlayed' ? 'bg-gray-400' : ''
                  }`}
                  onClick={() => handleSort('minutesPlayed')}
                >
                  Minutes Played {getSortSymbol('minutesPlayed')}
                </th>
                <th 
                  className={`border-collapse hover:bg-gray-500 border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'goals' ? 'bg-gray-400' : ''
                  }`}
                  onClick={() => handleSort('goals')}
                >
                  Goals {getSortSymbol('goals')}
                </th>
                <th 
                  className={`border-collapse hover:bg-gray-500 border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'assists' ? 'bg-gray-400' : ''
                  }`}
                  onClick={() => handleSort('assists')}
                >
                  Assists {getSortSymbol('assists')}
                </th>
                <th 
                  className={`border-collapse hover:bg-gray-500 border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'yellowCards' ? 'bg-gray-400' : ''
                  }`}
                  onClick={() => handleSort('yellowCards')}
                >
                  Yellow Cards {getSortSymbol('yellowCards')}
                </th>
                <th 
                  className={`border-collapse hover:bg-gray-500 border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'redCards' ? 'bg-gray-400' : ''
                  }`}
                  onClick={() => handleSort('redCards')}
                >
                  Red Cards {getSortSymbol('redCards')}
                </th>
                <th 
                  className={`border-collapse hover:bg-gray-500 rounded-tr-xl border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'ratio' ? 'bg-gray-400' : ''
                  }`} 
                  onClick={() => handleSort('ratio')}
                >
                  Ratio {getSortSymbol('ratio')}
                </th>

              </tr>
            </thead>
            <tbody>
              {sortedPlayers.length > 0 ? (
                sortedPlayers.map((player, index) => (
                  <tr key={player.id} className="bg-white even:bg-gray-100 hover:bg-gray-400">
                    <td className={`px-4 py-2 text-white font-semibold text-center ${getPositionColor(player.position)} ${index === players.length - 1 ? 'rounded-bl-xl' : ''}`}>
                      {player.name}
                    </td>
                    <td className="border border-gray-300 p-2 font-semibold text-center">{player.gamesPlayed}</td>
                    <td className="border border-gray-300 p-2 font-semibold text-center">{player.gamesStarted}</td>
                    <td className="border border-gray-300 p-2 font-semibold text-center">{player.minutesPlayed}</td>
                    <td className="border border-gray-300 p-2 font-semibold text-center">{player.goals}</td>
                    <td className="border border-gray-300 p-2 font-semibold text-center">{player.assists}</td>
                    <td className="border border-gray-300 p-2 font-semibold text-center">{player.yellowCards}</td>
                    <td className="border border-gray-300 p-2 font-semibold text-center">{player.redCards}</td>
                    <td className={`px-4 py-2 font-semibold text-center ${index === players.length - 1 ? 'rounded-br-xl' : ''}`}>
                      {(player.minutesPlayed / (player.goals + player.assists)).toFixed(0)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="border border-gray-300 p-2 text-center">No player stats found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
