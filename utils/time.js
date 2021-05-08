const convertMilisToMinutes = (milis) => {
    if (milis === null) return '00:00';
    const minutes = Math.floor(milis / 60000);
    const second = determineSecond(milis);
    const val = `${(minutes < 10 ? '0' : '') + minutes}:${(second < 10 ? '0' : '') + second}`;
    return val;
}

const determineSecond = (milis) => {
    if (milis === null) return
    const seconds = ((milis % 36000) / 1000).toFixed(0);
    return seconds
}

const convertSecondToMinutes = (time) => {
    if (typeof time !== 'number') return
    if (time === null) return '00:00';
    const times = +time;
    const minutes = Math.floor(times / 60);
    const seconds = (times % 60).toFixed(0);
    const val = `${(minutes < 10 ? '0' : '') + minutes}:${(times < 10 ? '0' : '') + seconds}`;
    return val;
}

function convertMilisToSecond(milis) {
    if (typeof milis !== 'number') return
    return +(milis / 1000).toFixed(0);
}

export {
    convertMilisToMinutes,
    determineSecond,
    convertSecondToMinutes,
    convertMilisToSecond
};