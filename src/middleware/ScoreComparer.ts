interface resultsObject {
    [name: string]: number;
}
interface scoresObject {
    [name: string]: {
        [name: string]: number;
    };
}

const ScoreComparer = (scores: scoresObject, pricePerHole: number, numHoles: number) => {
    // key: Username, value: Money Earned
    const results: resultsObject = {};
    // represents the hole #
    let rotation = 1;
    // base value for each hole, does adjust based on if hole gets pushed
    let payout = pricePerHole;

    // sets the results object with players as the key and 0 as their value
    Object.keys(scores).map((player) => {
        results[player] = 0;
    });

    // Loop continues until it has gone through the set amount of holes
    while (rotation <= numHoles) {
        // array of scores for the current hole
        const compareValues: number[] = [];
        //  Gets scores for each player for the given hole and pushes it to the array
        Object.keys(scores).map((player) => {
            compareValues.push(scores[player][`hole${rotation}`]);
        });

        //  Get the lowest number in the compareValues array
        const lowestNum = Math.min(...compareValues);
        //  Creates array of all the values that are equal to the lowest number, array of 'winners' for that hole
        const lowestArr = compareValues.filter((num) => num === lowestNum);

        //  If this is the last hole and there's more than 1 person with the same score
        if (rotation === numHoles && lowestArr.length > 1) {
            const arrOfWinners: number[] = [];

            //  Gets the winners index for the so that we can payout the proper people
            compareValues.forEach((num, indx) => {
                if (num === lowestNum) {
                    arrOfWinners.push(indx);
                }
            });
            //  Loops through the winners array containing their index's
            arrOfWinners.forEach((playerIndx) => {
                //  Gets the person to payout
                const playerToPayout = Object.keys(scores)[playerIndx];
                //  Determines amount to payout, current players money + the payout pool / amount of winners.
                const amountToPayout = results[playerToPayout] + payout / arrOfWinners.length;
                //  adds the determined payout to players earning
                results[playerToPayout] = Number(amountToPayout.toFixed(2));
            });

            // if theres more than 1 winner than increment the payout and move to next hole
        } else if (lowestArr.length > 1) {
            payout += pricePerHole;

            //  if there's 1 person with the lowest score
        } else {
            // Gets index of the player
            const indxOfPlayer = compareValues.indexOf(lowestNum);
            //  Gets username for player to payout
            const playerToPayout = Object.keys(scores)[indxOfPlayer];

            const amountToPayout = Number(results[playerToPayout]) + Number(payout);
            results[playerToPayout] = amountToPayout;
            payout = pricePerHole;
        }

        rotation++;
    }
    return results;
};

export default ScoreComparer;
