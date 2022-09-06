export const getBaseLog = (x: number, y: number) => {
    return Math.log(y) / Math.log(x);
}

export const isOdd = (a: number) => {
    return a % 2 === 0;
}

export const generateRandom = (min: number, max: number, exclude: number[]) => {
    let random = true;
    let value;
    while (random) {
        const x = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!exclude.includes(x)) {
            random = false;
            value = x;
        }
    }
    return value;
}

export const suffleList = (list: any[]) => {
    const firstHalf: any[] = [];
    const secondHalf: any[] = [];
    let count = 0;
    let key = false;
    const batch = list.map((_, index) => {
        if (count > 1) {
            count = 0;
            key = !key;
        }
        count++;
        return key ? 1 : 0;
    });

    list.map((item, index) => {
        if (isOdd(batch[index])) {
            if (isOdd(index)) {
                firstHalf.push(item);
            } else {
                secondHalf.push(item)
            }
        } else {
            if (!isOdd(index)) {
                firstHalf.push(item);
            } else {
                secondHalf.push(item)
            }
        }
    });

    return [...firstHalf, ...secondHalf];
}

export const splitArray = (list: any[]) => {
    const firstHalf: any[] = [];
    const secondHalf: any[] = [];

    list.map((item, index) => {
        if (isOdd(index)) {
            firstHalf.push({...item});
        } else {
            secondHalf.push({...item})
        }
    });

    return [firstHalf, secondHalf];
}

export const suffleBallot = (list: any[]) => {

}

const isAgainstPrior = (self: number, oponent: number) => {
    if (self === oponent) {
        return true;
    }
    if (isOdd(oponent)) {
        return self === oponent - 1;
    } else {
        return self === oponent + 1;
    }
}

/**
 * 
 * @param selfMatches _ the match ids if this athlete go to the final
 * @param oponentMatches _ the match ids if other athlete go to the final
 * @returns number of matches til they both meet eachother
 */

export const matchBeforeOppose = (selfMatches: number[], oponentMatches: number[]) => {
    let matches = 1;
    const total = selfMatches.length;
    for(let i = 0; i < total; i ++) {
        // if(!isAgainstPrior(selfMatches[i], oponentMatches[i])) {
        //     matches += 1;
        // }
        if(selfMatches[i] !== oponentMatches[i]) {
            matches += 1;
        }
    }
    return matches;
}
