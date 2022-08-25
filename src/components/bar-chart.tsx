export default function BarChart({
  characters,
  popularity,
}: {
  characters: string[];
  popularity: number[];
}) {
  if (characters.length === popularity.length) 
    return (
        <div className="bar-chart">   
            {characters.map(char => (
                <div key={char} className="bar" style={{height: `${popularity[characters.indexOf(char)]*10}px`}}>
                    <h1>{char}</h1>
                    <h2>Popularity: {popularity[characters.indexOf(char)]}</h2>
                    </div>
            ))}
        </div>
    )
    else {
        return (
            <h1>No data</h1>
        )
    }
}
