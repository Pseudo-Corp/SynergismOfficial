interface IPlugin {
    main: () => any
}

// There is no good way of reading all the paths in a directory on the web, 
// so plugins must be registered manually below. 

const RegisteredPlugins: readonly (readonly [string, string])[] = [
    [ 'Example Plugin', 'Example.ts' ],
    [ 'Synergism Dashboard', 'Dashboard.ts' ]
] as const;

export const loadPlugins = async () => {
    for (const [name, fileName] of RegisteredPlugins) {
        const file = (await import(`./${fileName}`)) as IPlugin;
        if (Object.prototype.toString.call(file.main) === '[object AsyncFunction]') {
            await file.main();
        } else {
            file.main();
        }

        console.log(`Loaded plugin ${name}!`);
    }
}