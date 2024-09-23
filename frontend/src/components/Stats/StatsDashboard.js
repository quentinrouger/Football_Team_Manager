import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar';

const StatsDashboard = () => {
  const [players, setPlayers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchPlayersWithStats = async () => {
      try {
        // Fetch all players first
        const playersResponse = await fetch('http://localhost:5000/api/players', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!playersResponse.ok) {
          throw new Error(`Failed to fetch players: ${playersResponse.statusText}`);
        }

        const playersData = await playersResponse.json();

        // Now fetch stats for each player
        const playersWithStats = await Promise.all(
          playersData.map(async (player) => {
            const statsResponse = await fetch(`http://localhost:5000/api/playerStats/${player.id}`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (statsResponse.status === 404) {
              // Return default stats if none are found
              return {
                ...player,
                total_games_played: 0,
                total_games_started: 0,
                total_minutes_played: 0,
                total_goals: 0,
                total_assists: 0,
                total_yellow_cards: 0,
                total_red_cards: 0,
              };
            }

            if (!statsResponse.ok) {
              throw new Error(`Failed to fetch stats for player ${player.id}: ${statsResponse.statusText}`);
            }

            const statsData = await statsResponse.json();
            return { ...player, ...statsData };
          })
        );

        setPlayers(playersWithStats);
      } catch (error) {
        console.error('Error fetching player stats:', error);
      }
    };

    fetchPlayersWithStats();
  }, []);

  // Sorting function
  const handleSort = (key) => {
    let direction = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▼' : '▲';
    }
    return '';
  };

  const sortedPlayers = React.useMemo(() => {
    let sortablePlayers = [...players];
    if (sortConfig.key) {
      sortablePlayers.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Special handling for "ratio"
        if (sortConfig.key === 'ratio') {
          aValue = (a.total_goals + a.total_assists) === 0 ? -Infinity : a.total_minutes_played / (a.total_goals + a.total_assists);
          bValue = (b.total_goals + b.total_assists) === 0 ? -Infinity : b.total_minutes_played / (b.total_goals + b.total_assists);
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
      style={{ backgroundImage: "url('/images/Homepage2-.png')" }}
    >
      <NavBar />
      <div className="container mt-28 mx-auto p-4 flex-grow">
        {/* <h1 className="text-7xl text-white text-center font-bold m-16">Team Stats</h1> */}
  
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-t-xl table-auto">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="border-collapse rounded-tl-xl border-gray-600 p-2">Name</th>
                <th
                  className={`border-collapse hover:bg-gray-500 border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'total_games_played' ? 'bg-gray-400' : ''
                  }`}
                  onClick={() => handleSort('total_games_played')}
                >
                  <span className="ml-2">🏟 </span>
                  Games Played {getSortSymbol('total_games_played')}
                </th>
                <th
                  className={`border-collapse hover:bg-gray-500 border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'total_games_started' ? 'bg-gray-400' : ''
                  }`}
                  onClick={() => handleSort('total_games_started')}
                >
                  <span className="ml-2">🚶 </span>
                  Games Started {getSortSymbol('total_games_started')}
                </th>
                <th
                  className={`border-collapse hover:bg-gray-500 border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'total_minutes_played' ? 'bg-gray-400' : ''
                  }`}
                  onClick={() => handleSort('total_minutes_played')}
                >
                  <span className="ml-2">⏱ </span>
                  Minutes Played {getSortSymbol('total_minutes_played')}
                </th>
                <th
                  className={`border-collapse hover:bg-gray-500 border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'total_goals' ? 'bg-gray-400' : ''
                  }`}
                  onClick={() => handleSort('total_goals')}
                >
                  <span className="ml-2">⚽️ </span>
                  Goals {getSortSymbol('total_goals')}
                </th>
                <th
                  className={`border-collapse hover:bg-gray-500 border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'total_assists' ? 'bg-gray-400' : ''
                  }`}
                  onClick={() => handleSort('total_assists')}
                >
                  <span className="ml-2">🅰️ </span>
                  Assists {getSortSymbol('total_assists')}
                </th>
                <th
                  className={`border-collapse hover:bg-gray-500 border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'total_yellow_cards' ? 'bg-gray-400' : ''
                  }`}
                  onClick={() => handleSort('total_yellow_cards')}
                >
                  <span className="ml-2">🟨 </span>
                  Yellow Cards {getSortSymbol('total_yellow_cards')}
                </th>
                <th
                  className={`border-collapse hover:bg-gray-500 border-gray-600 p-2 cursor-pointer ${
                    sortConfig.key === 'total_red_cards' ? 'bg-gray-400' : ''
                  }`}
                  onClick={() => handleSort('total_red_cards')}
                >
                  <span className="ml-2">🟥 </span>
                  Red Cards {getSortSymbol('total_red_cards')}
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
                    <td className={`px-4 py-2 text-white font-semibold text-center ${getPositionColor(player.position)} ${index === sortedPlayers.length - 1 ? 'rounded-bl-xl' : ''}`}>
                      {player.name}
                    </td>
                    <td className="border border-gray-300 p-2 font-semibold text-center">{player.total_games_played}</td>
                    <td className="border border-gray-300 p-2 font-semibold text-center">{player.total_games_started}</td>
                    <td className="border border-gray-300 p-2 font-semibold text-center">{player.total_minutes_played}</td>
                    <td className="border border-gray-300 p-2 font-semibold text-center">{player.total_goals}</td>
                    <td className="border border-gray-300 p-2 font-semibold text-center">{player.total_assists}</td>
                    <td className="border border-gray-300 p-2 font-semibold text-center">{player.total_yellow_cards}</td>
                    <td className="border border-gray-300 p-2 font-semibold text-center">{player.total_red_cards}</td>
                    <td className={`px-4 py-2 font-semibold text-center ${index === sortedPlayers.length - 1 ? 'rounded-br-xl' : ''}`}>
                    {
                      (Number(player.total_goals) + Number(player.total_assists)) === 0
                        ? 0
                        : (player.total_minutes_played / (Number(player.total_goals) + Number(player.total_assists))).toFixed(0)
                    }
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
