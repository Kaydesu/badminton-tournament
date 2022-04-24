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
        if (index < Math.ceil(list.length / 2)) {
            firstHalf.push(item);
        } else {
            secondHalf.push(item)
        }
    });

    return [firstHalf, secondHalf];
}

export const suffleBallot = (list: any[]) => {

}