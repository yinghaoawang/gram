export const DEBUG_MODE = true;

export const scrolledToBottom = () => {
    const console = document.getElementById('console');
    
    let res = (window.innerHeight + Math.round(document.documentElement.scrollTop)) == document.scrollingElement.scrollHeight;
    if (DEBUG_MODE) console.innerHTML = window.innerHeight + ' ' + Math.round(document.documentElement.scrollTop) + ' ' +
        (window.innerHeight + Math.round(document.documentElement.scrollTop)) + ' ' + document.scrollingElement.scrollHeight + ' ' + res;
    return res;
};
