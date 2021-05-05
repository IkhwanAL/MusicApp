const convertMilisToMinutes = (milis) => {
    if (milis === null) return '03:24';
    const minutes = Math.floor(milis / 60000);
    const second = determineSecond(milis);
    const val = `${minutes}:${(second < 10 ? '0' : '') + second}`;
    return val;
}

const determineSecond = (milis) => {
    if (milis === null) return
    const seconds = ((milis % 36000) / 1000).toFixed(0);
    return seconds
}

export { convertMilisToMinutes, determineSecond };