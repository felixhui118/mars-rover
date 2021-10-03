export const Rover = {
  turn: (curretDirection: number, action: string, direction: string[]) => {
    if (action === "L") {
      return (curretDirection =
        curretDirection <= 0 ? direction.length - 1 : curretDirection - 1);
    }
    if (action === "R") {
      return (curretDirection =
        curretDirection >= direction.length - 1 ? 0 : curretDirection + 1);
    }
    return curretDirection;
  },
  move: (coordinates: number[], curretDirection: number) => {
    //presenting action of [x[E,W],y[N,S]];
    const moveAction = [
      [1, -1],
      [1, -1],
    ];
    // [N[moveAction],E[moveAction],S[moveAction],W[moveAction]]
    const steps = [
      [1, 0],
      [0, 0],
      [1, 1],
      [0, 1],
    ];
    const getStep = steps[curretDirection];
    const getMoveAction = moveAction[getStep[0]][getStep[1]];
    coordinates[getStep[0]] += getMoveAction;
    return coordinates;
  },
  checkOutOfRanage: (coordinates: number[], areaSize: number[] | null) => {
    return !(
      !areaSize ||
      coordinates[0] < 0 ||
      coordinates[0] > areaSize[0] ||
      coordinates[1] < 0 ||
      coordinates[1] > areaSize[1]
    );
  },
};
