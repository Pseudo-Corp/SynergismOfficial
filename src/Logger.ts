const patchSettings: (keyof Console)[] = ['log', 'info', 'error'];
 
for (const method of patchSettings) {
    console[method] = new Proxy(console[method], {
        apply(target, thisArg: Console, args: string[]) {
            addConsoleEntry(args, method);
            return target.call(thisArg, ...args);
        }
    });
}

const addConsoleEntry = (args: string[], method: string) => {
    const logger = document.querySelector('#testingLogger > #console');

    if (logger.lastChild?.textContent === args.join(' ')) // duplicate element
        return;

    if (logger.childElementCount > 20)
        logger.removeChild(logger.children[0]);
    
    const text = document.createElement('p');
    text.textContent = args.join(' ');
    text.classList.add(method);
    
    logger.appendChild(text);
}