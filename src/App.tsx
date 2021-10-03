import { useRef, FormEvent, useState, useEffect } from "react";
import { Rover } from "./rover";
import "./App.css";

export default function App() {
  const [areaSize, setAreaSize] = useState<number[] | null>(null);
  const [movements, setMovements] = useState<string | null>(null);
  const [roverStarted, setRoverStarted] = useState<boolean>(false);

  // define for storing all rover's steps
  const [roverMovements, setRoverMovements] = useState<string[]>();
  // define Messages
  const [areaInputMsg, setAreaInputMsg] = useState<string | null>(null);
  const [movementsInputMsg, setMovementsInputMsg] = useState<string | null>(
    null
  );
  const outOfAreaMsg = "Out of Area";
  // define Ref
  const areaInputRef = useRef<HTMLInputElement>(null);
  const movementInputRef = useRef<HTMLInputElement>(null);

  // Form Submit handler
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let volidInput = true;

    const areaSizeInput = areaInputRef?.current?.value.trim() || "";
    if (areaSizeInput.match(/^[\d]+[ ][\d]+/g)) {
      setAreaSize(areaSizeInput.split(" ").map((size) => parseInt(size)));
      setAreaInputMsg(null);
    } else {
      volidInput = false;
      setAreaInputMsg("Incorrt Area Size format.");
    }

    const movementInput = movementInputRef?.current?.value.trim() || "";
    if (
      movementInput.match(
        /^[\d]+[ ][\d]+[ ][n|N|e|E|s|S|w|W][|][l|L|r|R|m|M]+$/g
      )
    ) {
      setMovements(movementInput);
      setMovementsInputMsg(null);
    } else {
      volidInput = false;
      setMovementsInputMsg("Incorrt Movement format.");
    }
    volidInput && setRoverStarted(true);
  };

  const roverStart = () => {
    if (!movements) return false;
    const [position, movement] = movements.split("|");
    let [cxString, cyString, cdString] = position.toUpperCase().split(" ");

    const actions = movement.toUpperCase().split("");
    const direction = ["N", "E", "S", "W"]; // [0,1,2,3]

    let cd = direction.indexOf(cdString);
    let coordinates = [parseInt(cxString), parseInt(cyString)];
    const allSteps: string[] = [];
    if (Rover.checkOutOfRanage(coordinates, areaSize)) {
      allSteps.push(position);
      actions.every((action, i) => {
        if (action === "M") {
          coordinates = Rover.move(coordinates, cd);
        } else {
          cd = Rover.turn(cd, action, direction);
        }
        if (!Rover.checkOutOfRanage(coordinates, areaSize)) {
          allSteps.push(outOfAreaMsg);
          return false;
        }
        allSteps.push([...coordinates, direction[cd]].join(" ").toString());
        return true;
      });
    } else {
      allSteps.push(outOfAreaMsg);
    }
    setRoverMovements(allSteps);
    setRoverStarted(false);
  };

  useEffect(() => {
    roverStarted && roverStart();
  }, [roverStarted]);

  return (
    <div className="App">
      <h1>Mars Rover Project</h1>
      <div className="instruction-container">
        <h2>instructions:</h2>
        <p>
          Input the FIRST textbox for defining the Area Size.
          <br />( experted format*: number_number)
        </p>
        <p>
          Input the SECOND textbox for defining the Movements.
          <br />( experted format*: number_number_direction|movement)
        </p>
        <ul>
          <li> _ = space</li>
          <li> direction should be N,E,W,S</li>
          <li> movement should be set of L,R,M</li>
        </ul>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            name="area-size"
            ref={areaInputRef}
            type="text"
            placeholder="E.g.: 10 10"
          />
          <input
            name="movements"
            ref={movementInputRef}
            type="text"
            placeholder="E.g.: 1 2 N|LMLMLMLMM"
          />
          <button type="submit">Submit</button>
        </form>
        <div className="input-msg-container">
          {areaInputMsg && <div>{areaInputMsg}</div>}
          {movementsInputMsg && <div>{movementsInputMsg}</div>}
        </div>
      </div>

      {roverMovements && (
        <div>
          <h2>Steps:</h2>
          <ol className="steps">
            {roverMovements?.map((v, i) => {
              return <li key={i.toString()}>{v}</li>;
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
