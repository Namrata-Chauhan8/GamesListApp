import React, { useState } from "react";
import { Form, Button, Table } from "react-bootstrap";
import axios from "axios";
import Link from "next/link";

const Home = ({ games }) => {
  const [searchItem, setSearchItem] = useState("");
  const [sortedByPlatform, setSortedByPlatform] = useState(false);
  const [filteredGames, setFilteredGames] = useState(games);

  const handleSearch = (event) => {
    const search = event.target.value.trim().toLowerCase();
    setSearchItem(search);
    const filtered = games.filter(
      (game) => game.title && game.title.toLowerCase().includes(search)
    );
    setFilteredGames(filtered);
  };

  const handleSort = () => {
    const sortedGames = [...filteredGames].sort((a, b) => {
      if (!a.platform || !b.platform) return 0;
      if (sortedByPlatform) {
        return b.platform.localeCompare(a.platform);
      } else {
        return a.platform.localeCompare(b.platform);
      }
    });
    setFilteredGames(sortedGames);
    setSortedByPlatform(!sortedByPlatform);
  };

  const resetGames = () => {
    setFilteredGames(games);
    setSearchItem("");
    setSortedByPlatform(false);
  };

  return (
    <div className="container">
      <div className="text-center mb-2">
        <img
          src="https://seeklogo.com/images/U/unity-logo-555C5D1D7E-seeklogo.com.png"
          alt=" "
          style={{
            width: "7rem",
            background: "white",
            margin: "1%",
            borderRadius: "10px",
          }}
        />
      </div>

      <Form.Control
        type="text"
        placeholder="Search by title"
        value={searchItem}
        onChange={handleSearch}
        className="text-black mb-4"
      />
      <Button onClick={handleSort} variant="success" className="m-3">
        Sort by Platform {sortedByPlatform ? "(Z-A)" : "(A-Z)"}
      </Button>
      <Button onClick={resetGames} variant="warning">
        Reset
      </Button>
      <Table striped bordered hover variant="dark" className="mt-4">
        <thead className="text-center">
          <tr>
            <th>
              <u>Image</u>
            </th>
            <th>
              <u>Title</u>
            </th>
            <th>
              <u>Platform</u>
            </th>
            <th>
              <u>Description</u>
            </th>
            <th>
              <u>Genre</u>
            </th>
            <th>
              <u>Game Link</u>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredGames.map(
            (game, index) =>
              game.title && (
                <tr key={index}>
                  <td>
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      width="100"
                      height="100"
                    />
                  </td>
                  <td>{game.title}</td>
                  <td>{game.platform}</td>
                  <td>
                    <center>{game.short_description}</center>
                  </td>
                  <td>
                    <center>{game.genre}</center>
                  </td>
                  <td>
                    <center>
                      <Link href={game.game_url}>{game.game_url}</Link>
                    </center>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </Table>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const response = await axios.get("https://www.freetogame.com/api/games"); //previous api --> https://s3-ap-southeast-1.amazonaws.com/he-public-data/gamesarena274f2bf.json
    const games = response.data;
    return {
      props: { games },
    };
  } catch (error) {
    console.error("Error fetching games:", error);
    return {
      props: { games: [] },
    };
  }
}

export default Home;
