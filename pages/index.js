import React, { useState } from "react";
import { Form, Button, Table } from "react-bootstrap";
import axios from "axios";

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
        <h2 className="border p-2 d-inline-block mt-4">
          Unity Games
        </h2>
      </div>

      <Form.Control
        type="text"
        placeholder="Search by title"
        value={searchItem}
        onChange={handleSearch}
        className="text-black mb-4"
      />
      <Button
        onClick={handleSort}
        variant="success"
        className="m-3"
      >
        Sort by Platform {sortedByPlatform ? "(Z-A)" : "(A-Z)"}
      </Button>
      <Button
        onClick={resetGames}
        variant="warning"
      >
        Reset
      </Button>
      <Table striped bordered hover variant="dark" className="mt-4">
        <thead className="text-center">
          <tr>
            <th>
              <u>Title</u>
            </th>
            <th>
              <u>Platform</u>
            </th>
            <th>
              <u>Score</u>
            </th>
            <th>
              <u>Genre</u>
            </th>
            <th>
              <u>Editor's Choice</u>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredGames.map(
            (game, index) =>
              game.title && (
                <tr key={index}>
                  <td>{game.title}</td>
                  <td>{game.platform}</td>
                  <td>
                    <center>{game.score}</center>
                  </td>
                  <td>
                    <center>{game.genre}</center>
                  </td>
                  <td>
                    <center>{game.editors_choice === "Y" ? "Yes" : "No"}</center>
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
    const response = await axios.get(
      "https://s3-ap-southeast-1.amazonaws.com/he-public-data/gamesarena274f2bf.json"
    );
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
