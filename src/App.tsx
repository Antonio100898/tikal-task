import { useEffect, useState } from "react";
import { ICharacter } from "./interfaces";
import { api } from "./api/api";
import BarChart from "./components/bar-chart";

function App() {
  const [data, setData] = useState<ICharacter[]>([]);
  const [mostUnpopular, setMostUnpopular] = useState<ICharacter | null>(null);
  const [dimension, setDimension] = useState("");
  const [barChart, setBarChart] = useState<number[]>([])

  const charactersData = [
    "Rick Sanchez",
    "Summer Smith",
    "Morty Smith",
    "Beth Smith",
    "Jerry Smith",
  ]; // Data for the characters from task part 2

  const getDemension = async (url: string) => {
    try {
      const { data } = await api.getDimensionOfUnpopular(url);
      setDimension(data.dimension);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCharacters = async () => {
    let maximumEpisodes = 0;
    let localBarChart = [] as number[];
    let pages = 0
    const withOriginList = [] as ICharacter[];

    try {
      const { data } = await api.getAllCharacters();
      data.results.map((char: ICharacter) => {
        const episodeLength = char.episode.length;
        if (char.origin.name === "Earth (C-137)") withOriginList.push(char);
        if (
          episodeLength > maximumEpisodes &&
          charactersData.includes(char.name)
        ) {
          maximumEpisodes = episodeLength;
        }
        if (charactersData.includes(char.name)) {
          let index = charactersData.indexOf(char.name);
          if (localBarChart[index] === undefined) {
            localBarChart[index] = episodeLength;
          } else {
            if (localBarChart[index] < episodeLength) localBarChart[index] = episodeLength;
          }
        }
      });
      pages = data.info.pages;
    } catch (error) {
      console.log(error);
    }

    if (pages > 1) {
      for (let i = 2; i <= pages; i++) {
        try {
          const { data } = await api.getPage(i);
          data.results.map((char: ICharacter) => {
            const episodeLength = char.episode.length;
            if (char.origin.name === "Earth (C-137)") withOriginList.push(char);
            if (
              episodeLength > maximumEpisodes &&
              charactersData.includes(char.name)
            ) {
              maximumEpisodes = episodeLength;
            }
            if (charactersData.includes(char.name)) {
              let index = charactersData.indexOf(char.name);
              if (localBarChart[index] === undefined) {
                localBarChart[index] = episodeLength;
              } else {
                if (localBarChart[index] < episodeLength)
                localBarChart[index] = episodeLength;
                }
            }
        });
        } catch (error) {
          console.log(error)
        }
      }
    }
    setBarChart(localBarChart)
    setData(withOriginList);
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      let minimalEpisodes = 1000;
      data.forEach((char) => {
        if (minimalEpisodes > char.episode.length)
          minimalEpisodes = char.episode.length;
      });
      let filteredData = data.filter(
        (char) => char.episode.length === minimalEpisodes
      );
      setMostUnpopular(filteredData[0]);
      getDemension(filteredData[0].origin.url);
    }
  }, [data]);

  //let maxEpisodeNumber = 0;
  //   let theCharacter = {} as ICharacter;
  //   if (filteredData.length > 1) {
  //     for (let i = 0; i < filteredData.length; i++) {
  //       let currentEpisodeNumber = Number(
  //         filteredData[i].episode[0].split("/")[5]
  //       );
  //       if (currentEpisodeNumber > maxEpisodeNumber) {
  //         maxEpisodeNumber = currentEpisodeNumber;
  //         theCharacter = filteredData[i];
  //       }
  //     }
  //   } else setMostUnpopular(filteredData[0]);
  //   setMostUnpopular(theCharacter);
  //   console.log(maxEpisodeNumber);
  // }, [data]);
 
  return (
    <div className="App">
       <h1>The Most unpopular character from Earth C-137</h1>
      <table className="table">
        <tbody>
        <tr>
          <td>Character name</td>
          <td>{mostUnpopular?.name}</td>
        </tr>
        <tr>
          <td>Origin name</td>
          <td>{mostUnpopular?.origin.name}</td>
        </tr>
        <tr>
          <td>Origin dimension</td>
          <td>{dimension && dimension}</td>
        </tr>
        <tr>
          <td>Popularity</td>
          <td>{mostUnpopular?.episode.length}</td>
        </tr>
        </tbody>
      </table>
      <BarChart characters={charactersData} popularity={barChart}/>
    </div>
  );
}

export default App;
