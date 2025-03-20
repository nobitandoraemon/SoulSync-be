
let elapsedTime = 0;
const interval = 3000;
const timeout = 12000;
const array = [1, 2, 3, 4, 5];
const wait = (n) => new Promise((resolve) => setTimeout(resolve, n));

let i = 1;
const y = async () => {
    const fun = async () => {
        while (elapsedTime < timeout) {
            console.log('heheh ');

            elapsedTime += interval;
            await wait(3000);
        };
    }
    await fun();
}

await y();
console.log('jjj');
